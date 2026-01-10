/**
 * useOnlineSync Hook - Sincronización al Recuperar Conexión
 * 🏗️ CP-010: Detecta cuando vuelve la conexión y sincroniza datos offline
 */

'use client';

import { useEffect, useState } from 'react';
import { useGenogramStore } from '@/store/genogram';
import { IndexedDBService } from '@/lib/indexeddb-service';
import { FirestoreService } from '@/lib/firestore-service';

export function useOnlineSync() {
  const { currentGenogram, currentUserId } = useGenogramStore();
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof window !== 'undefined' ? navigator.onLine : true
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncError(null);
      console.log('📡 Conexión recuperada - iniciando sincronización...');
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('📴 Sin conexión - cambios serán sincronizados después');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync when coming back online
  useEffect(() => {
    if (!isOnline || !currentUserId || !currentGenogram || isSyncing) return;

    const syncPendingChanges = async () => {
      try {
        setIsSyncing(true);
        setSyncError(null);

        // Get pending operations from sync queue
        const syncQueue = await IndexedDBService.getSyncQueue();

        if (syncQueue.length === 0) {
          console.log('✅ No hay cambios pendientes');
          setIsSyncing(false);
          return;
        }

        console.log(`⏳ Sincronizando ${syncQueue.length} operaciones...`);

        // Execute sync queue operations
        for (const operation of syncQueue) {
          try {
            switch (operation.type) {
              case 'create':
              case 'update':
                if (operation.collection === 'persons') {
                  await FirestoreService.updatePerson(
                    currentUserId,
                    currentGenogram.id,
                    operation.data.id,
                    operation.data
                  );
                } else if (operation.collection === 'relationships') {
                  await FirestoreService.addRelationship(
                    currentUserId,
                    currentGenogram.id,
                    operation.data
                  );
                }
                break;
              case 'delete':
                if (operation.collection === 'persons') {
                  await FirestoreService.deletePerson(
                    currentUserId,
                    currentGenogram.id,
                    operation.data.id
                  );
                } else if (operation.collection === 'relationships') {
                  await FirestoreService.deleteRelationship(
                    currentUserId,
                    currentGenogram.id,
                    operation.data.id
                  );
                }
                break;
            }
          } catch (opError) {
            console.error(`Error sincronizan operación:`, opError);
            // Continue with other operations instead of failing completely
          }
        }

        // Clear sync queue after all operations succeed
        await IndexedDBService.clearSyncQueue();
        console.log('✅ Sincronización completada');
        setIsSyncing(false);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        setSyncError(errorMessage);
        console.error('Error durante sincronización:', error);
        setIsSyncing(false);
      }
    };

    // Delay sync slightly to ensure connection is stable
    const timeoutId = setTimeout(syncPendingChanges, 1000);
    return () => clearTimeout(timeoutId);
  }, [isOnline, currentUserId, currentGenogram, isSyncing]);

  return {
    isOnline,
    isSyncing,
    syncError,
  };
}
