import * as React from 'react';
import { useMsal } from "@azure/msal-react";
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

const Navbar: React.FC = () => {
    const { accounts } = useMsal();
    const isAuthenticated = accounts.length > 0;

    return (
        <nav className="navbar navbar-expand-lg navbar-light py-4">
            <div className="container-fluid">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav03">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="nav03">
                    <ul className="navbar-nav mt-3 mt-lg-0 mb-3 mb-lg-0 ms-lg-3 me-auto">
                        <li className="nav-item me-4">
                            <a className="nav-link" href="/">Home</a>
                        </li>
                        <li className="nav-item me-4">
                            <a className="nav-link" href="/workflows">Workflows</a>
                        </li>
                        <li className="nav-item me-4">
                            <a className="nav-link" href="/instructions">Instructions</a>
                        </li>
                        <li className="nav-item me-4">
                            <a className="nav-link" href="/tutorials">Tutorials</a>
                        </li>
                        <li className="nav-item me-4">
                            <a className="nav-link" href="/studies">Studies</a>
                        </li>
                        <li className="nav-item me-4">
                            <a className="nav-link" href="https://sfkit.readthedocs.io/" target="_blank" rel="noreferrer">CLI Documentation</a>
                        </li>
                        <li className="nav-item me-4">
                            <a className="nav-link" href="/contact">Contact</a>
                        </li>
                    </ul>
                    <div className="ms-auto">
                        { isAuthenticated ? <LogoutButton /> : <LoginButton />}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
