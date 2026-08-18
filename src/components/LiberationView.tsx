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
    color: '#C47C68',
  },
  pensamientos: {
    label: 'Con demasiados pensamientos',
    prompt: 'Escribe ese torbellino de ideas, dudas o bucles mentales que no se detienen. Al verlos aquí escritos, tu mente comenzará a descansar.',
    color: '#7D98A1',
  },
  triste: {
    label: 'Triste',
    prompt: 'Expresa qué situación, dolor o vacío te genera tristeza en este momento. Permítete sentirlo y plasmarlo con total libertad.',
    color: '#7D98A1',
  },
  frustrado: {
    label: 'Frustrado',
    prompt: 'Escribe qué obstáculo, injusticia o expectativa no cumplida desató tu impotencia o enojo. Sácalo aquí para soltar su carga.',
    color: '#C47C68',
  },
  preocupado: {
    label: 'Preocupado',
    prompt: 'Describe el temor o la incertidumbre sobre el futuro que te inquieta. Al ponerle palabras precisas, pierde su control sobre ti.',
    color: '#E5A962',
  },
  tenso: {
    label: 'Tenso',
    prompt: 'Externaliza la presión o rigidez que cargas en tu cuerpo y mente. Identifica qué la originó y permítete comenzar a aflojarla.',
    color: '#C47C68',
  },
  respiro: {
    label: 'Necesito un respiro',
    prompt: 'Dedica estas líneas a soltar el cansancio acumulado del día. Reconoce tu esfuerzo y date permiso de descargar este peso.',
    color: '#8FAF9A',
  },
  miedo: {
    label: 'Miedo',
    prompt: 'Describe qué amenaza, peligro o incertidumbre te asusta. Al nombrarlo y sacarlo fuera de ti, tu cuerpo y mente recuperan la calma y seguridad.',
    color: '#8FAF9A',
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
        <h1 className="text-2xl font-serif-display font-medium text-white tracking-tight">
          Comienza mi liberación: ¿cómo te sientes hoy?
        </h1>
        <p className="text-xs text-white/60 leading-relaxed">
          Externaliza tu carga: escribe sin filtros todo aquello que te pesa, te limita o deseas liberar. Tu privacidad está protegida.
        </p>
      </div>

      {/* Contextual Emotional Guidance Banner (Bridge between Home and Writing Box) */}
      <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-3.5 space-y-1.5 shadow-sm">
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
            <span className="text-[11px] font-semibold text-[#8FAF9A] bg-[#8FAF9A]/15 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Guía de expresión
            </span>
          )}
          <span className="text-[11px] text-white/40 font-medium">¿Qué lo provoca?</span>
        </div>

        <p className="text-xs text-white/80 leading-relaxed">
          {emotionInfo
            ? emotionInfo.prompt
            : 'Escribe qué situación, pensamiento o emoción te está pesando en este instante. No busques redactar perfecto; simplemente deja que tus manos vacíen tu mente.'}
        </p>
      </div>

      {/* Writing Box with Privacy Masking (Preserving exact layout) */}
      <div className="bg-[#1C1C1E] border border-white/5 rounded-3xl p-4 sm:p-5 flex flex-col gap-3 shadow-sm">
        <div className="flex items-center justify-between pb-1 border-b border-white/5">
          <div className="flex items-center gap-1.5 text-xs text-white/60">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8FAF9A]" />
            <span>Privado y seguro</span>
          </div>

          <button
            type="button"
            onClick={() => setIsPrivate(!isPrivate)}
            className="flex items-center gap-1.5 text-xs text-[#8FAF9A] hover:text-[#a0c2ab] font-medium transition-colors px-2.5 py-1 rounded-lg bg-white/5"
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
          className="w-full bg-transparent border-none outline-none text-white text-sm leading-relaxed resize-none placeholder:text-white/30 focus:ring-0"
        />

        {/* Footer with clean separated layout so texts never overlap */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-white/50">
          <span id="wordCount" className="font-mono text-[#8FAF9A]">
            {wordCount} {wordCount === 1 ? 'palabra' : 'palabras'}
          </span>
          <span className="italic text-white/50 text-right truncate max-w-[200px]">
            &ldquo;practica y se disolverán&rdquo;
          </span>
        </div>
      </div>

      {/* Selector de Prácticas */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-white/80 uppercase tracking-wider">
          Selecciona tu práctica de liberación:
        </p>

        <div className="grid grid-cols-3 gap-2.5">
          {/* 1. Fuego */}
          <button
            type="button"
            onClick={() => setSelectedPractice('fuego')}
            className={`p-3 rounded-2xl border flex flex-col items-center gap-2 text-center transition-all ${
              selectedPractice === 'fuego'
                ? 'bg-[#8FAF9A]/20 border-[#8FAF9A] text-white ring-1 ring-[#8FAF9A]'
                : 'bg-[#1C1C1E] border-white/5 text-white/60 hover:bg-[#252528] hover:text-white'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              selectedPractice === 'fuego' ? 'bg-[#8FAF9A] text-[#121212]' : 'bg-white/5 text-[#8FAF9A]'
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
                ? 'bg-[#8FAF9A]/20 border-[#8FAF9A] text-white ring-1 ring-[#8FAF9A]'
                : 'bg-[#1C1C1E] border-white/5 text-white/60 hover:bg-[#252528] hover:text-white'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              selectedPractice === 'mar' ? 'bg-[#8FAF9A] text-[#121212]' : 'bg-white/5 text-[#8FAF9A]'
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
                ? 'bg-[#8FAF9A]/20 border-[#8FAF9A] text-white ring-1 ring-[#8FAF9A]'
                : 'bg-[#1C1C1E] border-white/5 text-white/60 hover:bg-[#252528] hover:text-white'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              selectedPractice === 'globo' ? 'bg-[#8FAF9A] text-[#121212]' : 'bg-white/5 text-[#8FAF9A]'
            }`}>
              <Wind className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium leading-tight">Globo que se eleva</span>
          </button>
        </div>

        {/* Dynamic description of the selected practice */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-3 text-center">
          <p id="practiceDescription" className="text-xs text-[#8FAF9A] italic">
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
          className="w-full h-14 bg-[#8FAF9A] hover:bg-[#80a38c] text-[#121212] font-semibold text-sm rounded-[18px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#8FAF9A]/20 active:scale-[0.98]"
        >
          <span>Comenzar mi liberación</span>
          <ArrowRight className="w-4 h-4 text-[#121212]" />
        </button>
      </div>
    </motion.div>
  );
};
