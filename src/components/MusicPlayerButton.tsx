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
            ? 'bg-[#5E8B7E]/20 border-[#5E8B7E] text-[#5E8B7E] shadow-sm shadow-[#5E8B7E]/20'
            : 'bg-[#2F3E46]/5 dark:bg-white/5 border-[#2F3E46]/10 dark:border-white/10 text-[#2F3E46]/70 dark:text-white/70 hover:text-[#5E8B7E] dark:hover:text-white hover:bg-[#2F3E46]/10'
        } ${className}`}
      >
        {isPlaying ? (
          <Volume2 className="w-3.5 h-3.5 text-[#5E8B7E] animate-pulse" />
        ) : (
          <VolumeX className="w-3.5 h-3.5 text-[#5A6D75] dark:text-white/50" />
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
            ? 'bg-[#5E8B7E] text-white border-[#5E8B7E] shadow-[#5E8B7E]/30'
            : 'bg-white/90 dark:bg-[#1F2E33]/90 text-[#2F3E46]/70 dark:text-white/70 hover:text-[#5E8B7E] dark:hover:text-white border-[#2F3E46]/10 dark:border-white/10'
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
          ? 'bg-[#5E8B7E]/20 border-[#5E8B7E] text-[#5E8B7E] shadow-sm'
          : 'bg-[#2F3E46]/5 dark:bg-white/10 hover:bg-[#2F3E46]/10 dark:hover:bg-white/15 text-[#2F3E46]/70 dark:text-white/70 hover:text-[#5E8B7E] dark:hover:text-white border-[#2F3E46]/10 dark:border-white/10'
      } ${className}`}
    >
      {isPlaying ? (
        <Volume2 className="w-4 h-4 text-[#5E8B7E] animate-pulse" />
      ) : (
        <VolumeX className="w-4 h-4 text-[#5A6D75] dark:text-white/50" />
      )}
      <span className="hidden sm:inline">{isPlaying ? 'Música ON' : 'Música'}</span>
    </button>
  );
};
