import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const { checkAuth, isAuthenticated, isLoading, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    isAuthenticated,
    isLoading,
    user
  };
};
