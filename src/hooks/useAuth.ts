// src/hooks/useAuth.ts
import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const { 
    checkAuth, 
    isAuthenticated, 
    isLoading, 
    user,
    login,
    logout 
  } = useAuthStore();

  useEffect(() => {
    // 只在组件挂载时检查一次认证状态
    checkAuth();
  }, []); // 空依赖数组

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout
  };
};
