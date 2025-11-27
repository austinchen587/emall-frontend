// src/components/auth/AuthLayout.tsx
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import './AuthLayout.css';

interface AuthLayoutProps {
  children?: React.ReactNode;
  title?: string;
  // 移除 onSuccess 属性，因为跳转逻辑现在由 useEffect 处理
}

type AuthMode = 'login' | 'register';

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title = "磊极科技"
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
                // 移除 onSuccess 属性
                onSwitchToRegister={() => setMode('register')}
              />
            ) : (
              <RegisterForm 
                // 移除 onSuccess 属性
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
