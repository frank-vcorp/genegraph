/**
 * History Management for Undo/Redo Functionality
 * 
 * Stores state snapshots and allows navigation through history.
 * Uses a simple timeline pattern with past/present/future states.
 */

import { Genogram } from '@/types/genogram';

export interface HistoryEntry {
  timestamp: number;
  genogram: Genogram;
  label: string; // e.g., "Added person", "Updated connection"
}

export interface HistoryState {
  past: HistoryEntry[];
  present: HistoryEntry | null;
  future: HistoryEntry[];
  maxHistorySize: number;
}

const MAX_HISTORY_SIZE = 100; // Límite de entradas para evitar consumo de memoria excesivo

/**
 * Crea un nuevo estado de history vacío
 */
export function createEmptyHistory(): HistoryState {
  return {
    past: [],
    present: null,
    future: [],
    maxHistorySize: MAX_HISTORY_SIZE,
  };
}

/**
 * Agrega una snapshot al history
 * Limpia el future (porque estamos haciendo una nueva acción)
 */
export function pushToHistory(
  history: HistoryState,
  genogram: Genogram | null,
  label: string
): HistoryState {
  if (!genogram) return history;

  // Si hay un present, moverl o al past
  const newPast = history.present
    ? [...history.past, history.present]
    : history.past;

  // Limitar el tamaño del history (eliminar del inicio si excede el límite)
  if (newPast.length > history.maxHistorySize) {
    newPast.shift();
  }

  return {
    ...history,
    past: newPast,
    present: {
      timestamp: Date.now(),
      genogram,
      label,
    },
    future: [], // Limpiar future al hacer una nueva acción
  };
}

/**
 * Realiza undo: mueve present al future, y past al present
 */
export function undo(history: HistoryState): HistoryState {
  if (history.past.length === 0) {
    return history; // No hay nada que deshacer
  }

  const newFuture = history.present
    ? [history.present, ...history.future]
    : history.future;

  const newPresent = history.past[history.past.length - 1];
  const newPast = history.past.slice(0, -1);

  return {
    ...history,
    past: newPast,
    present: newPresent,
    future: newFuture,
  };
}

/**
 * Realiza redo: mueve future al present, y present al past
 */
export function redo(history: HistoryState): HistoryState {
  if (history.future.length === 0) {
    return history; // No hay nada que rehacer
  }

  const newPast = history.present
    ? [...history.past, history.present]
    : history.past;

  const newPresent = history.future[0];
  const newFuture = history.future.slice(1);

  return {
    ...history,
    past: newPast,
    present: newPresent,
    future: newFuture,
  };
}

/**
 * Limpia todo el history
 */
export function clearHistory(history: HistoryState): HistoryState {
  return {
    ...history,
    past: [],
    present: history.present,
    future: [],
  };
}

/**
 * Obtiene información del state del history para debug/UI
 */
export function getHistoryInfo(history: HistoryState) {
  return {
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    pastLength: history.past.length,
    futureLength: history.future.length,
    presentLabel: history.present?.label || 'Initial',
  };
}

/**
 * Obtiene una lista de las últimas N entradas del history (para UI de debugger)
 */
export function getHistoryTimeline(history: HistoryState, limit: number = 10) {
  const allEntries = [
    ...history.past,
    history.present ? { ...history.present, current: true } : null,
  ].filter(Boolean);
  
  // Aplicar límite a toda la lista
  const timeline = allEntries.slice(-limit);
  
  return timeline.map((entry, index) => ({
    index,
    label: (entry as HistoryEntry)?.label,
    timestamp: (entry as HistoryEntry)?.timestamp,
    isCurrent: (entry as any)?.current ?? false,
  }));
}
