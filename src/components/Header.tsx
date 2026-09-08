import React from 'react';
import { HelpCircle, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  onOpenGuide: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenGuide, theme, onToggleTheme }) => {
  return (
    <header className="px-5 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between border-b border-[#ae3115]/10 dark:border-white/10 bg-[#f4faff]/90 dark:bg-[#141210]/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      {/* Brand & Logo */}
      <div className="flex items-center gap-2.5">
        {/* Stylized Sage Leaf Icon */}
        <div className="w-8 h-8 rounded-xl bg-[#ae3115]/15 border border-[#ae3115]/30 flex items-center justify-center shadow-sm">
          <svg className="w-5 h-5" viewBox="0 0 100 100" fill="none">
            <path d="M50 15 C30 35 25 65 50 85 C75 65 70 35 50 15 Z" fill="#ae3115" />
            <path d="M50 18 L50 82" stroke="#141210" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M50 40 C40 34 33 40 28 46" stroke="#141210" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M50 40 C60 34 67 40 72 46" stroke="#141210" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M50 58 C40 52 35 57 32 62" stroke="#141210" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M50 58 C60 52 65 57 68 62" stroke="#141210" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <span className="text-base font-bold tracking-[0.2em] text-[#ae3115]">
            SUELTA
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle (Dark / Light) */}
        <button
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          className="p-2 rounded-xl bg-[#0e1d25]/5 dark:bg-white/10 text-[#0e1d25] dark:text-[#fcfbf9] border border-[#0e1d25]/10 dark:border-white/10 hover:bg-[#0e1d25]/10 dark:hover:bg-white/15 transition-colors flex items-center justify-center"
          title={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-[#ff7854]" />
          ) : (
            <Moon className="w-4 h-4 text-[#ae3115]" />
          )}
        </button>

        {/* Guía y Propósito Button */}
        <button
          onClick={onOpenGuide}
          className="px-3.5 py-2 rounded-xl bg-[#ae3115]/10 dark:bg-[#ff7854]/20 text-[#ae3115] dark:text-[#ffb4a1] text-xs font-semibold border border-[#ae3115]/30 dark:border-[#ff7854]/30 transition-all flex items-center gap-1.5 active:scale-95 hover:bg-[#ae3115]/20 dark:hover:bg-[#ff7854]/30"
        >
          <HelpCircle className="w-4 h-4 text-[#ae3115] dark:text-[#ff7854]" />
          <span className="hidden sm:inline">Guía y propósito</span>
          <span className="sm:hidden">Guía</span>
        </button>
      </div>
    </header>
  );
};