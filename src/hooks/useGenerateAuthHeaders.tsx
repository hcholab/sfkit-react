import { useMemo } from "react";
import { useAuth } from "react-oidc-context";
import { useParams } from "react-router-dom";
import { useTerra } from "./useTerra";

const useGenerateAuthHeaders = (): Record<string, string> => {
  const { auth_key } = useParams();
  const auth = useAuth();
  const token = auth.user?.access_token || "";
  const { onTerra } = useTerra();

  return useMemo(() => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    } else if (auth_key && !onTerra) {
      headers.Authorization = auth_key;
    }

    return headers;
  }, [auth_key, token, onTerra]);
};

export default useGenerateAuthHeaders;
