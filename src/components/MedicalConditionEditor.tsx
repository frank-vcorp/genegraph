'use client';

import { useState } from 'react';
import { X, Plus, Trash2, Edit2 } from 'lucide-react';
import { MedicalCondition, GenoDate, DatePrecision } from '@/types/genogram';
import { v4 as uuidv4 } from 'uuid';

interface MedicalConditionEditorProps {
  isOpen: boolean;
  onClose: () => void;
  conditions: MedicalCondition[];
  onSave: (conditions: MedicalCondition[]) => void;
  personName?: string;
}

interface FormState {
  id: string;
  name: string;
  code: string;
  status: 'active' | 'remission' | 'cured' | 'chronic' | 'carrier';
  onsetDate: GenoDate | null;
  endDate: GenoDate | null;
  notes: string;
}

const DEFAULT_FORM_STATE: FormState = {
  id: '',
  name: '',
  code: '',
  status: 'active',
  onsetDate: null,
  endDate: null,
  notes: '',
};

export default function MedicalConditionEditor({
  isOpen,
  onClose,
  conditions,
  onSave,
  personName = 'Persona',
}: MedicalConditionEditorProps) {
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
  const [isEditing, setIsEditing] = useState(false);
  const [localConditions, setLocalConditions] = useState<MedicalCondition[]>(conditions);

  // Reset form
  const resetForm = () => {
    setFormState(DEFAULT_FORM_STATE);
    setIsEditing(false);
  };

  // Handle add/edit
  const handleSaveCondition = () => {
    if (!formState.name.trim()) {
      alert('El nombre de la condición es requerido');
      return;
    }

    if (isEditing) {
      // Edit existing
      setLocalConditions(
        localConditions.map((c) =>
          c.id === formState.id
            ? {
                id: c.id,
                name: formState.name,
                code: formState.code || undefined,
                status: formState.status,
                onsetDate: formState.onsetDate || undefined,
                endDate: formState.endDate || undefined,
                notes: formState.notes || undefined,
              }
            : c
        )
      );
    } else {
      // Add new
      const newCondition: MedicalCondition = {
        id: uuidv4(),
        name: formState.name,
        code: formState.code || undefined,
        status: formState.status,
        onsetDate: formState.onsetDate || undefined,
        endDate: formState.endDate || undefined,
        notes: formState.notes || undefined,
      };
      setLocalConditions([...localConditions, newCondition]);
    }

    resetForm();
  };

  // Handle edit
  const handleEditCondition = (condition: MedicalCondition) => {
    setFormState({
      id: condition.id,
      name: condition.name,
      code: condition.code || '',
      status: condition.status,
      onsetDate: condition.onsetDate || null,
      endDate: condition.endDate || null,
      notes: condition.notes || '',
    });
    setIsEditing(true);
  };

  // Handle delete
  const handleDeleteCondition = (id: string) => {
    if (confirm('¿Eliminar esta condición médica?')) {
      setLocalConditions(localConditions.filter((c) => c.id !== id));
    }
  };

  // Handle close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Handle save and close
  const handleSaveAndClose = () => {
    onSave(localConditions);
    handleClose();
  };

  // Handle date input
  const handleDateChange = (dateType: 'onset' | 'end', value: string) => {
    if (!value) {
      if (dateType === 'onset') {
        setFormState({ ...formState, onsetDate: null });
      } else {
        setFormState({ ...formState, endDate: null });
      }
      return;
    }

    const geoDate: GenoDate = {
      date: value,
      precision: 'exact',
    };

    if (dateType === 'onset') {
      setFormState({ ...formState, onsetDate: geoDate });
    } else {
      setFormState({ ...formState, endDate: geoDate });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            Condiciones Médicas de {personName}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row gap-6 p-6">
          {/* Form Section */}
          <div className="lg:w-1/3 border-r border-gray-200 lg:border-r pr-4">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">
              {isEditing ? 'Editar Condición' : 'Nueva Condición'}
            </h3>

            <div className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="ej: Hipertensión, Diabetes"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Código CIE-10 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Código CIE-10
                </label>
                <input
                  type="text"
                  value={formState.code}
                  onChange={(e) => setFormState({ ...formState, code: e.target.value })}
                  placeholder="ej: I10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Opcional. Ej: I10 (Hipertensión), E11 (Diabetes tipo 2)
                </p>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={formState.status}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      status: e.target.value as FormState['status'],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Activo</option>
                  <option value="remission">Remisión</option>
                  <option value="cured">Curado</option>
                  <option value="chronic">Crónico</option>
                  <option value="carrier">Portador</option>
                </select>
              </div>

              {/* Onset Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  value={formState.onsetDate?.date || ''}
                  onChange={(e) => handleDateChange('onset', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Fecha de Fin
                </label>
                <input
                  type="date"
                  value={formState.endDate?.date || ''}
                  onChange={(e) => handleDateChange('end', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Notas Clínicas
                </label>
                <textarea
                  value={formState.notes}
                  onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                  placeholder="Observaciones médicas relevantes..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={handleSaveCondition}
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  {isEditing ? 'Guardar' : 'Agregar'}
                </button>
                {isEditing && (
                  <button
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-medium transition"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Conditions List Section */}
          <div className="lg:w-2/3">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">
              Condiciones ({localConditions.length})
            </h3>

            {localConditions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No hay condiciones médicas registradas</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {localConditions.map((condition) => (
                  <div
                    key={condition.id}
                    className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition"
                  >
                    {/* Condition Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{condition.name}</h4>
                        {condition.code && (
                          <p className="text-xs text-gray-600">CIE-10: {condition.code}</p>
                        )}
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded font-medium whitespace-nowrap ml-2 ${
                          condition.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : condition.status === 'chronic'
                            ? 'bg-orange-100 text-orange-800'
                            : condition.status === 'cured'
                            ? 'bg-blue-100 text-blue-800'
                            : condition.status === 'remission'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {condition.status === 'active'
                          ? 'Activo'
                          : condition.status === 'remission'
                          ? 'Remisión'
                          : condition.status === 'cured'
                          ? 'Curado'
                          : condition.status === 'chronic'
                          ? 'Crónico'
                          : 'Portador'}
                      </span>
                    </div>

                    {/* Dates */}
                    {(condition.onsetDate || condition.endDate) && (
                      <div className="text-xs text-gray-600 mb-2">
                        {condition.onsetDate && (
                          <p>
                            Inicio:{' '}
                            {new Date(condition.onsetDate.date).toLocaleDateString('es-ES')}
                          </p>
                        )}
                        {condition.endDate && (
                          <p>
                            Fin:{' '}
                            {new Date(condition.endDate.date).toLocaleDateString('es-ES')}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Notes */}
                    {condition.notes && (
                      <p className="text-sm text-gray-700 mb-3 italic bg-white p-2 rounded border-l-2 border-blue-300">
                        {condition.notes}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditCondition(condition)}
                        className="flex-1 px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs font-medium transition flex items-center justify-center gap-1"
                      >
                        <Edit2 size={14} />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteCondition(condition.id)}
                        className="flex-1 px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-xs font-medium transition flex items-center justify-center gap-1"
                      >
                        <Trash2 size={14} />
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-3 justify-end">
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-medium transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveAndClose}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
