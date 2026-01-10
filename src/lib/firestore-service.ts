/**
 * Firestore Service - Real-time Genogram Synchronization
 * 🏗️ ARCH REFERENCE: CP-007-Firebase-Integration
 * Handles Firestore CRUD operations and real-time listeners
 * Data structure: users/{uid}/genograms/{gid}/persons/{pid}
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  writeBatch,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Genogram, Person, Connection } from '@/types/genogram';

export class FirestoreService {
  /**
   * Create a new genogram for a user
   */
  static async createGenogram(userId: string, genogram: Omit<Genogram, 'id'>): Promise<string> {
    try {
      const genogramRef = doc(collection(db, `users/${userId}/genograms`));
      await setDoc(genogramRef, {
        ...genogram,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return genogramRef.id;
    } catch (error) {
      console.error('Error creating genogram:', error);
      throw error;
    }
  }

  /**
   * Get a specific genogram
   */
  static async getGenogram(userId: string, genogramId: string): Promise<Genogram | null> {
    try {
      const docRef = doc(db, `users/${userId}/genograms/${genogramId}`);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) return null;
      
      return { id: docSnap.id, ...docSnap.data() } as Genogram;
    } catch (error) {
      console.error('Error getting genogram:', error);
      throw error;
    }
  }

  /**
   * Get all genograms for a user
   */
  static async getUserGenograms(userId: string): Promise<Genogram[]> {
    try {
      const q = query(collection(db, `users/${userId}/genograms`));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Genogram));
    } catch (error) {
      console.error('Error getting user genograms:', error);
      throw error;
    }
  }

  /**
   * Update genogram metadata
   */
  static async updateGenogram(
    userId: string,
    genogramId: string,
    updates: Partial<Genogram>
  ): Promise<void> {
    try {
      const docRef = doc(db, `users/${userId}/genograms/${genogramId}`);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating genogram:', error);
      throw error;
    }
  }

  /**
   * Delete a genogram and all its sub-collections
   */
  static async deleteGenogram(userId: string, genogramId: string): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      // Delete all persons in this genogram
      const personsRef = collection(db, `users/${userId}/genograms/${genogramId}/persons`);
      const personDocs = await getDocs(personsRef);
      personDocs.forEach((doc) => batch.delete(doc.ref));
      
      // Delete all relationships
      const relationshipsRef = collection(db, `users/${userId}/genograms/${genogramId}/relationships`);
      const relationshipDocs = await getDocs(relationshipsRef);
      relationshipDocs.forEach((doc) => batch.delete(doc.ref));
      
      // Delete the genogram itself
      const genogramRef = doc(db, `users/${userId}/genograms/${genogramId}`);
      batch.delete(genogramRef);
      
      await batch.commit();
    } catch (error) {
      console.error('Error deleting genogram:', error);
      throw error;
    }
  }

  /**
   * Add a person to a genogram
   */
  static async addPerson(
    userId: string,
    genogramId: string,
    person: Omit<Person, 'id'>
  ): Promise<string> {
    try {
      const personRef = doc(collection(db, `users/${userId}/genograms/${genogramId}/persons`));
      await setDoc(personRef, {
        ...person,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return personRef.id;
    } catch (error) {
      console.error('Error adding person:', error);
      throw error;
    }
  }

  /**
   * Update a person in a genogram
   */
  static async updatePerson(
    userId: string,
    genogramId: string,
    personId: string,
    updates: Partial<Person>
  ): Promise<void> {
    try {
      const personRef = doc(db, `users/${userId}/genograms/${genogramId}/persons/${personId}`);
      await updateDoc(personRef, {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating person:', error);
      throw error;
    }
  }

  /**
   * Delete a person from a genogram
   */
  static async deletePerson(
    userId: string,
    genogramId: string,
    personId: string
  ): Promise<void> {
    try {
      const personRef = doc(db, `users/${userId}/genograms/${genogramId}/persons/${personId}`);
      await deleteDoc(personRef);
    } catch (error) {
      console.error('Error deleting person:', error);
      throw error;
    }
  }

  /**
   * Get all persons in a genogram
   */
  static async getPersons(userId: string, genogramId: string): Promise<Person[]> {
    try {
      const personsRef = collection(db, `users/${userId}/genograms/${genogramId}/persons`);
      const querySnapshot = await getDocs(personsRef);
      
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Person));
    } catch (error) {
      console.error('Error getting persons:', error);
      throw error;
    }
  }

  /**
   * Add a relationship (connection) between two persons
   */
  static async addRelationship(
    userId: string,
    genogramId: string,
    relationship: Omit<Connection, 'id'>
  ): Promise<string> {
    try {
      const relRef = doc(collection(db, `users/${userId}/genograms/${genogramId}/relationships`));
      await setDoc(relRef, {
        ...relationship,
        createdAt: new Date(),
      });
      return relRef.id;
    } catch (error) {
      console.error('Error adding relationship:', error);
      throw error;
    }
  }

  /**
   * Delete a relationship
   */
  static async deleteRelationship(
    userId: string,
    genogramId: string,
    relationshipId: string
  ): Promise<void> {
    try {
      const relRef = doc(db, `users/${userId}/genograms/${genogramId}/relationships/${relationshipId}`);
      await deleteDoc(relRef);
    } catch (error) {
      console.error('Error deleting relationship:', error);
      throw error;
    }
  }

  /**
   * Get all relationships in a genogram
   */
  static async getRelationships(userId: string, genogramId: string): Promise<Connection[]> {
    try {
      const relsRef = collection(db, `users/${userId}/genograms/${genogramId}/relationships`);
      const querySnapshot = await getDocs(relsRef);
      
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Connection));
    } catch (error) {
      console.error('Error getting relationships:', error);
      throw error;
    }
  }

  /**
   * Subscribe to real-time updates of a genogram's persons
   * Returns unsubscribe function
   */
  static subscribeToPersons(
    userId: string,
    genogramId: string,
    callback: (persons: Person[]) => void
  ): Unsubscribe {
    try {
      const personsRef = collection(db, `users/${userId}/genograms/${genogramId}/persons`);
      
      return onSnapshot(personsRef, (snapshot) => {
        const persons = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Person));
        callback(persons);
      });
    } catch (error) {
      console.error('Error subscribing to persons:', error);
      throw error;
    }
  }

  /**
   * Subscribe to real-time updates of a genogram's relationships
   * Returns unsubscribe function
   */
  /**
   * Batch save entire genogram (optimized for large datasets)
   * Saves genogram metadata, all persons, and all relationships in atomic transaction
   * 🚀 CP-010 FIX: Eliminates N+1 writes pattern
   */
  static async batchSaveGenogram(
    userId: string,
    genogram: Genogram
  ): Promise<void> {
    try {
      const batch = writeBatch(db);
      const timestamp = new Date();

      // Update genogram metadata
      const genogramRef = doc(db, `users/${userId}/genograms/${genogram.id}`);
      batch.update(genogramRef, {
        pacientName: genogram.pacientName,
        metadata: genogram.metadata || {},
        updatedAt: timestamp,
      });

      // Save all persons in batch
      for (const person of genogram.persons) {
        const personRef = doc(
          db,
          `users/${userId}/genograms/${genogram.id}/persons/${person.id}`
        );
        batch.set(personRef, {
          ...person,
          updatedAt: timestamp,
        });
      }

      // Save all relationships in batch
      for (const relationship of genogram.connections) {
        const relRef = doc(
          db,
          `users/${userId}/genograms/${genogram.id}/relationships/${relationship.id}`
        );
        batch.set(relRef, {
          ...relationship,
          updatedAt: timestamp,
        });
      }

      // Commit all changes atomically
      await batch.commit();
    } catch (error) {
      console.error('Error batch saving genogram:', error);
      throw error;
    }
  }

  static subscribeToRelationships(
    userId: string,
    genogramId: string,
    callback: (relationships: Connection[]) => void
  ): Unsubscribe {
    try {
      const relsRef = collection(db, `users/${userId}/genograms/${genogramId}/relationships`);
      
      return onSnapshot(relsRef, (snapshot) => {
        const relationships = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Connection));
        callback(relationships);
      });
    } catch (error) {
      console.error('Error subscribing to relationships:', error);
      throw error;
    }
  }
}

