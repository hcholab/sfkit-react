import { useContext } from "react";
import { AppContext } from "../App";
import { useParams } from "react-router-dom";
import { useAuth } from "react-oidc-context";

const useGenerateAuthHeaders = (): Record<string, string> => {
  const { auth_key } = useParams();
  const auth = useAuth();
  const idToken = auth.user?.id_token || "";
  const { apiBaseUrl } = useContext(AppContext);

  const onTerra = apiBaseUrl.includes("broad");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (idToken) {
    headers.Authorization = `Bearer ${idToken}`;
  } else if (auth_key && !onTerra) {
    headers.Authorization = auth_key;
  }

  return headers;
};

export default useGenerateAuthHeaders;
