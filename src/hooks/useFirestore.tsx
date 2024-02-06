import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../App";
import { getFirestoreDatabase } from "./firebase";
import useGenerateAuthHeaders from "./useGenerateAuthHeaders";

type FirestoreHook = {
  userId: string;
  isDbInitialized: boolean;
};

const useFirestore = (): FirestoreHook => {
  const { apiBaseUrl } = useContext(AppContext);
  const [isDbInitialized, setDbInitialized] = useState(false);
  const [userId, setUserId] = useState("");
  const headers = useGenerateAuthHeaders();
  const isFetchingCustomTokenRef = useRef(false);

  useEffect(() => {
    if (!headers.Authorization || headers.Authorization === "Bearer " || isFetchingCustomTokenRef.current) {
      return;
    }
    isFetchingCustomTokenRef.current = true;
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
      })
      .finally(() => {
        isFetchingCustomTokenRef.current = false;
      });
  }, [apiBaseUrl, headers]);

  return {
    userId,
    isDbInitialized,
  };
};

export default useFirestore;
