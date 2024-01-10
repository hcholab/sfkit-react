import { useContext, useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { AppContext } from "../App";
import { getFirestoreDatabase } from "./firebase";

type AuthTokenHook = {
  idToken: string;
  userId: string;
  tokenLoading: boolean;
  isDbInitialized: boolean;
};

const useAuthToken = (): AuthTokenHook => {
  const { apiBaseUrl } = useContext(AppContext);
  const auth = useAuth();
  const idToken = auth.user?.id_token || "";
  const [tokenLoading, setLoading] = useState(true);
  const [isDbInitialized, setDbInitialized] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (auth.isAuthenticated) {
      // Fetch Firebase custom token from your Flask backend
      fetch(`${apiBaseUrl}/api/createCustomToken`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.customToken && data.firebaseApiKey && data.firebaseProjectId && data.firestoreDatabaseId) {
            return getFirestoreDatabase(data.customToken, data.firebaseApiKey, data.firebaseProjectId, data.firestoreDatabaseId)
              .then(uid => {
                setUserId(uid);
                setDbInitialized(true);
                setLoading(false);
              });
          } else {
            throw new Error("Failed to get custom token or Firebase API key");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [apiBaseUrl, auth.isAuthenticated, auth.user, idToken]);

  return {
    idToken,
    userId,
    tokenLoading,
    isDbInitialized,
  };
};

export default useAuthToken;
