/**
 * MedCheck Dual-Engine Voice Service
 * Supports:
 * Tier 1: Native Browser Web Speech Synthesis (when regional voice is installed)
 * Tier 2: High-Definition Regional Audio Streaming (for Indian languages on Windows/browsers lacking local packs)
 */

function cleanSpeechText(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[-*]\s+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitIntoChunks(text, maxLength = 160) {
  if (!text) return [];
  // Split on sentence boundaries (period, danda, question, exclamation, semicolon)
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
        // Break long segment by words/commas
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

class VoiceService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.currentAudio = null;
    this.audioQueue = [];
    this.isPlayingAudio = false;
    this.isPausedAudio = false;
    this.currentAudioRate = 1.0;
    this.activeCallbacks = { onStart: null, onEnd: null, onError: null };

    if (this.synth) {
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices() || [];
  }

  isSupported() {
    return true; // Supported via Web Speech or HTML5 Audio Streaming
  }

  /**
   * Check if browser has a genuine native regional voice for this language
   * (Does NOT count English fallbacks like Microsoft David)
   */
  hasNativeRegionalVoice(langCode) {
    if (!this.synth) return false;
    const code = (langCode || 'en').toLowerCase();
    if (code === 'en') return true;

    if (!this.voices || this.voices.length === 0) {
      this.loadVoices();
    }

    const regionalPrefixes = {
      hi: ['hi-in', 'hi'],
      te: ['te-in', 'te'],
      ta: ['ta-in', 'ta'],
      kn: ['kn-in', 'kn'],
      ml: ['ml-in', 'ml'],
      mr: ['mr-in', 'mr'],
      gu: ['gu-in', 'gu']
    };

    const targetPrefixes = regionalPrefixes[code] || [code];
    return this.voices.some(v => {
      const vLang = v.lang.toLowerCase();
      return targetPrefixes.some(p => vLang.startsWith(p));
    });
  }

  getNativeRegionalVoice(langCode) {
    const code = (langCode || 'en').toLowerCase();
    if (!this.voices || this.voices.length === 0) {
      this.loadVoices();
    }

    const regionalPrefixes = {
      hi: ['hi-in', 'hi'],
      te: ['te-in', 'te'],
      ta: ['ta-in', 'ta'],
      kn: ['kn-in', 'kn'],
      ml: ['ml-in', 'ml'],
      mr: ['mr-in', 'mr'],
      gu: ['gu-in', 'gu'],
      en: ['en-in', 'en-gb', 'en-us', 'en']
    };

    const targetPrefixes = regionalPrefixes[code] || [code];
    for (const prefix of targetPrefixes) {
      const found = this.voices.find(v => v.lang.toLowerCase().startsWith(prefix));
      if (found) return found;
    }

    return null;
  }

  /**
   * Primary Speak method
   */
  speak(text, language = 'en', rate = 1.0, onStart, onEnd, onError) {
    this.stop();

    const cleanText = cleanSpeechText(text);
    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    const lang = (language || 'en').toLowerCase();
    this.activeCallbacks = { onStart, onEnd, onError };

    // TIER 1: Native Web Speech if genuine regional voice is installed (or English)
    if (this.hasNativeRegionalVoice(lang)) {
      try {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = rate;
        utterance.pitch = 1.0;

        const voice = this.getNativeRegionalVoice(lang);
        if (voice) {
          utterance.voice = voice;
          utterance.lang = voice.lang;
        } else {
          utterance.lang = lang === 'hi' ? 'hi-IN' : lang === 'te' ? 'te-IN' : 'en-IN';
        }

        if (onStart) utterance.onstart = onStart;
        utterance.onend = () => {
          if (onEnd) onEnd();
        };
        utterance.onerror = (err) => {
          console.warn('[WebSpeech Error, attempting Audio Stream fallback]:', err);
          this.playViaAudioStream(cleanText, lang, rate, onStart, onEnd, onError);
        };

        this.synth.speak(utterance);
        return;
      } catch (e) {
        console.warn('[WebSpeech failed, falling back to Audio Stream]:', e);
      }
    }

    // TIER 2: High-Definition Regional Audio Streamer (Perfect for Indian languages on Windows)
    this.playViaAudioStream(cleanText, lang, rate, onStart, onEnd, onError);
  }

  /**
   * High-Definition Audio Streamer for Indian Regional Languages
   */
  playViaAudioStream(text, language, rate, onStart, onEnd, onError) {
    const chunks = splitIntoChunks(text, 160);
    if (chunks.length === 0) {
      if (onEnd) onEnd();
      return;
    }

    this.audioQueue = [...chunks];
    this.isPlayingAudio = true;
    this.isPausedAudio = false;
    this.currentAudioRate = rate;

    if (onStart) onStart();
    this.playNextAudioChunk(language, rate);
  }

  playNextAudioChunk(language, rate) {
    if (!this.isPlayingAudio || this.audioQueue.length === 0) {
      this.isPlayingAudio = false;
      this.isPausedAudio = false;
      this.currentAudio = null;
      if (this.activeCallbacks.onEnd) {
        this.activeCallbacks.onEnd();
      }
      return;
    }

    const chunk = this.audioQueue.shift();
    const encoded = encodeURIComponent(chunk);
    // Use local proxy with fallback to direct Google TTS
    const primaryUrl = `/api/tts?lang=${encodeURIComponent(language)}&text=${encoded}`;
    const fallbackUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(language)}&q=${encoded}`;

    const audio = new Audio();
    audio.playbackRate = rate || 1.0;
    this.currentAudio = audio;

    let hasSwitchedToFallback = false;

    audio.onended = () => {
      this.playNextAudioChunk(language, rate);
    };

    audio.onerror = (e) => {
      if (!hasSwitchedToFallback) {
        hasSwitchedToFallback = true;
        audio.src = fallbackUrl;
        audio.play().catch(playErr => {
          console.warn('[Audio Stream fallback play error]:', playErr);
          this.playNextAudioChunk(language, rate);
        });
      } else {
        console.warn('[Audio Stream error]:', e);
        this.playNextAudioChunk(language, rate);
      }
    };

    audio.src = primaryUrl;
    audio.play().catch(err => {
      if (!hasSwitchedToFallback) {
        hasSwitchedToFallback = true;
        audio.src = fallbackUrl;
        audio.play().catch(fallbackErr => {
          console.warn('[Audio Play error]:', fallbackErr);
          if (this.activeCallbacks.onError) {
            this.activeCallbacks.onError('Could not play audio stream.');
          }
          this.stop();
        });
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
  }

  isSpeaking() {
    const isSynthSpeaking = Boolean(this.synth && this.synth.speaking);
    return isSynthSpeaking || this.isPlayingAudio;
  }
}

export const voiceService = new VoiceService();
