import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  Edge,
} from 'reactflow';
import { RelationType, EmotionalType, EMOTIONAL_BONDS } from '@/types/genogram';
import { useGenogramStore } from '@/store/genogram';

interface RelationshipEdgeProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  markerEnd?: string;
  data?: {
    type?: RelationType | EmotionalType;
    label?: string;
  };
}

export const RelationshipEdge: React.FC<RelationshipEdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerEnd,
  data,
}) => {
  const { getEdge, setEdges } = useReactFlow();
  const { removeConnection } = useGenogramStore();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  // Determinar estilo según tipo de relación
  const getEdgeStyle = () => {
    const type = data?.type;
    
    if (!type) {
      return {
        stroke: '#95a5a6',
        strokeWidth: 2,
        strokeDasharray: '5,5',
      };
    }

    // Vínculos emocionales
    const emotionalBond = EMOTIONAL_BONDS.find((b) => b.id === type);
    if (emotionalBond) {
      return {
        stroke: emotionalBond.color,
        strokeWidth: 2.5,
        strokeDasharray: '5,5',
      };
    }

    // Relaciones conyugales
    switch (type) {
      case 'marriage':
        return {
          stroke: '#3498db',
          strokeWidth: 3,
          strokeDasharray: '0',
        };
      case 'free_union':
        return {
          stroke: '#3498db',
          strokeWidth: 2,
          strokeDasharray: '5,5',
        };
      case 'separation':
        return {
          stroke: '#e74c3c',
          strokeWidth: 3,
          strokeDasharray: '5,2',
        };
      case 'divorce':
        return {
          stroke: '#c0392b',
          strokeWidth: 3,
          strokeDasharray: '10,5',
        };
      default:
        return {
          stroke: '#95a5a6',
          strokeWidth: 2,
          strokeDasharray: '5,5',
        };
    }
  };

  const handleDelete = () => {
    // Eliminar de la visualización React Flow
    setEdges((edges) => edges.filter((e) => e.id !== id));
    
    // Eliminar del Store Zustand
    removeConnection(id);
  };

  const edgeStyle = getEdgeStyle();

  return (
    <>
      <BaseEdge path={edgePath} style={edgeStyle} markerEnd={markerEnd} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
            fontSize: '12px',
          }}
          className="nodrag nopan"
        >
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-colors"
            title="Delete relationship"
          >
            ✕
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

// Helper para obtener label de relación
export const getRelationshipLabel = (type?: RelationType | EmotionalType): string => {
  if (!type) return '';

  const emotionalBond = EMOTIONAL_BONDS.find((b) => b.id === type);
  if (emotionalBond) {
    return emotionalBond.icon;
  }

  switch (type) {
    case 'marriage':
      return 'M';
    case 'free_union':
      return 'L'; // "Living together"
    case 'separation':
      return 'S';
    case 'divorce':
      return 'D';
    default:
      return '?';
  }
};

// Configuración de estilos para legend
export const RELATIONSHIP_LEGEND = [
  {
    label: 'Matrimonio',
    type: 'marriage',
    style: { stroke: '#3498db', strokeWidth: 3, strokeDasharray: '0' },
  },
  {
    label: 'Unión Libre',
    type: 'free_union',
    style: { stroke: '#3498db', strokeWidth: 2, strokeDasharray: '5,5' },
  },
  {
    label: 'Separación',
    type: 'separation',
    style: { stroke: '#e74c3c', strokeWidth: 3, strokeDasharray: '5,2' },
  },
  {
    label: 'Divorcio',
    type: 'divorce',
    style: { stroke: '#c0392b', strokeWidth: 3, strokeDasharray: '10,5' },
  },
  {
    label: 'Vínculo Cercano',
    type: 'close',
    style: { stroke: '#27ae60', strokeWidth: 2.5, strokeDasharray: '5,5' },
  },
  {
    label: 'Vínculo Distante',
    type: 'distant',
    style: { stroke: '#bdc3c7', strokeWidth: 2.5, strokeDasharray: '5,5' },
  },
  {
    label: 'Conflictivo',
    type: 'conflict',
    style: { stroke: '#e74c3c', strokeWidth: 2.5, strokeDasharray: '5,5' },
  },
];
