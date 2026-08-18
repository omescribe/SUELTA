import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, RotateCcw, Compass, ArrowRight, Sparkles } from 'lucide-react';
import { BreathingWaveDisplay } from './BreathingWaveDisplay';
import { IllustrationCompletado } from './EmotionIllustrations';
import { saveTimerToStorage, getTimerFromStorage } from '../utils/timer';

interface ClosingViewProps {
  onReleaseAnother: () => void;
  onGoToGuides: () => void;
}

export const ClosingView: React.FC<ClosingViewProps> = ({ onReleaseAnother, onGoToGuides }) => {
  // 4-4-4 Breathing Configuration (3 cycles)
  // Inhala: 4s, Sostén: 4s, Exhala: 4s
  const INHALE_DURATION = 4;
  const HOLD_DURATION = 4;
  const EXHALE_DURATION = 4;
  const CYCLE_DURATION = INHALE_DURATION + HOLD_DURATION + EXHALE_DURATION; // 12s per cycle
  const TOTAL_CYCLES = 3;
  const TOTAL_DURATION = TOTAL_CYCLES * CYCLE_DURATION; // 36s total

  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [phaseDuration, setPhaseDuration] = useState(4);
  const [currentSecondInPhase, setCurrentSecondInPhase] = useState(1); // 1, 2, 3, 4
  const [currentCycle, setCurrentCycle] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);

  const endTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // Check if background timer exists
    const existing = getTimerFromStorage();
    const now = Date.now();
    let endTime = now + TOTAL_DURATION * 1000;

    if (existing && existing.type === 'cierre' && existing.endTimeMs > now) {
      endTime = existing.endTimeMs;
    } else {
      saveTimerToStorage({
        id: 'closing_wave_breath',
        title: 'Respiración de Cierre',
        totalSeconds: TOTAL_DURATION,
        endTimeMs: endTime,
        remainingSeconds: TOTAL_DURATION,
        isRunning: true,
        type: 'cierre',
      });
    }

    endTimeRef.current = endTime;

    const updateTimer = () => {
      if (!endTimeRef.current) return;
      const currentNow = Date.now();
      const totalRemaining = Math.max(0, Math.ceil((endTimeRef.current - currentNow) / 1000));

      if (totalRemaining <= 0) {
        setIsCompleted(true);
        saveTimerToStorage(null);
        return;
      }

      const totalElapsed = TOTAL_DURATION - totalRemaining;
      const cycleIdx = Math.min(TOTAL_CYCLES, Math.floor(totalElapsed / CYCLE_DURATION) + 1);
      setCurrentCycle(cycleIdx);

      const elapsedInCycle = totalElapsed % CYCLE_DURATION;
      if (elapsedInCycle < INHALE_DURATION) {
        setPhase('inhale');
        setPhaseDuration(INHALE_DURATION);
        setCurrentSecondInPhase(elapsedInCycle + 1); // 1, 2, 3, 4
      } else if (elapsedInCycle < INHALE_DURATION + HOLD_DURATION) {
        setPhase('hold');
        setPhaseDuration(HOLD_DURATION);
        setCurrentSecondInPhase(elapsedInCycle - INHALE_DURATION + 1); // 1, 2, 3, 4
      } else {
        setPhase('exhale');
        setPhaseDuration(EXHALE_DURATION);
        setCurrentSecondInPhase(elapsedInCycle - (INHALE_DURATION + HOLD_DURATION) + 1); // 1, 2, 3, 4
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 500);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        updateTimer();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [TOTAL_DURATION, CYCLE_DURATION]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center max-w-lg mx-auto w-full gap-5 pb-8 text-center"
    >
      {!isCompleted ? (
        // STATE 1: ACTIVE CLOSING BREATH WITH WAVE DISPLAY
        <div className="w-full flex flex-col items-center gap-5">
          {/* Check Icon Badge */}
          <div className="pt-1 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 bg-[#8FAF9A]/15 border border-[#8FAF9A]/30 text-[#8FAF9A] text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Tu carga ha sido liberada</span>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h1 className="text-2xl font-serif-display font-medium text-white tracking-tight">
              Respira para asentar la calma
            </h1>
            <p className="text-xs text-white/60 max-w-xs mx-auto leading-relaxed">
              3 ciclos conscientes (4-4-4) para armonizar tu ritmo cardíaco y relajar el cuerpo.
            </p>
          </div>

          {/* Glowing Wave Circle Display with Amber Orb */}
          <div className="w-full bg-[#1C1C1E] border border-white/5 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col items-center">
            <BreathingWaveDisplay
              phase={phase}
              phaseDuration={phaseDuration}
              currentSecondInPhase={currentSecondInPhase}
              currentCycle={currentCycle}
              totalCycles={TOTAL_CYCLES}
              modeLabel="Respiración 4-4-4 de Cierre"
            />
          </div>

          {/* Quick Skip / Continue button */}
          <button
            onClick={() => setIsCompleted(true)}
            className="text-xs text-white/50 hover:text-white/80 transition-colors flex items-center gap-1 py-1"
          >
            <span>Omitir y finalizar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        // STATE 2: COMPLETED GRACE SCREEN (Matching Paleta de colores y display.png)
        <div className="w-full bg-[#1C1C1E] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col items-center gap-5 shadow-sm text-center">
          <div className="inline-flex items-center gap-1.5 bg-[#E5A962]/15 text-[#E5A962] text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full border border-[#E5A962]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EJERCICIO COMPLETADO</span>
          </div>

          {/* Serene illustration figure with radiant aura */}
          <div className="w-48 h-48 my-1 flex items-center justify-center">
            <IllustrationCompletado className="w-full h-full" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-serif-display font-medium text-white tracking-tight">
              Gracias por este momento.
            </h2>
            <p className="text-xs sm:text-sm text-white/60 max-w-xs mx-auto leading-relaxed">
              Pequeños actos de cuidado cambian tu día. Tu mente ahora tiene más espacio y ligereza.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col gap-3 pt-2">
            <button
              onClick={onReleaseAnother}
              className="w-full h-14 bg-[#E5A962] hover:bg-[#d89b53] text-[#121212] font-semibold text-sm rounded-[18px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#E5A962]/20 active:scale-[0.98]"
            >
              <RotateCcw className="w-4 h-4 text-[#121212]" />
              <span>Soltar otra carga</span>
            </button>

            <button
              onClick={onGoToGuides}
              className="w-full h-12 bg-transparent hover:bg-white/5 text-white/70 hover:text-white font-medium text-xs rounded-[18px] border border-white/10 transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-[#8FAF9A]" />
              <span>Explorar más herramientas para tu calma</span>
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
