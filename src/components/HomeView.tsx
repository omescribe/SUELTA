import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { InstallBanner } from './InstallBanner';
import {
  IllustrationAbrumado,
  IllustrationPensamientos,
  IllustrationTriste,
  IllustrationFrustrado,
  IllustrationPreocupado,
  IllustrationTenso,
  IllustrationRespiro,
  IllustrationMiedo,
} from './EmotionIllustrations';

interface HomeViewProps {
  onStartLiberation: (emotion?: string) => void;
  onGoToBreathing: () => void;
}

const EMOTIONS = [
  {
    id: 'abrumado',
    label: 'Abrumado',
    dotColor: '#C47C68', // Terracota
    component: IllustrationAbrumado,
  },
  {
    id: 'pensamientos',
    label: 'Con demasiados pensamientos',
    dotColor: '#7D98A1', // Azul grisáceo
    component: IllustrationPensamientos,
  },
  {
    id: 'triste',
    label: 'Triste',
    dotColor: '#7D98A1',
    component: IllustrationTriste,
  },
  {
    id: 'frustrado',
    label: 'Frustrado',
    dotColor: '#C47C68',
    component: IllustrationFrustrado,
  },
  {
    id: 'preocupado',
    label: 'Preocupado',
    dotColor: '#E5A962', // Ámbar miel
    component: IllustrationPreocupado,
  },
  {
    id: 'tenso',
    label: 'Tenso',
    dotColor: '#C47C68',
    component: IllustrationTenso,
  },
  {
    id: 'respiro',
    label: 'Solo necesito un respiro',
    dotColor: '#8FAF9A', // Verde salvia
    component: IllustrationRespiro,
  },
  {
    id: 'miedo',
    label: 'Miedo',
    dotColor: '#8FAF9A', // Verde salvia
    component: IllustrationMiedo,
  },
];

export const HomeView: React.FC<HomeViewProps> = ({ onStartLiberation, onGoToBreathing }) => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  const handleSelect = (emotionId: string) => {
    const next = selectedEmotion === emotionId ? null : emotionId;
    setSelectedEmotion(next);
    if (next) {
      // Direct smooth transition to liberation with contextual state
      onStartLiberation(next);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6 max-w-lg mx-auto w-full pb-10"
    >
      {/* Hero Welcome with Sage Leaf Emblem */}
      <div className="text-center pt-2 space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1C1C1E] border border-[#8FAF9A]/40 shadow-inner">
          <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none">
            <path d="M50 15 C30 35 25 65 50 85 C75 65 70 35 50 15 Z" fill="#8FAF9A" />
            <path d="M50 18 L50 82" stroke="#121212" strokeWidth="3" strokeLinecap="round" />
            <path d="M50 38 C40 33 34 38 30 43" stroke="#121212" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M50 38 C60 33 66 38 70 43" stroke="#121212" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M50 56 C40 51 36 55 33 60" stroke="#121212" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M50 56 C60 51 64 55 67 60" stroke="#121212" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif-display font-medium text-white tracking-tight">
          Inhala profundamente
        </h1>
        <p className="text-xs sm:text-sm text-white/60 max-w-xs mx-auto leading-relaxed">
          Este espacio es para ti. Unos minutos para recuperar tu calma y transformar la sobrecarga mental.
        </p>
      </div>

      {/* PWA Install Banner */}
      <InstallBanner />

      {/* Emotion Check-in Section (Exact match to reference image) */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base sm:text-lg font-medium text-white tracking-tight">
            ¿Cómo te sientes ahora mismo?
          </h2>
          <span className="text-xs sm:text-sm text-[#8FAF9A] font-normal">
            Vamos paso a paso
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          {EMOTIONS.map((item) => {
            const Illustration = item.component;
            const isSelected = selectedEmotion === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`p-3 sm:p-4 rounded-2xl border text-left transition-all flex items-center gap-2.5 sm:gap-3.5 group relative overflow-hidden min-h-[76px] sm:min-h-[82px] ${
                  isSelected
                    ? 'bg-[#222225] border-[#8FAF9A] text-white ring-1 ring-[#8FAF9A] shadow-md shadow-[#8FAF9A]/10'
                    : 'bg-[#131315] border-white/5 text-white hover:bg-[#202023] hover:border-white/10'
                }`}
              >
                {/* Character Illustration */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Illustration className="w-full h-full" />
                </div>

                {/* Emotion Label */}
                <div className="min-w-0 pr-0.5">
                  <span className="text-xs sm:text-[14px] font-normal text-white/95 leading-tight block">
                    {item.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Frases Calmantes Card (Matching reference design) */}
      <div className="bg-[#1C1C1E] border border-white/5 rounded-3xl p-5 shadow-sm relative overflow-hidden flex items-center justify-between gap-4">
        <div className="space-y-2.5 z-10">
          <div className="text-[#E5A962] font-serif text-2xl leading-none">“</div>
          <p className="text-sm font-serif-display font-medium text-white/95 leading-snug max-w-[240px]">
            Todo lo que sueltas, te hace más ligero.
          </p>
          <div className="inline-flex items-center gap-1 bg-[#E5A962]/15 text-[#E5A962] text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3" />
            <span>PARA RECORDAR</span>
          </div>
        </div>

        {/* Minimalist stylized golden branch illustration */}
        <div className="shrink-0 text-[#E5A962]/40 pr-2">
          <svg className="w-16 h-20" viewBox="0 0 80 100" fill="none" stroke="currentColor">
            <path d="M40 95 Q38 50 40 10" strokeWidth="2" strokeLinecap="round" />
            <path d="M40 25 C30 20 20 25 18 35 C28 35 38 30 40 25 Z" strokeWidth="1.5" />
            <path d="M40 25 C50 20 60 25 62 35 C52 35 42 30 40 25 Z" strokeWidth="1.5" />
            <path d="M40 45 C28 40 18 48 16 58 C26 58 38 50 40 45 Z" strokeWidth="1.5" />
            <path d="M40 45 C52 40 62 48 64 58 C54 58 42 50 40 45 Z" strokeWidth="1.5" />
            <path d="M40 68 C30 65 22 72 20 80 C28 80 38 74 40 68 Z" strokeWidth="1.5" />
            <path d="M40 68 C50 65 58 72 60 80 C52 80 42 74 40 68 Z" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="space-y-3 pt-1">
        <button
          onClick={() => onStartLiberation(selectedEmotion || undefined)}
          className="w-full h-14 bg-[#8FAF9A] hover:bg-[#80a38c] text-[#121212] font-semibold text-sm rounded-[18px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#8FAF9A]/20 active:scale-[0.98]"
        >
          <span>Comenzar mi liberación</span>
          <ArrowRight className="w-4 h-4 text-[#121212]" />
        </button>

        <button
          onClick={onGoToBreathing}
          className="w-full h-12 bg-transparent hover:bg-white/5 text-white/70 hover:text-white font-medium text-xs rounded-[18px] border border-white/10 transition-all flex items-center justify-center gap-2"
        >
          <span>Hacer pausa de respiración guiada primero</span>
        </button>
      </div>
    </motion.div>
  );
};
