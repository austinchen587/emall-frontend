// src/pages/Auth/login.tsx
import React, { useState } from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import LoginForm from '../../components/auth/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm';
import './Login.css';

type AuthMode = 'login' | 'register';

const Login: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');

  const handleSwitchToRegister = () => {
    setMode('register');
  };

  const handleSwitchToLogin = () => {
    setMode('login');
  };

  return (
    <div className="login-page">
      <AuthLayout title="政府采购系统-内测">
        {mode === 'login' ? (
          <LoginForm onSwitchToRegister={handleSwitchToRegister} />
        ) : (
          <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
        )}
      </AuthLayout>
    </div>
  );
};

export default Login;
