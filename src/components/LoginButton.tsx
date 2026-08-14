import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import type { FC } from "react";
import { getFirebaseAuth } from "../hooks/firebase";

const LoginButton: FC = () => {
  const handleLogin = async () => {
    try {
      await signInWithRedirect(getFirebaseAuth(), new GoogleAuthProvider());
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <button className="btn btn-outline-primary" onClick={handleLogin}>
      Sign-in
    </button>
  );
};

export default LoginButton;
