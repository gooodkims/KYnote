
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, LogIn, X } from 'lucide-react';
import './frmLogin.css';

export default function FrmLogin() {
    const [txtID, setTxtID] = useState("");
    const [txtPassword, setTxtPassword] = useState("");
    const [errorID, setErrorID] = useState(false);
    const [errorPass, setErrorPass] = useState(false);

    const txtIDRef = useRef(null);
    const txtPasswordRef = useRef(null);

    useEffect(() => {
        setTxtID("");
        setTxtPassword("");
        if (txtIDRef.current) txtIDRef.current.focus();
    }, []);

    const handleConfirmClick = () => {
        setErrorID(false);
        setErrorPass(false);

        if (txtID.trim() === "") {
            setErrorID(true);
            if (txtIDRef.current) txtIDRef.current.focus();
            return;
        }

        if (txtPassword.trim() === "") {
            setErrorPass(true);
            if (txtPasswordRef.current) txtPasswordRef.current.focus();
            return;
        }

        if (txtID === "admin" && txtPassword === "1234") {
            alert("로그인 성공!");
        } else {
            alert("아이디 또는 패스워드가 틀립니다.");
            setTxtID("");
            setTxtPassword("");
            if (txtIDRef.current) txtIDRef.current.focus();
        }
    };

    const handleExitClick = () => {
        if (confirm("프로그램을 종료하시겠습니까?")) {
            window.close();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="frmLogin-container"
        >
            <div className="frmLogin-header">
                <div className="frmLogin-title">환영합니다.</div>
                <div className="frmLogin-subtitle">KYcare 로그인하세요</div>
            </div>

            <div className="input-group">
                <label className="input-label">아이디</label>
                <div className="input-wrapper">
                    <User className="input-icon" size={18} />
                    <input
                        type="text"
                        className={`modern-input ${errorID ? 'error' : ''}`}
                        placeholder="Enter your ID"
                        value={txtID}
                        onChange={(e) => { setTxtID(e.target.value); setErrorID(false); }}
                        ref={txtIDRef}
                    />
                </div>
            </div>

            <div className="input-group">
                <label className="input-label">암호</label>
                <div className="input-wrapper">
                    <Lock className="input-icon" size={18} />
                    <input
                        type="password"
                        className={`modern-input ${errorPass ? 'error' : ''}`}
                        placeholder="Enter your password"
                        value={txtPassword}
                        onChange={(e) => { setTxtPassword(e.target.value); setErrorPass(false); }}
                        ref={txtPasswordRef}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleConfirmClick();
                        }}
                    />
                </div>
            </div>

            <div className="button-group">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="modern-btn btn-primary"
                    onClick={handleConfirmClick}
                >
                    <LogIn size={18} />
                    로그인
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="modern-btn btn-secondary"
                    onClick={handleExitClick}
                >
                    <X size={18} />
                    종료
                </motion.button>
            </div>
        </motion.div>
    );
}
