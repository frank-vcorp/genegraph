'use client';

import { Gender } from '@/types/genogram';

interface PersonDraggableProps {
  type: Gender | 'pet';
}

export default function PersonDraggable({ type }: PersonDraggableProps) {
  const labels: Record<string, { label: string; icon: string; color: string }> = {
    male: { label: 'Hombre', icon: '□', color: 'bg-blue-50 border-blue-300' },
    female: { label: 'Mujer', icon: '●', color: 'bg-pink-50 border-pink-300' },
    unknown: { label: 'Género Desconocido', icon: '◇', color: 'bg-gray-50 border-gray-300' },
    pet: { label: 'Mascota', icon: '🐾', color: 'bg-orange-50 border-orange-300' },
  };

  const config = labels[type];

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('application/json', JSON.stringify({ type: 'person', personType: type }));
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`p-4 rounded-lg border-2 ${config.color} cursor-grab active:cursor-grabbing hover:shadow-md transition-all transform hover:scale-105`}
    >
      <div className="text-center">
        <div className="text-3xl mb-2">{config.icon}</div>
        <p className="text-sm font-semibold text-gray-700">{config.label}</p>
        <p className="text-xs text-gray-500 mt-1">Arrastra aquí</p>
      </div>
    </div>
  );
}
