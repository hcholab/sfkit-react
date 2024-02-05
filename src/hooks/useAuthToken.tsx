import { useContext, useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { AppContext } from "../App";
import { getFirestoreDatabase } from "./firebase";
import useGenerateAuthHeaders from "./useGenerateAuthHeaders";

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
  const headers = useGenerateAuthHeaders();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      setLoading(false);
      return;
    }
    fetch(`${apiBaseUrl}/api/createCustomToken`, {
      method: "POST",
      headers,
    })
      .then(async (res) => {
        const data = await res.json();
        if (data.customToken && data.firebaseApiKey && data.firebaseProjectId && data.firestoreDatabaseId) {
          const uid = await getFirestoreDatabase(
            data.customToken,
            data.firebaseApiKey,
            data.firebaseProjectId,
            data.firestoreDatabaseId
          );
          setUserId(uid);
          setDbInitialized(true);
          setLoading(false);
        } else {
          throw new Error("Failed to get custom token or Firebase API key");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, [apiBaseUrl, auth.isAuthenticated, auth.user, idToken, headers]);

  return {
    idToken,
    userId,
    tokenLoading,
    isDbInitialized,
  };
};

export default useAuthToken;
