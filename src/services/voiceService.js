/**
 * MedCheck Multilingual Voice Service
 * Comprehensive Speech Architecture supporting all 8 Indian Languages:
 * English (en-IN), Hindi (hi-IN), Telugu (te-IN), Tamil (ta-IN),
 * Kannada (kn-IN), Malayalam (ml-IN), Marathi (mr-IN), Gujarati (gu-IN)
 *
 * Tier 1: Browser Web Speech API (Used when a genuine native regional voice is installed)
 * Tier 2: Server-side High-Fidelity Audio Streaming via /api/tts (Used when regional voice pack is missing, e.g. on Windows)
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

export const LANGUAGE_NAMES = {
  en: 'English (India)',
  hi: 'हिन्दी (Hindi)',
  te: 'తెలుగు (Telugu)',
  ta: 'தமிழ் (Tamil)',
  kn: 'ಕನ್ನಡ (Kannada)',
  ml: 'മലയാളം (Malayalam)',
  mr: 'मराठी (Marathi)',
  gu: 'ગુજરાતી (Gujarati)'
};

/**
 * Strips markdown and clinical formatting for clean pronunciation
 */
export function cleanSpeechText(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[-*]\s+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Splits text into natural sentence/clause chunks for fluid audio streaming
 */
export function splitIntoChunks(text, maxLength = 160) {
  if (!text) return [];
  // Split on punctuation: Indian danda (।), period (.), question mark (?), exclamation (!), semicolon (;)
  const segments = text.split(/(?<=[।\.?!;\n])/g);
  const chunks = [];
  let buffer = '';

  for (let seg of segments) {
    seg = seg.trim();
    if (!seg) continue;

    if ((buffer + ' ' + seg).trim().length <= maxLength) {
      buffer = buffer ? (buffer + ' ' + seg) : seg;
    } else {
      if (buffer) chunks.push(buffer);
      if (seg.length > maxLength) {
        // Break long segment by comma or whitespace
        const words = seg.split(/(?<=[, ])/g);
        let temp = '';
        for (let w of words) {
          if ((temp + w).length <= maxLength) {
            temp += w;
          } else {
            if (temp.trim()) chunks.push(temp.trim());
            temp = w;
          }
        }
        buffer = temp.trim();
      } else {
        buffer = seg;
      }
    }
  }

  if (buffer) chunks.push(buffer);
  return chunks.length > 0 ? chunks : [text.substring(0, maxLength)];
}

export class VoiceService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.currentAudio = null;
    this.audioQueue = [];
    this.isPlayingAudio = false;
    this.isPausedAudio = false;
    this.currentAudioRate = 1.0;
    this.currentLang = 'en';
    this.activeCallbacks = { onStart: null, onEnd: null, onError: null, onLoading: null };
    this.voicesLoaded = false;

    if (this.synth) {
      this.loadVoices();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.loadVoices();
        };
      }
    }
  }

  loadVoices() {
    if (!this.synth) return;
    const available = this.synth.getVoices();
    if (available && available.length > 0) {
      this.voices = available;
      this.voicesLoaded = true;
    }
  }

  isSupported() {
    return true; // Web Speech API or Server-Side HTML5 Audio Streaming
  }

  getLocale(langCode) {
    const code = (langCode || 'en').toLowerCase();
    return BCP47_LOCALES[code] || 'en-IN';
  }

  /**
   * Strictly verifies if the browser has a GENUINE native regional voice for this language.
   * NEVER returns true for English fallback voices (e.g. Microsoft David) when lang is non-English.
   */
  hasNativeRegionalVoice(langCode) {
    if (!this.synth) return false;
    const code = (langCode || 'en').toLowerCase();

    if (!this.voices || this.voices.length === 0) {
      this.loadVoices();
    }

    if (code === 'en') {
      return this.voices.some(v => v.lang.toLowerCase().startsWith('en'));
    }

    const regionalPrefixes = {
      hi: ['hi-in', 'hi_in', 'hi'],
      te: ['te-in', 'te_in', 'te'],
      ta: ['ta-in', 'ta_in', 'ta'],
      kn: ['kn-in', 'kn_in', 'kn'],
      ml: ['ml-in', 'ml_in', 'ml'],
      mr: ['mr-in', 'mr_in', 'mr'],
      gu: ['gu-in', 'gu_in', 'gu']
    };

    const targetPrefixes = regionalPrefixes[code] || [code];
    return this.voices.some(v => {
      const vLang = v.lang.toLowerCase();
      // Ensure it starts with target prefix and does NOT start with 'en'
      return targetPrefixes.some(p => vLang.startsWith(p)) && !vLang.startsWith('en');
    });
  }

  getNativeRegionalVoice(langCode) {
    const code = (langCode || 'en').toLowerCase();
    if (!this.voices || this.voices.length === 0) {
      this.loadVoices();
    }

    const regionalPrefixes = {
      hi: ['hi-in', 'hi_in', 'hi'],
      te: ['te-in', 'te_in', 'te'],
      ta: ['ta-in', 'ta_in', 'ta'],
      kn: ['kn-in', 'kn_in', 'kn'],
      ml: ['ml-in', 'ml_in', 'ml'],
      mr: ['mr-in', 'mr_in', 'mr'],
      gu: ['gu-in', 'gu_in', 'gu'],
      en: ['en-in', 'en-gb', 'en-us', 'en']
    };

    const targetPrefixes = regionalPrefixes[code] || [code];
    for (const prefix of targetPrefixes) {
      const found = this.voices.find(v => {
        const vLang = v.lang.toLowerCase();
        if (code !== 'en' && vLang.startsWith('en')) return false;
        return vLang.startsWith(prefix);
      });
      if (found) return found;
    }

    return null;
  }

  /**
   * Main speech method
   */
  speak(text, language = 'en', rate = 1.0, onStart, onEnd, onError, onLoading) {
    this.stop();

    const cleanText = cleanSpeechText(text);
    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    const lang = (language || 'en').toLowerCase();
    this.currentLang = lang;
    this.activeCallbacks = { onStart, onEnd, onError, onLoading };

    // TIER 1: Native Web Speech API if a compatible regional voice is installed
    // Only used if language is 'en' OR has genuine regional voice (NEVER use English voice for Indian languages)
    if (this.hasNativeRegionalVoice(lang)) {
      try {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = Math.max(0.5, Math.min(2.0, rate || 1.0));
        utterance.pitch = 1.0;

        const voice = this.getNativeRegionalVoice(lang);
        if (voice) {
          utterance.voice = voice;
          utterance.lang = voice.lang;
        } else {
          utterance.lang = this.getLocale(lang);
        }

        utterance.onstart = () => {
          if (this.activeCallbacks.onStart) this.activeCallbacks.onStart();
        };

        utterance.onend = () => {
          if (this.activeCallbacks.onEnd) this.activeCallbacks.onEnd();
        };

        utterance.onerror = (err) => {
          console.warn('[WebSpeech synthesis error, switching to Server TTS fallback]:', err);
          this.playViaAudioStream(cleanText, lang, rate);
        };

        this.synth.speak(utterance);
        return;
      } catch (e) {
        console.warn('[WebSpeech invocation error, falling back to Server TTS]:', e);
      }
    }

    // TIER 2: Server-side Multilingual Audio Streamer (via /api/tts)
    // Delivers native pronunciation for all 8 Indian languages
    this.playViaAudioStream(cleanText, lang, rate);
  }

  /**
   * Server-side Audio Streaming for Indian Regional Languages
   */
  playViaAudioStream(text, language, rate) {
    const chunks = splitIntoChunks(text, 160);
    if (chunks.length === 0) {
      if (this.activeCallbacks.onEnd) this.activeCallbacks.onEnd();
      return;
    }

    if (this.activeCallbacks.onLoading) {
      this.activeCallbacks.onLoading(true);
    }

    this.audioQueue = [...chunks];
    this.isPlayingAudio = true;
    this.isPausedAudio = false;
    this.currentAudioRate = rate;

    this.playNextAudioChunk(language, rate);
  }

  playNextAudioChunk(language, rate) {
    if (!this.isPlayingAudio || this.audioQueue.length === 0) {
      this.isPlayingAudio = false;
      this.isPausedAudio = false;
      this.currentAudio = null;
      if (this.activeCallbacks.onLoading) {
        this.activeCallbacks.onLoading(false);
      }
      if (this.activeCallbacks.onEnd) {
        this.activeCallbacks.onEnd();
      }
      return;
    }

    const chunk = this.audioQueue.shift();
    const encoded = encodeURIComponent(chunk);
    const audioUrl = `/api/tts?lang=${encodeURIComponent(language)}&text=${encoded}&rate=${encodeURIComponent(rate || 1.0)}`;

    const audio = new Audio();
    audio.playbackRate = rate || 1.0;
    this.currentAudio = audio;

    let started = false;

    audio.oncanplay = () => {
      if (this.activeCallbacks.onLoading) {
        this.activeCallbacks.onLoading(false);
      }
    };

    audio.onplay = () => {
      if (!started) {
        started = true;
        if (this.activeCallbacks.onStart) {
          this.activeCallbacks.onStart();
        }
      }
    };

    audio.onended = () => {
      this.playNextAudioChunk(language, rate);
    };

    audio.onerror = (e) => {
      console.warn('[TTS Audio Stream Error]:', e);
      if (this.audioQueue.length > 0) {
        // Continue with remaining chunks if available
        this.playNextAudioChunk(language, rate);
      } else {
        this.stop();
        if (this.activeCallbacks.onError) {
          this.activeCallbacks.onError(`Audio playback error for ${LANGUAGE_NAMES[language] || language}.`);
        }
      }
    };

    audio.src = audioUrl;
    audio.play().catch(playErr => {
      console.warn('[Audio Play Promise Error]:', playErr);
      if (this.audioQueue.length > 0) {
        this.playNextAudioChunk(language, rate);
      } else {
        this.stop();
        if (this.activeCallbacks.onError) {
          this.activeCallbacks.onError(`Failed to play audio for ${LANGUAGE_NAMES[language] || language}.`);
        }
      }
    });
  }

  pause() {
    if (this.currentAudio && !this.currentAudio.paused) {
      this.currentAudio.pause();
      this.isPausedAudio = true;
    }
    if (this.synth && this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
    }
  }

  resume() {
    if (this.currentAudio && this.isPausedAudio) {
      this.currentAudio.play().catch(console.warn);
      this.isPausedAudio = false;
    }
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  stop() {
    this.isPlayingAudio = false;
    this.isPausedAudio = false;
    this.audioQueue = [];

    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio.src = '';
      } catch (e) {}
      this.currentAudio = null;
    }

    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }

    if (this.activeCallbacks.onLoading) {
      this.activeCallbacks.onLoading(false);
    }
  }

  isSpeaking() {
    const isSynthSpeaking = Boolean(this.synth && this.synth.speaking);
    return isSynthSpeaking || this.isPlayingAudio;
  }
}

export const voiceService = new VoiceService();

/**
 * Reusable speech function as specified in architecture requirements:
 * speakText(translatedText, targetLanguage, speed, callbacks)
 */
export function speakText(translatedText, targetLanguage = 'en', speed = 1.0, callbacks = {}) {
  const { onStart, onEnd, onError, onLoading } = callbacks;
  return voiceService.speak(translatedText, targetLanguage, speed, onStart, onEnd, onError, onLoading);
}

export default voiceService;
