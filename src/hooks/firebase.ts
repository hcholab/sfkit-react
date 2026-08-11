import type { FirebaseOptions } from "firebase/app";
import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth, signOut } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

export type FirebaseConfig = FirebaseOptions & { databaseId: string };

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore;

export const initFirebaseApp = (cfg: FirebaseConfig): void => {
  app = initializeApp(cfg);
  auth = getAuth(app);
  db = getFirestore(getFirebaseApp(), cfg.databaseId);
};

export const getFirebaseApp = (): FirebaseApp => {
  if (!app) throw new Error("FirebaseApp not initialized");
  return app;
};

export const getFirebaseAuth = (): Auth => {
  if (!auth) throw new Error("Firebase Auth not initialized");
  return auth;
};

export const removeUser = async (): Promise<void> => {
  await signOut(getFirebaseAuth());
};

export const getDb = () => {
  if (!db) {
    throw new Error("Firestore not initialized. Call initFirestore first.");
  }
  return db;
};
