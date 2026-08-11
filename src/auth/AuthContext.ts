import type { User } from "firebase/auth";
import { createContext } from "react";

export type AuthState = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  removeUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthState | undefined>(undefined);
