'use client';

import { useEffect, useState } from 'react';
import { useGenogramStore } from '@/store/genogram';
import Header from '@/components/Header';
import ToolSidebar from '@/components/ToolSidebar';
import Canvas from '@/components/Canvas';
import DetailsPanel from '@/components/DetailsPanel';
import PersonDraggable from '@/components/PersonDraggable';

export default function Home() {
  const { currentGenogram, createNewGenogram } = useGenogramStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // DEBUG LOGS
  console.log('[GenoGraph] Home component mounted');
  console.log('[GenoGraph] currentGenogram:', currentGenogram);
  console.log('[GenoGraph] isInitialized:', isInitialized);

  useEffect(() => {
    console.log('[GenoGraph] useEffect running...');
    // Inicializar genograma de prueba
    if (!currentGenogram && !isInitialized) {
      console.log('[GenoGraph] Creating new genogram...');
      createNewGenogram('demo-user', 'Paciente de Prueba');
      setIsInitialized(true);
    }
  }, [currentGenogram, isInitialized, createNewGenogram]);

  if (!currentGenogram) {
    console.log('[GenoGraph] Showing loading state...');
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">GenoGraph Pro</h1>
          <p className="text-gray-600">Inicializando aplicación...</p>
          <p className="text-xs text-gray-400 mt-2">Check console for debug logs</p>
        </div>
      </div>
    );
  }

  console.log('[GenoGraph] Rendering main UI...');
  return (
    <div className="flex flex-col h-screen w-full bg-gray-50">
      <Header />
      <div className="flex flex-1 overflow-hidden gap-4 p-4">
        <ToolSidebar />
        <div className="flex-1 flex gap-4">
          <Canvas />
          <DetailsPanel />
        </div>
      </div>

      {/* Hidden draggable references para drag & drop */}
      <div className="hidden">
        <PersonDraggable type="male" />
        <PersonDraggable type="female" />
        <PersonDraggable type="unknown" />
        <PersonDraggable type="pet" />
      </div>
    </div>
  );
}
