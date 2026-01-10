'use client';

import { useEffect, ReactNode } from 'react';

export default function ServiceWorkerProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registrado correctamente');
        })
        .catch((error) => {
          console.error('❌ Error registrando Service Worker:', error);
        });
    }

    // Escuchar el evento de instalación de PWA
    const handler = (e: any) => {
      console.log('✅ PWA es instalable - Icono de instalación disponible en Chrome');
      (window as any).deferredPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  return <>{children}</>;
}
