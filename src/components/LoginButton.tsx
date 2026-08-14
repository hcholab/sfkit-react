import { GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";
import type { FC } from "react";
import { getFirebaseAuth } from "../hooks/firebase";

const LoginButton: FC = () => {
  const handleLogin = async () => {
    try {
      const auth = getFirebaseAuth();
      const signIn = location.hostname === auth.config.authDomain ?
        signInWithRedirect : signInWithPopup;
      await signIn(auth, new GoogleAuthProvider());
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
