import React from 'react';
import LoginForm from '../components/login/LoginForm';

const LoginPage = ({ onLoginSuccess }) => {
    return (
        <div>
            <LoginForm onLoginSuccess={onLoginSuccess} />
        </div>
    );
};

export default LoginPage;
