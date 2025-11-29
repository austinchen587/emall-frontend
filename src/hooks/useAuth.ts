// src/hooks/useAuth.ts
import { useEffect, useRef } from 'react';
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

  // 使用 ref 来跟踪是否已经检查过认证
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    // 只在组件挂载时检查一次认证状态，避免重复调用
    if (!hasCheckedAuth.current) {
      hasCheckedAuth.current = true;
      console.log('执行认证检查...');
      checkAuth();
    }
  }, [checkAuth]); // 添加 checkAuth 到依赖数组

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout
  };
};
