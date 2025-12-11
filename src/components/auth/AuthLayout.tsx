// src/components/auth/AuthLayout.tsx
import React from 'react';
import './AuthLayout.css';

interface AuthLayoutProps {
  children?: React.ReactNode;
  title?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title = "万柯国誉"
}) => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-card">
          {title && <h1 className="auth-title">{title}</h1>}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
