import { useContext } from "react";
import { AuthContext, AuthState } from "../auth";

export const useAuth = (): AuthState => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth() must be used inside an <AuthProvider>");
  }
  return ctx;
};