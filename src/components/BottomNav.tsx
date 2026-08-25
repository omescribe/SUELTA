import React from 'react';
import { Home, Wind, Plus, Compass, User } from 'lucide-react';
import { ViewType } from '../types';

interface BottomNavProps {
  currentView: ViewType;
  onChangeView: (view: ViewType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onChangeView }) => {
  return (
    <nav className="h-20 bg-white/95 dark:bg-[#1F2E33]/95 backdrop-blur-md border-t border-[#2F3E46]/10 dark:border-white/10 flex items-center justify-around px-4 pb-safe relative z-30 transition-colors shadow-lg">
      {/* 1. Inicio */}
      <button
        onClick={() => onChangeView('inicio')}
        className={`flex flex-col items-center justify-center gap-1.5 py-1 px-3 rounded-xl transition-all ${
          currentView === 'inicio' ? 'text-[#5E8B7E] font-semibold' : 'text-[#2F3E46]/60 dark:text-white/50 hover:text-[#5E8B7E]'
        }`}
        aria-label="Inicio"
      >
        <Home className="w-5 h-5" strokeWidth={currentView === 'inicio' ? 2.5 : 1.8} />
        <span className="text-[11px] font-medium tracking-tight">Inicio</span>
      </button>

      {/* 2. Ejercicios */}
      <button
        onClick={() => onChangeView('ejercicios')}
        className={`flex flex-col items-center justify-center gap-1.5 py-1 px-3 rounded-xl transition-all ${
          currentView === 'ejercicios' || currentView === 'respiracion' ? 'text-[#5E8B7E] font-semibold' : 'text-[#2F3E46]/60 dark:text-white/50 hover:text-[#5E8B7E]'
        }`}
        aria-label="Ejercicios"
      >
        <Wind className="w-5 h-5" strokeWidth={currentView === 'ejercicios' || currentView === 'respiracion' ? 2.5 : 1.8} />
        <span className="text-[11px] font-medium tracking-tight">Ejercicios</span>
      </button>

      {/* Center: "O" con "+" adentro para Comenzar Liberación */}
      <div className="relative -top-5 flex flex-col items-center">
        <button
          onClick={() => onChangeView('liberacion')}
          className="w-14 h-14 rounded-full bg-[#5E8B7E] text-white flex items-center justify-center shadow-lg shadow-[#5E8B7E]/30 hover:scale-105 active:scale-95 transition-transform border-4 border-[#F1F5F4] dark:border-[#162225] ring-2 ring-[#5E8B7E]/40"
          aria-label="Comenzar mi liberación"
          title="Comenzar mi liberación"
        >
          {/* Subtle O with + inside */}
          <div className="relative flex items-center justify-center">
            <Plus className="w-7 h-7 stroke-[2.8]" />
          </div>
        </button>
        <span className="text-[10px] font-semibold text-[#5E8B7E] mt-0.5 tracking-tight">Soltar</span>
      </div>

      {/* 3. Descubrir */}
      <button
        onClick={() => onChangeView('descubrir')}
        className={`flex flex-col items-center justify-center gap-1.5 py-1 px-3 rounded-xl transition-all ${
          currentView === 'descubrir' ? 'text-[#5E8B7E] font-semibold' : 'text-[#2F3E46]/60 dark:text-white/50 hover:text-[#5E8B7E]'
        }`}
        aria-label="Descubrir"
      >
        <Compass className="w-5 h-5" strokeWidth={currentView === 'descubrir' ? 2.5 : 1.8} />
        <span className="text-[11px] font-medium tracking-tight">Descubrir</span>
      </button>

      {/* 4. Perfil */}
      <button
        onClick={() => onChangeView('perfil')}
        className={`flex flex-col items-center justify-center gap-1.5 py-1 px-3 rounded-xl transition-all ${
          currentView === 'perfil' ? 'text-[#5E8B7E] font-semibold' : 'text-[#2F3E46]/60 dark:text-white/50 hover:text-[#5E8B7E]'
        }`}
        aria-label="Perfil"
      >
        <User className="w-5 h-5" strokeWidth={currentView === 'perfil' ? 2.5 : 1.8} />
        <span className="text-[11px] font-medium tracking-tight">Perfil</span>
      </button>
    </nav>
  );
};
