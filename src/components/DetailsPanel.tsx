'use client';

import { useGenogramStore } from '@/store/genogram';
import { MEDICAL_CONDITIONS } from '@/types/genogram';
import { X } from 'lucide-react';

export default function DetailsPanel() {
  const { currentGenogram, selectedPersonId, updatePerson, selectPerson, removePerson, removeConditionFromPerson, addConditionToPerson } = useGenogramStore();

  const selectedPerson = currentGenogram?.persons.find((p) => p.id === selectedPersonId);

  if (!selectedPerson) {
    return (
      <div className="w-80 bg-white rounded-lg shadow-md border border-gray-200 p-6 flex items-center justify-center">
        <p className="text-gray-500 text-center">Selecciona una persona para editar</p>
      </div>
    );
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedPersonId) {
      updatePerson(selectedPersonId, { name: e.target.value });
    }
  };

  const handleDelete = () => {
    if (confirm('¿Eliminar esta persona?') && selectedPersonId) {
      removePerson(selectedPersonId);
      selectPerson(null);
    }
  };

  const toggleCondition = (conditionId: string) => {
    if (!selectedPersonId) return;
    if (selectedPerson.attributes.conditions.includes(conditionId)) {
      removeConditionFromPerson(selectedPersonId, conditionId);
    } else {
      addConditionToPerson(selectedPersonId, conditionId);
    }
  };

  const togglePrimaryPatient = () => {
    if (!selectedPersonId) return;
    updatePerson(selectedPersonId, {
      attributes: {
        ...selectedPerson.attributes,
        isPrimaryPatient: !selectedPerson.attributes.isPrimaryPatient,
      },
    });
  };

  const togglePrimaryCareiver = () => {
    if (!selectedPersonId) return;
    updatePerson(selectedPersonId, {
      attributes: {
        ...selectedPerson.attributes,
        isPrimaryCareiver: !selectedPerson.attributes.isPrimaryCareiver,
      },
    });
  };

  return (
    <div className="w-80 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Detalles</h3>
        <button
          onClick={() => selectPerson(null)}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
          <input
            type="text"
            value={selectedPerson.name}
            onChange={handleNameChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
          <select
            value={selectedPerson.attributes.status}
            onChange={(e) => {
              if (selectedPersonId) {
                updatePerson(selectedPersonId, {
                  attributes: {
                    ...selectedPerson.attributes,
                    status: e.target.value as any,
                  },
                });
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="alive">Vivo</option>
            <option value="deceased">Fallecido</option>
            <option value="miscarriage">Pérdida gestacional</option>
            <option value="abortion">Aborto</option>
          </select>
        </div>

        {/* Checkboxes */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedPerson.attributes.isPrimaryPatient}
              onChange={togglePrimaryPatient}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">Paciente Identificado</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedPerson.attributes.isPrimaryCareiver}
              onChange={togglePrimaryCareiver}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">Cuidador Principal</span>
          </label>
        </div>

        {/* Condiciones */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Condiciones Médicas</label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {MEDICAL_CONDITIONS.map((condition) => (
              <label key={condition.id} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                <input
                  type="checkbox"
                  checked={selectedPerson.attributes.conditions.includes(condition.id)}
                  onChange={() => toggleCondition(condition.id)}
                  className="w-4 h-4"
                />
                <span className="text-xl">{condition.icon}</span>
                <span className="text-sm text-gray-700">{condition.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={handleDelete}
          className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
        >
          Eliminar Persona
        </button>
      </div>
    </div>
  );
}
