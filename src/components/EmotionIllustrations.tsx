import React from 'react';
import abrumadoImg from '../assets/images/1_abrumado.png';
import pensamientosImg from '../assets/images/2_demasiados_pensamientos.png';
import tristeImg from '../assets/images/3_triste.png';
import frustradoImg from '../assets/images/4_frustrado.png';
import preocupadoImg from '../assets/images/5_preocupado.png';
import tensoImg from '../assets/images/6_tenso.png';
import respiroImg from '../assets/images/7_respiro.png';
import miedoImg from '../assets/images/miedo_final.webp';

interface IllustrationProps {
  className?: string;
}

// 1. ABRUMADO
export const IllustrationAbrumado: React.FC<IllustrationProps> = ({ className = 'w-16 h-16' }) => (
  <img
    src={abrumadoImg}
    alt="Abrumado"
    className={`${className} object-contain rounded-lg bg-[#131315]`}
  />
);

// 2. CON DEMASIADOS PENSAMIENTOS
export const IllustrationPensamientos: React.FC<IllustrationProps> = ({ className = 'w-16 h-16' }) => (
  <img
    src={pensamientosImg}
    alt="Con demasiados pensamientos"
    className={`${className} object-contain rounded-lg bg-[#131315]`}
  />
);

// 3. TRISTE
export const IllustrationTriste: React.FC<IllustrationProps> = ({ className = 'w-16 h-16' }) => (
  <img
    src={tristeImg}
    alt="Triste"
    className={`${className} object-contain rounded-lg bg-[#131315]`}
  />
);

// 4. FRUSTRADO
export const IllustrationFrustrado: React.FC<IllustrationProps> = ({ className = 'w-16 h-16' }) => (
  <img
    src={frustradoImg}
    alt="Frustrado"
    className={`${className} object-contain rounded-lg bg-[#131315]`}
  />
);

// 5. PREOCUPADO
export const IllustrationPreocupado: React.FC<IllustrationProps> = ({ className = 'w-16 h-16' }) => (
  <img
    src={preocupadoImg}
    alt="Preocupado"
    className={`${className} object-contain rounded-lg bg-[#131315]`}
  />
);

// 6. TENSO
export const IllustrationTenso: React.FC<IllustrationProps> = ({ className = 'w-16 h-16' }) => (
  <img
    src={tensoImg}
    alt="Tenso"
    className={`${className} object-contain rounded-lg bg-[#131315]`}
  />
);

// 7. SOLO NECESITO UN RESPIRO
export const IllustrationRespiro: React.FC<IllustrationProps> = ({ className = 'w-16 h-16' }) => (
  <img
    src={respiroImg}
    alt="Solo necesito un respiro"
    className={`${className} object-contain rounded-lg bg-[#131315]`}
  />
);

// 8. MIEDO
export const IllustrationMiedo: React.FC<IllustrationProps> = ({ className = 'w-16 h-16' }) => (
  <img
    src={miedoImg}
    alt="Miedo"
    className={`${className} object-contain rounded-lg bg-[#131315]`}
  />
);

// 9. EJERCICIO COMPLETADO
export const IllustrationCompletado: React.FC<IllustrationProps> = ({ className = 'w-48 h-48' }) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="100" cy="100" r="72" fill="#E5A962" opacity="0.25" />
    <g stroke="#E5A962" strokeWidth="1.5" strokeLinecap="round" opacity="0.6">
      <line x1="100" y1="18" x2="100" y2="34" />
      <line x1="142" y1="35" x2="132" y2="47" />
      <line x1="172" y1="70" x2="157" y2="78" />
      <line x1="182" y1="110" x2="167" y2="110" />
      <line x1="58" y1="35" x2="68" y2="47" />
      <line x1="28" y1="70" x2="43" y2="78" />
      <line x1="18" y1="110" x2="33" y2="110" />
    </g>
    <path d="M10 180C40 150 70 160 100 170C130 160 160 150 190 180H10Z" fill="#1C1C1E" opacity="0.9" />
    <path d="M72 100C68 76 82 62 100 62C118 62 132 76 128 100C124 116 120 128 120 128H80C80 128 76 116 72 100Z" fill="#2C2522" />
    <path d="M68 150C68 132 80 122 100 122C120 122 132 132 132 150L138 200H62L68 150Z" fill="#73897A" />
    <rect x="94" y="116" width="12" height="12" rx="4" fill="#D8AD8E" stroke="#1C1816" strokeWidth="1.5" />
    <ellipse cx="100" cy="98" rx="22" ry="24" fill="#D8AD8E" stroke="#1C1816" strokeWidth="1.5" />
    <path d="M74 88C80 72 92 68 100 68C108 68 120 72 126 88C118 80 110 78 100 80C90 78 82 80 74 88Z" fill="#38302B" />
    <path d="M88 98C91 102 96 102 98 98" stroke="#1C1816" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M112 98C109 102 104 102 102 98" stroke="#1C1816" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M94 110C97 113 103 113 106 110" stroke="#1C1816" strokeWidth="2.2" strokeLinecap="round" />
    <ellipse cx="94" cy="138" rx="10" ry="7" fill="#D8AD8E" stroke="#1C1816" strokeWidth="1.3" transform="rotate(-15 94 138)" />
    <ellipse cx="106" cy="138" rx="10" ry="7" fill="#D8AD8E" stroke="#1C1816" strokeWidth="1.3" transform="rotate(15 106 138)" />
  </svg>
);
