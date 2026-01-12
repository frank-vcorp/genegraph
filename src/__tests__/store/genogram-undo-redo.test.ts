/**
 * Tests for Undo/Redo History State Management
 * 
 * NOTE: These tests verify the history system state management.
 * They test the core undo/redo logic without relying on full store integration.
 */

import { describe, it, expect } from 'vitest';
import { 
  HistoryState, 
  createEmptyHistory, 
  pushToHistory, 
  undo, 
  redo, 
  getHistoryInfo 
} from '@/store/history';
import { Genogram } from '@/types/genogram';

// Helper to create minimal mock genogram
const createMockGenogram = (id: string, persons: number = 0): Genogram => ({
  id,
  userId: 'user-123',
  pacientName: 'Test',
  createdAt: new Date(),
  updatedAt: new Date(),
  persons: Array(persons).fill(null).map((_, i) => ({
    id: `p${i}`,
    name: `Person ${i}`,
    firstName: 'P',
    lastName: String(i),
    gender: 'male' as const,
    generation: 1,
    position: { x: 0, y: 0 },
    attributes: {
      status: 'living' as const,
      isTwin: false,
      isPrimaryPatient: false,
    },
    medicalConditions: [],
  })),
  relationships: [],
  connections: [],
  metadata: {},
});

describe('Undo/Redo Store Integration', () => {
  describe('History Timeline Simulation', () => {
    it('should track state changes through actions', () => {
      let history = createEmptyHistory();

      // Simulate adding 3 persons
      const g1 = createMockGenogram('g1', 1);
      history = pushToHistory(history, g1, 'Added person 1');

      const g2 = createMockGenogram('g2', 2);
      history = pushToHistory(history, g2, 'Added person 2');

      const g3 = createMockGenogram('g3', 3);
      history = pushToHistory(history, g3, 'Added person 3');

      // Verify final state
      const info = getHistoryInfo(history);
      expect(info.canUndo).toBe(true);
      expect(info.canRedo).toBe(false);
      expect(info.pastLength).toBe(2);
      expect(history.present?.genogram.persons).toHaveLength(3);
    });

    it('should support full undo/redo workflow', () => {
      let history = createEmptyHistory();

      // Build history: add 3 persons
      const g1 = createMockGenogram('g1', 1);
      const g2 = createMockGenogram('g2', 2);
      const g3 = createMockGenogram('g3', 3);

      history = pushToHistory(history, g1, 'Add person 1');
      history = pushToHistory(history, g2, 'Add person 2');
      history = pushToHistory(history, g3, 'Add person 3');

      // Verify state after 3 additions
      expect(history.present?.genogram.persons).toHaveLength(3);
      expect(getHistoryInfo(history).canUndo).toBe(true);
      expect(getHistoryInfo(history).canRedo).toBe(false);

      // Undo 2 steps
      history = undo(history);
      history = undo(history);
      expect(history.present?.genogram.persons).toHaveLength(1);

      // Redo 1 step
      history = redo(history);
      expect(history.present?.genogram.persons).toHaveLength(2);

      // Add new action (clears future)
      const g4 = createMockGenogram('g4', 2); // Same as g2 for simplicity
      history = pushToHistory(history, g4, 'Add person again');
      expect(getHistoryInfo(history).canRedo).toBe(false);
    });

    it('should handle branching history correctly', () => {
      let history = createEmptyHistory();

      // Build timeline: A -> B -> C
      const gA = createMockGenogram('a', 1);
      const gB = createMockGenogram('b', 2);
      const gC = createMockGenogram('c', 3);

      history = pushToHistory(history, gA, 'Step A');
      history = pushToHistory(history, gB, 'Step B');
      history = pushToHistory(history, gC, 'Step C');

      // Go back to B
      history = undo(history);
      expect(history.present?.genogram.id).toBe('b');
      expect(getHistoryInfo(history).canRedo).toBe(true);

      // Take different path: B -> D (not C)
      const gD = createMockGenogram('d', 4);
      history = pushToHistory(history, gD, 'Step D (alternative)');

      // Verify C is no longer in future
      expect(getHistoryInfo(history).canRedo).toBe(false);
      expect(getHistoryInfo(history).futureLength).toBe(0);
      expect(history.present?.genogram.id).toBe('d');
    });

    it('should respect maxHistorySize limits', () => {
      let history = createEmptyHistory();
      history.maxHistorySize = 5;

      // Add 10 genograms
      for (let i = 0; i < 10; i++) {
        const g = createMockGenogram(`g${i}`, i);
        history = pushToHistory(history, g, `Step ${i}`);
      }

      // Past should not exceed maxHistorySize
      expect(history.past.length).toBeLessThanOrEqual(history.maxHistorySize);
      expect(history.present?.genogram.id).toBe('g9');
    });

    it('should clear future on new action', () => {
      let history = createEmptyHistory();

      const g1 = createMockGenogram('g1', 1);
      const g2 = createMockGenogram('g2', 2);
      const g3 = createMockGenogram('g3', 3);
      const g4 = createMockGenogram('g4', 4);

      // Build A -> B -> C
      history = pushToHistory(history, g1, 'A');
      history = pushToHistory(history, g2, 'B');
      history = pushToHistory(history, g3, 'C');

      // Undo to B
      history = undo(history);
      expect(history.future).toHaveLength(1); // Future has C

      // Add D (should clear future)
      history = pushToHistory(history, g4, 'D');
      expect(history.future).toHaveLength(0);
      expect(history.present?.genogram.id).toBe('g4');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty history gracefully', () => {
      let history = createEmptyHistory();

      // Try undo on empty
      history = undo(history);
      expect(history.present).toBeNull();
      expect(history.past).toHaveLength(0);

      // Try redo on empty
      history = redo(history);
      expect(history.present).toBeNull();
      expect(history.future).toHaveLength(0);
    });

    it('should handle single entry history', () => {
      let history = createEmptyHistory();

      const g1 = createMockGenogram('g1', 1);
      history = pushToHistory(history, g1, 'First');

      // Can't undo from first entry
      const before = history;
      history = undo(history);
      expect(history).toEqual(before);
      expect(history.past).toHaveLength(0);

      // Can't redo
      history = redo(history);
      expect(history).toEqual(before);
      expect(history.future).toHaveLength(0);
    });

    it('should handle null genogram gracefully', () => {
      let history = createEmptyHistory();

      // Push null should not change history
      history = pushToHistory(history, null, 'Null action');
      expect(history.present).toBeNull();
      expect(history.past).toHaveLength(0);
    });

    it('should support multiple undo/redo cycles', () => {
      let history = createEmptyHistory();

      const g1 = createMockGenogram('g1', 1);
      const g2 = createMockGenogram('g2', 2);

      history = pushToHistory(history, g1, 'A');
      history = pushToHistory(history, g2, 'B');

      // Cycle: undo -> redo -> undo -> redo
      history = undo(history);
      history = redo(history);
      history = undo(history);
      history = redo(history);

      expect(history.present?.genogram.id).toBe('g2');
      expect(getHistoryInfo(history).canUndo).toBe(true);
      expect(getHistoryInfo(history).canRedo).toBe(false);
    });
  });
});
