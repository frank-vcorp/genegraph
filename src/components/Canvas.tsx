'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useGenogramStore } from '@/store/genogram';
import { Person, Position } from '@/types/genogram';
import ReactFlow, { 
  Node, 
  Edge, 
  Controls, 
  Background,
  useNodesState,
  useEdgesState,
  NodeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import PersonNode from './PersonNode';
import { RelationshipEdge } from './RelationshipEdge';
import { RelationshipModal } from './RelationshipModal';
import SaveStatus from './SaveStatus';
import { Plus } from 'lucide-react';

const nodeTypes = {
  personNode: PersonNode,
};

const edgeTypes = {
  relationship: RelationshipEdge,
};

export default function Canvas() {
  const { currentGenogram, addPerson, addConnection, viewMode, selectPerson, updatePerson } = useGenogramStore();
  const [showRelationshipModal, setShowRelationshipModal] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<{
    sourceId: string;
    targetId: string;
    sourceName: string;
    targetName: string;
  } | null>(null);

  // Convertir personas a nodos React Flow
  const initialNodes = useMemo(() => {
    if (!currentGenogram) return [];
    
    return currentGenogram.persons.map((person, index) => ({
      id: person.id,
      data: { person },
      position: person.position || { x: index * 250, y: person.generation * 150 },
      type: 'personNode',
    } as Node));
  }, [currentGenogram]);

  // Convertir conexiones a edges React Flow
  const initialEdges = useMemo(() => {
    if (!currentGenogram) return [];
    
    return currentGenogram.connections.map((connection) => ({
      id: connection.id,
      source: connection.sourceId,
      target: connection.targetId,
      type: 'relationship',
      data: {
        type: connection.type,
      },
    } as Edge));
  }, [currentGenogram]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sincronizar Store → React Flow cuando currentGenogram cambia
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [currentGenogram, setNodes, setEdges, initialNodes, initialEdges]);

  // Guardar posiciones cuando se mueven nodos
  const handleNodesChangeWithPersist = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);
      
      // Guardar posición de nodos que se movieron
      changes.forEach((change) => {
        if (change.type === 'position' && change.position && currentGenogram) {
          updatePerson(change.id, { position: change.position });
        }
      });
    },
    [onNodesChange, currentGenogram, updatePerson]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    
    if (!data || !currentGenogram) return;

    try {
      const draggedItem = JSON.parse(data);
      
      if (draggedItem.type === 'person') {
        // Crear nueva persona con posición en el React Flow
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const canvasRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        
        const newPerson: Omit<Person, 'id'> = {
          name: `Persona ${currentGenogram.persons.length + 1}`,
          gender: draggedItem.personType,
          generation: 2,
          position: {
            x: mouseX - canvasRect.left,
            y: mouseY - canvasRect.top,
          },
          attributes: {
            status: 'alive',
            isPrimaryPatient: false,
            isPrimaryCareiver: false,
            conditions: [],
          },
        };
        
        addPerson(newPerson);
      }
    } catch (error) {
      console.error('Error procesando drop:', error);
    }
  };

  if (!currentGenogram) return null;

  const handleCreateConnection = (sourceId: string, targetId: string) => {
    const sourcePerson = currentGenogram?.persons.find(p => p.id === sourceId);
    const targetPerson = currentGenogram?.persons.find(p => p.id === targetId);
    
    if (sourcePerson && targetPerson) {
      setSelectedConnection({
        sourceId,
        targetId,
        sourceName: sourcePerson.name,
        targetName: targetPerson.name,
      });
      setShowRelationshipModal(true);
    }
  };

  const handleConfirmRelationship = (type: string) => {
    if (selectedConnection) {
      addConnection({
        sourceId: selectedConnection.sourceId,
        targetId: selectedConnection.targetId,
        type: type as any,
      });
      setShowRelationshipModal(false);
      setSelectedConnection(null);
    }
  };

  return (
    <>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="flex-1 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden relative"
      >
        {currentGenogram.persons.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="text-gray-400">
              <Plus size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Arrastra personas desde el panel lateral</p>
              <p className="text-sm text-gray-400 mt-2">Comienza con el paciente identificado</p>
            </div>
          </div>
        ) : (
          <ReactFlow 
            nodes={nodes} 
            edges={edges}
            onNodesChange={handleNodesChangeWithPersist}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        )}
      </div>

      <RelationshipModal
        isOpen={showRelationshipModal}
        sourcePersonName={selectedConnection?.sourceName || ''}
        targetPersonName={selectedConnection?.targetName || ''}
        onConfirm={handleConfirmRelationship}
        onCancel={() => {
          setShowRelationshipModal(false);
          setSelectedConnection(null);
        }}
      />

      <SaveStatus position="bottom-right" showTime={true} />
    </>
  );
}
