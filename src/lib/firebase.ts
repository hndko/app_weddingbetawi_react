import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfigJson from '../../firebase-applet-config.json';

const metaEnv = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || firebaseConfigJson.apiKey,
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigJson.authDomain,
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || firebaseConfigJson.projectId,
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigJson.storageBucket,
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigJson.messagingSenderId,
  appId: metaEnv.VITE_FIREBASE_APP_ID || firebaseConfigJson.appId,
  firestoreDatabaseId: metaEnv.VITE_FIREBASE_DATABASE_ID || firebaseConfigJson.firestoreDatabaseId,
};

const app = initializeApp(firebaseConfig);

const dbId = firebaseConfig.firestoreDatabaseId;
const isValidDbId = dbId && !dbId.startsWith('G-') && dbId !== '(default)';

export const db = isValidDbId
  ? getFirestore(app, dbId)
  : getFirestore(app);

export const storage = getStorage(app);
