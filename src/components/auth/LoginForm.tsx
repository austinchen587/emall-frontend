// src/components/auth/LoginForm.tsx
import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { validateForm, validationRules } from '../../utils/validation';
import './LoginForm.css';

interface FormData {
  username: string;
  password: string;
}

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string>('');
  
  const { login, isLoading } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      const validator = validationRules[name];
      if (validator) {
        const error = validator(value);
        setErrors(prev => ({
          ...prev,
          [name]: error || ''
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    
    const formErrors = validateForm(formData, validationRules);
    setErrors(formErrors);
    
    if (Object.keys(formErrors).length > 0) {
      return;
    }

    try {
      await login(formData);
      onSuccess();
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || '登录失败，请重试');
    }
  };

  return (
    <div className="login-form">
      <h2>用户登录</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">用户名</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={errors.username ? 'error' : ''}
            disabled={isLoading}
          />
          {errors.username && <span className="error-text">{errors.username}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">密码</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'error' : ''}
            disabled={isLoading}
          />
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        {submitError && <div className="submit-error">{submitError}</div>}

        <button 
          type="submit" 
          disabled={isLoading}
          className="login-button"
        >
          {isLoading ? '登录中...' : '登录'}
        </button>

        {onSwitchToRegister && (
          <div className="switch-auth">
            <span>没有账号？</span>
            <button type="button" onClick={onSwitchToRegister} className="switch-button">
              立即注册
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
