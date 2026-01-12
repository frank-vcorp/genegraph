'use client';

import { Person, Gender } from '@/types/genogram';
import { useGenogramStore } from '@/store/genogram';
import { MEDICAL_CONDITIONS } from '@/types/genogram';
import { calculateAge, formatAge } from '@/logic/dates';
import { Handle, Position, useReactFlow } from 'reactflow';
import { Link2 } from 'lucide-react';

interface PersonNodeProps {
  data: { person: Person };
  selected?: boolean;
}

export default function PersonNode({ data, selected }: PersonNodeProps) {
  const { 
    selectPerson, 
    selectedPersonId, 
    addConditionToPerson,
    connectionMode,
    firstConnectionId,
    setConnectionMode,
    addConnection,
  } = useGenogramStore();
  const { getNodes } = useReactFlow();
  const person = data.person;
  const isSelected = selectedPersonId === person.id || selected;

  // Determinar el símbolo según género y estado (GenoPro-style)
  const getBaseSymbol = () => {
    if (person.isDeceased) {
      return '■'; // Cuadrado para fallecido
    }

    switch (person.gender) {
      case 'male':
        return '■'; // Cuadrado - hombre
      case 'female':
      case 'trans_female':
        return '●'; // Círculo - mujer
      case 'trans_male':
      case 'other':
        return '◇'; // Diamante - otros/trans
      case 'unknown':
      default:
        return '□'; // Cuadrado vacío - desconocido
    }
  };

  // Agregador visual para género trans o especial
  const getGenderModifier = () => {
    switch (person.gender) {
      case 'trans_male':
      case 'trans_female':
        return '▲'; // Triángulo para trans
      case 'other':
        return '±'; // Símbolo especial para otros
      default:
        return null;
    }
  };

  // Obtener color de fondo según género
  const getGenderColor = () => {
    switch (person.gender) {
      case 'male':
        return '#E8F0FE'; // Azul claro
      case 'female':
        return '#FEE8F0'; // Rosa claro
      case 'trans_male':
        return '#E8F8F0'; // Verde-azul claro
      case 'trans_female':
        return '#F8E8F8'; // Lila claro
      case 'other':
        return '#F8F0E8'; // Naranja claro
      case 'unknown':
        return '#F0F0F0'; // Gris claro
      default:
        return '#FFFFFF';
    }
  };

  // Estado visual de embarazo/aborto
  const getPregnancyVisualization = () => {
    if (!person.pregnancyStatus || person.pregnancyStatus === 'none') {
      return null;
    }

    switch (person.pregnancyStatus) {
      case 'pregnant':
        return { icon: '◀', color: '#90EE90' }; // Verde - embarazada
      case 'miscarriage':
        return { icon: '×', color: '#FFB6C6' }; // Rosa - aborto
      case 'abortion':
        return { icon: '×', color: '#FFB6C6' }; // Rosa - aborto
      case 'stillbirth':
        return { icon: '↓', color: '#C0C0C0' }; // Gris - mortinato
      default:
        return null;
    }
  };

  // Cuadrante de condición médica (GenoPro style)
  const getMedicalConditionQuadrant = () => {
    if (!person.medicalConditions || person.medicalConditions.length === 0) {
      return null;
    }

    // Usar la primera condición para el cuadrante visual
    const primaryCondition = person.medicalConditions[0];
    const conditionDef = MEDICAL_CONDITIONS.find(c => c.id === primaryCondition.code);
    
    return {
      color: primaryCondition.color || conditionDef?.color || '#FF0000',
      quadrant: conditionDef?.quadrant || 'top_right'
    };
  };

  // Rendering del cuadrante
  const renderConditionQuadrant = (quadrant: string, color: string) => {
    const quadrantClasses = {
      'top_right': 'absolute top-0 right-0 w-3 h-3 rounded-bl',
      'top_left': 'absolute top-0 left-0 w-3 h-3 rounded-br',
      'bottom_right': 'absolute bottom-0 right-0 w-3 h-3 rounded-tl',
      'bottom_left': 'absolute bottom-0 left-0 w-3 h-3 rounded-tr',
      'front': 'absolute -top-1 -right-1 w-3 h-3 rounded-full',
      'corner': 'absolute top-1 right-1 w-2 h-2 rounded-full',
    };

    return (
      <div 
        className={quadrantClasses[quadrant as keyof typeof quadrantClasses] || quadrantClasses['top_right']}
        style={{ backgroundColor: color }}
        title={person.medicalConditions?.[0]?.name}
      />
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const data = e.dataTransfer.getData('application/json');
    
    if (!data) return;

    try {
      const draggedItem = JSON.parse(data);
      
      if (draggedItem.type === 'condition') {
        addConditionToPerson(person.id, draggedItem.conditionId);
      }
    } catch (error) {
      console.error('Error procesando drop:', error);
    }
  };

  const handleConnect = () => {
    if (!connectionMode) {
      // Iniciar modo conexión
      setConnectionMode(true, person.id);
    } else if (firstConnectionId && firstConnectionId !== person.id) {
      // Completar conexión
      addConnection({
        sourceId: firstConnectionId,
        targetId: person.id,
        type: 'marriage', // Tipo por defecto, el modal puede cambiar esto
      });
      setConnectionMode(false);
    }
  };

  const baseSymbol = getBaseSymbol();
  const modifier = getGenderModifier();
  const pregnancyViz = getPregnancyVisualization();
  const medicalQuadrant = getMedicalConditionQuadrant();
  const age = calculateAge(person.birthDate, person.blockAgeCalculation);
  const ageDisplay = formatAge(person.birthDate, person.blockAgeCalculation, person.isDeceased);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Enter o Space para seleccionar persona (A11y keyboard navigation)
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectPerson(person.id);
    }
  };

  return (
    <>
      <Handle type="target" position={Position.Top} />
      
      <div
        onClick={() => selectPerson(person.id)}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label={`${person.firstName} ${person.lastName}, ${person.gender}`}
        className={`relative p-2 md:p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
          isSelected
            ? 'border-blue-500 bg-blue-50 shadow-lg scale-110 ring-2 ring-blue-400'
            : 'border-gray-300 hover:border-blue-300 shadow-sm'
        } ${
          connectionMode && firstConnectionId === person.id
            ? 'ring-2 ring-purple-500 bg-purple-50'
            : ''
        } ${person.attributes.isPrimaryPatient ? 'ring-2 ring-green-500' : ''} 
        min-w-max w-32 md:w-40`}
        style={{ backgroundColor: getGenderColor() }}
      >
        {/* Símbolo Principal con Fallecido Diagonal */}
        <div className={`text-4xl md:text-5xl text-center mb-2 relative h-12 md:h-14 flex items-center justify-center transition-transform duration-200 hover:scale-110 ${
          person.isDeceased ? 'opacity-70' : ''
        }`}>
          <div className="flex items-center justify-center gap-0.5">
            <span>{baseSymbol}</span>
            {modifier && <span className="text-lg md:text-2xl text-red-500 animate-pulse">{modifier}</span>}
          </div>
          
          {/* Línea diagonal para fallecido */}
          {person.isDeceased && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-px bg-gray-500 transform -rotate-45" />
            </div>
          )}

          {/* Visualización de embarazo */}
          {pregnancyViz && (
            <div 
              className="absolute -bottom-2 -right-2 w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full border transition-transform duration-200 hover:scale-125"
              style={{ 
                backgroundColor: pregnancyViz.color + '40',
                borderColor: pregnancyViz.color,
              }}
              title={person.pregnancyStatus}
            >
              <span className="text-xs md:text-sm" style={{ color: pregnancyViz.color }}>
                {pregnancyViz.icon}
              </span>
            </div>
          )}

          {/* Cuadrante de Condición Médica (GenoPro Style) */}
          {medicalQuadrant && renderConditionQuadrant(medicalQuadrant.quadrant, medicalQuadrant.color)}
        </div>

        {/* Nombre */}
        <p className="text-xs md:text-sm font-bold text-gray-800 text-center truncate px-1 transition-colors duration-200 hover:text-blue-700">
          {person.firstName} {person.lastName}
        </p>

        {/* Edad */}
        {age !== undefined && (
          <p className="text-xs text-gray-600 text-center transition-colors duration-200 hover:text-gray-800">{ageDisplay}</p>
        )}

        {/* Condiciones como lista de etiquetas (solo si >1) */}
        {person.medicalConditions && person.medicalConditions.length > 1 && (
          <div className="flex gap-0.5 justify-center mt-2 flex-wrap px-1">
            {person.medicalConditions.slice(0, 3).map((cond) => {
              const condDef = MEDICAL_CONDITIONS.find((c) => c.id === cond.code || c.id === cond.name);
              return (
                <div
                  key={cond.id}
                  className="px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-700 border border-gray-300 transition-all duration-200 hover:bg-blue-100 hover:border-blue-400 hover:text-blue-900 cursor-help"
                  title={`${cond.name} (${cond.status})`}
                >
                  {cond.name.substring(0, 3)}
                </div>
              );
            })}
            {person.medicalConditions.length > 3 && (
              <span className="text-xs text-gray-500 transition-colors duration-200 hover:text-gray-700">+{person.medicalConditions.length - 3}</span>
            )}
          </div>
        )}

        {/* Indicadores */}
        <div className="flex justify-center gap-1 mt-2 text-sm md:text-base transition-all duration-200 hover:scale-110">
          {person.attributes.isPrimaryPatient && (
            <span title="Paciente Identificado" className="transition-transform hover:scale-125">👤</span>
          )}
          {person.attributes.isPrimaryCareiver && (
            <span title="Cuidador Principal" className="transition-transform hover:scale-125">⭐</span>
          )}
          {person.twinGroupId && (
            <span title={`${person.twinType} gemelos`} className="transition-transform hover:scale-125">👯</span>
          )}
        </div>

        {/* Botón de Conexión */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleConnect();
          }}
          className={`w-full mt-2 py-1 px-2 rounded text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1 transform hover:scale-105 active:scale-95 ${
            connectionMode && firstConnectionId === person.id
              ? 'bg-purple-500 text-white hover:bg-purple-600 shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
          }`}
        >
          <Link2 size={12} />
          {connectionMode && firstConnectionId === person.id ? 'Conectando...' : 'Conectar'}
        </button>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </>
  );
}
