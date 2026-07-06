// services/firebase/auth.ts
import { 
  signInWithEmailAndPassword, 
  signOut, 
  setPersistence, 
  browserLocalPersistence 
} from 'firebase/auth';
import { auth } from './config';
import { LoginCredentials } from '@/types/auth';

/**
 * Validates admin user credentials and creates a local session persistent across browser tabs.
 */
export const loginAdmin = async ({ email, password }: LoginCredentials): Promise<void> => {
  try {
    // Explicitly enforce local browser persistence before executing sign in
    await setPersistence(auth, browserLocalPersistence);
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    console.error("Firebase Authentication Login Error:", error);
    throw new Error(error.code || "An unexpected authentication error occurred.");
  }
};

/**
 * Terminates the active administrator session.
 */
export const logoutAdmin = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("Firebase Authentication Logout Error:", error);
    throw new Error("Failed to safely terminate administrative session.");
  }
};