import { useContext, useMemo } from "react";
import { AppContext } from "../App";
import { useParams } from "react-router-dom";
import { useAuth } from "react-oidc-context";

const useGenerateAuthHeaders = (): Record<string, string> => {
  const { auth_key } = useParams();
  const auth = useAuth();
  const accessToken = auth.user?.access_token || "";
  const { apiBaseUrl } = useContext(AppContext);

  return useMemo(() => {
    const url = new URL(apiBaseUrl);
    const onTerra = url.hostname.endsWith('.broadinstitute.org');
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    } else if (auth_key && !onTerra) {
      headers.Authorization = auth_key;
    }

    return headers;
  }, [auth_key, accessToken, apiBaseUrl]);
};

export default useGenerateAuthHeaders;
