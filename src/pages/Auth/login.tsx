// src/pages/Auth/login.tsx
import React from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import LoginForm from '../../components/auth/LoginForm';
import './Login.css';

const Login: React.FC = () => {
  const handleSwitchToRegister = () => {
    console.log('切换到注册页面');
  };

  return (
    <div className="login-page">
      <AuthLayout title="磊极科技">
        <LoginForm onSwitchToRegister={handleSwitchToRegister} />
      </AuthLayout>
    </div>
  );
};

export default Login;
