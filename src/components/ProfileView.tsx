import React from 'react';
import { motion } from 'motion/react';
import { Moon, Sun, Lock, BookOpen, HeartPulse, Globe, Check } from 'lucide-react';

interface ProfileViewProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ theme, onToggleTheme }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-5 max-w-lg mx-auto w-full pb-10"
    >
      {/* Title */}
      <div className="space-y-1 pt-1">
        <h1 className="text-2xl font-serif-display font-medium text-[#0e1d25] dark:text-[#fcfbf9] tracking-tight">
          Perfil y Configuración
        </h1>
        <p className="text-xs text-[#59413c] dark:text-[#fcfbf9]/60">
          Ajustes de apariencia, privacidad y evidencia científica
        </p>
      </div>

      {/* Theme Switcher Card */}
      <div className="bg-white dark:bg-[#1c1917] border border-[#0e1d25]/10 dark:border-white/10 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF6B4A]/15 flex items-center justify-center text-[#ae3115]">
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0e1d25] dark:text-[#fcfbf9]">Modo Oscuro</p>
              <p className="text-xs text-[#59413c] dark:text-[#fcfbf9]/50">Ajusta el contraste para descanso visual</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={theme === 'dark'}
              onChange={onToggleTheme}
              className="sr-only peer"
            />
            <div className="w-12 h-7 bg-[#0e1d25]/15 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-br peer-checked:from-[#FF6B4A] peer-checked:to-[#FF7E5F]"></div>
          </label>
        </div>
      </div>

      {/* Language Selector */}
      <div className="bg-white dark:bg-[#1c1917] border border-[#0e1d25]/10 dark:border-white/10 rounded-3xl p-5 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF6B4A]/15 flex items-center justify-center text-[#ae3115]">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0e1d25] dark:text-[#fcfbf9]">Idioma del Sistema</p>
              <p className="text-xs text-[#59413c] dark:text-[#fcfbf9]/50">Idioma principal y de los ejercicios</p>
            </div>
          </div>

          <span className="text-xs text-[#ae3115] font-semibold bg-[#FF6B4A]/15 px-3 py-1 rounded-full flex items-center gap-1">
            <Check className="w-3 h-3" /> Español
          </span>
        </div>
      </div>

      {/* Local Encrypted Privacy */}
      <div className="bg-white dark:bg-[#1c1917] border border-[#0e1d25]/10 dark:border-white/10 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF6B4A]/15 flex items-center justify-center text-[#ae3115]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0e1d25] dark:text-[#fcfbf9]">Privacidad Local Cifrada</p>
              <p className="text-xs text-[#59413c] dark:text-[#fcfbf9]/50">Cifrado en local activo</p>
            </div>
          </div>

          <span className="text-[11px] font-semibold text-[#ae3115] bg-[#FF6B4A]/15 px-2.5 py-1 rounded-full">
            Activo
          </span>
        </div>

        <p className="text-xs text-[#59413c] dark:text-[#fcfbf9]/70 leading-relaxed pt-1 border-t border-[#0e1d25]/10 dark:border-white/5">
          Tus pensamientos se procesan únicamente en la memoria volátil de tu dispositivo y se eliminan inmediatamente tras liberarse. Nunca se envían a servidores ni se almacenan en la nube.
        </p>
      </div>

      {/* Evidencia Científica */}
      <div className="bg-white dark:bg-[#1c1917] border border-[#0e1d25]/10 dark:border-white/10 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2.5 text-[#ae3115]">
          <BookOpen className="w-4 h-4" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#0e1d25] dark:text-[#fcfbf9]">Evidencia Científica</h2>
        </div>

        <div className="space-y-2.5 text-xs text-[#59413c] dark:text-[#fcfbf9]/80">
          <div className="bg-[#f4faff] dark:bg-[#23201d] p-3.5 rounded-2xl border border-[#0e1d25]/10 dark:border-white/5">
            <strong className="text-[#0e1d25] dark:text-[#fcfbf9] block font-semibold mb-0.5">
              1. Método de Escritura Expresiva de Pennebaker
            </strong>
            <p className="text-[#59413c] dark:text-[#fcfbf9]/65 leading-relaxed">
              La externalización escrita de estresores reduce la rumiación cognitiva y fomenta la integración emocional adaptativa.
            </p>
          </div>

          <div className="bg-[#f4faff] dark:bg-[#23201d] p-3.5 rounded-2xl border border-[#0e1d25]/10 dark:border-white/5">
            <strong className="text-[#0e1d25] dark:text-[#fcfbf9] block font-semibold mb-0.5">
              2. Etiquetado Afectivo de Lieberman
            </strong>
            <p className="text-[#59413c] dark:text-[#fcfbf9]/65 leading-relaxed">
              Poner en palabras precisas una emoción disminuye directamente la reactividad en la amígdala cerebral y activa la corteza prefrontal ventrolateral.
            </p>
          </div>
        </div>
      </div>

      {/* Nota de Bienestar */}
      <div className="bg-white dark:bg-[#1c1917] border border-[#0e1d25]/10 dark:border-white/10 rounded-3xl p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-[#FDB833]">
          <HeartPulse className="w-4 h-4" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#0e1d25] dark:text-[#fcfbf9]">Nota de Bienestar</h2>
        </div>
        <p className="text-xs text-[#59413c] dark:text-[#fcfbf9]/70 leading-relaxed">
          Estas prácticas están diseñadas para promover la relajación y el bienestar. No sustituyen la atención médica o psicológica. Si necesitas ayuda o asesoramiento profesional, consulta con un profesional de la salud.
        </p>
      </div>

      {/* App Version & Footer */}
      <div className="pt-3 pb-2 text-center text-xs text-[#59413c]/60 dark:text-[#fcfbf9]/40 space-y-1">
        <p>SUELTA v1.0 • Idioma: Español</p>
        <p className="text-[11px] font-mono text-[#59413c]/40 dark:text-[#fcfbf9]/30">© 2026 SUELTA. Marca Registrada.</p>
      </div>
    </motion.div>
  );
};