import React from 'react';
import './AuthLayout.css';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
};
