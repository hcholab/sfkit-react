import * as React from 'react';
import { useMsal } from '@azure/msal-react';

const LogoutButton: React.FC = () => {
    const { instance } = useMsal();

    const handleLogout = () => {
        instance.logout();
    };

    return (
        <button className="btn btn-outline-secondary" onClick={handleLogout}>Logout</button>
    );
}

export default LogoutButton;
