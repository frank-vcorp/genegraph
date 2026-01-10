import { vi } from 'vitest';

export const mockSignInWithEmailAndPassword = vi.fn();
export const mockCreateUserWithEmailAndPassword = vi.fn();
export const mockSignOut = vi.fn();
export const mockOnAuthStateChanged = vi.fn();
export const mockUpdateProfile = vi.fn();
export const mockGetAuth = vi.fn();

export const User = class {};
export const getAuth = mockGetAuth;
export const signInWithEmailAndPassword = mockSignInWithEmailAndPassword;
export const createUserWithEmailAndPassword = mockCreateUserWithEmailAndPassword;
export const signOut = mockSignOut;
export const onAuthStateChanged = mockOnAuthStateChanged;
export const updateProfile = mockUpdateProfile;
export const signInWithPopup = vi.fn();
