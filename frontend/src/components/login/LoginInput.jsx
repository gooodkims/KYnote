import React from 'react';
import './Login.css';

const LoginInput = ({ label, type, placeholder, value, onChange, id }) => {
    return (
        <div className="login-input-group">
            <label htmlFor={id} className="login-label">{label}</label>
            <input
                type={type}
                id={id}
                className="login-input"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

export default LoginInput;
