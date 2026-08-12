import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { getFirebaseAuth } from "./firebase";
import { useConfig } from "./useConfig";

const useGenerateAuthHeaders = () => {
  const { auth_key } = useParams();
  const { onTerra } = useConfig();

  return useCallback(async (): Promise<Record<string, string>> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const idToken = await getFirebaseAuth().currentUser?.getIdToken();
    if (idToken) {
      headers.Authorization = `Bearer ${idToken}`;
    } else if (auth_key && !onTerra) {
      headers.Authorization = auth_key;
    }

    return headers;
  }, [auth_key, onTerra]);
};

export default useGenerateAuthHeaders;
