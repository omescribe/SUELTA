import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface BreathingWaveDisplayProps {
  phase: 'inhale' | 'hold' | 'exhale';
  phaseDuration: number;
  currentSecondInPhase: number; // 1, 2, 3, 4...
  currentCycle: number;
  totalCycles: number;
  modeLabel?: string;
  theme?: 'dark' | 'light';
}

export const BreathingWaveDisplay: React.FC<BreathingWaveDisplayProps> = ({
  phase,
  phaseDuration,
  currentSecondInPhase,
  currentCycle,
  totalCycles,
  modeLabel,
  theme = 'dark',
}) => {
  // Phase progress normalized (0 to 1)
  const phaseProgress = Math.min(1, Math.max(0, currentSecondInPhase / phaseDuration));

  // Compute position of the golden orb on the wave path
  // The wave goes across the circle width (x from 40 to 200), center at y = 120
  // Inhale: orb moves from left (x=50, y=120) up over crest (x=90, y=85) to center (x=120, y=120)
  // Hold: orb floats calmly near center (x=120) with gentle hovering
  // Exhale: orb glides from center through trough (x=150, y=155) to right (x=190, y=120)
  let orbX = 120;
  let orbY = 120;

  if (phase === 'inhale') {
    // Inhale: 0 -> 1 moves x from 50 to 120, y rises up to 80 then to 120
    const t = phaseProgress;
    orbX = 50 + t * 70;
    orbY = 120 - Math.sin(t * Math.PI) * 38;
  } else if (phase === 'hold') {
    // Hold: gentle stationary pulse at peak
    orbX = 120 + Math.sin(phaseProgress * Math.PI * 2) * 5;
    orbY = 85 + Math.cos(phaseProgress * Math.PI * 2) * 4;
  } else {
    // Exhale: 0 -> 1 moves x from 120 to 190, y dips down to 155 then to 120
    const t = phaseProgress;
    orbX = 120 + t * 70;
    orbY = 120 + Math.sin(t * Math.PI) * 38;
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full py-2 select-none">
      {/* Optional Mode tag */}
      {modeLabel && (
        <span className="text-xs font-semibold text-[#2EC4B6] bg-[#2EC4B6]/15 px-3 py-1 rounded-full">
          {modeLabel}
        </span>
      )}

      {/* Glowing Wave Circle Display Container */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Ambient background glow — Somatic Radiance breathing transitions */}
        <div
          className="absolute inset-4 rounded-full transition-all duration-700 pointer-events-none"
          style={{
            background:
              phase === 'inhale'
                ? 'radial-gradient(circle, rgba(46, 196, 182, 0.30) 0%, rgba(72, 202, 228, 0.18) 50%, rgba(0,0,0,0) 70%)'
                : phase === 'hold'
                ? 'radial-gradient(circle, rgba(253, 184, 51, 0.32) 0%, rgba(255, 126, 95, 0.18) 50%, rgba(0,0,0,0) 70%)'
                : 'radial-gradient(circle, rgba(255, 107, 74, 0.30) 0%, rgba(253, 184, 51, 0.18) 50%, rgba(0,0,0,0) 70%)',
            transform: phase === 'inhale' ? 'scale(1.1)' : phase === 'hold' ? 'scale(1.15)' : 'scale(0.92)',
          }}
        />

        {/* SVG Circle Frame + Wave + Orb */}
        <svg viewBox="0 0 240 240" className="w-full h-full relative z-10 overflow-visible">
          <defs>
            {/* Somatic Ring Gradient: Serene Sky → Solar Amber → Coral Glow */}
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDB833" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#2EC4B6" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#FF7E5F" stopOpacity="0.9" />
            </linearGradient>

            {/* Ambient Wave Gradient — mint to coral */}
            <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2EC4B6" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#FDB833" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#48CAE4" stopOpacity="0.45" />
            </linearGradient>

            {/* Orb Glow Filter */}
            <filter id="orbGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer Ring Ambient Shadow */}
          <circle
            cx="120"
            cy="120"
            r="86"
            fill="none"
            stroke="rgba(253, 184, 51, 0.18)"
            strokeWidth="8"
          />

          {/* Main Glowing Ring */}
          <circle
            cx="120"
            cy="120"
            r="86"
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="2.5"
            className="transition-all duration-500"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(253, 184, 51, 0.45))',
            }}
          />

          {/* Smooth Sine Wave Line Crossing the Ring */}
          <path
            d="M40 120 C 75 75, 100 75, 120 120 C 140 165, 165 165, 200 120"
            fill="none"
            stroke="url(#waveGrad)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Secondary subtle guide line */}
          <path
            d="M48 120 C 80 85, 105 85, 120 120 C 135 155, 160 155, 192 120"
            fill="none"
            stroke="#2EC4B6"
            strokeWidth="0.8"
            strokeDasharray="3 3"
            opacity="0.35"
          />

          {/* Gliding Solar Amber Glowing Orb */}
          <g filter="url(#orbGlow)">
            {/* Outer halo */}
            <circle
              cx={orbX}
              cy={orbY}
              r="14"
              fill="#FDB833"
              opacity="0.28"
              className="transition-all duration-150"
            />
            {/* Middle core */}
            <circle
              cx={orbX}
              cy={orbY}
              r="8"
              fill="#FDB833"
              opacity="0.92"
              className="transition-all duration-150"
            />
            {/* Inner bright highlight */}
            <circle
              cx={orbX}
              cy={orbY}
              r="4"
              fill="#FFF8E7"
              className="transition-all duration-150"
            />
          </g>

          {/* Dynamic Counter in the center-top */}
          <text
            x="120"
            y="55"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="18"
            fontWeight="600"
            fontFamily="monospace"
            opacity="0.9"
          >
            {currentSecondInPhase} / {phaseDuration} s
          </text>
        </svg>

        {/* Floating guidance label over wave */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-12">
          <span className="text-sm font-serif-display font-medium text-white/90 tracking-wide drop-shadow-md">
            {phase === 'inhale' && 'Inhala profundo'}
            {phase === 'hold' && 'Sostén con calma'}
            {phase === 'exhale' && 'Exhala despacio'}
          </span>
          <span className="text-[11px] text-white/50 font-mono mt-0.5">
            segundo {currentSecondInPhase} de {phaseDuration}
          </span>
        </div>
      </div>

      {/* Phase Indicators: Inhala • Mantén • Exhala */}
      <div className="flex items-center justify-center gap-4 text-xs">
        {/* Inhala */}
        <div
          className={`flex items-center gap-1.5 transition-all duration-300 ${
            phase === 'inhale'
              ? 'text-[#2EC4B6] font-semibold scale-105'
              : 'text-[#0e1d25]/50 dark:text-[#fcfbf9]/40'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full transition-all ${
              phase === 'inhale' ? 'bg-[#2EC4B6] shadow-[0_0_8px_#2EC4B6]' : 'bg-[#0e1d25]/20 dark:bg-white/20'
            }`}
          />
          <span>Inhala</span>
        </div>

        <span className="text-[#0e1d25]/20 dark:text-white/20">•</span>

        {/* Mantén */}
        <div
          className={`flex items-center gap-1.5 transition-all duration-300 ${
            phase === 'hold'
              ? 'text-[#2EC4B6] font-semibold scale-105'
              : 'text-[#0e1d25]/50 dark:text-[#fcfbf9]/40'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full transition-all ${
              phase === 'hold' ? 'bg-[#2EC4B6] shadow-[0_0_8px_#2EC4B6]' : 'bg-[#0e1d25]/20 dark:bg-white/20'
            }`}
          />
          <span>Mantén</span>
        </div>

        <span className="text-[#0e1d25]/20 dark:text-white/20">•</span>

        {/* Exhala */}
        <div
          className={`flex items-center gap-1.5 transition-all duration-300 ${
            phase === 'exhale'
              ? 'text-[#2EC4B6] font-semibold scale-105'
              : 'text-[#0e1d25]/50 dark:text-[#fcfbf9]/40'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full transition-all ${
              phase === 'exhale' ? 'bg-[#2EC4B6] shadow-[0_0_8px_#2EC4B6]' : 'bg-[#0e1d25]/20 dark:bg-white/20'
            }`}
          />
          <span>Exhala</span>
        </div>
      </div>

      {/* Badge: Ciclo X de Y */}
      <div className="flex items-center gap-1.5 bg-[#FF6B4A]/10 dark:bg-[#1c1917] border border-[#FF6B4A]/20 dark:border-white/10 px-3.5 py-1.5 rounded-full text-xs text-[#0e1d25]/80 dark:text-[#fcfbf9]/70 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-[#ae3115] dark:text-[#ff7854]" />
        <span>
          Ciclo <strong className="text-[#ae3115] dark:text-[#fcfbf9] font-semibold">{currentCycle}</strong> de {totalCycles}
        </span>
      </div>
    </div>
  );
};