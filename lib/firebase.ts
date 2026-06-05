// lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  connectFirestoreEmulator 
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate config
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('Firebase config is missing required fields');
  console.log('Current config:', {
    hasApiKey: !!firebaseConfig.apiKey,
    hasProjectId: !!firebaseConfig.projectId,
    projectId: firebaseConfig.projectId,
  });
}

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth and Storage normally
export const auth = getAuth(app);
export const storage = getStorage(app);

// Initialize Firestore with persistent cache (client-side only)
let db;

if (typeof window !== 'undefined') {
  // Client-side: Enable persistent local cache
  try {
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    });
    console.log('✅ Firestore persistent cache enabled');
  } catch (error) {
    // If persistence fails (e.g., private browsing), fall back to default
    console.warn('⚠️ Firestore persistence not available, using default cache:', error);
    db = getFirestore(app);
  }
} else {
  // Server-side: Use default Firestore (no persistence needed)
  db = getFirestore(app);
}

// Optional: Connect to emulator in development
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
  if (typeof window !== 'undefined') {
    try {
      connectFirestoreEmulator(db, 'localhost', 8080);
      console.log('🔧 Connected to Firestore emulator');
    } catch (error) {
      console.warn('Emulator already connected or not available');
    }
  }
}

// Log for debugging
console.log('Firebase initialized with project:', firebaseConfig.projectId);

export { db };
export default app;
