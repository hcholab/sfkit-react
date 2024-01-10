import { initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import { getAuth, signInWithCustomToken } from "firebase/auth";

let db: Firestore;

export const getFirestoreDatabase = (customToken: string, apiKey: string, projectId: string, databaseId: string) => {
  const app = initializeApp({ apiKey, projectId });
  const auth = getAuth(app);
  signInWithCustomToken(auth, customToken)
    .then(user => console.log("Firebase user:", user.user));
  db = getFirestore(app, databaseId);
};

export const getDb = () => {
  if (!db) {
    throw new Error("Db has not been initialized. Call getFirestoreDatabase first.");
  }
  return db;
};
