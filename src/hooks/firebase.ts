import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

let db: Firestore;

export const getFirestoreDatabase = async (customToken: string, apiKey: string, projectId: string, databaseId: string) => {
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
