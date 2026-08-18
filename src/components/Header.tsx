import React from 'react';
import { HelpCircle, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  onOpenGuide: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenGuide, theme, onToggleTheme }) => {
  return (
    <header className="px-6 py-4 flex items-center justify-between border-b border-white/5 dark:border-white/5 bg-[#121212]/80 dark:bg-[#121212]/80 backdrop-blur-md sticky top-0 z-40">
      {/* Brand & Logo */}
      <div className="flex items-center gap-2.5">
        {/* Stylized Sage Leaf Icon */}
        <div className="w-8 h-8 rounded-xl bg-[#1C1C1E] border border-[#8FAF9A]/30 flex items-center justify-center shadow-sm">
          <svg className="w-5 h-5" viewBox="0 0 100 100" fill="none">
            <path d="M50 15 C30 35 25 65 50 85 C75 65 70 35 50 15 Z" fill="#8FAF9A" />
            <path d="M50 18 L50 82" stroke="#121212" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M50 40 C40 34 33 40 28 46" stroke="#121212" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M50 40 C60 34 67 40 72 46" stroke="#121212" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M50 58 C40 52 35 57 32 62" stroke="#121212" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M50 58 C60 52 65 57 68 62" stroke="#121212" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <span className="text-base font-semibold tracking-[0.2em] text-[#8FAF9A]">
            SUELTA
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle (Dark / Light with icons, no emojis) */}
        <button
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          className="p-2 rounded-xl bg-[#1C1C1E] hover:bg-[#252528] text-white/70 hover:text-white border border-white/5 transition-colors flex items-center justify-center"
          title={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-[#8FAF9A]" />
          ) : (
            <Moon className="w-4 h-4 text-[#8FAF9A]" />
          )}
        </button>

        {/* Guía y Propósito Button */}
        <button
          onClick={onOpenGuide}
          className="px-3.5 py-2 rounded-xl bg-[#1C1C1E] hover:bg-[#252528] text-[#8FAF9A] text-xs font-medium border border-[#8FAF9A]/20 transition-all flex items-center gap-1.5 active:scale-95"
        >
          <HelpCircle className="w-4 h-4 text-[#8FAF9A]" />
          <span className="hidden sm:inline">Guía y propósito</span>
          <span className="sm:hidden">Guía</span>
        </button>
      </div>
    </header>
  );
};
