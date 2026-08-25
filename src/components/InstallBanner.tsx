import React, { useEffect, useState } from 'react';
import { Download, Check, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const InstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // If prompt not available (e.g. iOS or manual browser), give friendly guidance
      alert('Para instalar en tu pantalla de inicio:\n\n• En Android/Chrome: Toca el menú (tres puntos) y elige "Instalar app" o "Añadir a pantalla de inicio".\n• En iPhone/Safari: Toca el botón Compartir y elige "Añadir a la pantalla de inicio".');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  if (isInstalled) return null;

  return (
    <div id="installPwaContainer" className="p-4 bg-white dark:bg-[#1F2E33] border border-[#5E8B7E]/30 rounded-2xl flex flex-col gap-3 shadow-md">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#5E8B7E]/15 flex items-center justify-center text-[#5E8B7E] flex-shrink-0">
          <Smartphone className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-medium text-[#2F3E46] dark:text-white/90">
            Acceso rápido, privado y 100% offline
          </p>
          <p className="text-[11px] text-[#5A6D75] dark:text-white/50">
            Puedes abrir SUELTA en cualquier momento sin conexión.
          </p>
        </div>
      </div>

      <button
        id="installAppBtn"
        onClick={handleInstallClick}
        className="w-full h-12 bg-[#5E8B7E] hover:bg-[#4D7A6D] text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-md active:scale-98"
      >
        <Download className="w-4 h-4" />
        <span>Guarda esta APP en tu pantalla de inicio</span>
      </button>
    </div>
  );
};
