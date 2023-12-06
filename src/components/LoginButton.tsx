import * as React from "react";
import { useAuth } from "react-oidc-context";

const LoginButton: React.FC = () => {
  const auth = useAuth();

  const handleLogin = async () => {
    try {
      auth.signinPopup();
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
