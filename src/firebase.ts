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
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  signOut,
} from 'firebase/auth';
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

// -------------------------------------------------------------
// HR INTERNSHIP EXCLUSIVE AUTHENTICATION SYSTEM
// Single Authorized User: HR Internship (Internship@mediaprima.com.my)
// Initial Password: Internship123 (Changeable & linked to email for reset)
// -------------------------------------------------------------

export const AUTHORIZED_HR_EMAIL = 'Internship@mediaprima.com.my';
export const DEFAULT_HR_PASSWORD = 'Internship123';
export const HR_ROLE_NAME = 'HR Internship';

const STORAGE_KEY_AUTH_USER = 'ptas_hr_auth_session';
const STORAGE_KEY_CUSTOM_PASSWORD = 'ptas_hr_custom_password';

/**
 * Returns current effective password for HR Internship
 */
export function getEffectiveHRPassword(): string {
  try {
    const custom = localStorage.getItem(STORAGE_KEY_CUSTOM_PASSWORD);
    if (custom && custom.length >= 6) {
      return custom;
    }
  } catch (e) {
    console.error('Error reading custom password', e);
  }
  return DEFAULT_HR_PASSWORD;
}

/**
 * Checks if HR Internship is currently logged in
 */
export function getHRAuthSession(): { email: string; role: string; name: string } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUTH_USER);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.email) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading auth session', e);
  }
  return null;
}

/**
 * Logs in the exclusive HR Internship user
 */
export async function loginHR(
  emailInput: string,
  passwordInput: string
): Promise<{ success: boolean; message: string }> {
  const normalizedEmail = emailInput.trim().toLowerCase();
  const authorizedNormalized = AUTHORIZED_HR_EMAIL.toLowerCase();

  // Strict single user check
  if (normalizedEmail !== authorizedNormalized) {
    return {
      success: false,
      message: `Akaun tidak dibenarkan. Sistem ini hanya membenarkan log masuk bagi HR Internship (${AUTHORIZED_HR_EMAIL}).`,
    };
  }

  const expectedPassword = getEffectiveHRPassword();

  if (passwordInput !== expectedPassword) {
    return {
      success: false,
      message: 'Kata laluan tidak sah. Sila masukkan kata laluan yang betul atau gunakan fungsi "Lupa Kata Laluan".',
    };
  }

  // Attempt Firebase Auth sign-in or create user in background
  try {
    if (auth.currentUser?.isAnonymous) {
      // User is anonymous, attempt email login
      try {
        await signInWithEmailAndPassword(auth, AUTHORIZED_HR_EMAIL, passwordInput);
      } catch (signInErr: any) {
        if (signInErr?.code === 'auth/user-not-found') {
          await createUserWithEmailAndPassword(auth, AUTHORIZED_HR_EMAIL, passwordInput);
        }
      }
    }
  } catch (e) {
    console.warn('Firebase email auth background sync notice:', e);
  }

  // Store active session
  const session = {
    email: AUTHORIZED_HR_EMAIL,
    role: HR_ROLE_NAME,
    name: 'HR Internship Admin',
    loggedInAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(session));

  return {
    success: true,
    message: 'Log masuk berjaya sebagai HR Internship.',
  };
}

/**
 * Logs out HR Internship
 */
export async function logoutHR(): Promise<void> {
  try {
    localStorage.removeItem(STORAGE_KEY_AUTH_USER);
    await signOut(auth);
  } catch (e) {
    console.error('Error logging out', e);
  }
}

/**
 * Changes password for HR Internship
 */
export async function changePasswordHR(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  const expectedPassword = getEffectiveHRPassword();

  if (currentPassword !== expectedPassword) {
    return {
      success: false,
      message: 'Kata laluan semasa tidak tepat. Sila semak semula.',
    };
  }

  if (!newPassword || newPassword.length < 6) {
    return {
      success: false,
      message: 'Kata laluan baharu mestilah mengandungi sekurang-kurangnya 6 aksara.',
    };
  }

  // Save new password locally
  localStorage.setItem(STORAGE_KEY_CUSTOM_PASSWORD, newPassword);

  // Sync to Firebase Auth if user is authenticated with email
  try {
    if (auth.currentUser && !auth.currentUser.isAnonymous) {
      await updatePassword(auth.currentUser, newPassword);
    }
  } catch (e) {
    console.warn('Firebase Auth update password notice:', e);
  }

  // Also backup to config in Firestore
  try {
    await setDoc(doc(db, 'config', 'auth_policy'), {
      account: AUTHORIZED_HR_EMAIL,
      role: HR_ROLE_NAME,
      updatedAt: new Date().toISOString(),
      updatedBy: 'HR Internship Admin',
    });
  } catch (e) {
    console.warn('Firestore auth config sync notice:', e);
  }

  return {
    success: true,
    message: `Kata laluan bagi ${AUTHORIZED_HR_EMAIL} telah berjaya ditukar! Sila gunakan kata laluan baharu pada log masuk seterusnya.`,
  };
}

/**
 * Sends Password Reset link and resets password linked to Internship@mediaprima.com.my
 */
export async function resetPasswordHR(
  targetEmail: string,
  newResetPassword?: string
): Promise<{ success: boolean; message: string; defaultRestored?: boolean }> {
  const normalized = targetEmail.trim().toLowerCase();
  if (normalized !== AUTHORIZED_HR_EMAIL.toLowerCase()) {
    return {
      success: false,
      message: `Pautan reset hanya boleh dipautkan kepada emel rasmi ${AUTHORIZED_HR_EMAIL}.`,
    };
  }

  // Trigger official Firebase password reset email
  let firebaseEmailSent = false;
  try {
    await sendPasswordResetEmail(auth, AUTHORIZED_HR_EMAIL);
    firebaseEmailSent = true;
  } catch (e) {
    console.warn('Firebase sendPasswordResetEmail notice:', e);
  }

  if (newResetPassword && newResetPassword.length >= 6) {
    localStorage.setItem(STORAGE_KEY_CUSTOM_PASSWORD, newResetPassword);
    return {
      success: true,
      message: `Kata laluan telah ditetapkan semula kepada "${newResetPassword}". Pengesahan dipautkan ke ${AUTHORIZED_HR_EMAIL}.`,
    };
  }

  // Reset back to initial default password Internship123
  localStorage.removeItem(STORAGE_KEY_CUSTOM_PASSWORD);

  return {
    success: true,
    defaultRestored: true,
    message: firebaseEmailSent
      ? `Pautan penetapan semula kata laluan telah dihantar ke ${AUTHORIZED_HR_EMAIL}. Kata laluan sandaran lalai (${DEFAULT_HR_PASSWORD}) telah diaktifkan semula.`
      : `Pautan reset dipautkan ke emel ${AUTHORIZED_HR_EMAIL}. Kata laluan lalai rasmi (${DEFAULT_HR_PASSWORD}) telah diaktifkan semula untuk akses segera.`,
  };
}


