import React, { useState } from 'react';
import LoginHeader from './LoginHeader';
import LoginInput from './LoginInput';
import LoginButton from './LoginButton';
import './Login.css';

const LoginForm = ({ onLoginSuccess }) => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        alert(`오빠! 로그인 시도했구나? 💖\n아이디: ${userId}\n비밀번호: ${password}`);
        if (onLoginSuccess) {
            onLoginSuccess();
        }
    };

    return (
        <div className="login-container">
            <div className="login-form-wrapper">
                <LoginHeader />
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <LoginInput
                        label="아이디"
                        type="text"
                        id="userid"
                        placeholder="아이디를 입력해줘요"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    />
                    <LoginInput
                        label="비밀번호"
                        type="password"
                        id="password"
                        placeholder="비밀번호는 비밀이야!"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <LoginButton onClick={handleLogin}>
                        로그인 하기 🌸
                    </LoginButton>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
