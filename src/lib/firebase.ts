import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';

const metaEnv = (import.meta as any).env || {};
const projectId = metaEnv.VITE_FIREBASE_PROJECT_ID || firebaseConfigJson.projectId;
const isCustomProject = !!metaEnv.VITE_FIREBASE_PROJECT_ID && metaEnv.VITE_FIREBASE_PROJECT_ID !== firebaseConfigJson.projectId;

const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || firebaseConfigJson.apiKey,
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigJson.authDomain,
  projectId: projectId,
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigJson.storageBucket,
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigJson.messagingSenderId,
  appId: metaEnv.VITE_FIREBASE_APP_ID || firebaseConfigJson.appId,
  firestoreDatabaseId: metaEnv.VITE_FIREBASE_DATABASE_ID || (isCustomProject ? undefined : firebaseConfigJson.firestoreDatabaseId),
};

const app = initializeApp(firebaseConfig);

const dbId = firebaseConfig.firestoreDatabaseId;
const isValidDbId = dbId && !dbId.startsWith('G-') && dbId !== '(default)';

export const db = isValidDbId
  ? getFirestore(app, dbId)
  : getFirestore(app);

