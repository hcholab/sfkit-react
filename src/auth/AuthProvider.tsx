import { onAuthStateChanged, User } from "firebase/auth";
import type { FC, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { AuthContext, AuthState } from ".";
import { FirebaseConfig, getFirebaseAuth, initFirebaseApp, removeUser } from "../hooks/firebase";

type ProviderProps = {
  firebase: FirebaseConfig;
  children: ReactNode;
};

export const AuthProvider: FC<ProviderProps> = ({ firebase, children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initFirebaseApp(firebase);
    return onAuthStateChanged(getFirebaseAuth(), (u) => {
      setUser(u);
      setIsLoading(false);
    });
  }, [firebase]);

  const value = useMemo<AuthState>(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      removeUser,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
