import React from 'react';
import './Login.css';

const LoginButton = ({ onClick, children }) => {
    return (
        <button className="login-button" onClick={onClick}>
            {children}
        </button>
    );
};

export default LoginButton;
