import { vi } from 'vitest';

export const mockWriteBatch = vi.fn();
export const mockSetDoc = vi.fn();
export const mockUpdateDoc = vi.fn();
export const mockDeleteDoc = vi.fn();
export const mockGetDoc = vi.fn();
export const mockGetDocs = vi.fn();
export const mockOnSnapshot = vi.fn();
export const mockDoc = vi.fn();
export const mockCollection = vi.fn();
export const mockQuery = vi.fn();
export const mockWhere = vi.fn();
export const mockOrderBy = vi.fn();

export const writeBatch = mockWriteBatch;
export const setDoc = mockSetDoc;
export const updateDoc = mockUpdateDoc;
export const deleteDoc = mockDeleteDoc;
export const getDoc = mockGetDoc;
export const getDocs = mockGetDocs;
export const onSnapshot = mockOnSnapshot;
export const doc = mockDoc;
export const collection = mockCollection;
export const query = mockQuery;
export const where = mockWhere;
export const orderBy = mockOrderBy;

export const serverTimestamp = () => new Date();
export const Timestamp = class {
  toDate() {
    return new Date();
  }
};
