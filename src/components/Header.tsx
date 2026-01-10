'use client';

import { useGenogramStore } from '@/store/genogram';
import { Settings, Eye } from 'lucide-react';
import PdfExportButton from './PdfExportButton';

export default function Header() {
  const { currentGenogram, viewMode, setViewMode } = useGenogramStore();

  const toggleViewMode = () => {
    setViewMode(viewMode === 'classic' ? 'modern' : 'classic');
  };

  return (
    <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">GenoGraph Pro</h1>
            {currentGenogram && (
              <p className="text-sm text-gray-300">Paciente: {currentGenogram.pacientName}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleViewMode}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-sm font-medium"
            title={`Cambiar a vista ${viewMode === 'classic' ? 'moderna' : 'clásica'}`}
          >
            {viewMode === 'classic' ? (
              <>
                <Eye size={18} />
                Vista Clásica
              </>
            ) : (
              <>
                <Eye size={18} />
                Vista Moderna
              </>
            )}
          </button>

          <PdfExportButton variant="button" />

          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-sm font-medium">
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
