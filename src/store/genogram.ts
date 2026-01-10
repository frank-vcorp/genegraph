import { create } from 'zustand';
import { Person, Connection, Genogram, Gender, Status, PersonAttributes, generateId } from '@/types/genogram';
import { FirestoreService } from '@/lib/firestore-service';

interface GenogramStore {
  // Estado
  currentGenogram: Genogram | null;
  selectedPersonId: string | null;
  viewMode: 'classic' | 'modern';
  isDraggingCondition: boolean;
  draggedConditionId: string | null;
  connectionMode: boolean;
  firstConnectionId: string | null;
  currentUserId: string | null;
  isSyncing: boolean;

  // Acciones - Genograma
  setCurrentGenogram: (genogram: Genogram | null) => void;
  setCurrentUserId: (userId: string | null) => void;
  createNewGenogram: (userId: string, patientName: string) => void;
  saveToFirestore: (userId: string, genogramId: string) => Promise<void>;
  
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
  loadFromFirestore: (userId: string, genogramId: string) => Promise<void>;
}

export const useGenogramStore = create<GenogramStore>((set, get) => ({
  currentGenogram: null,
  selectedPersonId: null,
  viewMode: 'modern',
  isDraggingCondition: false,
  draggedConditionId: null,
  connectionMode: false,
  firstConnectionId: null,
  currentUserId: null,
  isSyncing: false,

  setCurrentGenogram: (genogram) => set({ currentGenogram: genogram }),

  setCurrentUserId: (userId) => set({ currentUserId: userId }),

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

  saveToFirestore: async (userId: string, genogramId: string) => {
    set({ isSyncing: true });
    try {
      const state = get();
      if (!state.currentGenogram) throw new Error('No genogram to save');

      // Save genogram metadata
      await FirestoreService.updateGenogram(userId, genogramId, {
        pacientName: state.currentGenogram.pacientName,
        updatedAt: new Date(),
      });

      // Save persons (simplified - in production, sync individual changes)
      // This is a batch-like operation
      const existingPersons = await FirestoreService.getPersons(userId, genogramId);
      const currentPersonIds = state.currentGenogram.persons.map(p => p.id);
      
      // Delete removed persons
      for (const person of existingPersons) {
        if (!currentPersonIds.includes(person.id)) {
          await FirestoreService.deletePerson(userId, genogramId, person.id);
        }
      }

      // Save/update all current persons
      for (const person of state.currentGenogram.persons) {
        await FirestoreService.updatePerson(userId, genogramId, person.id, person);
      }

      set({ isSyncing: false });
    } catch (error) {
      console.error('Error saving to Firestore:', error);
      set({ isSyncing: false });
      throw error;
    }
  },

  loadFromFirestore: async (userId: string, genogramId: string) => {
    set({ isSyncing: true });
    try {
      const genogram = await FirestoreService.getGenogram(userId, genogramId);
      if (!genogram) throw new Error('Genogram not found');

      const persons = await FirestoreService.getPersons(userId, genogramId);
      const relationships = await FirestoreService.getRelationships(userId, genogramId);

      set({
        currentGenogram: {
          ...genogram,
          persons,
          connections: relationships,
        },
        currentUserId: userId,
        isSyncing: false,
      });
    } catch (error) {
      console.error('Error loading from Firestore:', error);
      set({ isSyncing: false });
      throw error;
    }
  },

  addPerson: (person) =>
    set((state) => {
      if (!state.currentGenogram) return state;
      const newPerson = {
        ...person,
        id: generateId('person'),
      };
      
      // Auto-save to Firestore if user is logged in
      if (state.currentUserId && state.currentGenogram.id) {
        FirestoreService.addPerson(state.currentUserId, state.currentGenogram.id, person).catch(
          (error) => console.error('Error saving person to Firestore:', error)
        );
      }

      return {
        currentGenogram: {
          ...state.currentGenogram,
          persons: [
            ...state.currentGenogram.persons,
            newPerson,
          ],
          updatedAt: new Date(),
        },
      };
    }),

  updatePerson: (id, updates) =>
    set((state) => {
      if (!state.currentGenogram) return state;

      // Auto-save to Firestore if user is logged in
      if (state.currentUserId && state.currentGenogram.id) {
        FirestoreService.updatePerson(state.currentUserId, state.currentGenogram.id, id, updates).catch(
          (error) => console.error('Error updating person in Firestore:', error)
        );
      }

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

      // Auto-delete from Firestore if user is logged in
      if (state.currentUserId && state.currentGenogram.id) {
        FirestoreService.deletePerson(state.currentUserId, state.currentGenogram.id, id).catch(
          (error) => console.error('Error deleting person from Firestore:', error)
        );
      }

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
      const newConnection = {
        ...connection,
        id: generateId('connection'),
      };

      // Auto-save to Firestore if user is logged in
      if (state.currentUserId && state.currentGenogram.id) {
        FirestoreService.addRelationship(state.currentUserId, state.currentGenogram.id, connection).catch(
          (error) => console.error('Error saving relationship to Firestore:', error)
        );
      }

      return {
        currentGenogram: {
          ...state.currentGenogram,
          connections: [
            ...state.currentGenogram.connections,
            newConnection,
          ],
          updatedAt: new Date(),
        },
      };
    }),

  removeConnection: (id) =>
    set((state) => {
      if (!state.currentGenogram) return state;

      // Auto-delete from Firestore if user is logged in
      if (state.currentUserId && state.currentGenogram.id) {
        FirestoreService.deleteRelationship(state.currentUserId, state.currentGenogram.id, id).catch(
          (error) => console.error('Error deleting relationship from Firestore:', error)
        );
      }

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
