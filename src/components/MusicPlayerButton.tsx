import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { musicManager } from '../utils/audio';

interface MusicPlayerButtonProps {
  variant?: 'header' | 'compact' | 'floating';
  className?: string;
}

export const MusicPlayerButton: React.FC<MusicPlayerButtonProps> = ({
  variant = 'header',
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const unsubscribe = musicManager.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleToggle = () => {
    musicManager.toggle();
  };

  if (variant === 'compact') {
    return (
      <button
        id="musicaToggleBtnCompact"
        type="button"
        onClick={handleToggle}
        aria-label={isPlaying ? 'Pausar música de fondo' : 'Reproducir música relajante'}
        title={isPlaying ? 'Pausar música relajante' : 'Música relajante (30% vol)'}
        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 active:scale-95 ${
          isPlaying
            ? 'bg-[#8FAF9A]/20 border-[#8FAF9A] text-[#8FAF9A] shadow-sm shadow-[#8FAF9A]/20'
            : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10'
        } ${className}`}
      >
        {isPlaying ? (
          <Volume2 className="w-3.5 h-3.5 text-[#8FAF9A] animate-pulse" />
        ) : (
          <VolumeX className="w-3.5 h-3.5 text-white/50" />
        )}
        <span>{isPlaying ? 'Música activa' : 'Música relax'}</span>
      </button>
    );
  }

  if (variant === 'floating') {
    return (
      <button
        id="musicaToggleBtnFloating"
        type="button"
        onClick={handleToggle}
        aria-label={isPlaying ? 'Pausar música' : 'Reproducir música relax'}
        title={isPlaying ? 'Pausar música relajante' : 'Reproducir música relajante'}
        className={`p-3 rounded-2xl shadow-lg border backdrop-blur-md transition-all flex items-center justify-center active:scale-90 ${
          isPlaying
            ? 'bg-[#8FAF9A] text-[#121212] border-[#8FAF9A] shadow-[#8FAF9A]/30'
            : 'bg-[#1C1C1E]/90 text-white/70 hover:text-white border-white/10 hover:bg-[#252528]'
        } ${className}`}
      >
        {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>
    );
  }

  return (
    <button
      id="musicaToggleBtn"
      type="button"
      onClick={handleToggle}
      aria-label={isPlaying ? 'Pausar música' : 'Reproducir música relajante'}
      title={isPlaying ? 'Pausar música relajante' : 'Música relajante (30% vol)'}
      className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 active:scale-95 ${
        isPlaying
          ? 'bg-[#8FAF9A]/20 border-[#8FAF9A] text-[#8FAF9A] shadow-sm'
          : 'bg-[#1C1C1E] hover:bg-[#252528] text-white/70 hover:text-white border-white/5'
      } ${className}`}
    >
      {isPlaying ? (
        <Volume2 className="w-4 h-4 text-[#8FAF9A] animate-pulse" />
      ) : (
        <VolumeX className="w-4 h-4 text-white/50" />
      )}
      <span className="hidden sm:inline">{isPlaying ? 'Música ON' : 'Música'}</span>
    </button>
  );
};
