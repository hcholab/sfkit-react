import * as React from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogout = () => {
    auth.removeUser();
    navigate("/");
    window.location.reload();
  };

  return (
    <button className="btn btn-outline-secondary" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
