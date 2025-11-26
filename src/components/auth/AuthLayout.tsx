// src/components/auth/AuthLayout.tsx
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import './AuthLayout.css';

interface AuthLayoutProps {
  children?: React.ReactNode;
  title?: string;
  onSuccess?: () => void;  // 新增 onSuccess 属性
}

type AuthMode = 'login' | 'register';

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title = "磊极科技",
  onSuccess 
}) => {
  const [mode, setMode] = useState<AuthMode>('login');

  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-card">
          {title && <h1 className="auth-title">{title}</h1>}
          {children || (
            mode === 'login' ? (
              <LoginForm 
                onSuccess={onSuccess || (() => window.location.href = '/dashboard')}
                onSwitchToRegister={() => setMode('register')}
              />
            ) : (
              <RegisterForm 
                onSuccess={onSuccess || (() => window.location.href = '/dashboard')}
                onSwitchToLogin={() => setMode('login')}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
