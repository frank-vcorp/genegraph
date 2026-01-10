'use client';

import { Person } from '@/types/genogram';
import { useGenogramStore } from '@/store/genogram';
import { MEDICAL_CONDITIONS } from '@/types/genogram';
import { Handle, Position, useReactFlow } from 'reactflow';
import { Link2, Plus } from 'lucide-react';

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

  // Determinar el símbolo según género y estado
  const getSymbol = () => {
    if (person.attributes.status === 'deceased') {
      return '☠️';
    }

    switch (person.gender) {
      case 'male':
        return '□';
      case 'female':
        return '●';
      case 'pet':
        return '🐾';
      case 'unknown':
      default:
        return '◇';
    }
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

  return (
    <>
      <Handle type="target" position={Position.Top} />
      
      <div
        onClick={() => selectPerson(person.id)}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
          isSelected
            ? 'border-blue-500 bg-blue-50 shadow-lg scale-110'
            : 'border-gray-300 bg-white hover:border-gray-400'
        } ${
          connectionMode && firstConnectionId === person.id
            ? 'ring-2 ring-purple-500'
            : ''
        } ${person.attributes.isPrimaryPatient ? 'ring-2 ring-green-500' : ''}`}
      >
        {/* Símbolo Principal */}
        <div className="text-3xl text-center mb-2">{getSymbol()}</div>

        {/* Nombre */}
        <p className="text-xs font-bold text-gray-800 text-center truncate">{person.name}</p>

        {/* Edad */}
        {person.age && (
          <p className="text-xs text-gray-600 text-center">{person.age}a</p>
        )}

        {/* Condiciones como puntos pequeños */}
        {person.attributes.conditions.length > 0 && (
          <div className="flex gap-0.5 justify-center mt-2 flex-wrap">
            {person.attributes.conditions.map((condId) => {
              const cond = MEDICAL_CONDITIONS.find((c) => c.id === condId);
              return (
                <div
                  key={condId}
                  className="w-4 h-4 rounded-full flex items-center justify-center text-xs"
                  style={{ backgroundColor: cond?.color + '30', color: cond?.color }}
                  title={cond?.name}
                >
                  {cond?.icon.charAt(0)}
                </div>
              );
            })}
          </div>
        )}

        {/* Indicadores */}
        <div className="flex justify-center gap-1 mt-2 text-xs">
          {person.attributes.isPrimaryPatient && (
            <span title="Paciente Identificado">👤</span>
          )}
          {person.attributes.isPrimaryCareiver && (
            <span title="Cuidador Principal">⭐</span>
          )}
        </div>

        {/* Botón de Conexión */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleConnect();
          }}
          className={`w-full mt-2 py-1 px-2 rounded text-xs font-medium transition flex items-center justify-center gap-1 ${
            connectionMode && firstConnectionId === person.id
              ? 'bg-purple-500 text-white hover:bg-purple-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
