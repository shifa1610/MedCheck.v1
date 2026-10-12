import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Square, 
  RotateCcw,
  Sparkles,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { voiceService, speakText, BCP47_LOCALES } from '../services/voiceService';

export default function VoicePlayer({ text, language = 'en', label = 'Read Aloud' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [rate, setRate] = useState(1.0);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    setSupported(voiceService.isSupported());
    return () => {
      voiceService.stop();
    };
  }, []);

  useEffect(() => {
    voiceService.stop();
    setIsPlaying(false);
    setIsLoading(false);
    setErrorMessage(null);
  }, [language, text]);

  const handleTogglePlay = () => {
    if (isPlaying || isLoading) {
      voiceService.stop();
      setIsPlaying(false);
      setIsLoading(false);
      return;
    }

    if (!text || !text.trim()) {
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    speakText(text, language, rate, {
      onLoading: (loading) => {
        setIsLoading(loading);
      },
      onStart: () => {
        setIsLoading(false);
        setIsPlaying(true);
        setErrorMessage(null);
      },
      onEnd: () => {
        setIsLoading(false);
        setIsPlaying(false);
      },
      onError: (err) => {
        setIsLoading(false);
        setIsPlaying(false);
        setErrorMessage(typeof err === 'string' ? err : 'Unable to play audio');
        setTimeout(() => setErrorMessage(null), 4000);
      }
    });
  };

  const handleStop = () => {
    voiceService.stop();
    setIsPlaying(false);
    setIsLoading(false);
  };

  const handleRateChange = (newRate) => {
    setRate(newRate);
    if (isPlaying) {
      voiceService.stop();
      setIsLoading(true);
      speakText(text, language, newRate, {
        onLoading: (loading) => setIsLoading(loading),
        onStart: () => {
          setIsLoading(false);
          setIsPlaying(true);
          setErrorMessage(null);
        },
        onEnd: () => {
          setIsLoading(false);
          setIsPlaying(false);
        },
        onError: (err) => {
          setIsLoading(false);
          setIsPlaying(false);
          setErrorMessage(typeof err === 'string' ? err : 'Audio playback error');
          setTimeout(() => setErrorMessage(null), 4000);
        }
      });
    }
  };

  if (!supported) return null;

  const locale = BCP47_LOCALES[language] || 'en-IN';

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200/80 rounded-xl px-3 py-1.5 text-xs text-teal-900 shadow-2xs">
        {/* Play / Pause / Loading Button */}
        <button
          onClick={handleTogglePlay}
          disabled={!text || !text.trim()}
          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold transition-all shadow-xs ${
            isLoading
              ? 'bg-teal-500 text-white cursor-wait'
              : isPlaying 
                ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse cursor-pointer' 
                : 'bg-teal-600 hover:bg-teal-700 text-white active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
          title={isLoading ? 'Loading audio...' : isPlaying ? 'Pause voice over' : `Listen to ${label} (${locale})`}
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-3.5 h-3.5" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          )}
        </button>

        {/* Stop button when playing */}
        {isPlaying && (
          <button
            onClick={handleStop}
            className="w-6 h-6 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            title="Stop reading"
          >
            <Square className="w-3 h-3 fill-current" />
          </button>
        )}

        {/* Label and Audio Wave Animation */}
        <div className="flex items-center gap-1.5">
          <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'text-teal-600 animate-bounce' : 'text-teal-700'}`} />
          <span className="font-semibold text-[11px] text-teal-950">
            {isLoading ? 'Buffering...' : isPlaying ? 'Speaking...' : label}
          </span>

          {isPlaying && (
            <div className="flex items-center gap-0.5 ml-1">
              <span className="w-1 h-3 bg-teal-600 rounded-full animate-[pulse_0.6s_ease-in-out_infinite]" />
              <span className="w-1 h-4 bg-teal-500 rounded-full animate-[pulse_0.4s_ease-in-out_infinite]" />
              <span className="w-1 h-2 bg-teal-700 rounded-full animate-[pulse_0.8s_ease-in-out_infinite]" />
            </div>
          )}
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1 ml-1 border-l border-teal-200 pl-2">
          {[0.8, 1.0, 1.2].map((r) => (
            <button
              key={r}
              onClick={() => handleRateChange(r)}
              className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold transition-colors cursor-pointer ${
                rate === r 
                  ? 'bg-teal-700 text-white' 
                  : 'text-teal-800 hover:bg-teal-100'
              }`}
            >
              {r}x
            </button>
          ))}
        </div>
      </div>

      {/* Error alert toast */}
      {errorMessage && (
        <div className="flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 animate-fade-in">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
