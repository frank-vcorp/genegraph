/**
 * IndexedDB Service for Local Persistence
 * 🏗️ ARCH REFERENCE: CP-009-Local-Persistence
 * Handles offline storage and sync-on-reconnect
 */

import { Genogram, Person, Connection } from '@/types/genogram';

const DB_NAME = 'GenoGraph-Pro';
const DB_VERSION = 1;
const STORE_GENOGRAMS = 'genograms';
const STORE_PERSONS = 'persons';
const STORE_RELATIONSHIPS = 'relationships';
const STORE_SYNC_QUEUE = 'sync_queue';

export class IndexedDBService {
  private static db: IDBDatabase | null = null;

  /**
   * Initialize IndexedDB database
   */
  static async init(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains(STORE_GENOGRAMS)) {
          db.createObjectStore(STORE_GENOGRAMS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_PERSONS)) {
          const personStore = db.createObjectStore(STORE_PERSONS, { keyPath: 'id' });
          personStore.createIndex('genogramId', 'genogramId', { unique: false });
        }
        if (!db.objectStoreNames.contains(STORE_RELATIONSHIPS)) {
          const relStore = db.createObjectStore(STORE_RELATIONSHIPS, { keyPath: 'id' });
          relStore.createIndex('genogramId', 'genogramId', { unique: false });
        }
        if (!db.objectStoreNames.contains(STORE_SYNC_QUEUE)) {
          db.createObjectStore(STORE_SYNC_QUEUE, { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  /**
   * Save genogram to IndexedDB
   */
  static async saveGenogram(genogram: Genogram): Promise<void> {
    const db = await this.getDB();
    const transaction = db.transaction([STORE_GENOGRAMS], 'readwrite');
    const store = transaction.objectStore(STORE_GENOGRAMS);

    return new Promise((resolve, reject) => {
      const request = store.put({
        ...genogram,
        savedAt: new Date().toISOString(),
      });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get genogram from IndexedDB
   */
  static async getGenogram(genogramId: string): Promise<Genogram | null> {
    const db = await this.getDB();
    const transaction = db.transaction([STORE_GENOGRAMS], 'readonly');
    const store = transaction.objectStore(STORE_GENOGRAMS);

    return new Promise((resolve, reject) => {
      const request = store.get(genogramId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Save person to IndexedDB
   */
  static async savePerson(genogramId: string, person: Person): Promise<void> {
    const db = await this.getDB();
    const transaction = db.transaction([STORE_PERSONS], 'readwrite');
    const store = transaction.objectStore(STORE_PERSONS);

    return new Promise((resolve, reject) => {
      const request = store.put({
        ...person,
        genogramId,
        savedAt: new Date().toISOString(),
      });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all persons for a genogram
   */
  static async getPersons(genogramId: string): Promise<Person[]> {
    const db = await this.getDB();
    const transaction = db.transaction([STORE_PERSONS], 'readonly');
    const store = transaction.objectStore(STORE_PERSONS);
    const index = store.index('genogramId');

    return new Promise((resolve, reject) => {
      const request = index.getAll(genogramId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete person from IndexedDB
   */
  static async deletePerson(personId: string): Promise<void> {
    const db = await this.getDB();
    const transaction = db.transaction([STORE_PERSONS], 'readwrite');
    const store = transaction.objectStore(STORE_PERSONS);

    return new Promise((resolve, reject) => {
      const request = store.delete(personId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Save relationship to IndexedDB
   */
  static async saveRelationship(genogramId: string, relationship: Connection): Promise<void> {
    const db = await this.getDB();
    const transaction = db.transaction([STORE_RELATIONSHIPS], 'readwrite');
    const store = transaction.objectStore(STORE_RELATIONSHIPS);

    return new Promise((resolve, reject) => {
      const request = store.put({
        ...relationship,
        genogramId,
        savedAt: new Date().toISOString(),
      });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all relationships for a genogram
   */
  static async getRelationships(genogramId: string): Promise<Connection[]> {
    const db = await this.getDB();
    const transaction = db.transaction([STORE_RELATIONSHIPS], 'readonly');
    const store = transaction.objectStore(STORE_RELATIONSHIPS);
    const index = store.index('genogramId');

    return new Promise((resolve, reject) => {
      const request = index.getAll(genogramId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete relationship from IndexedDB
   */
  static async deleteRelationship(relationshipId: string): Promise<void> {
    const db = await this.getDB();
    const transaction = db.transaction([STORE_RELATIONSHIPS], 'readwrite');
    const store = transaction.objectStore(STORE_RELATIONSHIPS);

    return new Promise((resolve, reject) => {
      const request = store.delete(relationshipId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Add operation to sync queue (for offline support)
   */
  static async addToSyncQueue(operation: {
    type: 'create' | 'update' | 'delete';
    collection: 'persons' | 'relationships' | 'genograms';
    data: any;
    timestamp: string;
  }): Promise<void> {
    const db = await this.getDB();
    const transaction = db.transaction([STORE_SYNC_QUEUE], 'readwrite');
    const store = transaction.objectStore(STORE_SYNC_QUEUE);

    return new Promise((resolve, reject) => {
      const request = store.add(operation);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all pending sync operations
   */
  static async getSyncQueue(): Promise<any[]> {
    const db = await this.getDB();
    const transaction = db.transaction([STORE_SYNC_QUEUE], 'readonly');
    const store = transaction.objectStore(STORE_SYNC_QUEUE);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear sync queue (after successful sync)
   */
  static async clearSyncQueue(): Promise<void> {
    const db = await this.getDB();
    const transaction = db.transaction([STORE_SYNC_QUEUE], 'readwrite');
    const store = transaction.objectStore(STORE_SYNC_QUEUE);

    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear all data from IndexedDB
   */
  static async clearAll(): Promise<void> {
    const db = await this.getDB();
    const stores = [STORE_GENOGRAMS, STORE_PERSONS, STORE_RELATIONSHIPS, STORE_SYNC_QUEUE];
    const transaction = db.transaction(stores, 'readwrite');

    const promises = stores.map(
      (storeName) =>
        new Promise<void>((resolve, reject) => {
          const store = transaction.objectStore(storeName);
          const request = store.clear();
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        })
    );

    await Promise.all(promises);
  }

  /**
   * Get database instance
   */
  private static async getDB(): Promise<IDBDatabase> {
    if (!this.db) {
      return this.init();
    }
    return this.db;
  }
}
