import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Square, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { voiceService } from '../services/voiceService';

export default function VoicePlayer({ text, language = 'en', label = 'Read Aloud' }) {
  const [isPlaying, setIsPlaying] = useState(false);
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
  }, [language, text]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      voiceService.stop();
      setIsPlaying(false);
    } else {
      voiceService.speak(
        text,
        language,
        rate,
        () => setIsPlaying(true),
        () => setIsPlaying(false),
        () => setIsPlaying(false)
      );
    }
  };

  const handleStop = () => {
    voiceService.stop();
    setIsPlaying(false);
  };

  const handleRateChange = (newRate) => {
    setRate(newRate);
    if (isPlaying) {
      voiceService.stop();
      voiceService.speak(
        text,
        language,
        newRate,
        () => setIsPlaying(true),
        () => setIsPlaying(false),
        () => setIsPlaying(false)
      );
    }
  };

  if (!supported) return null;

  return (
    <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200/80 rounded-xl px-3 py-1.5 text-xs text-teal-900 shadow-2xs">
      {/* Play / Pause Button */}
      <button
        onClick={handleTogglePlay}
        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold transition-all shadow-xs ${
          isPlaying 
            ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse' 
            : 'bg-teal-600 hover:bg-teal-700 text-white active:scale-95'
        }`}
        title={isPlaying ? 'Pause voice over' : 'Listen to summary aloud'}
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
      </button>

      {/* Stop button when playing */}
      {isPlaying && (
        <button
          onClick={handleStop}
          className="w-6 h-6 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors"
          title="Stop reading"
        >
          <Square className="w-3 h-3 fill-current" />
        </button>
      )}

      {/* Label and Audio Wave Animation */}
      <div className="flex items-center gap-1.5">
        <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'text-teal-600 animate-bounce' : 'text-teal-700'}`} />
        <span className="font-semibold text-[11px] text-teal-950">
          {isPlaying ? 'Speaking...' : label}
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
            className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold transition-colors ${
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
  );
}
