import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth, signInWithCustomToken, signOut } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

export type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  databaseId: string;
};

let _app: FirebaseApp | undefined;
let _auth: Auth | undefined;
let db: Firestore;

export const initFirebaseApp = (cfg: FirebaseConfig): void => {
  _app = initializeApp(cfg);
  _auth = getAuth(_app);
};

export const getFirebaseApp = (): FirebaseApp => {
  if (!_app) throw new Error("FirebaseApp not initialized");
  return _app;
};

export const getFirebaseAuth = (): Auth => {
  if (!_auth) throw new Error("Firebase Auth not initialized");
  return _auth;
};

export const removeUser = async (): Promise<void> => {
  await signOut(getFirebaseAuth());
};

export const getFirestoreDatabase = async (customToken: string, apiKey: string, projectId: string, databaseId: string): Promise<string> => {
  const app = initializeApp({ apiKey, projectId });
  const auth = getAuth(app);
  const { user: { uid } } = await signInWithCustomToken(auth, customToken);
  db = getFirestore(app, databaseId);
  return uid;
};

export const getDb = () => {
  if (!db) {
    throw new Error("Db has not been initialized. Call getFirestoreDatabase first.");
  }
  return db;
};
