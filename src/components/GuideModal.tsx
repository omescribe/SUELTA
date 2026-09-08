import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Brain, Wind, ArrowRight, X } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartPractice: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose, onStartPractice }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="modalGuia"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full max-w-lg bg-white dark:bg-[#1c1917] border border-[#0e1d25]/10 dark:border-white/10 rounded-[28px] p-6 sm:p-7 shadow-2xl text-[#0e1d25] dark:text-[#fcfbf9] my-auto max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#0e1d25]/10 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#FF6B4A]/15 flex items-center justify-center text-[#ae3115]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#ae3115] tracking-tight">Bienvenido a Suelta</h2>
                  <p className="text-xs text-[#59413c] dark:text-[#fcfbf9]/50">Refugio de autorregulación emocional</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#0e1d25]/5 dark:bg-white/5 hover:bg-[#0e1d25]/10 dark:hover:bg-white/10 flex items-center justify-center text-[#0e1d25]/70 dark:text-[#fcfbf9]/70 hover:text-[#ae3115] dark:hover:text-[#ff7854] transition-colors"
                aria-label="Cerrar modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Purpose */}
            <div className="mt-5 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#ae3115]">
                ¿Para qué sirve esta app?
              </p>
              <p className="text-sm text-[#0e1d25]/90 dark:text-[#fcfbf9]/80 leading-relaxed font-normal bg-[#f4faff] dark:bg-[#23201d] p-3.5 rounded-2xl border border-[#0e1d25]/10 dark:border-white/5">
                <strong className="text-[#0e1d25] dark:text-[#fcfbf9] font-medium">Suelta</strong> es una herramienta de autorregulación emocional diseñada para transformar cargas mentales en alivio corporal inmediato.
              </p>
            </div>

            {/* Two Key Principles */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-[#f4faff] dark:bg-[#23201d] p-4 rounded-2xl border border-[#0e1d25]/10 dark:border-white/5 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[#ae3115]">
                  <Brain className="w-4 h-4" />
                  <strong className="text-xs tracking-wide text-[#0e1d25] dark:text-[#fcfbf9]">1. Desactiva la ansiedad</strong>
                </div>
                <p className="text-xs text-[#59413c] dark:text-[#fcfbf9]/70 leading-relaxed">
                  Nombra tu emoción y reduce al instante la reactividad en la amígdala cerebral.
                </p>
              </div>

              <div className="bg-[#f4faff] dark:bg-[#23201d] p-4 rounded-2xl border border-[#0e1d25]/10 dark:border-white/5 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[#48CAE4]">
                  <Wind className="w-4 h-4" />
                  <strong className="text-xs tracking-wide text-[#0e1d25] dark:text-[#fcfbf9]">2. Descarga somática</strong>
                </div>
                <p className="text-xs text-[#59413c] dark:text-[#fcfbf9]/70 leading-relaxed">
                  Ver tus pensamientos disolverse en fuego, arena o viento calma tu sistema nervioso.
                </p>
              </div>
            </div>

            {/* Step-by-Step Guide */}
            <div className="mt-4 bg-[#f4faff] dark:bg-[#23201d] p-4 sm:p-5 rounded-2xl border border-[#0e1d25]/10 dark:border-white/5 space-y-3.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#ae3115]">
                Guía paso a paso: cómo realizar un ejercicio o práctica
              </p>

              <ul className="space-y-3 text-xs text-[#0e1d25]/90 dark:text-[#fcfbf9]/80">
                <li className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#FF6B4A]/20 text-[#ae3115] flex items-center justify-center font-semibold text-[11px]">1</span>
                  <div>
                    <strong className="text-[#0e1d25] dark:text-[#fcfbf9] block font-medium">Identifica lo que sientes</strong>
                    <span className="text-[#59413c] dark:text-[#fcfbf9]/60">Selecciona la emoción dominante (ansiedad, estrés, tristeza, miedo, enojo o confusión).</span>
                  </div>
                </li>

                <li className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#FF6B4A]/20 text-[#ae3115] flex items-center justify-center font-semibold text-[11px]">2</span>
                  <div>
                    <strong className="text-[#0e1d25] dark:text-[#fcfbf9] block font-medium">Vacía tu mente sin filtro</strong>
                    <span className="text-[#59413c] dark:text-[#fcfbf9]/60">Escribe en el papel de descarga lo que te pasa. Activa el botón de privacidad si deseas ocultar el texto.</span>
                  </div>
                </li>

                <li className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#FF6B4A]/20 text-[#ae3115] flex items-center justify-center font-semibold text-[11px]">3</span>
                  <div>
                    <strong className="text-[#0e1d25] dark:text-[#fcfbf9] block font-medium">Elige la práctica somática</strong>
                    <span className="text-[#59413c] dark:text-[#fcfbf9]/60">Escoge entre fuego transformador, arena efímera y globo de viento.</span>
                  </div>
                </li>

                <li className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#FF6B4A]/20 text-[#ae3115] flex items-center justify-center font-semibold text-[11px]">4</span>
                  <div>
                    <strong className="text-[#0e1d25] dark:text-[#fcfbf9] block font-medium">Mantén presionado para liberar</strong>
                    <span className="text-[#59413c] dark:text-[#fcfbf9]/60">Presiona el botón de acción, inhala hondo y observa cómo tus palabras y cargas se disuelven por completo.</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Action Button */}
            <div className="mt-5 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onStartPractice();
                }}
                className="w-full h-14 bg-gradient-to-br from-[#FF6B4A] to-[#FF7E5F] hover:from-[#e85a3a] hover:to-[#e86e4f] text-white font-semibold text-sm rounded-[18px] transition-all flex items-center justify-center gap-2 shadow-[0_8px_24px_-2px_rgba(255,107,74,0.45),0_2px_6px_rgba(253,184,51,0.3)] active:scale-[0.97]"
              >
                <span>Entiendo, comenzar mi práctica</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};