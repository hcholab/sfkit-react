import { createContext } from "react";

export type AuthState = {
  userId?: string;
  isLoading: boolean;
  removeUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthState | undefined>(undefined);
