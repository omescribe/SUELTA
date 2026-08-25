import React from 'react';
import { HelpCircle, Sun, Moon } from 'lucide-react';
import { MusicPlayerButton } from './MusicPlayerButton';

interface HeaderProps {
  onOpenGuide: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenGuide, theme, onToggleTheme }) => {
  return (
    <header className="px-5 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between border-b border-[#2F3E46]/10 dark:border-white/10 bg-[#F1F5F4]/90 dark:bg-[#162225]/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      {/* Brand & Logo */}
      <div className="flex items-center gap-2.5">
        {/* Stylized Sage Leaf Icon */}
        <div className="w-8 h-8 rounded-xl bg-[#5E8B7E]/15 border border-[#5E8B7E]/30 flex items-center justify-center shadow-sm">
          <svg className="w-5 h-5" viewBox="0 0 100 100" fill="none">
            <path d="M50 15 C30 35 25 65 50 85 C75 65 70 35 50 15 Z" fill="#5E8B7E" />
            <path d="M50 18 L50 82" stroke="#162225" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M50 40 C40 34 33 40 28 46" stroke="#162225" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M50 40 C60 34 67 40 72 46" stroke="#162225" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M50 58 C40 52 35 57 32 62" stroke="#162225" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M50 58 C60 52 65 57 68 62" stroke="#162225" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <span className="text-base font-bold tracking-[0.2em] text-[#5E8B7E]">
            SUELTA
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Relaxing Background Music Toggle */}
        <MusicPlayerButton variant="header" />

        {/* Theme Toggle (Dark / Light) */}
        <button
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          className="p-2 rounded-xl bg-[#2F3E46]/5 dark:bg-white/10 text-[#2F3E46] dark:text-white/80 border border-[#2F3E46]/10 dark:border-white/10 hover:bg-[#2F3E46]/10 dark:hover:bg-white/15 transition-colors flex items-center justify-center"
          title={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-[#5E8B7E]" />
          ) : (
            <Moon className="w-4 h-4 text-[#5E8B7E]" />
          )}
        </button>

        {/* Guía y Propósito Button */}
        <button
          onClick={onOpenGuide}
          className="px-3.5 py-2 rounded-xl bg-[#5E8B7E]/10 dark:bg-[#5E8B7E]/20 text-[#5E8B7E] text-xs font-semibold border border-[#5E8B7E]/30 transition-all flex items-center gap-1.5 active:scale-95 hover:bg-[#5E8B7E]/20"
        >
          <HelpCircle className="w-4 h-4 text-[#5E8B7E]" />
          <span className="hidden sm:inline">Guía y propósito</span>
          <span className="sm:hidden">Guía</span>
        </button>
      </div>
    </header>
  );
};
