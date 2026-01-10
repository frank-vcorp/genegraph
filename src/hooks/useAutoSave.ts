/**
 * useAutoSave Hook for Local Persistence
 * 🏗️ ARCH REFERENCE: CP-009-Local-Persistence
 * Automatically saves genogram to IndexedDB with debouncing
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { useGenogramStore } from '@/store/genogram';
import { IndexedDBService } from '@/lib/indexeddb-service';

interface AutoSaveConfig {
  debounceMs?: number;
  enabled?: boolean;
}

export function useAutoSave(config: AutoSaveConfig = {}) {
  const { debounceMs = 5000, enabled = true } = config;
  const { currentGenogram } = useGenogramStore();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || !currentGenogram) return;

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for debounced save
    timeoutRef.current = setTimeout(async () => {
      try {
        setIsSaving(true);
        setError(null);

        // Save genogram to IndexedDB
        await IndexedDBService.saveGenogram(currentGenogram);

        // Save all persons
        for (const person of currentGenogram.persons) {
          await IndexedDBService.savePerson(currentGenogram.id, person);
        }

        // Save all relationships
        for (const relationship of currentGenogram.connections) {
          await IndexedDBService.saveRelationship(currentGenogram.id, relationship);
        }

        setLastSaved(new Date());
        setIsSaving(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error saving to IndexedDB';
        setError(errorMessage);
        console.error('Auto-save error:', err);
        setIsSaving(false);
      }
    }, debounceMs);

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentGenogram, debounceMs, enabled]);

  return {
    isSaving,
    lastSaved,
    error,
  };
}
