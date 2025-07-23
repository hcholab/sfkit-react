import { useMemo } from "react";
import { useAuth } from "react-oidc-context";
import { useParams } from "react-router-dom";
import { useConfig } from "./useConfig";

const useGenerateAuthHeaders = (): Record<string, string> => {
  const { auth_key } = useParams();
  const auth = useAuth();
  const accessToken = auth.user?.access_token || "";
  const { onTerra } = useConfig();

  return useMemo(() => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    } else if (auth_key && !onTerra) {
      headers.Authorization = auth_key;
    }

    return headers;
  }, [auth_key, accessToken, onTerra]);
};

export default useGenerateAuthHeaders;
