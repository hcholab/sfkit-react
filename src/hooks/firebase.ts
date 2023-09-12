import { initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import { getAuth, signInWithCustomToken } from "firebase/auth";

let db: Firestore;

export const getFirestoreDatabase = (customToken: string, firebaseApiKey: string) => {
  const app = initializeApp({ apiKey: firebaseApiKey, projectId: "broad-cho-priv1" });
  const auth = getAuth(app);
  signInWithCustomToken(auth, customToken);
  db = getFirestore(app);
};

export const getDb = () => {
  if (!db) {
    throw new Error("Db has not been initialized. Call getFirestoreDatabase first.");
  }
  return db;
};
