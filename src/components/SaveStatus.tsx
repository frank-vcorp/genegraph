/**
 * SaveStatus Indicator Component
 * 🏗️ ARCH REFERENCE: CP-009-Local-Persistence
 * Shows auto-save status and last save time
 */

'use client';

import React from 'react';
import { useAutoSave } from '@/hooks/useAutoSave';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface SaveStatusProps {
  position?: 'top-right' | 'bottom-right' | 'bottom-left';
  showTime?: boolean;
}

export default function SaveStatus({ position = 'bottom-right', showTime = true }: SaveStatusProps) {
  const { isSaving, lastSaved, error } = useAutoSave({ enabled: true, debounceMs: 5000 });

  const positionClass = {
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  }[position];

  if (error) {
    return (
      <div className={`fixed ${positionClass} z-50 transition-all duration-300`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 shadow-md flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800">Error al guardar</p>
            <p className="text-xs text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isSaving) {
    return (
      <div className={`fixed ${positionClass} z-50 transition-all duration-300`}>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 shadow-md flex items-center gap-2">
          <div className="animate-spin">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-sm text-blue-800">Guardando...</p>
        </div>
      </div>
    );
  }

  if (lastSaved) {
    const timeAgo = getTimeAgo(lastSaved);
    return (
      <div className={`fixed ${positionClass} z-50 transition-all duration-300`}>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 shadow-md flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="text-sm text-green-800">
              {showTime ? `Guardado ${timeAgo}` : 'Guardado'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'hace unos segundos';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `hace ${days}d`;
}
