'use client';

import { useState, useMemo } from 'react';
import { GenoDate, DatePrecision } from '@/types/genogram';
import { Calendar, X } from 'lucide-react';

interface GenoDateInputProps {
  value?: GenoDate | null;
  onChange: (value: GenoDate | null) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  showClear?: boolean;
}

const PRECISION_OPTIONS: Array<{ value: DatePrecision; label: string; description: string }> = [
  { value: 'exact', label: 'Exacta', description: 'Fecha precisa (YYYY-MM-DD)' },
  { value: 'about', label: 'Aprox.', description: 'Aproximadamente (~)' },
  { value: 'before', label: 'Antes', description: 'Antes de esta fecha' },
  { value: 'after', label: 'Después', description: 'Después de esta fecha' },
  { value: 'unknown', label: 'Desconocida', description: 'Fecha desconocida' },
];

/**
 * GenoDateInput Component
 * Selector de fecha avanzado con opciones de precisión
 * Soporta: Exacta, Aproximada (~), Antes, Después, Desconocida
 */
export default function GenoDateInput({
  value,
  onChange,
  label = 'Fecha',
  required = false,
  placeholder = 'Selecciona una fecha',
  showClear = true,
}: GenoDateInputProps) {
  const [selectedPrecision, setSelectedPrecision] = useState<DatePrecision>(
    value?.precision || 'exact'
  );
  const [dateValue, setDateValue] = useState<string>(value?.date || '');
  const [displayValue, setDisplayValue] = useState<string>(value?.display || '');
  const [showCustomDisplay, setShowCustomDisplay] = useState<boolean>(!!value?.display);

  // Fórmula para mostrar fecha basada en precision
  const formattedDisplay = useMemo(() => {
    if (selectedPrecision === 'unknown') {
      return 'Desconocida';
    }

    if (!dateValue) {
      return placeholder;
    }

    const date = new Date(dateValue);
    const formatted = date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    if (showCustomDisplay && displayValue) {
      return displayValue;
    }

    switch (selectedPrecision) {
      case 'exact':
        return formatted;
      case 'about':
        return `Aprox. ${formatted}`;
      case 'before':
        return `Antes de ${formatted}`;
      case 'after':
        return `Después de ${formatted}`;
      default:
        return formatted;
    }
  }, [selectedPrecision, dateValue, displayValue, showCustomDisplay, placeholder]);

  // Handler para cambios
  const handlePrecisionChange = (precision: DatePrecision) => {
    setSelectedPrecision(precision);

    // Si desconocida, limpiar fecha
    if (precision === 'unknown') {
      setDateValue('');
      onChange({
        date: '',
        precision: 'unknown',
      });
    } else if (dateValue) {
      // Mantener fecha con nueva precision
      onChange({
        date: dateValue,
        precision,
        display: showCustomDisplay && displayValue ? displayValue : undefined,
      });
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDateValue(newDate);

    if (newDate) {
      onChange({
        date: newDate,
        precision: selectedPrecision,
        display: showCustomDisplay && displayValue ? displayValue : undefined,
      });
    }
  };

  const handleDisplayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDisplay = e.target.value;
    setDisplayValue(newDisplay);

    if (dateValue) {
      onChange({
        date: dateValue,
        precision: selectedPrecision,
        display: newDisplay || undefined,
      });
    }
  };

  const handleClear = () => {
    setDateValue('');
    setDisplayValue('');
    setSelectedPrecision('exact');
    setShowCustomDisplay(false);
    onChange(null);
  };

  return (
    <div className="space-y-4">
      {/* Label */}
      {label && (
        <div className="flex items-center gap-2">
          <label className="block text-sm font-semibold text-gray-700">
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
          <Calendar size={16} className="text-gray-400" />
        </div>
      )}

      {/* Precision Tabs */}
      <div className="grid grid-cols-5 gap-1 bg-gray-100 p-1 rounded-lg">
        {PRECISION_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => handlePrecisionChange(option.value)}
            className={`py-2 px-2 rounded text-sm font-medium transition-all whitespace-nowrap ${
              selectedPrecision === option.value
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            title={option.description}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Date Input (solo si no es desconocida) */}
      {selectedPrecision !== 'unknown' && (
        <div className="space-y-3">
          <input
            type="date"
            value={dateValue}
            onChange={handleDateChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="YYYY-MM-DD"
          />

          {/* Display Override Checkbox + Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showCustomDisplay}
                onChange={(e) => setShowCustomDisplay(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-gray-700">
                Mostrar texto personalizado (opcional)
              </span>
            </label>

            {showCustomDisplay && (
              <input
                type="text"
                value={displayValue}
                onChange={handleDisplayChange}
                placeholder="ej: Invierno 1990, Primavera de 1985"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            )}
          </div>
        </div>
      )}

      {/* Preview */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-gray-600 mb-1">Vista previa:</p>
        <p className="text-base font-semibold text-blue-900">
          {formattedDisplay}
        </p>
      </div>

      {/* Clear Button */}
      {showClear && (dateValue || selectedPrecision === 'unknown') && (
        <button
          onClick={handleClear}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
        >
          <X size={16} />
          Limpiar fecha
        </button>
      )}
    </div>
  );
}
