import { BatchMetadata, ClaimItem } from '../types';
import {
  initializeAndSeedDatabase,
  getBatchFromFirestore,
  getClaimsFromFirestore,
  authorizeBatchInFirestore,
  flagBatchInFirestore,
} from './firestoreService';

// Ensure tables and collections exist upon app initialization
let initPromise: Promise<any> | null = null;
export function ensureDatabaseInitialized() {
  if (!initPromise) {
    initPromise = initializeAndSeedDatabase();
  }
  return initPromise;
}

export async function fetchBatchFromDb(): Promise<BatchMetadata> {
  await ensureDatabaseInitialized();
  return getBatchFromFirestore();
}

export async function fetchClaimsFromDb(): Promise<ClaimItem[]> {
  await ensureDatabaseInitialized();
  return getClaimsFromFirestore();
}

export async function authorizeBatchInDb(batchId: string): Promise<boolean> {
  await ensureDatabaseInitialized();
  return authorizeBatchInFirestore(batchId);
}

export async function flagBatchInDb(batchId: string, reason: string, notes: string): Promise<boolean> {
  await ensureDatabaseInitialized();
  return flagBatchInFirestore(batchId, reason, notes);
}
