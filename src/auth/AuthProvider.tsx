import { onAuthStateChanged, User } from "firebase/auth";
import type { FC, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { AuthContext, AuthState } from ".";
import { AppConfig } from "../appConfig";
import { getFirebaseAuth, initFirebaseApp, removeUser } from "../hooks/firebase";

type ProviderProps = AppConfig & {
  children: ReactNode;
};

export const AuthProvider: FC<ProviderProps> = ({ apiBaseUrl, firebase, children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initFirebaseApp(firebase);
    return onAuthStateChanged(getFirebaseAuth(), async (u) => {
      setUser(u);
      setIsLoading(false);
      if (!u) return;
      try {
        const res = await fetch(`${apiBaseUrl}/api/profile/${u.uid}`, {
          headers: {
            Authorization: `Bearer ${await u.getIdToken()}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error(`profile fetch failed: ${res.status}`);
      } catch (e) {
        console.error("Failed to register user profile:", e);
      }
    });
  }, [apiBaseUrl, firebase]);

  const value = useMemo<AuthState>(
    () => ({
      userId: user?.uid ?? "",
      isLoading,
      removeUser,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
