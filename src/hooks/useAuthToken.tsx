import { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { getFirestoreDatabase } from "./firebase";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

type AuthTokenHook = {
  idToken: string;
  userId: string;
  tokenLoading: boolean;
  isDbInitialized: boolean;
};

const useAuthToken = (): AuthTokenHook => {
  const { instance, inProgress, accounts } = useMsal();
  const [idToken, setIdToken] = useState<string>("");
  const userId: string = accounts[0]?.idTokenClaims?.sub?.toString() || "";
  const [tokenLoading, setLoading] = useState(true);
  const [isDbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    if (inProgress === "none" && accounts.length > 0) {
      const request = {
        scopes: ["openid"],
        account: accounts[0],
      };

      instance
        .acquireTokenSilent(request)
        .then((response) => {
          setIdToken(response.idToken);

          // Fetch Firebase custom token from your Flask backend
          fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/createCustomToken`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${response.idToken}`,
            },
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.customToken && data.firebaseApiKey) {
                getFirestoreDatabase(data.customToken, data.firebaseApiKey);
                setDbInitialized(true);
                setLoading(false);
              } else {
                throw new Error("Failed to get custom token or Firebase API key");
              }
            })
            .catch((error) => {
              console.error("Error:", error);
              setLoading(false);
            });
        })
        .catch((error) => {
          console.error("Failed to acquire token silently:", error);

          if (error instanceof InteractionRequiredAuthError) {
            // Handle interaction required error silently
            console.log("User interaction required, but proceeding silently.");
            setLoading(false);
            setIdToken(""); // Reset the ID token to indicate no user is logged in
            return;
          }

          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [inProgress, accounts, instance]);

  return {
    idToken,
    userId,
    tokenLoading,
    isDbInitialized,
  };
};

export default useAuthToken;
