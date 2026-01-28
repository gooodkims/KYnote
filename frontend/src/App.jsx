import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import PatientPage from './pages/PatientPage';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('login');

  const handleLoginSuccess = () => {
    setCurrentScreen('patient');
  };

  return (
    <div>
      {currentScreen === 'login' && <LoginPage onLoginSuccess={handleLoginSuccess} />}
      {currentScreen === 'patient' && <PatientPage />}
    </div>
  );
}

export default App;
