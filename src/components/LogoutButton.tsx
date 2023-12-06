import * as React from 'react';
import { useAuth } from 'react-oidc-context';

const LogoutButton: React.FC = () => {
    const auth = useAuth();

    const handleLogout = () => {
        auth.removeUser();
    };

    return (
        <button className="btn btn-outline-secondary" onClick={handleLogout}>Logout</button>
    );
}

export default LogoutButton;
