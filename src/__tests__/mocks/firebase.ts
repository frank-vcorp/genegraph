/**
 * Firebase Mock
 * 🏗️ Mocked Firebase modules for testing
 */

import { vi } from 'vitest';

// Mock auth module
export const mockSignInWithEmailAndPassword = vi.fn();
export const mockCreateUserWithEmailAndPassword = vi.fn();
export const mockSignOut = vi.fn();
export const mockOnAuthStateChanged = vi.fn();
export const mockUpdateProfile = vi.fn();

// Mock firestore module
export const mockDoc = vi.fn((db, ...path) => ({ path }));
export const mockCollection = vi.fn((db, ...path) => ({ path }));
export const mockDocs = vi.fn();
export const mockQuery = vi.fn();
export const mockWhere = vi.fn();
export const mockOrderBy = vi.fn();
export const mockLimit = vi.fn();
export const mockSetDoc = vi.fn();
export const mockUpdateDoc = vi.fn();
export const mockDeleteDoc = vi.fn();
export const mockGetDoc = vi.fn();
export const mockGetDocs = vi.fn();
export const mockOnSnapshot = vi.fn();
export const mockWriteBatch = vi.fn();

// Mock writeBatch response
export const mockBatch = {
  set: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  commit: vi.fn().mockResolvedValue(undefined),
};

mockWriteBatch.mockReturnValue(mockBatch);

// Mock Firebase initialization
export const mockInitializeApp = vi.fn();
export const mockGetAuth = vi.fn();
export const mockGetFirestore = vi.fn();

// Default mock implementations
export const firebaseAuthMock = {
  currentUser: null,
  signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
  createUserWithEmailAndPassword: mockCreateUserWithEmailAndPassword,
  signOut: mockSignOut,
  onAuthStateChanged: mockOnAuthStateChanged,
  updateProfile: mockUpdateProfile,
};

export const firebaseFirestoreMock = {
  doc: mockDoc,
  collection: mockCollection,
  setDoc: mockSetDoc,
  updateDoc: mockUpdateDoc,
  deleteDoc: mockDeleteDoc,
  getDoc: mockGetDoc,
  getDocs: mockGetDocs,
  onSnapshot: mockOnSnapshot,
  writeBatch: mockWriteBatch,
  query: mockQuery,
  where: mockWhere,
  orderBy: mockOrderBy,
  limit: mockLimit,
  docs: mockDocs,
};

// Reset all mocks before each test
export function resetFirebaseMocks() {
  mockSignInWithEmailAndPassword.mockReset();
  mockCreateUserWithEmailAndPassword.mockReset();
  mockSignOut.mockReset();
  mockOnAuthStateChanged.mockReset();
  mockUpdateProfile.mockReset();
  mockSetDoc.mockReset();
  mockUpdateDoc.mockReset();
  mockDeleteDoc.mockReset();
  mockGetDoc.mockReset();
  mockGetDocs.mockReset();
  mockOnSnapshot.mockReset();
  mockBatch.set.mockReset();
  mockBatch.update.mockReset();
  mockBatch.delete.mockReset();
  mockBatch.commit.mockReset();
  mockWriteBatch.mockReset().mockReturnValue(mockBatch);
}
