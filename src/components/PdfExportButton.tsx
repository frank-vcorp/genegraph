'use client';

import { useCallback, useRef, useState } from 'react';
import { useGenogramStore } from '@/store/genogram';
import { PdfExporter } from './PdfExporter';
import { FileDown, Loader } from 'lucide-react';

interface PdfExportButtonProps {
  variant?: 'icon' | 'button';
  className?: string;
}

export default function PdfExportButton({
  variant = 'button',
  className = '',
}: PdfExportButtonProps) {
  const { currentGenogram, viewMode } = useGenogramStore();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = useCallback(
    async (template: 'classic' | 'modern') => {
      if (!currentGenogram || isExporting) return;

      try {
        setIsExporting(true);

        // Buscar elemento canvas (ReactFlow container)
        const canvasElement = document.querySelector(
          '.react-flow'
        ) as HTMLElement;

        if (!canvasElement) {
          alert('No se pudo encontrar el canvas del genograma');
          return;
        }

        // Generar nombre de archivo con marca de tiempo
        const timestamp = new Date().toISOString().split('T')[0];
        const fileName = `genograma_${currentGenogram.pacientName?.replace(/\s+/g, '_') || 'sin_nombre'}_${timestamp}_${template}`;

        // Exportar según template seleccionado
        if (template === 'classic') {
          await PdfExporter.exportClassic(canvasElement, currentGenogram, fileName);
        } else {
          await PdfExporter.exportModern(canvasElement, currentGenogram, fileName);
        }

        alert('Genograma exportado exitosamente');
      } catch (error) {
        console.error('Error durante exportación:', error);
        alert('Error al exportar el genograma');
      } finally {
        setIsExporting(false);
      }
    },
    [currentGenogram, isExporting]
  );

  if (!currentGenogram || currentGenogram.persons.length === 0) {
    return null;
  }

  if (variant === 'icon') {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => handleExport('classic')}
          disabled={isExporting}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
          title="Exportar como PDF Clásico"
        >
          {isExporting ? (
            <Loader className="animate-spin" size={18} />
          ) : (
            <FileDown size={18} />
          )}
        </button>
        <button
          onClick={() => handleExport('modern')}
          disabled={isExporting}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
          title="Exportar como PDF Moderno"
        >
          {isExporting ? (
            <Loader className="animate-spin" size={18} />
          ) : (
            <FileDown size={18} />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      <button
        onClick={() => handleExport('classic')}
        disabled={isExporting}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors flex items-center gap-2 disabled:opacity-50"
      >
        {isExporting ? (
          <Loader className="animate-spin" size={16} />
        ) : (
          <FileDown size={16} />
        )}
        PDF Clásico
      </button>
      <button
        onClick={() => handleExport('modern')}
        disabled={isExporting}
        className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors flex items-center gap-2 disabled:opacity-50"
      >
        {isExporting ? (
          <Loader className="animate-spin" size={16} />
        ) : (
          <FileDown size={16} />
        )}
        PDF Moderno
      </button>
    </div>
  );
}
