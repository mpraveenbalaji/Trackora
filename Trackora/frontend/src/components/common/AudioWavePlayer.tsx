import React, { useState } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

export const AudioWavePlayer: React.FC<{ durationSeconds?: number }> = ({
  durationSeconds = 30,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full max-w-sm">
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="w-8 h-8 rounded-full bg-[#136b6f] text-white flex items-center justify-center hover:bg-[#0e5558] transition-colors shadow-sm shrink-0"
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
      </button>

      {/* Simulated Waveform */}
      <div className="flex-1 flex items-center gap-1 h-6">
        {[14, 20, 8, 22, 16, 10, 24, 18, 12, 20, 15, 8, 18, 24, 14, 9, 16, 22].map(
          (height, i) => (
            <span
              key={i}
              style={{ height: isPlaying ? undefined : `${height}px` }}
              className={`w-1 rounded-full ${
                isPlaying
                  ? 'audio-bar'
                  : i < 7
                  ? 'bg-[#136b6f]'
                  : 'bg-slate-300'
              }`}
            />
          )
        )}
      </div>

      <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 shrink-0">
        <Volume2 className="w-3.5 h-3.5 text-slate-400" />
        <span>0:{durationSeconds < 10 ? `0${durationSeconds}` : durationSeconds}</span>
      </div>
    </div>
  );
};
