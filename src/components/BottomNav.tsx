import React from 'react';
import { Home, Wind, Plus, Compass, User } from 'lucide-react';
import { ViewType } from '../types';

interface BottomNavProps {
  currentView: ViewType;
  onChangeView: (view: ViewType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onChangeView }) => {
  return (
    <nav className="h-20 bg-[#1C1C1E] dark:bg-[#1C1C1E] border-t border-white/5 flex items-center justify-around px-4 pb-safe relative z-30 transition-colors">
      {/* 1. Inicio */}
      <button
        onClick={() => onChangeView('inicio')}
        className={`flex flex-col items-center justify-center gap-1.5 py-1 px-3 rounded-xl transition-all ${
          currentView === 'inicio' ? 'text-[#8FAF9A]' : 'text-white/40 hover:text-white/70'
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
          currentView === 'ejercicios' || currentView === 'respiracion' ? 'text-[#8FAF9A]' : 'text-white/40 hover:text-white/70'
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
          className="w-14 h-14 rounded-full bg-[#8FAF9A] text-[#121212] flex items-center justify-center shadow-lg shadow-[#8FAF9A]/30 hover:scale-105 active:scale-95 transition-transform border-4 border-[#121212] ring-2 ring-[#8FAF9A]/40"
          aria-label="Comenzar mi liberación"
          title="Comenzar mi liberación"
        >
          {/* Subtle O with + inside */}
          <div className="relative flex items-center justify-center">
            <Plus className="w-7 h-7 stroke-[2.8]" />
          </div>
        </button>
        <span className="text-[10px] font-semibold text-[#8FAF9A] mt-0.5 tracking-tight">Soltar</span>
      </div>

      {/* 3. Descubrir */}
      <button
        onClick={() => onChangeView('descubrir')}
        className={`flex flex-col items-center justify-center gap-1.5 py-1 px-3 rounded-xl transition-all ${
          currentView === 'descubrir' ? 'text-[#8FAF9A]' : 'text-white/40 hover:text-white/70'
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
          currentView === 'perfil' ? 'text-[#8FAF9A]' : 'text-white/40 hover:text-white/70'
        }`}
        aria-label="Perfil"
      >
        <User className="w-5 h-5" strokeWidth={currentView === 'perfil' ? 2.5 : 1.8} />
        <span className="text-[11px] font-medium tracking-tight">Perfil</span>
      </button>
    </nav>
  );
};
