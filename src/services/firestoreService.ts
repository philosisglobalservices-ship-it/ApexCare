import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { firestoreDb } from '../lib/firebase';
import { BatchMetadata, ClaimItem } from '../types';
import { BATCH_DATA, CLAIMS_LIST } from '../data/mockData';

// Firestore collection identifiers (tables)
export const COLLECTIONS = {
  PROVIDERS: 'providers',
  BATCHES: 'batches',
  CLAIMS: 'claims',
  AUDIT_LOGS: 'auditLogs',
  USERS: 'users',
} as const;

/**
 * Initializes and seeds all necessary tables (collections) in Firestore:
 * - providers: Healthcare Provider Registry (Reddington Hospital Group)
 * - batches: Settlement Batches (Dual-Control Settlement #SETTLE-2026-B402-LAG)
 * - claims: Itemized Clinical Claims (42 ICD-10 encounter records)
 * - auditLogs: Statutory Double-Entry GL Ledger & Audit Trail
 * - users: Authorized Dual-Control Officers
 */
export async function initializeAndSeedDatabase(): Promise<{
  success: boolean;
  seeded: boolean;
  message: string;
}> {
  try {
    const batchDocRef = doc(firestoreDb, COLLECTIONS.BATCHES, 'SETTLE-2026-B402-LAG');
    const batchSnap = await getDoc(batchDocRef);

    if (batchSnap.exists()) {
      return {
        success: true,
        seeded: false,
        message: 'Database tables and collections already verified.',
      };
    }

    console.log('Seeding initial Firestore database tables and records...');

    // 1. Table: providers
    const providerRef = doc(firestoreDb, COLLECTIONS.PROVIDERS, 'HCP-RED-001');
    await setDoc(providerRef, {
      providerId: 'HCP-RED-001',
      name: BATCH_DATA.providerName,
      tier: BATCH_DATA.providerTier,
      locations: BATCH_DATA.providerLocations,
      nhiaReg: BATCH_DATA.providerNhiaReg,
      bankName: BATCH_DATA.bankName,
      accountNumberMasked: BATCH_DATA.accountNumberMasked,
      accountName: BATCH_DATA.accountName,
      createdAt: serverTimestamp(),
    });

    // 2. Table: batches
    await setDoc(batchDocRef, {
      ...BATCH_DATA,
      status: 'PENDING_APPROVAL',
      providerId: 'HCP-RED-001',
      createdAt: serverTimestamp(),
    });

    // 3. Table: claims (all 42 claims)
    for (const claim of CLAIMS_LIST) {
      const claimDocId = claim.claimNumber.replace(/[^a-zA-Z0-9_-]/g, '_');
      const claimRef = doc(firestoreDb, COLLECTIONS.CLAIMS, claimDocId);
      await setDoc(claimRef, {
        ...claim,
        batchId: 'SETTLE-2026-B402-LAG',
        createdAt: serverTimestamp(),
      });
    }

    // 4. Table: auditLogs (Initial dual-custody maker entry)
    const logRef = doc(firestoreDb, COLLECTIONS.AUDIT_LOGS, 'LOG-INIT-001');
    await setDoc(logRef, {
      batchId: 'SETTLE-2026-B402-LAG',
      eventType: 'MAKER_INITIATED',
      actorName: BATCH_DATA.makerName,
      actorRole: BATCH_DATA.makerTitle,
      actorToken: BATCH_DATA.makerToken,
      description: 'Settlement batch compiled and initial Maker signature committed to NHIA clearing gateway.',
      debitAccount: 'Provider Claims Suspense (A/C 50201)',
      creditAccount: 'Intermediary Access CBN Settlement (A/C 10104)',
      amount: BATCH_DATA.netSettlement,
      timestamp: BATCH_DATA.makerTimestamp,
      createdAt: serverTimestamp(),
    });

    // 5. Table: users
    const users = [
      {
        uid: 'user-adelekan-001',
        email: 'a.adelekan@apexcare.ng',
        name: 'Dr. A. O. Adelekan (MD, FMCOG)',
        role: 'cfo_checker',
      },
      {
        uid: 'user-adeleke-002',
        email: 'b.adeleke@apexcare.ng',
        name: 'Babatunde Adeleke (ACA)',
        role: 'treasury_analyst',
      },
      {
        uid: 'user-audit-003',
        email: 'audit@apexcare.ng',
        name: 'Claims Quality Assurance Controller',
        role: 'claims_auditor',
      },
    ];

    for (const u of users) {
      const userRef = doc(firestoreDb, COLLECTIONS.USERS, u.uid);
      await setDoc(userRef, {
        ...u,
        createdAt: serverTimestamp(),
      });
    }

    console.log('Database tables successfully created and seeded with 42 claims.');
    return {
      success: true,
      seeded: true,
      message: 'All necessary database tables and records created successfully.',
    };
  } catch (err: any) {
    console.error('Error during database initialization:', err);
    return {
      success: false,
      seeded: false,
      message: err.message || 'Database initialization encountered an error.',
    };
  }
}

/**
 * Fetch the active settlement batch from Firestore
 */
export async function getBatchFromFirestore(): Promise<BatchMetadata> {
  try {
    const batchDocRef = doc(firestoreDb, COLLECTIONS.BATCHES, 'SETTLE-2026-B402-LAG');
    const snap = await getDoc(batchDocRef);

    if (snap.exists()) {
      const data = snap.data();
      return {
        batchId: data.batchId || BATCH_DATA.batchId,
        sessionIdentifier: data.sessionIdentifier || BATCH_DATA.sessionIdentifier,
        providerName: data.providerName || BATCH_DATA.providerName,
        providerTier: data.providerTier || BATCH_DATA.providerTier,
        providerLocations: data.providerLocations || BATCH_DATA.providerLocations,
        providerNhiaReg: data.providerNhiaReg || BATCH_DATA.providerNhiaReg,
        bankName: data.bankName || BATCH_DATA.bankName,
        accountNumberMasked: data.accountNumberMasked || BATCH_DATA.accountNumberMasked,
        accountName: data.accountName || BATCH_DATA.accountName,
        grossAdjudicated: Number(data.grossAdjudicated) || BATCH_DATA.grossAdjudicated,
        tariffDeductions: Number(data.tariffDeductions) || BATCH_DATA.tariffDeductions,
        enrolleeCopay: Number(data.enrolleeCopay) || BATCH_DATA.enrolleeCopay,
        withholdingTax: Number(data.withholdingTax) || BATCH_DATA.withholdingTax,
        netSettlement: Number(data.netSettlement) || BATCH_DATA.netSettlement,
        totalClaimsCount: Number(data.totalClaimsCount) || BATCH_DATA.totalClaimsCount,
        reconciledClaimsCount: Number(data.reconciledClaimsCount) || BATCH_DATA.reconciledClaimsCount,
        disputedClaimsCount: Number(data.disputedClaimsCount) || BATCH_DATA.disputedClaimsCount,
        disputedAmount: Number(data.disputedAmount) || BATCH_DATA.disputedAmount,
        disputedClaimId: data.disputedClaimId || BATCH_DATA.disputedClaimId,
        disputedReason: data.disputedReason || BATCH_DATA.disputedReason,
        makerName: data.makerName || BATCH_DATA.makerName,
        makerTitle: data.makerTitle || BATCH_DATA.makerTitle,
        makerTimestamp: data.makerTimestamp || BATCH_DATA.makerTimestamp,
        makerToken: data.makerToken || BATCH_DATA.makerToken,
        checkerName: data.checkerName || BATCH_DATA.checkerName,
        checkerTitle: data.checkerTitle || BATCH_DATA.checkerTitle,
        checkerTimestamp: data.checkerTimestamp || BATCH_DATA.checkerTimestamp,
        checkerSignId: data.checkerSignId || BATCH_DATA.checkerSignId,
        cryptographicHash: data.cryptographicHash || BATCH_DATA.cryptographicHash,
        executionStamp: data.executionStamp || BATCH_DATA.executionStamp,
        clearingGateway: data.clearingGateway || BATCH_DATA.clearingGateway,
        networkLatency: data.networkLatency || BATCH_DATA.networkLatency,
      };
    }
  } catch (err) {
    console.warn('Could not read batch from Firestore, falling back to local dataset:', err);
  }
  return BATCH_DATA;
}

/**
 * Fetch itemized claims from Firestore
 */
export async function getClaimsFromFirestore(): Promise<ClaimItem[]> {
  try {
    const claimsCol = collection(firestoreDb, COLLECTIONS.CLAIMS);
    const q = query(claimsCol, orderBy('claimNumber', 'asc'));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const items: ClaimItem[] = [];
      snap.forEach((docSnap) => {
        const d = docSnap.data();
        items.push({
          id: docSnap.id,
          claimNumber: d.claimNumber,
          patientName: d.patientName,
          enrolleeId: d.enrolleeId,
          procedureName: d.procedureName,
          category: d.category,
          grossBilled: Number(d.grossBilled),
          netRemittable: Number(d.netRemittable),
          disallowanceAmount: d.disallowanceAmount ? Number(d.disallowanceAmount) : 0,
          whtAmount: d.whtAmount ? Number(d.whtAmount) : 0,
          status: d.status,
          verificationBadge: d.verificationBadge,
          badgeType: d.badgeType,
          icd10Code: d.icd10Code,
          admissionDate: d.admissionDate,
          dischargeDate: d.dischargeDate,
          treatingPhysician: d.treatingPhysician,
          notes: d.notes,
        });
      });
      return items;
    }
  } catch (err) {
    console.warn('Could not read claims from Firestore, falling back to local dataset:', err);
  }
  return CLAIMS_LIST;
}

/**
 * Authorize settlement in Firestore (Dual-Custody Checker Sign-off)
 */
export async function authorizeBatchInFirestore(
  batchId: string,
  checkerName = 'Dr. A. O. Adelekan (MD, FMCOG)',
  checkerSignId = 'Biometric Sign ID #KEY-OK-9924'
): Promise<boolean> {
  try {
    const now = new Date();
    const timestampStr = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} • ${now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WAT`;

    const batchDocRef = doc(firestoreDb, COLLECTIONS.BATCHES, 'SETTLE-2026-B402-LAG');
    await updateDoc(batchDocRef, {
      status: 'COMPLETED',
      checkerName,
      checkerTitle: 'Chief Financial Office / MD',
      checkerTimestamp: timestampStr,
      checkerSignId,
      executionStamp: timestampStr,
      updatedAt: serverTimestamp(),
    });

    // Record immutable audit log
    await addDoc(collection(firestoreDb, COLLECTIONS.AUDIT_LOGS), {
      batchId,
      eventType: 'CHECKER_AUTHORIZED',
      actorName: checkerName,
      actorRole: 'CFO / Lead Medical Director',
      actorToken: checkerSignId,
      description: 'Executive Dual-Custody sign-off completed. NIBSS Instant Payment dispatched.',
      debitAccount: 'Provider Claims Expense (A/C 50201)',
      creditAccount: 'Access Bank Settlement (A/C 10104)',
      amount: BATCH_DATA.netSettlement,
      timestamp: timestampStr,
      createdAt: serverTimestamp(),
    });

    return true;
  } catch (err) {
    console.error('Failed to authorize batch in Firestore:', err);
    return false;
  }
}

/**
 * Flag batch in Firestore
 */
export async function flagBatchInFirestore(
  batchId: string,
  reason: string,
  notes: string
): Promise<boolean> {
  try {
    const batchDocRef = doc(firestoreDb, COLLECTIONS.BATCHES, 'SETTLE-2026-B402-LAG');
    await updateDoc(batchDocRef, {
      status: 'FLAGGED',
      disputedReason: notes ? `Discrepancy: ${reason} - ${notes}` : `Discrepancy: ${reason}`,
      updatedAt: serverTimestamp(),
    });

    // Record immutable audit log
    await addDoc(collection(firestoreDb, COLLECTIONS.AUDIT_LOGS), {
      batchId,
      eventType: 'BATCH_FLAGGED',
      actorName: 'Claims Quality Assurance Controller',
      actorRole: 'Claims Audit',
      actorToken: 'AUDIT-FLAG-SYS',
      description: `Batch suspended: ${reason}. Notes: ${notes || 'None'}`,
      amount: BATCH_DATA.disputedAmount,
      timestamp: new Date().toISOString(),
      createdAt: serverTimestamp(),
    });

    return true;
  } catch (err) {
    console.error('Failed to flag batch in Firestore:', err);
    return false;
  }
}
