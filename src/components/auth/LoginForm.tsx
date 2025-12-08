// src/components/auth/LoginForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import './LoginForm.css';

interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const navigate = useNavigate();
  
  const { login, isLoading, error: authError, isAuthenticated } = useAuthStore();

  // 监听认证状态变化，登录成功后跳转
  useEffect(() => {
    if (isAuthenticated) {
      console.log('登录成功，跳转到 dashboard');
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors: { username?: string; password?: string } = {};
    
    // 用户名验证：不能为空
    if (!username.trim()) {
      newErrors.username = '用户名不能为空';
    }
    
    // 密码验证：至少6个字符
    if (password.length < 6) {
      newErrors.password = '密码至少需要6个字符';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await login({ username, password });
      // 跳转逻辑现在由 useEffect 处理
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    
    // 实时验证
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, username: '用户名不能为空' }));
    } else {
      setErrors(prev => ({ ...prev, username: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    
    // 实时验证
    if (value.length > 0 && value.length < 6) {
      setErrors(prev => ({ ...prev, password: '密码至少需要6个字符' }));
    } else {
      setErrors(prev => ({ ...prev, password: undefined }));
    }
  };

  return (
    <div className="login-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            id="username"
            type="text"
            value={username}
            onChange={handleUsernameChange}
            placeholder="用户名"
            className={errors.username ? 'error' : ''}
            required
          />
          {errors.username && <span className="error-message">{errors.username}</span>}
        </div>
        
        <div className="form-group">
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="密码 (至少6个字符)"
            className={errors.password ? 'error' : ''}
            minLength={6}
            required
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>
        
        {authError && <div className="submit-error">{authError}</div>}
        
        <button type="submit" disabled={isLoading} className="login-button">
          {isLoading ? '登录中...' : '登录'}
        </button>
      </form>
      
      <div className="switch-auth">
        <span>还没有账号？</span>
        <button type="button" onClick={onSwitchToRegister} className="switch-button">
          立即注册
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
