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
    checkAuth();
  }, [checkAuth]);

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout
  };
};
