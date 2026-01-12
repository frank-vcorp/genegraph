/**
 * Tests for History Management Module
 * 
 * Verifies undo/redo state transitions, history limits, and edge cases
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  HistoryState,
  createEmptyHistory,
  pushToHistory,
  undo,
  redo,
  clearHistory,
  getHistoryInfo,
  getHistoryTimeline,
} from '@/store/history';
import { Genogram } from '@/types/genogram';

// Mock genogram
const createMockGenogram = (id: string, patientName: string = 'Test'): Genogram => ({
  id,
  userId: 'user-123',
  pacientName: patientName,
  createdAt: new Date(),
  updatedAt: new Date(),
  persons: [],
  relationships: [],
  connections: [],
  metadata: {},
});

describe('History Management', () => {
  let history: HistoryState;

  beforeEach(() => {
    history = createEmptyHistory();
  });

  describe('createEmptyHistory', () => {
    it('should create empty history with correct defaults', () => {
      expect(history.past).toEqual([]);
      expect(history.present).toBeNull();
      expect(history.future).toEqual([]);
      expect(history.maxHistorySize).toBe(100);
    });
  });

  describe('pushToHistory', () => {
    it('should add first entry to present', () => {
      const genogram = createMockGenogram('g1');
      history = pushToHistory(history, genogram, 'Initial');

      expect(history.present).not.toBeNull();
      expect(history.present?.label).toBe('Initial');
      expect(history.present?.genogram.id).toBe('g1');
      expect(history.past).toHaveLength(0);
      expect(history.future).toHaveLength(0);
    });

    it('should move present to past and add new entry', () => {
      const g1 = createMockGenogram('g1');
      const g2 = createMockGenogram('g2');

      history = pushToHistory(history, g1, 'Action 1');
      expect(history.past).toHaveLength(0);
      expect(history.present?.genogram.id).toBe('g1');

      history = pushToHistory(history, g2, 'Action 2');
      expect(history.past).toHaveLength(1);
      expect(history.past[0].genogram.id).toBe('g1');
      expect(history.present?.genogram.id).toBe('g2');
      expect(history.future).toHaveLength(0); // Future cleared
    });

    it('should clear future when pushing new entry', () => {
      const g1 = createMockGenogram('g1');
      const g2 = createMockGenogram('g2');
      const g3 = createMockGenogram('g3');

      // Build history: g1 -> g2 -> g3
      history = pushToHistory(history, g1, 'A1');
      history = pushToHistory(history, g2, 'A2');
      history = pushToHistory(history, g3, 'A3');

      // Undo to g2, moving g3 to future
      history = undo(history);
      expect(history.future).toHaveLength(1);

      // Push new action should clear future
      const g4 = createMockGenogram('g4');
      history = pushToHistory(history, g4, 'A4');
      expect(history.future).toHaveLength(0);
      expect(history.past).toHaveLength(2); // g1, g2
      expect(history.present?.genogram.id).toBe('g4');
    });

    it('should limit history size to maxHistorySize', () => {
      let h = createEmptyHistory();
      h = {
        ...h,
        maxHistorySize: 3,
      };

      for (let i = 0; i < 5; i++) {
        const g = createMockGenogram(`g${i}`, `Patient ${i}`);
        h = pushToHistory(h, g, `Action ${i}`);
      }

      // Con maxHistorySize=3, past puede tener hasta 3 entradas
      // Después de 5 pushes: past=[g1, g2, g3], present=g4
      expect(h.past.length).toBe(3);
      expect(h.present?.genogram.id).toBe('g4');
      // Check oldest entry was removed
      expect(h.past[0].genogram.pacientName).toBe('Patient 1');
    });

    it('should handle null genogram gracefully', () => {
      history = pushToHistory(history, null, 'Null action');
      expect(history.present).toBeNull();
      expect(history.past).toHaveLength(0);
    });
  });

  describe('undo', () => {
    it('should restore previous state from past', () => {
      const g1 = createMockGenogram('g1');
      const g2 = createMockGenogram('g2');

      history = pushToHistory(history, g1, 'A1');
      history = pushToHistory(history, g2, 'A2');

      history = undo(history);
      expect(history.present?.genogram.id).toBe('g1');
      expect(history.future[0].genogram.id).toBe('g2');
    });

    it('should do nothing if no past entries', () => {
      const g1 = createMockGenogram('g1');
      history = pushToHistory(history, g1, 'A1');

      const oldHistory = history;
      history = undo(history);
      expect(history).toEqual(oldHistory);
    });

    it('should handle multiple undos', () => {
      const g1 = createMockGenogram('g1');
      const g2 = createMockGenogram('g2');
      const g3 = createMockGenogram('g3');

      history = pushToHistory(history, g1, 'A1');
      history = pushToHistory(history, g2, 'A2');
      history = pushToHistory(history, g3, 'A3');

      history = undo(history);
      expect(history.present?.genogram.id).toBe('g2');

      history = undo(history);
      expect(history.present?.genogram.id).toBe('g1');

      // No more past, so undo does nothing
      const historyBefore = history;
      history = undo(history);
      expect(history).toEqual(historyBefore);
      expect(history.present?.genogram.id).toBe('g1');
    });
  });

  describe('redo', () => {
    it('should restore future state', () => {
      const g1 = createMockGenogram('g1');
      const g2 = createMockGenogram('g2');

      history = pushToHistory(history, g1, 'A1');
      history = pushToHistory(history, g2, 'A2');
      history = undo(history);

      history = redo(history);
      expect(history.present?.genogram.id).toBe('g2');
      expect(history.past[0].genogram.id).toBe('g1');
      expect(history.future).toHaveLength(0);
    });

    it('should do nothing if no future entries', () => {
      const g1 = createMockGenogram('g1');
      history = pushToHistory(history, g1, 'A1');

      const oldHistory = history;
      history = redo(history);
      expect(history).toEqual(oldHistory);
    });

    it('should handle multiple redos', () => {
      const g1 = createMockGenogram('g1');
      const g2 = createMockGenogram('g2');
      const g3 = createMockGenogram('g3');

      history = pushToHistory(history, g1, 'A1');
      history = pushToHistory(history, g2, 'A2');
      history = pushToHistory(history, g3, 'A3');

      // Undo twice to get back to g1
      history = undo(history);
      history = undo(history);
      expect(history.present?.genogram.id).toBe('g1');
      expect(history.future.length).toBe(2); // g2, g3

      history = redo(history);
      expect(history.present?.genogram.id).toBe('g2');

      history = redo(history);
      expect(history.present?.genogram.id).toBe('g3');

      // No more future, so redo does nothing
      const historyBefore = history;
      history = redo(history);
      expect(history).toEqual(historyBefore);
      expect(history.present?.genogram.id).toBe('g3');
    });
  });

  describe('clearHistory', () => {
    it('should clear past and future but keep present', () => {
      const g1 = createMockGenogram('g1');
      const g2 = createMockGenogram('g2');

      history = pushToHistory(history, g1, 'A1');
      history = pushToHistory(history, g2, 'A2');

      history = clearHistory(history);
      expect(history.past).toHaveLength(0);
      expect(history.future).toHaveLength(0);
      expect(history.present?.genogram.id).toBe('g2');
    });
  });

  describe('getHistoryInfo', () => {
    it('should report correct flags for empty history', () => {
      const info = getHistoryInfo(history);
      expect(info.canUndo).toBe(false);
      expect(info.canRedo).toBe(false);
      expect(info.pastLength).toBe(0);
      expect(info.futureLength).toBe(0);
    });

    it('should report canUndo after push', () => {
      const g1 = createMockGenogram('g1');
      history = pushToHistory(history, g1, 'A1');

      const info = getHistoryInfo(history);
      expect(info.canUndo).toBe(false); // No past yet
      expect(info.canRedo).toBe(false);
    });

    it('should report canUndo after multiple pushes', () => {
      const g1 = createMockGenogram('g1');
      const g2 = createMockGenogram('g2');

      history = pushToHistory(history, g1, 'A1');
      history = pushToHistory(history, g2, 'A2');

      const info = getHistoryInfo(history);
      expect(info.canUndo).toBe(true);
      expect(info.canRedo).toBe(false);
      expect(info.pastLength).toBe(1);
    });

    it('should report canRedo after undo', () => {
      const g1 = createMockGenogram('g1');
      const g2 = createMockGenogram('g2');
      const g3 = createMockGenogram('g3');

      history = pushToHistory(history, g1, 'A1');
      history = pushToHistory(history, g2, 'A2');
      history = pushToHistory(history, g3, 'A3');
      history = undo(history);

      const info = getHistoryInfo(history);
      expect(info.canUndo).toBe(true); // past has g1 and g2
      expect(info.canRedo).toBe(true); // future has g3
      expect(info.futureLength).toBe(1);
    });
  });

  describe('getHistoryTimeline', () => {
    it('should return timeline of history entries', () => {
      const g1 = createMockGenogram('g1');
      const g2 = createMockGenogram('g2');

      history = pushToHistory(history, g1, 'Action 1');
      history = pushToHistory(history, g2, 'Action 2');

      const timeline = getHistoryTimeline(history, 10);
      expect(timeline).toHaveLength(2);
      expect(timeline[0].label).toBe('Action 1');
      expect(timeline[1].label).toBe('Action 2');
      expect(timeline[1].isCurrent).toBe(true);
    });

    it('should limit timeline to specified size', () => {
      let h = createEmptyHistory();

      for (let i = 0; i < 5; i++) {
        const g = createMockGenogram(`g${i}`);
        h = pushToHistory(h, g, `Action ${i}`);
      }

      const timeline = getHistoryTimeline(h, 2);
      expect(timeline).toHaveLength(2);
      expect(timeline[0].label).toBe('Action 3');
      expect(timeline[1].label).toBe('Action 4');
      expect(timeline[1].isCurrent).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should handle undo/redo cycles correctly', () => {
      const g1 = createMockGenogram('g1');
      const g2 = createMockGenogram('g2');
      const g3 = createMockGenogram('g3');

      history = pushToHistory(history, g1, 'A1');
      history = pushToHistory(history, g2, 'A2');
      history = pushToHistory(history, g3, 'A3');

      // Undo twice
      history = undo(history);
      history = undo(history);
      expect(history.present?.genogram.id).toBe('g1');

      // Redo once
      history = redo(history);
      expect(history.present?.genogram.id).toBe('g2');

      // Undo and push new (should discard future)
      history = undo(history);
      const g4 = createMockGenogram('g4');
      history = pushToHistory(history, g4, 'A4');

      expect(history.present?.genogram.id).toBe('g4');
      expect(history.future).toHaveLength(0); // g3 discarded
    });

    it('should handle alternating undo/redo', () => {
      const g1 = createMockGenogram('g1');
      const g2 = createMockGenogram('g2');

      history = pushToHistory(history, g1, 'A1');
      history = pushToHistory(history, g2, 'A2');

      // Undo, redo, undo, redo...
      history = undo(history);
      expect(history.present?.genogram.id).toBe('g1');

      history = redo(history);
      expect(history.present?.genogram.id).toBe('g2');

      history = undo(history);
      expect(history.present?.genogram.id).toBe('g1');

      history = redo(history);
      expect(history.present?.genogram.id).toBe('g2');

      const info = getHistoryInfo(history);
      expect(info.canUndo).toBe(true);
      expect(info.canRedo).toBe(false);
    });
  });
});
