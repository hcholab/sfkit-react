import * as React from "react";
import { useAuth } from "react-oidc-context";
import { Link } from "react-router-dom";
import useFirestore from "../hooks/useFirestore";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import NotificationList from "./NotificationList";

const Navbar: React.FC = () => {
  const auth = useAuth();
  const { userId, isDbInitialized } = useFirestore();

  return (
    <nav className="navbar navbar-expand-lg navbar-light py-4">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav03">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="nav03">
          <ul className="navbar-nav mt-3 mt-lg-0 mb-3 mb-lg-0 ms-lg-3 me-auto">
            <li className="nav-item me-4">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item me-4">
              <Link className="nav-link" to="/workflows">
                Workflows
              </Link>
            </li>
            <li className="nav-item me-4">
              <Link className="nav-link" to="/instructions">
                Instructions
              </Link>
            </li>
            <li className="nav-item me-4">
              <Link className="nav-link" to="/tutorials">
                Tutorials
              </Link>
            </li>
            <li className="nav-item me-4">
              <Link className="nav-link" to="/studies">
                Studies
              </Link>
            </li>
            <li className="nav-item me-4">
              <Link className="nav-link" to="https://sfkit.readthedocs.io/" target="_blank" rel="noopener noreferrer">
                CLI Documentation
              </Link>
            </li>
            <li className="nav-item me-4">
              <Link className="nav-link" to="/contact">
                Contact
              </Link>
            </li>
          </ul>
          <div className="ms-auto d-flex align-items-center">
            {!auth.isAuthenticated && isDbInitialized && <NotificationList userId={userId} />}
            {auth.isAuthenticated ? <LogoutButton /> : <LoginButton />}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
