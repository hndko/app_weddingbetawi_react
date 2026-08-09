import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfigJson from '../../firebase-applet-config.json';

const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfigJson.projectId;
const isCustomProject = !!import.meta.env.VITE_FIREBASE_PROJECT_ID && import.meta.env.VITE_FIREBASE_PROJECT_ID !== firebaseConfigJson.projectId;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfigJson.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigJson.authDomain,
  projectId: projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigJson.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigJson.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfigJson.appId,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || (isCustomProject ? undefined : firebaseConfigJson.firestoreDatabaseId),
};

const app = initializeApp(firebaseConfig);

const dbId = firebaseConfig.firestoreDatabaseId;
const isValidDbId = dbId && !dbId.startsWith('G-') && dbId !== '(default)';

export const db = isValidDbId
  ? getFirestore(app, dbId)
  : getFirestore(app);

export const storage = getStorage(app);
