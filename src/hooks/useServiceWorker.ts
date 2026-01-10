import { useEffect } from 'react';

export function useServiceWorker() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registrado:', registration);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }

    // Detectar cuando la app es instalable
    window.addEventListener('beforeinstallprompt', (event) => {
      console.log('✅ App es instalable en Chrome');
      // Puedes guardar el evento para mostrar un botón personalizado
      (window as any).deferredPrompt = event;
    });
  }, []);
}
