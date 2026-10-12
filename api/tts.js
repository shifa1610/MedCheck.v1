/**
 * MedCheck Multilingual Text-to-Speech (TTS) Serverless Endpoint
 * Compatible with Vercel Serverless Functions and local Express server
 * 
 * Supports:
 * 1. Google Cloud Text-to-Speech (via GOOGLE_TTS_API_KEY or GOOGLE_API_KEY)
 * 2. Azure AI Speech (via AZURE_SPEECH_KEY and AZURE_SPEECH_REGION)
 * 3. High-Fidelity Google TTS Gateway (zero-config fallback supporting all 8 Indian languages)
 */

export const BCP47_LOCALES = {
  en: 'en-IN',
  hi: 'hi-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  mr: 'mr-IN',
  gu: 'gu-IN'
};

const GOOGLE_CLOUD_VOICES = {
  en: { languageCode: 'en-IN', name: 'en-IN-Neural2-A' },
  hi: { languageCode: 'hi-IN', name: 'hi-IN-Neural2-A' },
  te: { languageCode: 'te-IN', name: 'te-IN-Standard-A' },
  ta: { languageCode: 'ta-IN', name: 'ta-IN-Standard-A' },
  kn: { languageCode: 'kn-IN', name: 'kn-IN-Standard-A' },
  ml: { languageCode: 'ml-IN', name: 'ml-IN-Standard-A' },
  mr: { languageCode: 'mr-IN', name: 'mr-IN-Standard-A' },
  gu: { languageCode: 'gu-IN', name: 'gu-IN-Standard-A' }
};

const AZURE_VOICES = {
  en: 'en-IN-NeerjaNeural',
  hi: 'hi-IN-SwaraNeural',
  te: 'te-IN-ShrutiNeural',
  ta: 'ta-IN-PallaviNeural',
  kn: 'kn-IN-SapnaNeural',
  ml: 'ml-IN-SobhanaNeural',
  mr: 'mr-IN-AarohiNeural',
  gu: 'gu-IN-DhwaniNeural'
};

export async function handleTTS(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const text = req.query.text || (req.body && req.body.text);
    const lang = (req.query.lang || (req.body && req.body.lang) || 'en').toLowerCase();
    const rate = parseFloat(req.query.rate || '1.0') || 1.0;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Text query parameter is required' });
    }

    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/#{1,6}\s+/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/[-*]\s+/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 200);

    const locale = BCP47_LOCALES[lang] || 'en-IN';

    // 1. Check for Google Cloud Text-to-Speech API Key
    const googleApiKey = process.env.GOOGLE_TTS_API_KEY || process.env.GOOGLE_API_KEY;
    if (googleApiKey) {
      try {
        const voiceConfig = GOOGLE_CLOUD_VOICES[lang] || { languageCode: locale };
        const gCloudUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${googleApiKey}`;
        const gRes = await fetch(gCloudUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: { text: cleanText },
            voice: voiceConfig,
            audioConfig: {
              audioEncoding: 'MP3',
              speakingRate: Math.max(0.5, Math.min(2.0, rate))
            }
          })
        });

        if (gRes.ok) {
          const gData = await gRes.json();
          if (gData.audioContent) {
            const audioBuffer = Buffer.from(gData.audioContent, 'base64');
            res.setHeader('Content-Type', 'audio/mpeg');
            res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
            res.setHeader('X-TTS-Provider', 'Google-Cloud-TextToSpeech');
            return res.send(audioBuffer);
          }
        }
      } catch (gErr) {
        console.warn('[Google Cloud TTS API Error, falling back to Gateway]:', gErr.message);
      }
    }

    // 2. Check for Azure AI Speech Credentials
    const azureKey = process.env.AZURE_SPEECH_KEY;
    const azureRegion = process.env.AZURE_SPEECH_REGION;
    if (azureKey && azureRegion) {
      try {
        const voiceName = AZURE_VOICES[lang] || 'en-IN-NeerjaNeural';
        const azureUrl = `https://${azureRegion}.tts.speech.microsoft.com/cognitiveservices/v1`;
        const ssml = `<speak version='1.0' xml:lang='${locale}'><voice xml:lang='${locale}' name='${voiceName}'><prosody rate='${rate}'>${cleanText}</prosody></voice></speak>`;

        const aRes = await fetch(azureUrl, {
          method: 'POST',
          headers: {
            'Ocp-Apim-Subscription-Key': azureKey,
            'Content-Type': 'application/ssml+xml',
            'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
            'User-Agent': 'MedCheck-HealthCopilot'
          },
          body: ssml
        });

        if (aRes.ok) {
          const aBuffer = await aRes.arrayBuffer();
          res.setHeader('Content-Type', 'audio/mpeg');
          res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
          res.setHeader('X-TTS-Provider', 'Azure-AI-Speech');
          return res.send(Buffer.from(aBuffer));
        }
      } catch (aErr) {
        console.warn('[Azure Speech API Error, falling back to Gateway]:', aErr.message);
      }
    }

    // 3. High-Fidelity Google TTS Gateway Streamer (Default Zero-Config Provider)
    // Supports all 8 Indian languages (kn, ml, mr, gu, te, ta, hi, en)
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(lang)}&q=${encodeURIComponent(cleanText)}`;
    const gatewayRes = await fetch(ttsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'audio/mpeg, audio/*;q=0.9',
        'Referer': 'https://translate.google.com/'
      }
    });

    if (!gatewayRes.ok) {
      return res.status(gatewayRes.status).json({
        error: `TTS provider returned HTTP ${gatewayRes.status} for locale ${locale}`
      });
    }

    const arrayBuffer = await gatewayRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length === 0) {
      return res.status(500).json({ error: 'Received empty audio buffer from TTS service' });
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    res.setHeader('X-TTS-Provider', 'Google-TTS-Gateway');
    res.setHeader('X-TTS-Locale', locale);

    return res.send(buffer);

  } catch (err) {
    console.error('[TTS Service Error]:', err);
    return res.status(500).json({
      error: 'Text-to-Speech synthesis failed',
      details: err.message
    });
  }
}

// Vercel Serverless Function entry point
export default async function handler(req, res) {
  return handleTTS(req, res);
}
