import React, { useState } from 'react';
import { RelationType, EmotionalType, EMOTIONAL_BONDS } from '@/types/genogram';
import { X } from 'lucide-react';

interface RelationshipModalProps {
  isOpen: boolean;
  sourcePersonName: string;
  targetPersonName: string;
  onConfirm: (type: RelationType | EmotionalType) => void;
  onCancel: () => void;
}

export const RelationshipModal: React.FC<RelationshipModalProps> = ({
  isOpen,
  sourcePersonName,
  targetPersonName,
  onConfirm,
  onCancel,
}) => {
  const [selectedType, setSelectedType] = useState<RelationType | EmotionalType>('marriage');

  if (!isOpen) {
    return null;
  }

  const relationshipTypes: Array<{ id: RelationType; label: string; icon: string; color: string }> = [
    { id: 'marriage', label: 'Matrimonio', icon: '💍', color: '#3498db' },
    { id: 'free_union', label: 'Unión Libre', icon: '🤝', color: '#3498db' },
    { id: 'separation', label: 'Separación', icon: '⛔', color: '#e74c3c' },
    { id: 'divorce', label: 'Divorcio', icon: '📋', color: '#c0392b' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Crear Relación</h2>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Relación entre <strong>{sourcePersonName}</strong> y{' '}
          <strong>{targetPersonName}</strong>
        </p>

        <div className="space-y-3 mb-6">
          {relationshipTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`w-full p-3 rounded-lg border-2 transition flex items-center gap-3 ${
                selectedType === type.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl">{type.icon}</span>
              <span className="flex-1 text-left font-medium text-gray-700">
                {type.label}
              </span>
              {selectedType === type.id && (
                <span className="text-blue-500">✓</span>
              )}
            </button>
          ))}
        </div>

        <details className="mb-6 bg-gray-50 rounded-lg p-3">
          <summary className="cursor-pointer font-medium text-sm text-gray-700 hover:text-gray-900">
            Vínculos Emocionales (Opcional)
          </summary>
          <div className="mt-3 space-y-2">
            {EMOTIONAL_BONDS.map((bond) => (
              <button
                key={bond.id}
                onClick={() => setSelectedType(bond.id as RelationType | EmotionalType)}
                className={`w-full p-2 rounded text-sm text-left flex items-center gap-2 transition ${
                  selectedType === bond.id
                    ? 'bg-blue-100 text-blue-900'
                    : 'hover:bg-gray-200 text-gray-700'
                }`}
              >
                <span className="text-lg">{bond.icon}</span>
                {bond.name}
              </button>
            ))}
          </div>
        </details>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(selectedType)}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
          >
            Crear Relación
          </button>
        </div>
      </div>
    </div>
  );
};
