import { create } from 'zustand';
import { Person, Connection, Genogram, Gender, Status, PersonAttributes, generateId } from '@/types/genogram';

interface GenogramStore {
  // Estado
  currentGenogram: Genogram | null;
  selectedPersonId: string | null;
  viewMode: 'classic' | 'modern';
  isDraggingCondition: boolean;
  draggedConditionId: string | null;
  connectionMode: boolean;
  firstConnectionId: string | null;

  // Acciones - Genograma
  setCurrentGenogram: (genogram: Genogram | null) => void;
  createNewGenogram: (userId: string, patientName: string) => void;
  
  // Acciones - Personas
  addPerson: (person: Omit<Person, 'id'>) => void;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  removePerson: (id: string) => void;
  selectPerson: (id: string | null) => void;
  
  // Acciones - Condiciones
  addConditionToPerson: (personId: string, conditionId: string) => void;
  removeConditionFromPerson: (personId: string, conditionId: string) => void;
  
  // Acciones - Conexiones
  addConnection: (connection: Omit<Connection, 'id'>) => void;
  removeConnection: (id: string) => void;
  
  // Acciones - UI
  setViewMode: (mode: 'classic' | 'modern') => void;
  setDraggingCondition: (isDragging: boolean, conditionId: string | null) => void;
  setConnectionMode: (enabled: boolean, firstId?: string | null) => void;
}

export const useGenogramStore = create<GenogramStore>((set) => ({
  currentGenogram: null,
  selectedPersonId: null,
  viewMode: 'modern',
  isDraggingCondition: false,
  draggedConditionId: null,
  connectionMode: false,
  firstConnectionId: null,

  setCurrentGenogram: (genogram) => set({ currentGenogram: genogram }),

  createNewGenogram: (userId, patientName) =>
    set({
      currentGenogram: {
        id: generateId('genogram'),
        userId,
        pacientName: patientName,
        createdAt: new Date(),
        updatedAt: new Date(),
        persons: [],
        connections: [],
        metadata: {},
      },
    }),

  addPerson: (person) =>
    set((state) => {
      if (!state.currentGenogram) return state;
      return {
        currentGenogram: {
          ...state.currentGenogram,
          persons: [
            ...state.currentGenogram.persons,
            {
              ...person,
              id: generateId('person'),
            },
          ],
          updatedAt: new Date(),
        },
      };
    }),

  updatePerson: (id, updates) =>
    set((state) => {
      if (!state.currentGenogram) return state;
      return {
        currentGenogram: {
          ...state.currentGenogram,
          persons: state.currentGenogram.persons.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
          updatedAt: new Date(),
        },
      };
    }),

  removePerson: (id) =>
    set((state) => {
      if (!state.currentGenogram) return state;
      return {
        currentGenogram: {
          ...state.currentGenogram,
          persons: state.currentGenogram.persons.filter((p) => p.id !== id),
          connections: state.currentGenogram.connections.filter(
            (c) => c.sourceId !== id && c.targetId !== id
          ),
          updatedAt: new Date(),
        },
        selectedPersonId: state.selectedPersonId === id ? null : state.selectedPersonId,
      };
    }),

  selectPerson: (id) => set({ selectedPersonId: id }),

  addConditionToPerson: (personId, conditionId) =>
    set((state) => {
      if (!state.currentGenogram) return state;
      return {
        currentGenogram: {
          ...state.currentGenogram,
          persons: state.currentGenogram.persons.map((p) =>
            p.id === personId && !p.attributes.conditions.includes(conditionId)
              ? {
                  ...p,
                  attributes: {
                    ...p.attributes,
                    conditions: [...p.attributes.conditions, conditionId],
                  },
                }
              : p
          ),
          updatedAt: new Date(),
        },
      };
    }),

  removeConditionFromPerson: (personId, conditionId) =>
    set((state) => {
      if (!state.currentGenogram) return state;
      return {
        currentGenogram: {
          ...state.currentGenogram,
          persons: state.currentGenogram.persons.map((p) =>
            p.id === personId
              ? {
                  ...p,
                  attributes: {
                    ...p.attributes,
                    conditions: p.attributes.conditions.filter((c) => c !== conditionId),
                  },
                }
              : p
          ),
          updatedAt: new Date(),
        },
      };
    }),

  addConnection: (connection) =>
    set((state) => {
      if (!state.currentGenogram) return state;
      return {
        currentGenogram: {
          ...state.currentGenogram,
          connections: [
            ...state.currentGenogram.connections,
            {
              ...connection,
              id: generateId('connection'),
            },
          ],
          updatedAt: new Date(),
        },
      };
    }),

  removeConnection: (id) =>
    set((state) => {
      if (!state.currentGenogram) return state;
      return {
        currentGenogram: {
          ...state.currentGenogram,
          connections: state.currentGenogram.connections.filter((c) => c.id !== id),
          updatedAt: new Date(),
        },
      };
    }),

  setViewMode: (mode) => set({ viewMode: mode }),

  setDraggingCondition: (isDragging, conditionId) =>
    set({ isDraggingCondition: isDragging, draggedConditionId: conditionId }),

  setConnectionMode: (enabled, firstId = null) =>
    set({ connectionMode: enabled, firstConnectionId: firstId }),
}));
