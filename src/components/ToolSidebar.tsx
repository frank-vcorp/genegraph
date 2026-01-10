'use client';

import { useState } from 'react';
import { MEDICAL_CONDITIONS, EMOTIONAL_BONDS } from '@/types/genogram';
import ConditionDraggable from './ConditionDraggable';
import PersonDraggable from './PersonDraggable';

type TabType = 'persons' | 'bonds' | 'conditions';

export default function ToolSidebar() {
  const [activeTab, setActiveTab] = useState<TabType>('persons');

  return (
    <aside className="w-64 bg-white rounded-lg shadow-md flex flex-col border border-gray-200 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        <button
          onClick={() => setActiveTab('persons')}
          className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
            activeTab === 'persons'
              ? 'bg-white text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          👥 Personas
        </button>
        <button
          onClick={() => setActiveTab('bonds')}
          className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
            activeTab === 'bonds'
              ? 'bg-white text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          ❤️ Vínculos
        </button>
        <button
          onClick={() => setActiveTab('conditions')}
          className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
            activeTab === 'conditions'
              ? 'bg-white text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          🏥 Clínica
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeTab === 'persons' && (
          <>
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
              Arrastra para agregar personas
            </div>
            <PersonDraggable type="male" />
            <PersonDraggable type="female" />
            <PersonDraggable type="unknown" />
            <PersonDraggable type="pet" />
          </>
        )}

        {activeTab === 'bonds' && (
          <>
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
              Vínculos emocionales
            </div>
            {EMOTIONAL_BONDS.map((bond) => (
              <div key={bond.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-help" title={bond.name}>
                <div className="text-2xl mb-2">{bond.icon}</div>
                <p className="text-sm font-medium text-gray-700">{bond.name}</p>
              </div>
            ))}
          </>
        )}

        {activeTab === 'conditions' && (
          <>
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
              Arrastra sobre una persona
            </div>
            {MEDICAL_CONDITIONS.map((condition) => (
              <ConditionDraggable key={condition.id} condition={condition} />
            ))}
          </>
        )}
      </div>

      {/* Footer tip */}
      <div className="p-3 bg-blue-50 border-t border-gray-200 text-xs text-blue-700">
        <strong>💡 Tip:</strong> Arrastra los símbolos al lienzo. Haz clic en una persona para editar detalles.
      </div>
    </aside>
  );
}
