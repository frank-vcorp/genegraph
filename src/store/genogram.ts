import { create } from 'zustand';
import { Person, Connection, Genogram, Gender, Status, PersonAttributes, generateId, MedicalCondition, DatePrecision } from '@/types/genogram';
import { FirestoreService } from '@/lib/firestore-service';
import { HistoryState, createEmptyHistory, pushToHistory, undo as undoHistory, redo as redoHistory, getHistoryInfo } from './history';

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
  history: HistoryState;
  canUndo: boolean;
  canRedo: boolean;

  // Acciones - Genograma
  setCurrentGenogram: (genogram: Genogram | null) => void;
  setCurrentUserId: (userId: string | null) => void;
  createNewGenogram: (userId: string, patientName: string) => void;
  saveToFirestore: (userId: string, genogramId: string) => Promise<void>;
  loadFromFirestore: (userId: string, genogramId: string) => Promise<void>;
  
  // Acciones - Personas (Core CRUD)
  addPerson: (person: Omit<Person, 'id'>) => void;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  removePerson: (id: string) => void;
  selectPerson: (id: string | null) => void;
  
  // Acciones - Personas (Granulares)
  setPersonGender: (personId: string, gender: Gender) => void;
  setPersonGeneration: (personId: string, generation: number) => void;
  setPersonStatus: (personId: string, status: Status) => void;
  setPersonName: (personId: string, name: string) => void;
  setTwinStatus: (personId: string, isTwin: boolean) => void;
  setBirthDate: (personId: string, date: string, precision: DatePrecision) => void;
  setDeathDate: (personId: string, date: string, precision: DatePrecision) => void;
  setPersonPrimaryPatient: (personId: string, isPrimary: boolean) => void;
  
  // Acciones - Condiciones Médicas (Granulares)
  addMedicalCondition: (personId: string, condition: MedicalCondition) => void;
  updateMedicalCondition: (personId: string, conditionId: string, updates: Partial<MedicalCondition>) => void;
  removeMedicalCondition: (personId: string, conditionId: string) => void;
  addConditionToPerson: (personId: string, conditionId: string) => void; // Legacy
  removeConditionFromPerson: (personId: string, conditionId: string) => void; // Legacy
  
  // Acciones - Conexiones
  addConnection: (connection: Omit<Connection, 'id'>) => void;
  removeConnection: (id: string) => void;
  
  // Acciones - UI
  setViewMode: (mode: 'classic' | 'modern') => void;
  setDraggingCondition: (isDragging: boolean, conditionId: string | null) => void;
  setConnectionMode: (enabled: boolean, firstId?: string | null) => void;
  
  // Acciones - History (Undo/Redo)
  undo: () => void;
  redo: () => void;
  pushHistory: (label: string) => void;
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
  history: createEmptyHistory(),
  canUndo: false,
  canRedo: false,

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
        relationships: [],
        connections: [],
        metadata: {},
      },
    }),

  saveToFirestore: async (userId: string, genogramId: string) => {
    set({ isSyncing: true });
    try {
      const state = get();
      if (!state.currentGenogram) throw new Error('No genogram to save');

      await FirestoreService.batchSaveGenogram(userId, state.currentGenogram);

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

  // ============ ACCIONES PERSONAS - CORE CRUD ============

  addPerson: (person) =>
    set((state) => {
      if (!state.currentGenogram) return state;
      const newPerson = {
        ...person,
        id: generateId('person'),
      };
      
      if (state.currentUserId && state.currentGenogram.id) {
        FirestoreService.addPerson(state.currentUserId, state.currentGenogram.id, person).catch(
          (error) => console.error('Error saving person to Firestore:', error)
        );
      }

      const updatedGenogram = {
        ...state.currentGenogram,
        persons: [
          ...state.currentGenogram.persons,
          newPerson,
        ],
        updatedAt: new Date(),
      };

      // Registrar en history después del cambio
      const newHistory = pushToHistory(state.history, updatedGenogram, `Added person: ${newPerson.name}`);
      const historyInfo = getHistoryInfo(newHistory);

      return {
        currentGenogram: updatedGenogram,
        history: newHistory,
        canUndo: historyInfo.canUndo,
        canRedo: historyInfo.canRedo,
      };
    }),

  updatePerson: (id, updates) =>
    set((state) => {
      if (!state.currentGenogram) return state;

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

      if (state.currentUserId && state.currentGenogram.id) {
        FirestoreService.deletePerson(state.currentUserId, state.currentGenogram.id, id).catch(
          (error) => console.error('Error deleting person from Firestore:', error)
        );
      }

      const updatedGenogram = {
        ...state.currentGenogram,
        persons: state.currentGenogram.persons.filter((p) => p.id !== id),
        connections: state.currentGenogram.connections.filter(
          (c) => c.sourceId !== id && c.targetId !== id
        ),
        updatedAt: new Date(),
      };

      // Registrar en history después del cambio
      const newHistory = pushToHistory(state.history, updatedGenogram, `Removed person: ${id}`);
      const historyInfo = getHistoryInfo(newHistory);

      return {
        currentGenogram: updatedGenogram,
        selectedPersonId: state.selectedPersonId === id ? null : state.selectedPersonId,
        history: newHistory,
        canUndo: historyInfo.canUndo,
        canRedo: historyInfo.canRedo,
      };
    }),

  selectPerson: (id) => set({ selectedPersonId: id }),

  // ============ ACCIONES PERSONAS - GRANULARES ============

  setPersonGender: (personId, gender) =>
    get().updatePerson(personId, { gender }),

  setPersonGeneration: (personId, generation) =>
    get().updatePerson(personId, { generation }),

  setPersonStatus: (personId, status) =>
    get().updatePerson(personId, {
      attributes: {
        ...get().currentGenogram?.persons.find(p => p.id === personId)?.attributes,
        status,
      } as PersonAttributes,
    }),

  setPersonName: (personId, name) =>
    get().updatePerson(personId, { name }),

  setTwinStatus: (personId, isTwin) =>
    get().updatePerson(personId, {
      attributes: {
        ...get().currentGenogram?.persons.find(p => p.id === personId)?.attributes,
        isTwin,
      } as PersonAttributes,
    }),

  setBirthDate: (personId, date, precision) =>
    get().updatePerson(personId, {
      birthDate: { date, precision },
    }),

  setDeathDate: (personId, date, precision) =>
    get().updatePerson(personId, {
      deathDate: { date, precision },
    }),

  setPersonPrimaryPatient: (personId, isPrimary) =>
    get().updatePerson(personId, {
      attributes: {
        ...get().currentGenogram?.persons.find(p => p.id === personId)?.attributes,
        isPrimaryPatient: isPrimary,
      } as PersonAttributes,
    }),

  // ============ ACCIONES CONDICIONES MÉDICAS ============

  addMedicalCondition: (personId, condition) =>
    set((state) => {
      if (!state.currentGenogram) return state;

      return {
        currentGenogram: {
          ...state.currentGenogram,
          persons: state.currentGenogram.persons.map((p) =>
            p.id === personId
              ? {
                  ...p,
                  medicalConditions: [
                    ...p.medicalConditions,
                    { ...condition, id: condition.id || generateId('condition') },
                  ],
                }
              : p
          ),
          updatedAt: new Date(),
        },
      };
    }),

  updateMedicalCondition: (personId, conditionId, updates) =>
    set((state) => {
      if (!state.currentGenogram) return state;

      return {
        currentGenogram: {
          ...state.currentGenogram,
          persons: state.currentGenogram.persons.map((p) =>
            p.id === personId
              ? {
                  ...p,
                  medicalConditions: p.medicalConditions.map((c) =>
                    c.id === conditionId ? { ...c, ...updates } : c
                  ),
                }
              : p
          ),
          updatedAt: new Date(),
        },
      };
    }),

  removeMedicalCondition: (personId, conditionId) =>
    set((state) => {
      if (!state.currentGenogram) return state;

      return {
        currentGenogram: {
          ...state.currentGenogram,
          persons: state.currentGenogram.persons.map((p) =>
            p.id === personId
              ? {
                  ...p,
                  medicalConditions: p.medicalConditions.filter((c) => c.id !== conditionId),
                }
              : p
          ),
          updatedAt: new Date(),
        },
      };
    }),

  // Legacy methods (mantener para backward compatibility)
  addConditionToPerson: (personId, conditionId) =>
    set((state) => {
      if (!state.currentGenogram) return state;
      return {
        currentGenogram: {
          ...state.currentGenogram,
          persons: state.currentGenogram.persons.map((p) =>
            p.id === personId && !p.medicalConditions.some(c => c.id === conditionId)
              ? {
                  ...p,
                  medicalConditions: [
                    ...p.medicalConditions,
                    {
                      id: generateId('condition'),
                      code: conditionId,
                      name: conditionId,
                      status: 'active',
                    },
                  ],
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
                  medicalConditions: p.medicalConditions.filter((c) => c.id !== conditionId),
                }
              : p
          ),
          updatedAt: new Date(),
        },
      };
    }),

  // ============ ACCIONES CONEXIONES ============

  addConnection: (connection) =>
    set((state) => {
      if (!state.currentGenogram) return state;
      const newConnection = {
        ...connection,
        id: generateId('connection'),
      };

      if (state.currentUserId && state.currentGenogram.id) {
        FirestoreService.addRelationship(state.currentUserId, state.currentGenogram.id, connection).catch(
          (error) => console.error('Error saving relationship to Firestore:', error)
        );
      }

      const updatedGenogram = {
        ...state.currentGenogram,
        connections: [
          ...state.currentGenogram.connections,
          newConnection,
        ],
        updatedAt: new Date(),
      };

      // Registrar en history después del cambio
      const newHistory = pushToHistory(state.history, updatedGenogram, `Added relationship`);
      const historyInfo = getHistoryInfo(newHistory);

      return {
        currentGenogram: updatedGenogram,
        history: newHistory,
        canUndo: historyInfo.canUndo,
        canRedo: historyInfo.canRedo,
      };
    }),

  removeConnection: (id) =>
    set((state) => {
      if (!state.currentGenogram) return state;

      if (state.currentUserId && state.currentGenogram.id) {
        FirestoreService.deleteRelationship(state.currentUserId, state.currentGenogram.id, id).catch(
          (error) => console.error('Error deleting relationship from Firestore:', error)
        );
      }

      const updatedGenogram = {
        ...state.currentGenogram,
        connections: state.currentGenogram.connections.filter((c) => c.id !== id),
        updatedAt: new Date(),
      };

      // Registrar en history después del cambio
      const newHistory = pushToHistory(state.history, updatedGenogram, `Removed relationship: ${id}`);
      const historyInfo = getHistoryInfo(newHistory);

      return {
        currentGenogram: updatedGenogram,
        history: newHistory,
        canUndo: historyInfo.canUndo,
        canRedo: historyInfo.canRedo,
      };
    }),

  // ============ ACCIONES UI ============

  setViewMode: (mode) => set({ viewMode: mode }),

  setDraggingCondition: (isDragging, conditionId) =>
    set({ isDraggingCondition: isDragging, draggedConditionId: conditionId }),

  setConnectionMode: (enabled, firstId = null) =>
    set({ connectionMode: enabled, firstConnectionId: firstId }),

  // ============ ACCIONES HISTORY (UNDO/REDO) ============

  /**
   * Deshacer la última acción
   * Restaura el genogram al estado anterior del history
   */
  undo: () =>
    set((state) => {
      const newHistory = undoHistory(state.history);
      const historyInfo = getHistoryInfo(newHistory);
      
      return {
        history: newHistory,
        currentGenogram: newHistory.present?.genogram ?? null,
        canUndo: historyInfo.canUndo,
        canRedo: historyInfo.canRedo,
      };
    }),

  /**
   * Rehacer la última acción desecha
   * Restaura el genogram al estado siguiente del history
   */
  redo: () =>
    set((state) => {
      const newHistory = redoHistory(state.history);
      const historyInfo = getHistoryInfo(newHistory);
      
      return {
        history: newHistory,
        currentGenogram: newHistory.present?.genogram ?? null,
        canUndo: historyInfo.canUndo,
        canRedo: historyInfo.canRedo,
      };
    }),

  /**
   * Agregar un snapshot al history
   * Se llama después de cambios significativos (add/update/remove)
   * @param label Descripción de la acción para UI
   */
  pushHistory: (label: string) =>
    set((state) => {
      if (!state.currentGenogram) return state;
      
      const newHistory = pushToHistory(state.history, state.currentGenogram, label);
      const historyInfo = getHistoryInfo(newHistory);

      return {
        history: newHistory,
        canUndo: historyInfo.canUndo,
        canRedo: historyInfo.canRedo,
      };
    }),
}));
