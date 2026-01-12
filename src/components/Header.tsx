'use client';

import { useGenogramStore } from '@/store/genogram';
import { Settings, Eye, RotateCcw, RotateCw } from 'lucide-react';
import PdfExportButton from './PdfExportButton';

export default function Header() {
  const { currentGenogram, viewMode, setViewMode, undo, redo, canUndo, canRedo } = useGenogramStore();

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
          {/* Undo/Redo Buttons */}
          <div className="flex gap-2 border-l border-r border-gray-700 px-4">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              title="Deshacer (Ctrl+Z)"
            >
              <RotateCcw size={16} />
              <span className="hidden sm:inline">Undo</span>
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              title="Rehacer (Ctrl+Y)"
            >
              <RotateCw size={16} />
              <span className="hidden sm:inline">Redo</span>
            </button>
          </div>

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
