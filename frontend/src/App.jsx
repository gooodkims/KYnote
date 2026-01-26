import { useState } from 'react';
import FrmLogin from './forms/frmLogin';
import FrmPatient from './forms/frmPatient';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('login');

  const handleLoginSuccess = () => {
    setCurrentScreen('patient');
  };

  return (
    <div>
      {currentScreen === 'login' && <FrmLogin onLoginSuccess={handleLoginSuccess} />}
      {currentScreen === 'patient' && <FrmPatient />}
    </div>
  );
}

export default App;
