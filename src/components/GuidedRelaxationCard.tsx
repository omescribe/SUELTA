import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';

/* ---------- Frases de la secuencia (duración total ≈ 55 s) ---------- */
const SECUENCIA = [
  { t: 0, txt: 'Haz una pausa', sub: 'nada más por un momento' },
  { t: 6, txt: 'Suelta la tensión', sub: 'de tus hombros, de tu mandíbula' },
  { t: 12, txt: 'No tienes que sostenerlo todo ahora', sub: '' },
  { t: 19, txt: 'Respira', sub: 'sigue el círculo' },
  { t: 44, txt: 'Estás en calma', sub: 'esto también pasará' },
];

const DURACION_TOTAL = 55000; // 55 segundos en ms
const FASES_RESPIRACION = [
  ['Inhala', 4000],
  ['Sostén', 4000],
  ['Exhala', 6000],
] as const;

export const GuidedRelaxationCard: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentPhrase, setCurrentPhrase] = useState<{ txt: string; sub: string; key: number }>({
    txt: 'Haz una pausa',
    sub: 'nada más por un momento',
    key: 0,
  });
  const [isPhraseVisible, setIsPhraseVisible] = useState(true);
  const [progressPercent, setProgressPercent] = useState(0);

  // Estados de respiración guiada
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'Inhala' | 'Sostén' | 'Exhala'>('Inhala');
  const [breathingCount, setBreathingCount] = useState(4);
  const [ringScale, setRingScale] = useState(1);

  // Refs de animación
  const startTimeRef = useRef<number>(Date.now());
  const pausedAtRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const currentPhraseTimeRef = useRef<number>(-1);
  const particlesRef = useRef<Array<{ id: number; size: number; left: number; bottom: number; duration: number; delay: number }>>([]);

  // Generar partículas doradas una sola vez al montar
  if (particlesRef.current.length === 0) {
    const arr = [];
    for (let i = 0; i < 26; i++) {
      arr.push({
        id: i,
        size: 3 + Math.random() * 7,
        left: Math.random() * 100,
        bottom: Math.random() * 30,
        duration: 7 + Math.random() * 9,
        delay: -Math.random() * 10,
      });
    }
    particlesRef.current = arr;
  }

  // Bucle principal de animación a prueba de segundo plano con Date.now()
  useEffect(() => {
    if (!isPlaying) return;

    let timeoutId: number | null = null;

    const updateSecuencia = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const currentProgress = Math.min(100, (elapsed / DURACION_TOTAL) * 100);
      setProgressPercent(currentProgress);

      // 1. Lógica de cambio de frase
      let actual = SECUENCIA[0];
      for (const f of SECUENCIA) {
        if (elapsed >= f.t * 1000) actual = f;
      }

      if (currentPhraseTimeRef.current !== actual.t) {
        currentPhraseTimeRef.current = actual.t;
        setIsPhraseVisible(false);
        timeoutId = window.setTimeout(() => {
          setCurrentPhrase({ txt: actual.txt, sub: actual.sub, key: actual.t });
          setIsPhraseVisible(true);
        }, 600);
      }

      // 2. Lógica de respiración guiada (entre 19s y 44s)
      const tRespiro = elapsed - 19000;
      const activo = tRespiro >= 0 && tRespiro <= 25000;
      setIsBreathingActive(activo);

      if (activo) {
        const ciclo = 14000;
        let t = tRespiro % ciclo;
        for (const [nombre, dur] of FASES_RESPIRACION) {
          if (t < dur) {
            setBreathingPhase(nombre);
            setBreathingCount(Math.ceil((dur - t) / 1000));
            const p = t / dur;
            const escala = nombre === 'Inhala' ? 0.8 + 0.35 * p : nombre === 'Sostén' ? 1.15 : 1.15 - 0.35 * p;
            setRingScale(escala);
            break;
          }
          t -= dur;
        }
      }

      // 3. Control de ciclo continuo
      if (elapsed < DURACION_TOTAL) {
        rafIdRef.current = requestAnimationFrame(updateSecuencia);
      } else {
        setIsPhraseVisible(false);
        timeoutId = window.setTimeout(() => {
          startTimeRef.current = Date.now();
          currentPhraseTimeRef.current = -1;
          rafIdRef.current = requestAnimationFrame(updateSecuencia);
        }, 2500);
      }
    };

    rafIdRef.current = requestAnimationFrame(updateSecuencia);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isPlaying]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      // Pausar
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      pausedAtRef.current = Date.now() - startTimeRef.current;
      setIsPlaying(false);
    } else {
      // Reanudar
      startTimeRef.current = Date.now() - pausedAtRef.current;
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    currentPhraseTimeRef.current = -1;
    startTimeRef.current = Date.now();
    pausedAtRef.current = 0;
    setIsPlaying(true);
  };

  return (
    <div className="bg-[#1C1C1E] border border-white/5 rounded-3xl p-5 shadow-sm space-y-4">
      {/* Estilos CSS Scoped para animaciones del canvas */}
      <style>{`
        @keyframes terOndear {
          0%   { transform: translateY(0) rotate(-4deg) scaleX(1); }
          50%  { transform: translateY(-3%) rotate(2deg) scaleX(1.06); }
          100% { transform: translateY(2%) rotate(-1deg) scaleX(0.97); }
        }
        @keyframes terRespirarLuz {
          0%   { opacity: 0.65; transform: scaleY(1); }
          100% { opacity: 1; transform: scaleY(1.12); }
        }
        @keyframes terFlotar {
          0%   { transform: translateY(20px) translateX(0); opacity: 0; }
          12%  { opacity: 0.9; }
          85%  { opacity: 0.5; }
          100% { transform: translateY(-380px) translateX(24px); opacity: 0; }
        }
        @keyframes terAletear {
          0%   { transform: scaleX(1); }
          100% { transform: scaleX(0.45); }
        }
        @keyframes terVolar {
          0%   { transform: translate(0, 0) rotate(8deg); opacity: 0; }
          10%  { opacity: 0.95; }
          50%  { transform: translate(25px, -70px) rotate(-6deg); }
          90%  { opacity: 0.6; }
          100% { transform: translate(-20px, -150px) rotate(5deg); opacity: 0; }
        }
        @keyframes terAura {
          0%, 100% { transform: scale(0.96); opacity: 0.4; }
          50%      { transform: scale(1.08); opacity: 0.9; }
        }
      `}</style>

      {/* Header del Componente */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#E5A962]/20 text-[#E5A962] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white tracking-tight">
              Relajación Guiada
            </h2>
            <p className="text-[11px] text-white/60">
              Secuencia interactiva de calma y reconexión
            </p>
          </div>
        </div>
        <span className="text-[10px] font-semibold text-[#E5A962] bg-[#E5A962]/15 px-2.5 py-0.5 rounded-full border border-[#E5A962]/20">
          Experiencia
        </span>
      </div>

      {/* Escenario de Animación Integro */}
      <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden shadow-inner select-none border border-white/5 bg-gradient-to-b from-[#0a1f14] via-[#0e2a1b] to-[#1d4a32]">
        {/* Luces radiales de fondo */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(120% 60% at 50% 108%, rgba(232,196,120,0.35), transparent 60%),
              radial-gradient(90% 50% at 50% -10%, rgba(120,200,160,0.18), transparent 60%)
            `,
          }}
        />

        {/* 1. Telas translúcidas ondeantes */}
        <div
          className="absolute -left-[30%] w-[160%] h-[60%] top-[12%] blur-[2px] pointer-events-none"
          style={{
            background: 'linear-gradient(100deg, transparent 20%, rgba(240,235,215,.14) 45%, rgba(240,235,215,.05) 60%, transparent 80%)',
            animation: 'terOndear 11s ease-in-out infinite alternate',
            transformOrigin: 'center',
          }}
        />
        <div
          className="absolute -left-[30%] w-[160%] h-[60%] top-[34%] opacity-60 blur-[2px] pointer-events-none"
          style={{
            background: 'linear-gradient(100deg, transparent 20%, rgba(240,235,215,.14) 45%, rgba(240,235,215,.05) 60%, transparent 80%)',
            animation: 'terOndear 13s ease-in-out infinite alternate -4s',
            transformOrigin: 'center',
          }}
        />
        <div
          className="absolute -left-[30%] w-[160%] h-[60%] top-[58%] opacity-40 blur-[2px] pointer-events-none"
          style={{
            background: 'linear-gradient(100deg, transparent 20%, rgba(240,235,215,.14) 45%, rgba(240,235,215,.05) 60%, transparent 80%)',
            animation: 'terOndear 15s ease-in-out infinite alternate -8s',
            transformOrigin: 'center',
          }}
        />

        {/* 2. Velo de agua / luz inferior */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[26%] pointer-events-none"
          style={{
            background: 'radial-gradient(80% 100% at 50% 120%, rgba(232,196,120,.45), rgba(232,196,120,.08) 55%, transparent 75%)',
            animation: 'terRespirarLuz 7s ease-in-out infinite alternate',
          }}
        />

        {/* 3. Partículas doradas */}
        {particlesRef.current.map((m) => (
          <div
            key={m.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${m.size}px`,
              height: `${m.size}px`,
              left: `${m.left}%`,
              bottom: `${m.bottom}%`,
              background: 'radial-gradient(circle, rgba(255,232,170,.95), rgba(255,232,170,0) 70%)',
              animation: `terFlotar ${m.duration}s linear infinite ${m.delay}s`,
            }}
          />
        ))}

        {/* 4. Mariposas luminosas SVG */}
        {[
          { x: 70, y: 18, delay: 0 },
          { x: 78, y: 40, delay: -6 },
          { x: 18, y: 30, delay: -3 },
        ].map((mar, i) => (
          <div
            key={i}
            className="absolute w-11 h-11 pointer-events-none drop-shadow-[0_0_8px_rgba(255,225,150,0.9)]"
            style={{
              left: `${mar.x}%`,
              bottom: `${mar.y}%`,
              animation: `terVolar 14s ease-in-out infinite ${mar.delay}s`,
            }}
          >
            <svg
              viewBox="0 0 40 40"
              fill="rgba(255,232,170,.9)"
              style={{
                width: '100%',
                height: '100%',
                animation: 'terAletear 0.5s ease-in-out infinite alternate',
                transformOrigin: 'center',
              }}
            >
              <ellipse cx="12" cy="14" rx="9" ry="11" />
              <ellipse cx="28" cy="14" rx="9" ry="11" />
              <ellipse cx="14" cy="27" rx="6" ry="7" opacity="0.7" />
              <ellipse cx="26" cy="27" rx="6" ry="7" opacity="0.7" />
              <rect x="19" y="8" width="2.4" height="24" rx="1.2" fill="rgba(120,80,30,.9)" />
            </svg>
          </div>
        ))}

        {/* 5. Frases animadas */}
        <div
          className={`absolute left-6 right-6 top-[38%] sm:top-[40%] text-center font-serif transition-all duration-700 pointer-events-none ${
            isPhraseVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
          style={{
            textShadow: '0 0 18px rgba(232,196,120,.35), 0 2px 6px rgba(0,0,0,.55)',
            color: '#f2ead8',
          }}
        >
          <p className="text-xl sm:text-2xl font-medium leading-relaxed tracking-wide">
            {currentPhrase.txt}
          </p>
          {currentPhrase.sub && (
            <span className="block mt-2 text-xs sm:text-sm italic opacity-85 font-sans tracking-normal">
              {currentPhrase.sub}
            </span>
          )}
        </div>

        {/* 6. Indicador de respiración guiada (Activo 19s a 44s) */}
        <div
          className={`absolute left-1/2 bottom-[14%] -translate-x-1/2 w-28 h-28 rounded-full border border-[rgba(255,232,170,.55)] flex flex-col items-center justify-center text-[10px] tracking-widest uppercase transition-all duration-500 shadow-[0_0_30px_rgba(232,196,120,.25),inset_0_0_26px_rgba(232,196,120,.12)] text-[#f2ead8] pointer-events-none ${
            isBreathingActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{
            transform: `translateX(-50%) scale(${isBreathingActive ? ringScale : 0.8})`,
          }}
        >
          <span
            className="absolute -inset-3.5 rounded-full border border-[rgba(255,232,170,.25)]"
            style={{ animation: 'terAura 6s ease-in-out infinite' }}
          />
          <span className="font-semibold tracking-wider">{breathingPhase}</span>
          <span className="text-lg font-mono font-bold">{breathingCount}</span>
        </div>

        {/* 7. Controles de Reproducción sobre la escena */}
        <div className="absolute top-3.5 right-3.5 flex items-center gap-2 z-10">
          <button
            type="button"
            onClick={handleTogglePlay}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#f2ead8]/15 hover:bg-[#f2ead8]/25 text-[#f2ead8] border border-[#f2ead8]/30 backdrop-blur-md transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            title={isPlaying ? 'Pausar relajación' : 'Continuar relajación'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Continuar</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleRestart}
            className="p-1.5 rounded-full bg-[#f2ead8]/15 hover:bg-[#f2ead8]/25 text-[#f2ead8] border border-[#f2ead8]/30 backdrop-blur-md transition-all flex items-center justify-center shadow-sm active:scale-95"
            title="Reiniciar secuencia"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 8. Barra de progreso inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-10">
          <div
            className="h-full bg-gradient-to-r from-[rgba(232,196,120,.4)] to-[#e8c478] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
