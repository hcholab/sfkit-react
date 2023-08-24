import * as React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../msalConfig';

const LoginButton: React.FC = () => {
    const { instance } = useMsal();

    const handleLogin = async () => {
        try {
            await instance.loginPopup(loginRequest);
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <button className="btn btn-outline-primary" onClick={handleLogin}>Login with Microsoft</button>
    );
}

export default LoginButton;
