export type ViewType = 
  | 'inicio' 
  | 'ejercicios' 
  | 'liberacion' 
  | 'animacion' 
  | 'cierre' 
  | 'descubrir' 
  | 'perfil' 
  | 'respiracion';

export type PracticeType = 'fuego' | 'mar' | 'globo';

export type BreathingMode = '4-4-6' | '4-7-8';

export interface GroundingExercise {
  id: string;
  title: string;
  category: 'cesped' | 'arbol';
  durationMinutes: number;
  subtitle: string;
  steps: {
    title: string;
    substeps?: string[];
  }[];
}

export interface ActiveTimer {
  id: string;
  title: string;
  totalSeconds: number;
  endTimeMs: number;
  remainingSeconds: number;
  isRunning: boolean;
  type: 'grounding' | 'breathing' | 'cierre';
}
