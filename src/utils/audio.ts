// Web Audio API and Background Audio utilities for SUELTA PWA

let audioContext: AudioContext | null = null;

/**
 * Initializes and resumes the global AudioContext on first user interaction.
 * Prevents autoplay restrictions on mobile and desktop browsers.
 */
export function initAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioContext = new AudioCtx();
      }
    }
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume().catch(() => {});
    }
  } catch (err) {
    console.warn('AudioContext initialization failed:', err);
  }
  return audioContext;
}

/**
 * Emits a single beep of ~830 Hz with a smooth exponential fade out lasting ~350ms.
 */
export function playSingleBeep(ctx: AudioContext, startOffsetSeconds = 0) {
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const startTime = ctx.currentTime + startOffsetSeconds;
    const duration = 0.35; // 350ms

    osc.frequency.setValueAtTime(830, startTime);

    // Initial moderate volume (0.25) between 0.2 and 0.3
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.setValueAtTime(0.25, startTime);
    // Smooth exponential ramp down
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  } catch (err) {
    console.warn('Error playing beep:', err);
  }
}

/**
 * Plays a sequence of 3 consecutive beeps (~830 Hz) when a timer reaches zero,
 * and triggers device vibration if supported (300ms on, 150ms off, 300ms on).
 */
export function playTimerCompleteBeep() {
  const ctx = initAudioContext();
  if (ctx) {
    // 3 consecutive beeps spaced ~450ms apart
    playSingleBeep(ctx, 0);
    playSingleBeep(ctx, 0.45);
    playSingleBeep(ctx, 0.90);
  }

  // Haptic feedback support
  if (typeof window !== 'undefined' && 'navigator' in window && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate([300, 150, 300]);
    } catch {
      // Ignore vibration errors
    }
  }
}

/**
 * Background relax music controller singleton
 */
class MusicManager {
  private audioElement: HTMLAudioElement | null = null;
  private isPlaying = false;
  private listeners: Set<(playing: boolean) => void> = new Set();

  public getAudioElement(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioElement) {
      let el = document.getElementById('musica') as HTMLAudioElement | null;
      if (!el) {
        el = document.createElement('audio');
        el.id = 'musica';
        el.src = '/relax.mp3';
        el.loop = true;
        el.preload = 'auto';
        document.body.appendChild(el);
      }
      el.volume = 0.3; // Default 30% volume
      this.audioElement = el;
    }
    return this.audioElement;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public toggle(): boolean {
    const el = this.getAudioElement();
    if (!el) return false;

    // Also prime audio context on user action
    initAudioContext();

    if (this.isPlaying) {
      el.pause();
      this.isPlaying = false;
    } else {
      el.volume = 0.3;
      el.play().then(() => {
        this.isPlaying = true;
        this.notify();
      }).catch((err) => {
        console.warn('Audio playback prevented:', err);
        this.isPlaying = false;
        this.notify();
      });
      return true;
    }
    this.notify();
    return this.isPlaying;
  }

  public pause() {
    const el = this.getAudioElement();
    if (el && this.isPlaying) {
      el.pause();
      this.isPlaying = false;
      this.notify();
    }
  }

  public subscribe(listener: (playing: boolean) => void): () => void {
    this.listeners.add(listener);
    listener(this.isPlaying);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.isPlaying));
  }
}

export const musicManager = new MusicManager();
