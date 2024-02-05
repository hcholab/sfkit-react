import { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import { getFirestoreDatabase } from "./firebase";
import useGenerateAuthHeaders from "./useGenerateAuthHeaders";

type AuthKeyHook = {
  userId: string;
  isDbInitialized: boolean;
};

const useAuthToken = (): AuthKeyHook => {
  const { apiBaseUrl } = useContext(AppContext);
  const [isDbInitialized, setDbInitialized] = useState(false);
  const [userId, setUserId] = useState("");
  const headers = useGenerateAuthHeaders();

  useEffect(() => {
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
        } else {
          throw new Error("Failed to get custom token or Firebase API key");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }, [apiBaseUrl, headers]);

  return {
    userId,
    isDbInitialized,
  };
};

export default useAuthToken;
