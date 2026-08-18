import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Play, RotateCcw, ArrowRight, Wind, Sparkles } from 'lucide-react';
import { BreathingMode } from '../types';
import { BreathingWaveDisplay } from './BreathingWaveDisplay';
import { IllustrationCompletado } from './EmotionIllustrations';
import { saveTimerToStorage, sendTimerNotification, requestNotificationPermission } from '../utils/timer';

export const BreathingView: React.FC<{ onCompleteSession?: () => void }> = ({ onCompleteSession }) => {
  const [selectedMode, setSelectedMode] = useState<BreathingMode>('4-4-6');
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [cycleCount, setCycleCount] = useState(1);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [currentSecondInPhase, setCurrentSecondInPhase] = useState(1);
  const [currentPhaseDuration, setCurrentPhaseDuration] = useState(4);

  // Configuration
  // 4-4-6: Inhala 4s, Sostén 4s, Exhala 6s (3 cycles)
  // 4-7-8: Inhala 4s, Sostén 7s, Exhala 8s (4 cycles)
  const totalCycles = selectedMode === '4-4-6' ? 3 : 4;
  const inhaleDuration = 4;
  const holdDuration = selectedMode === '4-4-6' ? 4 : 7;
  const exhaleDuration = selectedMode === '4-4-6' ? 6 : 8;

  const cycleDuration = inhaleDuration + holdDuration + exhaleDuration;
  const totalSessionSeconds = totalCycles * cycleDuration;

  const timerRef = useRef<number | null>(null);
  const sessionEndTimeRef = useRef<number | null>(null);

  const startBreathing = (mode: BreathingMode) => {
    requestNotificationPermission();
    setSelectedMode(mode);
    setIsActive(true);
    setIsCompleted(false);
    setCycleCount(1);
    setPhase('inhale');
    setCurrentSecondInPhase(1);
    setCurrentPhaseDuration(4);

    const now = Date.now();
    const duration = mode === '4-4-6' ? 3 * (4 + 4 + 6) : 4 * (4 + 7 + 8);
    sessionEndTimeRef.current = now + duration * 1000;

    saveTimerToStorage({
      id: `breathing_${mode}`,
      title: `Respiración ${mode}`,
      totalSeconds: duration,
      endTimeMs: sessionEndTimeRef.current,
      remainingSeconds: duration,
      isRunning: true,
      type: 'breathing',
    });
  };

  const stopBreathing = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    saveTimerToStorage(null);
  };

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (!sessionEndTimeRef.current) return;

      const totalLeft = Math.max(0, Math.ceil((sessionEndTimeRef.current - now) / 1000));
      if (totalLeft <= 0) {
        setIsActive(false);
        setIsCompleted(true);
        saveTimerToStorage(null);
        sendTimerNotification('SUELTA - Respiración Completada', 'Has terminado tus ciclos de respiración guiada. Continúa con tu día en calma.');
        return;
      }

      // Calculate current cycle and phase based on elapsed time
      const totalElapsed = totalSessionSeconds - totalLeft;
      const currentCycleIndex = Math.min(totalCycles, Math.floor(totalElapsed / cycleDuration) + 1);
      setCycleCount(currentCycleIndex);

      const elapsedInCycle = totalElapsed % cycleDuration;
      if (elapsedInCycle < inhaleDuration) {
        setPhase('inhale');
        setCurrentPhaseDuration(inhaleDuration);
        setCurrentSecondInPhase(elapsedInCycle + 1);
      } else if (elapsedInCycle < inhaleDuration + holdDuration) {
        setPhase('hold');
        setCurrentPhaseDuration(holdDuration);
        setCurrentSecondInPhase(elapsedInCycle - inhaleDuration + 1);
      } else {
        setPhase('exhale');
        setCurrentPhaseDuration(exhaleDuration);
        setCurrentSecondInPhase(elapsedInCycle - (inhaleDuration + holdDuration) + 1);
      }
    }, 500);

    timerRef.current = interval as unknown as number;

    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && sessionEndTimeRef.current) {
        const left = Math.max(0, Math.ceil((sessionEndTimeRef.current - Date.now()) / 1000));
        if (left <= 0) {
          setIsActive(false);
          setIsCompleted(true);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isActive, cycleDuration, inhaleDuration, holdDuration, totalCycles, totalSessionSeconds, exhaleDuration]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6 max-w-lg mx-auto w-full pb-8"
    >
      {/* Title */}
      <div className="space-y-1 pt-1 text-center">
        <h1 className="text-2xl font-serif-display font-medium text-white tracking-tight">
          Respiración Guiada Consciente
        </h1>
        <p className="text-xs text-white/60 max-w-xs mx-auto leading-relaxed">
          Disminuye el ritmo físico y mental activando tu sistema nervioso parasimpático.
        </p>
      </div>

      {!isActive && !isCompleted ? (
        // STATE 1: SELECTION & GUIDANCE (Does not start automatically!)
        <div className="space-y-4">
          <div className="bg-[#1C1C1E] border border-white/5 rounded-3xl p-5 space-y-3 shadow-sm text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#8FAF9A]/20 text-[#8FAF9A] mx-auto flex items-center justify-center">
              <Wind className="w-6 h-6" />
            </div>
            <h2 className="text-sm font-semibold text-white">Instrucciones antes de comenzar</h2>
            <p className="text-xs text-white/70 leading-relaxed max-w-xs mx-auto">
              Encuentra una postura cómoda con la espalda recta y hombros relajados. Cuando estés listo, toca uno de los botones abajo para iniciar el ciclo guiado.
            </p>
          </div>

          {/* Practice Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 4-4-6 Suave */}
            <div className="bg-[#1C1C1E] border border-white/5 rounded-3xl p-5 flex flex-col justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <strong className="text-sm text-white font-semibold">Respiración 4-4-6</strong>
                  <span className="text-[10px] text-[#8FAF9A] bg-[#8FAF9A]/15 px-2 py-0.5 rounded-full font-medium">Suave</span>
                </div>
                <p className="text-xs text-white/60">
                  Inhala 4s • Sostén 4s • Exhala 6s (3 ciclos). Ideal para iniciar y soltar tensión diaria.
                </p>
              </div>

              <button
                onClick={() => startBreathing('4-4-6')}
                className="w-full h-12 bg-[#8FAF9A] hover:bg-[#80a38c] text-[#121212] font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Respiración 446 suave</span>
              </button>
            </div>

            {/* 4-7-8 Avanzado */}
            <div className="bg-[#1C1C1E] border border-white/5 rounded-3xl p-5 flex flex-col justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <strong className="text-sm text-white font-semibold">Respiración 4-7-8</strong>
                  <span className="text-[10px] text-[#7D98A1] bg-[#7D98A1]/15 px-2 py-0.5 rounded-full font-medium">Avanzado</span>
                </div>
                <p className="text-xs text-white/60">
                  Inhala 4s • Sostén 7s • Exhala 8s (4 ciclos). Sedante natural del sistema nervioso.
                </p>
              </div>

              <button
                onClick={() => startBreathing('4-7-8')}
                className="w-full h-12 bg-[#7D98A1] hover:bg-[#6f8992] text-[#121212] font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Respiración 478 avanzado</span>
              </button>
            </div>
          </div>
        </div>
      ) : isActive ? (
        // STATE 2: ACTIVE GUIDED BREATHING WITH GLOWING WAVE DISPLAY
        <div className="bg-[#1C1C1E] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col items-center gap-6 shadow-sm">
          <BreathingWaveDisplay
            phase={phase}
            phaseDuration={currentPhaseDuration}
            currentSecondInPhase={currentSecondInPhase}
            currentCycle={cycleCount}
            totalCycles={totalCycles}
            modeLabel={`Modo ${selectedMode} (${selectedMode === '4-4-6' ? 'Suave' : 'Avanzado'})`}
          />

          {/* Cancel Button */}
          <button
            onClick={stopBreathing}
            className="px-4 py-2 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 text-xs flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Detener respiración</span>
          </button>
        </div>
      ) : (
        // STATE 3: COMPLETED WITH SERENE CHARACTER ARTWORK
        <div className="bg-[#1C1C1E] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col items-center gap-5 shadow-sm text-center">
          <div className="inline-flex items-center gap-1.5 bg-[#E5A962]/15 text-[#E5A962] text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full border border-[#E5A962]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SESIÓN COMPLETADA</span>
          </div>

          <div className="w-44 h-44 my-1 flex items-center justify-center">
            <IllustrationCompletado className="w-full h-full" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-serif-display font-medium text-white">
              Muy bien hecho
            </h2>
            <p className="text-xs text-white/60 max-w-xs mx-auto">
              Has completado los ciclos de respiración. Tu cuerpo ha iniciado el reflejo de calma.
            </p>
          </div>

          <div className="w-full flex flex-col gap-2.5 pt-2">
            {onCompleteSession && (
              <button
                onClick={onCompleteSession}
                className="w-full h-14 bg-[#8FAF9A] hover:bg-[#80a38c] text-[#121212] font-semibold text-sm rounded-[18px] flex items-center justify-center gap-2 shadow-lg shadow-[#8FAF9A]/20 active:scale-[0.98]"
              >
                <span>Continuar hacia la liberación</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setIsCompleted(false)}
              className="w-full h-12 bg-transparent text-white/70 hover:text-white text-xs font-medium rounded-xl border border-white/10"
            >
              Realizar otra respiración
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
