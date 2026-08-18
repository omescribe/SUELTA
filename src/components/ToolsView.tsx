import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sprout, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  Footprints, 
  Droplets,
  Layers
} from 'lucide-react';
import { ActiveTimer } from '../types';
import { saveTimerToStorage, getTimerFromStorage, sendTimerNotification, requestNotificationPermission } from '../utils/timer';

export const ToolsView: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>('cesped');
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);

  // Dedicated display timer states for Césped and Árbol
  const [cespedSelectedMinutes, setCespedSelectedMinutes] = useState<number>(10);
  const [arbolSelectedMinutes, setArbolSelectedMinutes] = useState<number>(5);

  // Load and sync background timer
  useEffect(() => {
    const saved = getTimerFromStorage();
    if (saved && saved.type === 'grounding' && saved.remainingSeconds > 0) {
      setActiveTimer(saved);
    }

    const interval = setInterval(() => {
      if (activeTimer && activeTimer.isRunning) {
        const remaining = Math.max(0, Math.ceil((activeTimer.endTimeMs - Date.now()) / 1000));
        if (remaining <= 0) {
          sendTimerNotification('SUELTA - Grounding Completado', `Tu sesión de ${activeTimer.title} ha finalizado. Tómate un momento para volver a tu ritmo.`);
          saveTimerToStorage(null);
          setActiveTimer({
            ...activeTimer,
            remainingSeconds: 0,
            isRunning: false,
          });
        } else {
          setActiveTimer((prev) => (prev ? { ...prev, remainingSeconds: remaining } : null));
        }
      }
    }, 1000);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        const current = getTimerFromStorage();
        if (current && current.type === 'grounding') {
          setActiveTimer(current);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [activeTimer]);

  const startTimer = (title: string, minutes: number, category?: string) => {
    requestNotificationPermission();
    const totalSeconds = minutes * 60;
    const endTimeMs = Date.now() + totalSeconds * 1000;
    const newTimer: ActiveTimer = {
      id: `grounding_${category || 'nature'}_${Date.now()}`,
      title,
      totalSeconds,
      endTimeMs,
      remainingSeconds: totalSeconds,
      isRunning: true,
      type: 'grounding',
    };
    setActiveTimer(newTimer);
    saveTimerToStorage(newTimer);
  };

  const stopTimer = () => {
    saveTimerToStorage(null);
    setActiveTimer(null);
  };

  const toggleTimerPause = () => {
    if (!activeTimer) return;
    if (activeTimer.isRunning) {
      // Pause
      const timer: ActiveTimer = {
        ...activeTimer,
        isRunning: false,
      };
      setActiveTimer(timer);
      saveTimerToStorage(timer);
    } else {
      // Resume
      const endTimeMs = Date.now() + activeTimer.remainingSeconds * 1000;
      const timer: ActiveTimer = {
        ...activeTimer,
        endTimeMs,
        isRunning: true,
      };
      setActiveTimer(timer);
      saveTimerToStorage(timer);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Determine timer display for Cesped
  const isCespedTimerActive = activeTimer && activeTimer.id.includes('cesped') && activeTimer.isRunning;
  const cespedDisplayTime = isCespedTimerActive
    ? formatTimer(activeTimer.remainingSeconds)
    : `${cespedSelectedMinutes.toString().padStart(2, '0')}:00`;

  // Determine timer display for Arbol
  const isArbolTimerActive = activeTimer && activeTimer.id.includes('arbol') && activeTimer.isRunning;
  const arbolDisplayTime = isArbolTimerActive
    ? formatTimer(activeTimer.remainingSeconds)
    : `${arbolSelectedMinutes.toString().padStart(2, '0')}:00`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6 max-w-lg mx-auto w-full pb-10"
    >
      {/* Header */}
      <div className="space-y-1 pt-1">
        <h1 className="text-2xl font-serif-display font-medium text-white tracking-tight">
          Más herramientas para tu calma
        </h1>
        <p className="text-xs text-white/60 leading-relaxed">
          Herramientas sencillas para recuperar la calma en cualquier momento.
        </p>
      </div>

      {/* Floating Active Timer Banner */}
      <AnimatePresence>
        {activeTimer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-[#8FAF9A]/15 border border-[#8FAF9A] rounded-2xl flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#8FAF9A] text-[#121212] flex items-center justify-center font-bold">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">{activeTimer.title}</p>
                <p className="text-lg font-mono font-bold text-[#8FAF9A]">
                  {formatTimer(activeTimer.remainingSeconds)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTimerPause}
                className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20"
                title={activeTimer.isRunning ? 'Pausar' : 'Reanudar'}
              >
                {activeTimer.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={stopTimer}
                className="p-2 rounded-xl bg-white/10 text-white/70 hover:text-white hover:bg-white/20"
                title="Detener temporizador"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section 1: Grounding - Césped (Matching Image 3) */}
      <div className="bg-[#1C1C1E] border border-white/5 rounded-3xl overflow-hidden shadow-sm">
        <button
          onClick={() => setExpandedSection(expandedSection === 'cesped' ? null : 'cesped')}
          className="w-full p-5 flex items-center justify-between text-left transition-colors hover:bg-white/5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#8FAF9A]/20 text-[#8FAF9A] flex items-center justify-center flex-shrink-0">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Conecta con la naturaleza (Césped)</h2>
              <p className="text-xs text-white/60">Pausa para volver al cuerpo descalzo sobre el césped</p>
            </div>
          </div>
          <div className="text-white/40">
            {expandedSection === 'cesped' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {expandedSection === 'cesped' && (
          <div className="px-5 pb-5 pt-2 border-t border-white/5 space-y-4 text-xs text-white/80">
            {/* Objective banner matching Image 3 */}
            <p className="text-white/90 font-medium italic bg-white/5 p-3 rounded-2xl leading-relaxed">
              <strong>Objetivo:</strong> Dirigir la atención hacia los sentidos para disminuir la rumiación mental y favorecer una mayor estabilidad corporal.
            </p>

            {/* Dedicated Césped Timer Card (Matching Image 3 visual style) */}
            <div className="bg-[#252528] p-5 rounded-2xl border border-[#8FAF9A]/30 flex flex-col items-center gap-4 text-center">
              <span className="text-[11px] font-semibold tracking-wider text-[#8FAF9A] uppercase">
                TEMPORIZADOR DE PRÁCTICA (CÉSPED)
              </span>

              <div className="text-4xl sm:text-5xl font-mono font-bold text-[#8FAF9A] tracking-wider py-1 drop-shadow-[0_0_12px_rgba(143,175,154,0.3)]">
                {cespedDisplayTime}
              </div>

              <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
                <button
                  onClick={() => {
                    setCespedSelectedMinutes(10);
                    startTimer('Conexión con Césped (10 min)', 10, 'cesped');
                  }}
                  className={`py-2.5 px-2 rounded-full text-xs font-semibold transition-all ${
                    isCespedTimerActive && cespedSelectedMinutes === 10
                      ? 'bg-[#8FAF9A] text-[#121212] shadow-md shadow-[#8FAF9A]/30'
                      : 'bg-[#8FAF9A] hover:bg-[#80a38c] text-[#121212]'
                  }`}
                >
                  Iniciar 10 min
                </button>

                <button
                  onClick={() => {
                    setCespedSelectedMinutes(20);
                    startTimer('Conexión con Césped (20 min)', 20, 'cesped');
                  }}
                  className={`py-2.5 px-2 rounded-full text-xs font-medium transition-all ${
                    isCespedTimerActive && cespedSelectedMinutes === 20
                      ? 'bg-[#8FAF9A] text-[#121212]'
                      : 'bg-[#1C1C1E] border border-white/10 text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  20 min
                </button>

                <button
                  onClick={stopTimer}
                  className="py-2.5 px-2 rounded-full text-xs font-medium bg-[#1C1C1E] border border-white/10 text-white/80 hover:text-white hover:bg-white/10 transition-all"
                >
                  Detener
                </button>
              </div>
            </div>

            {/* 1. Camina descalzo */}
            <div className="bg-[#252528] p-4 rounded-2xl border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-white text-xs font-semibold">1. Camina descalzo (10 a 20 minutos)</strong>
                <button
                  onClick={() => {
                    setCespedSelectedMinutes(15);
                    startTimer('Camina Descalzo en Césped', 15, 'cesped');
                  }}
                  className="px-2.5 py-1 bg-[#8FAF9A]/20 text-[#8FAF9A] font-semibold text-[11px] rounded-lg flex items-center gap-1 hover:bg-[#8FAF9A]/30 border border-[#8FAF9A]/30"
                >
                  <Play className="w-3 h-3" /> 15 min
                </button>
              </div>
              <ul className="space-y-1 text-white/70 pl-2">
                <li>• Busca un césped limpio, seguro y libre de desechos.</li>
                <li>• Quítate los zapatos y las medias, y comienza a caminar lentamente.</li>
                <li>• Siente la textura del césped bajo tus pies, la temperatura y el movimiento de cada paso.</li>
                <li>• Cuando tu mente se distraiga, vuelve suavemente a la sensación de tus pies. Recuerda: no necesitas dejar de pensar, solo volver al presente.</li>
              </ul>
            </div>

            {/* 2. Quédate de pie */}
            <div className="bg-[#252528] p-4 rounded-2xl border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-white text-xs font-semibold">2. Quédate de pie (5 a 15 minutos)</strong>
                <button
                  onClick={() => {
                    setCespedSelectedMinutes(10);
                    startTimer('De Pie en Césped', 10, 'cesped');
                  }}
                  className="px-2.5 py-1 bg-[#8FAF9A]/20 text-[#8FAF9A] font-semibold text-[11px] rounded-lg flex items-center gap-1 hover:bg-[#8FAF9A]/30 border border-[#8FAF9A]/30"
                >
                  <Play className="w-3 h-3" /> 10 min
                </button>
              </div>
              <ul className="space-y-1 text-white/70 pl-2">
                <li>• Quítate los zapatos y las medias, y permanece de pie sobre el césped.</li>
                <li>• Separa ligeramente los pies, relaja las rodillas y deja caer los brazos.</li>
                <li>• Siente el peso de tu cuerpo y el contacto de tus pies con el suelo.</li>
                <li>• Observa tu respiración y los sonidos que te rodean, sin intentar cambiar nada. Solo quédate aquí.</li>
              </ul>
            </div>

            {/* 3. Siéntate en el césped */}
            <div className="bg-[#252528] p-4 rounded-2xl border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-white text-xs font-semibold">3. Siéntate en el césped (10 a 20 minutos)</strong>
                <button
                  onClick={() => {
                    setCespedSelectedMinutes(15);
                    startTimer('Sentarse en Césped', 15, 'cesped');
                  }}
                  className="px-2.5 py-1 bg-[#8FAF9A]/20 text-[#8FAF9A] font-semibold text-[11px] rounded-lg flex items-center gap-1 hover:bg-[#8FAF9A]/30 border border-[#8FAF9A]/30"
                >
                  <Play className="w-3 h-3" /> 15 min
                </button>
              </div>
              <ul className="space-y-1 text-white/70 pl-2">
                <li>• Siéntate sobre el césped limpio y seco. Puedes hacerlo directamente o utilizar una manta.</li>
                <li>• Apoya las manos sobre tus piernas o sobre el césped. Siente los puntos de contacto de tu cuerpo con el suelo.</li>
                <li>• Observa los sonidos, el aire, la temperatura y todo lo que te rodea. Deja que tu atención descanse en el momento presente.</li>
              </ul>
            </div>

            {/* 4. Descansa sobre el césped */}
            <div className="bg-[#252528] p-4 rounded-2xl border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-white text-xs font-semibold">4. Descansa sobre el césped (10 a 20 minutos)</strong>
                <button
                  onClick={() => {
                    setCespedSelectedMinutes(20);
                    startTimer('Descansar en Césped', 20, 'cesped');
                  }}
                  className="px-2.5 py-1 bg-[#8FAF9A]/20 text-[#8FAF9A] font-semibold text-[11px] rounded-lg flex items-center gap-1 hover:bg-[#8FAF9A]/30 border border-[#8FAF9A]/30"
                >
                  <Play className="w-3 h-3" /> 20 min
                </button>
              </div>
              <ul className="space-y-1 text-white/70 pl-2">
                <li>• Acuéstate cómodamente sobre el césped si lo prefieres, utilizando una manta. Siente cómo el suelo sostiene tu cuerpo.</li>
                <li>• Observa el cielo, las hojas o simplemente cierra los ojos.</li>
                <li>• Escucha los sonidos que te rodean y permite que tu cuerpo descanse. No tienes que hacer nada, solo estar.</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Grounding - Árbol (Matching Image 2) */}
      <div className="bg-[#1C1C1E] border border-white/5 rounded-3xl overflow-hidden shadow-sm">
        <button
          onClick={() => setExpandedSection(expandedSection === 'arbol' ? null : 'arbol')}
          className="w-full p-5 flex items-center justify-between text-left transition-colors hover:bg-white/5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E5A962]/20 text-[#E5A962] flex items-center justify-center flex-shrink-0">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Conecta con la naturaleza (Árbol)</h2>
              <p className="text-xs text-white/60">Enraizamiento profundo apoyando manos o abrazando</p>
            </div>
          </div>
          <div className="text-white/40">
            {expandedSection === 'arbol' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {expandedSection === 'arbol' && (
          <div className="px-5 pb-5 pt-2 border-t border-white/5 space-y-4 text-xs text-white/80">
            {/* Objective banner matching Image 2 */}
            <p className="text-white/90 font-medium italic bg-white/5 p-3 rounded-2xl leading-relaxed">
              <strong>Objetivo:</strong> Utilizar el contacto táctil y la solidez de la corteza para reducir la hiperactividad emocional.
            </p>

            {/* Dedicated Árbol Timer Card (Matching Image 2 visual style) */}
            <div className="bg-[#252528] p-5 rounded-2xl border border-[#8FAF9A]/30 flex flex-col items-center gap-4 text-center">
              <span className="text-[11px] font-semibold tracking-wider text-[#8FAF9A] uppercase">
                TEMPORIZADOR DE PRÁCTICA (ÁRBOL)
              </span>

              <div className="text-4xl sm:text-5xl font-mono font-bold text-[#8FAF9A] tracking-wider py-1 drop-shadow-[0_0_12px_rgba(143,175,154,0.3)]">
                {arbolDisplayTime}
              </div>

              <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
                <button
                  onClick={() => {
                    setArbolSelectedMinutes(5);
                    startTimer('Conexión con Árbol (5 min)', 5, 'arbol');
                  }}
                  className={`py-2.5 px-2 rounded-full text-xs font-semibold transition-all ${
                    isArbolTimerActive && arbolSelectedMinutes === 5
                      ? 'bg-[#8FAF9A] text-[#121212] shadow-md shadow-[#8FAF9A]/30'
                      : 'bg-[#8FAF9A] hover:bg-[#80a38c] text-[#121212]'
                  }`}
                >
                  Iniciar 5 min
                </button>

                <button
                  onClick={() => {
                    setArbolSelectedMinutes(3);
                    startTimer('Conexión con Árbol (3 min)', 3, 'arbol');
                  }}
                  className={`py-2.5 px-2 rounded-full text-xs font-medium transition-all ${
                    isArbolTimerActive && arbolSelectedMinutes === 3
                      ? 'bg-[#8FAF9A] text-[#121212]'
                      : 'bg-[#1C1C1E] border border-white/10 text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  3 min
                </button>

                <button
                  onClick={stopTimer}
                  className="py-2.5 px-2 rounded-full text-xs font-medium bg-[#1C1C1E] border border-white/10 text-white/80 hover:text-white hover:bg-white/10 transition-all"
                >
                  Detener
                </button>
              </div>
            </div>

            {/* 1. Siente hojas y ramas */}
            <div className="bg-[#252528] p-4 rounded-2xl border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-white text-xs font-semibold">1. Siente las hojas y las ramas (3 a 5 minutos)</strong>
                <button
                  onClick={() => {
                    setArbolSelectedMinutes(3);
                    startTimer('Sentir Hojas y Ramas', 3, 'arbol');
                  }}
                  className="px-2.5 py-1 bg-[#8FAF9A]/20 text-[#8FAF9A] font-semibold text-[11px] rounded-lg flex items-center gap-1 hover:bg-[#8FAF9A]/30 border border-[#8FAF9A]/30"
                >
                  <Play className="w-3 h-3" /> 3 min
                </button>
              </div>
              <ul className="space-y-1 text-white/70 pl-2">
                <li>• Acércate a un árbol y toca suavemente sus hojas o ramas.</li>
                <li>• Presta atención a su textura, temperatura, forma y pequeños detalles.</li>
                <li>• Explora lentamente con tus dedos y vuelve a la sensación cada vez que tu mente se aleje. Siente, observa, permanece.</li>
              </ul>
            </div>

            {/* 2. Apoya tus manos */}
            <div className="bg-[#252528] p-4 rounded-2xl border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-white text-xs font-semibold">2. Apoya tus manos en un árbol (2 a 5 minutos)</strong>
                <button
                  onClick={() => {
                    setArbolSelectedMinutes(3);
                    startTimer('Manos en el Tronco', 3, 'arbol');
                  }}
                  className="px-2.5 py-1 bg-[#8FAF9A]/20 text-[#8FAF9A] font-semibold text-[11px] rounded-lg flex items-center gap-1 hover:bg-[#8FAF9A]/30 border border-[#8FAF9A]/30"
                >
                  <Play className="w-3 h-3" /> 3 min
                </button>
              </div>
              <p className="text-white/70 leading-relaxed">
                Elige un árbol que te resulte agradable y coloca suavemente ambas manos sobre su tronco. Relaja los hombros y siente la textura y temperatura de la corteza. Permanece unos minutos observando tu respiración y las sensaciones de tus manos.
              </p>
            </div>

            {/* 3. Abraza un árbol */}
            <div className="bg-[#252528] p-4 rounded-2xl border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-white text-xs font-semibold">3. Abraza un árbol (1 a 3 minutos)</strong>
                <button
                  onClick={() => {
                    setArbolSelectedMinutes(2);
                    startTimer('Abrazar un Árbol', 2, 'arbol');
                  }}
                  className="px-2.5 py-1 bg-[#8FAF9A]/20 text-[#8FAF9A] font-semibold text-[11px] rounded-lg flex items-center gap-1 hover:bg-[#8FAF9A]/30 border border-[#8FAF9A]/30"
                >
                  <Play className="w-3 h-3" /> 2 min
                </button>
              </div>
              <p className="text-white/70 leading-relaxed">
                Elige un árbol que sea cómodo y seguro para abrazar. Rodea suavemente el tronco con tus brazos sin apretar. Puedes apoyar las manos o el pecho si te resulta agradable. Respira con naturalidad y presta atención a la sensación del contacto. Quédate unos instantes simplemente presente.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Section 3: Escaneo Corporal */}
      <div className="bg-[#1C1C1E] border border-white/5 rounded-3xl p-5 space-y-2.5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#D8C8B8]/20 text-[#D8C8B8] flex items-center justify-center flex-shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Escaneo Corporal</h2>
            <p className="text-xs text-white/60">Reconocer dónde se acumula la tensión física (2 a 4 min)</p>
          </div>
        </div>
        <p className="text-xs text-white/70 leading-relaxed pt-1">
          Cierra los ojos si te resulta cómodo. Lleva lentamente tu atención hacia: cabeza, mandíbula, cuello, hombros, pecho, abdomen, espalda, piernas y pies. No intentes relajar nada, solo observa con respiración natural.
        </p>
      </div>

      {/* Section 4: Paño Frío (Reflejo Vagal) */}
      <div className="bg-[#1C1C1E] border border-white/5 rounded-3xl p-5 space-y-2.5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#7D98A1]/20 text-[#7D98A1] flex items-center justify-center flex-shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Paño Frío (Activación Vagal)</h2>
            <p className="text-xs text-white/60">Estrategia física inmediata para momentos de sobrecarga</p>
          </div>
        </div>
        <p className="text-xs text-white/70 leading-relaxed pt-1">
          Humedece un paño con agua fresca. Apóyalo suavemente sobre tus sienes o rostro durante 30 a 60 segundos respirando lento. Activa los reflejos del nervio vago reduciendo la frecuencia cardíaca.
        </p>
      </div>

      {/* Section 5: Frases Calmantes */}
      <div className="bg-[#1C1C1E] border border-white/5 rounded-3xl p-5 space-y-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E5A962]/20 text-[#E5A962] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Frases Calmantes</h2>
            <p className="text-xs text-white/60">Anclas de diálogo interno compasivo</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 pt-1">
          {[
            'Puedo dar un paso a la vez.',
            'No necesito resolver todo ahora.',
            'Esto también cambiará.',
            'Puedo permitirme hacer una pausa.',
            'Estoy haciendo lo mejor que puedo con lo que tengo hoy.',
          ].map((phrase, idx) => (
            <div key={idx} className="p-3 bg-[#252528] rounded-xl text-xs text-white/80 border border-white/5 font-serif-display italic">
              &ldquo;{phrase}&rdquo;
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
