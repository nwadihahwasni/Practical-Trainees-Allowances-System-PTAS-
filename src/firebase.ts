import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';
import { Intern, CloudLink } from './types';
import { INITIAL_INTERNS, DEFAULT_DEPARTMENTS, DEFAULT_BANKS } from './data/initialData';

export const INITIAL_CLOUD_LINKS: CloudLink[] = [
  {
    id: 'link-001',
    title: 'Media Prima Group HR Portal & Policy HR-TR-04',
    url: 'https://intranet.mediaprima.com.my/people-culture/hr-tr-04',
    category: 'Statutory Document',
    description: 'Practical trainee policy, allowance ceiling regulations, and statutory codes.',
    createdAt: '2026-08-01T08:00:00.000Z',
    createdBy: 'Group People & Culture',
  },
  {
    id: 'link-002',
    title: 'Maybank Corporate Autopay Gateway',
    url: 'https://www.maybank2u.com.my/mbb/corporate',
    category: 'Bank Autopay',
    description: 'Encrypted hash batch disbursement portal for trainee allowances.',
    createdAt: '2026-08-15T09:30:00.000Z',
    createdBy: 'Group Payroll Operations',
  },
  {
    id: 'link-003',
    title: 'Media Prima Google Drive Offboarding Repository',
    url: 'https://drive.google.com/drive/folders/mediaprima-ptas-offboarding',
    category: 'Google Drive',
    description: 'Shared repository for signed Attendance Forms and Progress Reports.',
    createdAt: '2026-08-20T14:15:00.000Z',
    createdBy: 'HR Admin Ops',
  },
  {
    id: 'link-004',
    title: 'Active Payroll Batch Live Sheet (August 2026)',
    url: 'https://docs.google.com/spreadsheets/d/1MediaPrima_Aug2026_Disbursement_Live',
    category: 'Payroll Sheet',
    description: 'Consolidated trainee allowance ledger synchronized with Group Finance.',
    createdAt: '2026-08-28T14:30:00.000Z',
    createdBy: 'HR Admin Ops',
  },
];

// Initialize Firebase App
const app = initializeApp({
  projectId: firebaseConfig.projectId,
  appId: firebaseConfig.appId,
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
});

// Initialize Firestore with specific database ID from config
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Standardized Operation Types & Error Handler as mandated by Firebase Skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Ensure user is authenticated
export async function ensureAuth(): Promise<User> {
  if (auth.currentUser) {
    return auth.currentUser;
  }
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        unsubscribe();
        resolve(user);
      } else {
        try {
          const cred = await signInAnonymously(auth);
          unsubscribe();
          resolve(cred.user);
        } catch (err) {
          unsubscribe();
          reject(err);
        }
      }
    });
  });
}

// Test connection on boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
      return false;
    }
    // Any other response (including not found) means the connection succeeded
    return true;
  }
}

// Subscribe to interns collection with live updates and seeding
export function subscribeToInterns(
  onData: (interns: Intern[]) => void,
  onError?: (err: Error) => void
) {
  const path = 'interns';
  const colRef = collection(db, path);

  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        // Seed initial 14 interns if collection is currently empty
        try {
          for (const intern of INITIAL_INTERNS) {
            await setDoc(doc(db, path, intern.id), intern);
          }
          onData(INITIAL_INTERNS);
        } catch (seedErr) {
          console.warn('Seeding interns fallback to memory', seedErr);
          onData(INITIAL_INTERNS);
        }
      } else {
        const loaded: Intern[] = [];
        snapshot.forEach((d) => {
          loaded.push(d.data() as Intern);
        });
        onData(loaded);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      if (onError) onError(error);
    }
  );
}

// Save or update an intern
export async function saveInternToFirestore(intern: Intern): Promise<void> {
  const path = `interns/${intern.id}`;
  try {
    await setDoc(doc(db, 'interns', intern.id), intern);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Delete an intern
export async function deleteInternFromFirestore(id: string): Promise<void> {
  const path = `interns/${id}`;
  try {
    await deleteDoc(doc(db, 'interns', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Subscribe to dynamic departments
export function subscribeToDepartments(
  onData: (depts: string[]) => void
) {
  const path = 'config';
  return onSnapshot(
    doc(db, path, 'departments'),
    async (snap) => {
      if (!snap.exists()) {
        try {
          await setDoc(doc(db, path, 'departments'), { items: DEFAULT_DEPARTMENTS });
          onData(DEFAULT_DEPARTMENTS);
        } catch {
          onData(DEFAULT_DEPARTMENTS);
        }
      } else {
        const data = snap.data();
        if (data && Array.isArray(data.items)) {
          onData(data.items);
        }
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, `${path}/departments`);
    }
  );
}

// Save departments to Firestore
export async function saveDepartmentsToFirestore(departments: string[]): Promise<void> {
  const path = 'config/departments';
  try {
    await setDoc(doc(db, 'config', 'departments'), { items: departments });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Subscribe to dynamic banks
export function subscribeToBanks(
  onData: (banks: string[]) => void
) {
  const path = 'config';
  return onSnapshot(
    doc(db, path, 'banks'),
    async (snap) => {
      if (!snap.exists()) {
        try {
          await setDoc(doc(db, path, 'banks'), { items: DEFAULT_BANKS });
          onData(DEFAULT_BANKS);
        } catch {
          onData(DEFAULT_BANKS);
        }
      } else {
        const data = snap.data();
        if (data && Array.isArray(data.items)) {
          onData(data.items);
        }
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, `${path}/banks`);
    }
  );
}

// Save banks to Firestore
export async function saveBanksToFirestore(banks: string[]): Promise<void> {
  const path = 'config/banks';
  try {
    await setDoc(doc(db, 'config', 'banks'), { items: banks });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Subscribe to Cloud Links stored in Firestore
export function subscribeToLinks(
  onData: (links: CloudLink[]) => void,
  onError?: (err: Error) => void
) {
  const path = 'links';
  const colRef = collection(db, path);

  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        // Seed default links if collection is currently empty
        try {
          for (const link of INITIAL_CLOUD_LINKS) {
            await setDoc(doc(db, path, link.id), link);
          }
          onData(INITIAL_CLOUD_LINKS);
        } catch {
          onData(INITIAL_CLOUD_LINKS);
        }
      } else {
        const loaded: CloudLink[] = [];
        snapshot.forEach((d) => {
          loaded.push(d.data() as CloudLink);
        });
        // Sort descending by date
        loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        onData(loaded);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      if (onError) onError(error);
    }
  );
}

// Save or update link in Firestore
export async function saveLinkToFirestore(link: CloudLink): Promise<void> {
  const path = `links/${link.id}`;
  try {
    await setDoc(doc(db, 'links', link.id), link);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Delete link from Firestore
export async function deleteLinkFromFirestore(id: string): Promise<void> {
  const path = `links/${id}`;
  try {
    await deleteDoc(doc(db, 'links', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

