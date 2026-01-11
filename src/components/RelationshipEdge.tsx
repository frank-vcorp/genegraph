import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  Edge,
} from 'reactflow';
import { 
  Relationship, 
  LineageType, 
  PartnershipType, 
  EmotionalInteraction,
  EMOTIONAL_BONDS,
  PARTNERSHIP_TYPES,
} from '@/types/genogram';
import { useGenogramStore } from '@/store/genogram';

interface RelationshipEdgeProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  markerEnd?: string;
  data?: {
    relationship?: Relationship;
    type?: PartnershipType | LineageType | EmotionalInteraction;
    label?: string;
  };
}

/**
 * RelationshipEdge Component - Dual-Layer Visualization
 * 
 * Capa 1: Parentesco (Lineage - sólida/punteada)
 * Capa 2: Pareja (Partnership - estilos específicos)
 * Capa 3: Emocional (Emotional - overlay zigzag/doble/triple)
 */
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

  const relationship = data?.relationship;

  /**
   * Obtener estilos de edge basado en Relationship interface
   * Prioridad: Lineage > Partnership > Emotional
   */
  const getEdgeStyle = () => {
    if (!relationship) {
      return getDefaultEdgeStyle(data?.type);
    }

    // Capa 1: Parentesco (Lineage) - Prioridad 1
    if (relationship.isLineage && relationship.lineageType) {
      return getLineageStyle(relationship.lineageType);
    }

    // Capa 2: Pareja (Partnership) - Prioridad 2
    if (relationship.isPartnership && relationship.partnershipType) {
      return getPartnershipStyle(relationship.partnershipType);
    }

    // Capa 3: Emocional (Emotional) - Prioridad 3 (overlay)
    if (relationship.emotionalConfig?.types?.length) {
      return getEmotionalStyle(relationship.emotionalConfig.types[0]);
    }

    return getDefaultEdgeStyle();
  };

  /**
   * Estilos para Lineage (Parentesco)
   */
  const getLineageStyle = (lineageType: LineageType) => {
    switch (lineageType) {
      case 'biological':
        return {
          stroke: '#2c3e50', // Gris oscuro para relaciones biológicas
          strokeWidth: 2,
          strokeDasharray: '0', // Sólida
        };
      case 'adoptive':
        return {
          stroke: '#2c3e50',
          strokeWidth: 2,
          strokeDasharray: '8,4', // Punteada
        };
      case 'foster':
        return {
          stroke: '#2c3e50',
          strokeWidth: 2,
          strokeDasharray: '4,4', // Más punteada
        };
      case 'donor':
        return {
          stroke: '#7f8c8d',
          strokeWidth: 1.5,
          strokeDasharray: '2,2', // Muy punteada
        };
      default:
        return {
          stroke: '#2c3e50',
          strokeWidth: 2,
          strokeDasharray: '0',
        };
    }
  };

  /**
   * Estilos para Partnership (Pareja/Matrimonio)
   */
  const getPartnershipStyle = (partnershipType: PartnershipType) => {
    switch (partnershipType) {
      case 'marriage':
        return {
          stroke: '#3498db', // Azul - Matrimonio
          strokeWidth: 3,
          strokeDasharray: '0', // Sólida
        };
      case 'cohabitation':
        return {
          stroke: '#16a085', // Verde azulado - Convivencia
          strokeWidth: 2.5,
          strokeDasharray: '0',
        };
      case 'free_union':
        return {
          stroke: '#3498db',
          strokeWidth: 2,
          strokeDasharray: '5,5', // Punteada
        };
      case 'separation':
        return {
          stroke: '#f39c12', // Naranja - Separación
          strokeWidth: 2.5,
          strokeDasharray: '5,3',
        };
      case 'divorce':
        return {
          stroke: '#e74c3c', // Rojo - Divorcio
          strokeWidth: 3,
          strokeDasharray: '10,5', // Guionada
        };
      case 'widowhood':
        return {
          stroke: '#7f8c8d', // Gris - Viudez
          strokeWidth: 2,
          strokeDasharray: '0',
        };
      default:
        return {
          stroke: '#95a5a6',
          strokeWidth: 2,
          strokeDasharray: '5,5',
        };
    }
  };

  /**
   * Estilos para Emotional (Vínculo emocional)
   * Estos pueden superponer el estilo base
   */
  const getEmotionalStyle = (emotionalType: EmotionalInteraction) => {
    switch (emotionalType) {
      case 'close':
        return {
          stroke: '#27ae60', // Verde - Cercano
          strokeWidth: 2.5,
          strokeDasharray: '0',
        };
      case 'fused':
        return {
          stroke: '#1e8449', // Verde oscuro - Fusionado
          strokeWidth: 3,
          strokeDasharray: '0',
        };
      case 'distant':
        return {
          stroke: '#bdc3c7', // Gris claro - Distante
          strokeWidth: 2,
          strokeDasharray: '5,5', // Punteada
        };
      case 'conflicted':
        return {
          stroke: '#e74c3c', // Rojo - Conflictivo
          strokeWidth: 2.5,
          strokeDasharray: '3,3',
        };
      case 'fused_hostile':
        return {
          stroke: '#c0392b', // Rojo oscuro - Fusionado + Conflictivo
          strokeWidth: 3,
          strokeDasharray: '3,3',
        };
      case 'cutoff':
        return {
          stroke: '#34495e', // Gris oscuro - Corte
          strokeWidth: 2,
          strokeDasharray: '1,2', // Muy punteada
        };
      case 'abuse_physical':
        return {
          stroke: '#c0392b', // Rojo oscuro - Abuso físico
          strokeWidth: 3,
          strokeDasharray: '0',
        };
      case 'abuse_emotional':
        return {
          stroke: '#e67e22', // Naranja - Abuso emocional
          strokeWidth: 2.5,
          strokeDasharray: '0',
        };
      case 'unknown':
      default:
        return {
          stroke: '#95a5a6',
          strokeWidth: 2,
          strokeDasharray: '5,5',
        };
    }
  };

  /**
   * Estilo por defecto cuando no hay relationship definida
   */
  const getDefaultEdgeStyle = (type?: string) => {
    if (!type) {
      return {
        stroke: '#95a5a6',
        strokeWidth: 2,
        strokeDasharray: '5,5',
      };
    }

    // Buscar en emotional bonds
    const emotionalBond = EMOTIONAL_BONDS.find((b) => b.id === type);
    if (emotionalBond) {
      return {
        stroke: emotionalBond.color,
        strokeWidth: 2.5,
        strokeDasharray: '5,5',
      };
    }

    // Buscar en partnership types
    const partnership = PARTNERSHIP_TYPES.find((p) => p.id === type);
    if (partnership) {
      return {
        stroke: '#3498db',
        strokeWidth: 2,
        strokeDasharray: '0',
      };
    }

    return {
      stroke: '#95a5a6',
      strokeWidth: 2,
      strokeDasharray: '5,5',
    };
  };

  const handleDelete = () => {
    // Eliminar de la visualización React Flow
    setEdges((edges) => edges.filter((e) => e.id !== id));
    
    // Eliminar del Store Zustand
    removeConnection(id);
  };

  /**
   * Obtener label visual para la relación
   * Si hay múltiples capas, mostrar todos
   */
  const getEdgeLabel = () => {
    if (!relationship) return '';

    const labels: string[] = [];

    // Agregar label de lineage
    if (relationship.isLineage && relationship.lineageType) {
      labels.push(getLineageLabel(relationship.lineageType));
    }

    // Agregar label de partnership
    if (relationship.isPartnership && relationship.partnershipType) {
      labels.push(getPartnershipLabel(relationship.partnershipType));
    }

    // Agregar label de emocional (solo el primero)
    if (relationship.emotionalConfig?.types?.length) {
      labels.push(getEmotionalLabel(relationship.emotionalConfig.types[0]));
    }

    return labels.join(' | ');
  };

  const getLineageLabel = (lineageType: LineageType): string => {
    switch (lineageType) {
      case 'biological': return 'Bio';
      case 'adoptive': return 'Adp';
      case 'foster': return 'Fos';
      case 'donor': return 'Don';
      default: return 'Lin';
    }
  };

  const getPartnershipLabel = (partnershipType: PartnershipType): string => {
    switch (partnershipType) {
      case 'marriage': return 'M';
      case 'cohabitation': return 'C';
      case 'free_union': return 'L';
      case 'separation': return 'S';
      case 'divorce': return 'D';
      case 'widowhood': return 'W';
      default: return '?';
    }
  };

  const getEmotionalLabel = (emotionalType: EmotionalInteraction): string => {
    switch (emotionalType) {
      case 'close': return '💚';
      case 'fused': return '💚💚';
      case 'distant': return '⚪';
      case 'conflicted': return '⚡';
      case 'fused_hostile': return '🔗⚡';
      case 'cutoff': return '✂️';
      case 'abuse_physical': return '🔴';
      case 'abuse_emotional': return '🟠';
      case 'unknown': return '?';
      default: return '';
    }
  };

  const edgeStyle = getEdgeStyle();
  const edgeLabel = getEdgeLabel();

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
          className="nodrag nopan flex items-center gap-1"
        >
          {/* Label de relación (opcional, solo si hay espacio) */}
          {edgeLabel && (
            <div className="bg-white px-2 py-0.5 rounded-md text-xs font-medium text-gray-700 border border-gray-300 shadow-sm">
              {edgeLabel}
            </div>
          )}
          
          {/* Botón de eliminar */}
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-colors shadow-md"
            title="Delete relationship"
          >
            ✕
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

/**
 * Helper para obtener label simple de relación (para leyenda, etc.)
 */
export const getRelationshipLabel = (relationship?: Relationship): string => {
  if (!relationship) return 'Unknown';

  if (relationship.isLineage && relationship.lineageType) {
    return `Lineage: ${relationship.lineageType}`;
  }

  if (relationship.isPartnership && relationship.partnershipType) {
    return `Partnership: ${relationship.partnershipType}`;
  }

  if (relationship.emotionalConfig?.types?.length) {
    return `Emotional: ${relationship.emotionalConfig.types[0]}`;
  }

  return 'Relationship';
};

/**
 * Leyenda de Relaciones para PDF/UI
 */
export const RELATIONSHIP_LEGEND = [
  // Lineage
  {
    label: 'Relación Biológica',
    style: { stroke: '#2c3e50', strokeWidth: 2, strokeDasharray: '0' },
    category: 'Lineage',
  },
  {
    label: 'Relación Adoptiva',
    style: { stroke: '#2c3e50', strokeWidth: 2, strokeDasharray: '8,4' },
    category: 'Lineage',
  },
  {
    label: 'Relación de Crianza',
    style: { stroke: '#2c3e50', strokeWidth: 2, strokeDasharray: '4,4' },
    category: 'Lineage',
  },
  
  // Partnership
  {
    label: 'Matrimonio',
    style: { stroke: '#3498db', strokeWidth: 3, strokeDasharray: '0' },
    category: 'Partnership',
  },
  {
    label: 'Convivencia',
    style: { stroke: '#16a085', strokeWidth: 2.5, strokeDasharray: '0' },
    category: 'Partnership',
  },
  {
    label: 'Unión Libre',
    style: { stroke: '#3498db', strokeWidth: 2, strokeDasharray: '5,5' },
    category: 'Partnership',
  },
  {
    label: 'Separación',
    style: { stroke: '#f39c12', strokeWidth: 2.5, strokeDasharray: '5,3' },
    category: 'Partnership',
  },
  {
    label: 'Divorcio',
    style: { stroke: '#e74c3c', strokeWidth: 3, strokeDasharray: '10,5' },
    category: 'Partnership',
  },
  {
    label: 'Viudez',
    style: { stroke: '#7f8c8d', strokeWidth: 2, strokeDasharray: '0' },
    category: 'Partnership',
  },
  
  // Emotional
  {
    label: 'Vínculo Cercano',
    style: { stroke: '#27ae60', strokeWidth: 2.5, strokeDasharray: '0' },
    category: 'Emotional',
  },
  {
    label: 'Vínculo Fusionado',
    style: { stroke: '#1e8449', strokeWidth: 3, strokeDasharray: '0' },
    category: 'Emotional',
  },
  {
    label: 'Vínculo Distante',
    style: { stroke: '#bdc3c7', strokeWidth: 2, strokeDasharray: '5,5' },
    category: 'Emotional',
  },
  {
    label: 'Conflictivo',
    style: { stroke: '#e74c3c', strokeWidth: 2.5, strokeDasharray: '3,3' },
    category: 'Emotional',
  },
  {
    label: 'Corte/Ruptura',
    style: { stroke: '#34495e', strokeWidth: 2, strokeDasharray: '1,2' },
    category: 'Emotional',
  },
  {
    label: 'Abuso',
    style: { stroke: '#c0392b', strokeWidth: 3, strokeDasharray: '0' },
    category: 'Emotional',
  },
];
