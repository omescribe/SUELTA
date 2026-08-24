// Utility for background-resilient timers in SUELTA PWA
import { ActiveTimer } from '../types';

const TIMER_STORAGE_KEY = 'suelta_active_timer';

export function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return Promise.resolve('unsupported');
  }
  if (Notification.permission === 'granted') {
    return Promise.resolve('granted');
  }
  return Notification.requestPermission();
}

export function sendTimerNotification(title: string, body: string) {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
      });
    } catch {
      // Fallback in some service worker contexts
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(title, {
            body,
            icon: '/icon-192.png',
            badge: '/icon-192.png',
          });
        });
      }
    }
  }
}

export function saveTimerToStorage(timer: ActiveTimer | null) {
  if (typeof window === 'undefined') return;
  if (!timer) {
    localStorage.removeItem(TIMER_STORAGE_KEY);
  } else {
    localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(timer));
  }
}

export function getTimerFromStorage(): ActiveTimer | null {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem(TIMER_STORAGE_KEY);
  if (!saved) return null;
  try {
    const timer: ActiveTimer = JSON.parse(saved);
    const now = Date.now();
    const remaining = Math.max(0, Math.ceil((timer.endTimeMs - now) / 1000));
    return {
      ...timer,
      remainingSeconds: remaining,
      isRunning: remaining > 0,
    };
  } catch {
    return null;
  }
}
