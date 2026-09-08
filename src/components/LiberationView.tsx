import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Flame, Waves, Wind, Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { PracticeType } from '../types';

interface LiberationViewProps {
  initialEmotion?: string;
  onStartAnimation: (practice: PracticeType, text: string) => void;
}

const EMOTION_PROMPTS: Record<string, { label: string; prompt: string; color: string }> = {
  abrumado: {
    label: 'Abrumado',
    prompt: 'Describe qué situación, exceso de tareas o exigencias te hacen sentir así. Vuelca aquí todo lo que satura tu mente sin guardarte nada.',
    color: '#FF7E5F', // Coral Glow
  },
  pensamientos: {
    label: 'Con demasiados pensamientos',
    prompt: 'Escribe ese torbellino de ideas, dudas o bucles mentales que no se detienen. Al verlos aquí escritos, tu mente comenzará a descansar.',
    color: '#48CAE4', // Serene Sky
  },
  triste: {
    label: 'Triste',
    prompt: 'Expresa qué situación, dolor o vacío te genera tristeza en este momento. Permítete sentirlo y plasmarlo con total libertad.',
    color: '#48CAE4',
  },
  frustrado: {
    label: 'Frustrado',
    prompt: 'Escribe qué obstáculo, injusticia o expectativa no cumplida desató tu impotencia o enojo. Sácalo aquí para soltar su carga.',
    color: '#FF7E5F',
  },
  preocupado: {
    label: 'Preocupado',
    prompt: 'Describe el temor o la incertidumbre sobre el futuro que te inquieta. Al ponerle palabras precisas, pierde su control sobre ti.',
    color: '#FDB833', // Solar Amber
  },
  tenso: {
    label: 'Tenso',
    prompt: 'Externaliza la presión o rigidez que cargas en tu cuerpo y mente. Identifica qué la originó y permítete comenzar a aflojarla.',
    color: '#FF7E5F',
  },
  respiro: {
    label: 'Necesito un respiro',
    prompt: 'Dedica estas líneas a soltar el cansancio acumulado del día. Reconoce tu esfuerzo y date permiso de descargar este peso.',
    color: '#2EC4B6', // Mystic Emerald
  },
  miedo: {
    label: 'Miedo',
    prompt: 'Describe qué amenaza, peligro o incertidumbre te asusta. Al nombrarlo y sacarlo fuera de ti, tu cuerpo y mente recuperan la calma y seguridad.',
    color: '#2EC4B6',
  },
  dolor: {
    label: 'Dolor o malestar físico',
    prompt: 'Ubica en qué parte de tu cuerpo sientes dolor, molestia o rigidez física. Describe la sensación y permítete soltar la resistencia para que tu cuerpo pueda relajarse.',
    color: '#FDB833',
  },
};

export const LiberationView: React.FC<LiberationViewProps> = ({ initialEmotion, onStartAnimation }) => {
  const defaultPlaceholder = "Siento una pesadez en el pecho por lo ocurrido hoy. Elijo soltar esta tensión y dejar ir la sobrecarga...";
  const [text, setText] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedPractice, setSelectedPractice] = useState<PracticeType>('fuego');

  const emotionInfo = initialEmotion ? EMOTION_PROMPTS[initialEmotion] : null;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleStart = () => {
    const textToRelease = text.trim() || defaultPlaceholder;
    onStartAnimation(selectedPractice, textToRelease);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-5 max-w-lg mx-auto w-full pb-8"
    >
      {/* Title & Introduction */}
      <div className="space-y-1.5 pt-1">
        <h1 className="text-2xl font-serif-display font-medium text-[#0e1d25] dark:text-[#fcfbf9] tracking-tight">
          Comienza mi liberación: ¿cómo te sientes hoy?
        </h1>
        <p className="text-xs text-[#59413c] dark:text-[#fcfbf9]/60 leading-relaxed">
          Externaliza tu carga: escribe sin filtros todo aquello que te pesa, te limita o deseas liberar. Tu privacidad está protegida.
        </p>
      </div>

      {/* Contextual Emotional Guidance Banner */}
      <div className="bg-white dark:bg-[#1c1917] border border-[#0e1d25]/10 dark:border-white/10 rounded-2xl p-3.5 space-y-1.5 shadow-sm">
        <div className="flex items-center gap-2">
          {emotionInfo ? (
            <span
              className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5"
              style={{
                backgroundColor: `${emotionInfo.color}25`,
                color: emotionInfo.color,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: emotionInfo.color }} />
              Sientes: {emotionInfo.label}
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-[#ae3115] bg-[#FF6B4A]/15 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Guía de expresión
            </span>
          )}
          <span className="text-[11px] text-[#59413c] dark:text-[#fcfbf9]/40 font-medium">¿Qué lo provoca?</span>
        </div>

        <p className="text-xs text-[#0e1d25] dark:text-[#fcfbf9]/80 leading-relaxed">
          {emotionInfo
            ? emotionInfo.prompt
            : 'Escribe qué situación, pensamiento o emoción te está pesando en este instante. No busques redactar perfecto; simplemente deja que tus manos vacíen tu mente.'}
        </p>
      </div>

      {/* Writing Box with Privacy Masking */}
      <div className="bg-white dark:bg-[#1c1917] border border-[#0e1d25]/10 dark:border-white/10 rounded-3xl p-4 sm:p-5 flex flex-col gap-3 shadow-sm">
        <div className="flex items-center justify-between pb-1 border-b border-[#0e1d25]/10 dark:border-white/10">
          <div className="flex items-center gap-1.5 text-xs text-[#59413c] dark:text-[#fcfbf9]/60">
            <ShieldCheck className="w-3.5 h-3.5 text-[#ae3115]" />
            <span>Privado y seguro</span>
          </div>

          <button
            type="button"
            onClick={() => setIsPrivate(!isPrivate)}
            className="flex items-center gap-1.5 text-xs text-[#ae3115] hover:text-[#7a1f0c] font-medium transition-colors px-2.5 py-1 rounded-lg bg-[#FF6B4A]/10"
          >
            {isPrivate ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span id="privacyBtnText">{isPrivate ? 'Revelar' : 'Ocultar'}</span>
          </button>
        </div>

        <textarea
          id="journalText"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={defaultPlaceholder}
          rows={5}
          style={{
            WebkitTextSecurity: isPrivate ? 'disc' : 'none',
          } as React.CSSProperties}
          className="w-full bg-transparent border-none outline-none text-[#0e1d25] dark:text-[#fcfbf9] text-sm leading-relaxed resize-none placeholder:text-[#59413c]/50 dark:placeholder:text-[#fcfbf9]/30 focus:ring-0"
        />

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#0e1d25]/10 dark:border-white/10 text-[11px] text-[#59413c] dark:text-[#fcfbf9]/50">
          <span id="wordCount" className="font-mono text-[#ae3115] font-semibold">
            {wordCount} {wordCount === 1 ? 'palabra' : 'palabras'}
          </span>
          <span className="italic text-[#59413c] dark:text-[#fcfbf9]/50 text-right truncate max-w-[200px]">
            &ldquo;practica y se disolverán&rdquo;
          </span>
        </div>
      </div>

      {/* Selector de Prácticas */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-[#0e1d25] dark:text-[#fcfbf9]/80 uppercase tracking-wider">
          Selecciona tu práctica de liberación:
        </p>

        <div className="grid grid-cols-3 gap-2.5">
          {/* 1. Fuego */}
          <button
            type="button"
            onClick={() => setSelectedPractice('fuego')}
            className={`p-3 rounded-2xl border flex flex-col items-center gap-2 text-center transition-all ${
              selectedPractice === 'fuego'
                ? 'bg-[#FF6B4A]/15 border-[#FF6B4A] text-[#0e1d25] dark:text-[#fcfbf9] ring-1 ring-[#FF6B4A]'
                : 'bg-white dark:bg-[#1c1917] border-[#0e1d25]/10 dark:border-white/10 text-[#59413c] dark:text-[#fcfbf9]/60 hover:bg-[#FF6B4A]/5'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              selectedPractice === 'fuego' ? 'bg-[#FF6B4A] text-white' : 'bg-[#FF6B4A]/10 text-[#ae3115]'
            }`}>
              <Flame className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium leading-tight">Papel que se quema</span>
          </button>

          {/* 2. Mar */}
          <button
            type="button"
            onClick={() => setSelectedPractice('mar')}
            className={`p-3 rounded-2xl border flex flex-col items-center gap-2 text-center transition-all ${
              selectedPractice === 'mar'
                ? 'bg-[#FF6B4A]/15 border-[#FF6B4A] text-[#0e1d25] dark:text-[#fcfbf9] ring-1 ring-[#FF6B4A]'
                : 'bg-white dark:bg-[#1c1917] border-[#0e1d25]/10 dark:border-white/10 text-[#59413c] dark:text-[#fcfbf9]/60 hover:bg-[#FF6B4A]/5'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              selectedPractice === 'mar' ? 'bg-[#FF6B4A] text-white' : 'bg-[#FF6B4A]/10 text-[#ae3115]'
            }`}>
              <Waves className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium leading-tight">Arena que se borra</span>
          </button>

          {/* 3. Globo */}
          <button
            type="button"
            onClick={() => setSelectedPractice('globo')}
            className={`p-3 rounded-2xl border flex flex-col items-center gap-2 text-center transition-all ${
              selectedPractice === 'globo'
                ? 'bg-[#FF6B4A]/15 border-[#FF6B4A] text-[#0e1d25] dark:text-[#fcfbf9] ring-1 ring-[#FF6B4A]'
                : 'bg-white dark:bg-[#1c1917] border-[#0e1d25]/10 dark:border-white/10 text-[#59413c] dark:text-[#fcfbf9]/60 hover:bg-[#FF6B4A]/5'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              selectedPractice === 'globo' ? 'bg-[#FF6B4A] text-white' : 'bg-[#FF6B4A]/10 text-[#ae3115]'
            }`}>
              <Wind className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium leading-tight">Globo que se eleva</span>
          </button>
        </div>

        {/* Dynamic description of the selected practice */}
        <div className="bg-[#FF6B4A]/10 border border-[#FF6B4A]/20 rounded-2xl p-3 text-center">
          <p id="practiceDescription" className="text-xs text-[#ae3115] italic font-medium">
            {selectedPractice === 'fuego' && "Externaliza y observa la transformación purificadora del fuego."}
            {selectedPractice === 'mar' && "Flujo constante del agua del mar barriendo y llevándose lo pesado."}
            {selectedPractice === 'globo' && "Ligereza absoluta entregada a la inmensidad infinita del cielo."}
          </p>
        </div>
      </div>

      {/* Start Button */}
      <div className="pt-2">
        <button
          onClick={handleStart}
          className="w-full h-14 bg-gradient-to-br from-[#FF6B4A] to-[#FF7E5F] hover:from-[#e85a3a] hover:to-[#e86e4f] text-white font-semibold text-sm rounded-[18px] transition-all flex items-center justify-center gap-2 shadow-[0_8px_24px_-2px_rgba(255,107,74,0.45),0_2px_6px_rgba(253,184,51,0.3)] active:scale-[0.97]"
        >
          <span>Comenzar mi liberación</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>
    </motion.div>
  );
};