'use client';

import { useState } from 'react';
import { useGenogramStore } from '@/store/genogram';
import { MEDICAL_CONDITIONS } from '@/types/genogram';
import { X } from 'lucide-react';
import MedicalConditionEditor from './MedicalConditionEditor';
import { MedicalCondition } from '@/types/genogram';

export default function DetailsPanel() {
  const { currentGenogram, selectedPersonId, updatePerson, selectPerson, removePerson, removeConditionFromPerson, addConditionToPerson } = useGenogramStore();
  const [isMedicalEditorOpen, setIsMedicalEditorOpen] = useState(false);

  const selectedPerson = currentGenogram?.persons.find((p) => p.id === selectedPersonId);

  if (!selectedPerson) {
    return (
      <div className="w-80 bg-white rounded-lg shadow-md border border-gray-200 p-6 flex items-center justify-center">
        <p className="text-gray-500 text-center">Selecciona una persona para editar</p>
      </div>
    );
  }

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedPersonId) {
      updatePerson(selectedPersonId, { firstName: e.target.value });
    }
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedPersonId) {
      updatePerson(selectedPersonId, { lastName: e.target.value });
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
    const hasCondition = selectedPerson.medicalConditions.some(c => c.id === conditionId);
    if (hasCondition) {
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

  const toggleDeceased = () => {
    if (!selectedPersonId) return;
    updatePerson(selectedPersonId, {
      isDeceased: !selectedPerson.isDeceased,
    });
  };

  const handleMedicalConditionsSave = (conditions: MedicalCondition[]) => {
    if (!selectedPersonId) return;
    updatePerson(selectedPersonId, {
      medicalConditions: conditions,
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
        {/* Nombres */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
          <input
            type="text"
            value={selectedPerson.firstName}
            onChange={handleFirstNameChange}
            placeholder="Nombre"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <input
            type="text"
            value={selectedPerson.lastName}
            onChange={handleLastNameChange}
            placeholder="Apellido"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Género */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Género</label>
          <select
            value={selectedPerson.gender}
            onChange={(e) => {
              if (selectedPersonId) {
                updatePerson(selectedPersonId, {
                  gender: e.target.value as any,
                });
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="unknown">Desconocido</option>
            <option value="male">Hombre</option>
            <option value="female">Mujer</option>
            <option value="trans_male">Trans Hombre</option>
            <option value="trans_female">Trans Mujer</option>
            <option value="other">Otro</option>
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
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedPerson.isDeceased}
              onChange={toggleDeceased}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">Fallecido</span>
          </label>
        </div>

        {/* Condiciones */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-semibold text-gray-700">Condiciones Médicas</label>
            <button
              onClick={() => setIsMedicalEditorOpen(true)}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded font-medium transition"
            >
              + Editar
            </button>
          </div>
          {selectedPerson.medicalConditions.length === 0 ? (
            <p className="text-sm text-gray-500 italic">Sin condiciones registradas</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedPerson.medicalConditions.map((condition) => (
                <div key={condition.id} className="p-2 bg-blue-50 rounded border border-blue-200 text-sm">
                  <div className="font-medium text-gray-800">{condition.name}</div>
                  {condition.code && <div className="text-xs text-gray-600">CIE-10: {condition.code}</div>}
                  {condition.status && <div className="text-xs text-gray-600">Estado: {condition.status}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Medical Condition Editor Modal */}
        <MedicalConditionEditor
          isOpen={isMedicalEditorOpen}
          onClose={() => setIsMedicalEditorOpen(false)}
          conditions={selectedPerson.medicalConditions}
          onSave={handleMedicalConditionsSave}
          personName={`${selectedPerson.firstName} ${selectedPerson.lastName}`}
        />
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
