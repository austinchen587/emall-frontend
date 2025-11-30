// src/stores/authStore.ts (最简版本)
import { create } from 'zustand';
import { authAPI, LoginRequest, RegisterRequest } from '../services/api_auth/auth';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

// 最简单的版本，不使用 get 参数
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login(credentials);
      
      if (response.status === 'success') {
        const userData = response.user || null;
        set({
          user: userData,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        
        if (userData) {
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } else {
        throw new Error(response.message || '登录失败');
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : '登录失败'
      });
      throw error;
    }
  },

  register: async (userData: RegisterRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.register(userData);
      if (response.status === 'success' && response.user) {
        const userData = response.user;
        set({
          user: userData,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        throw new Error(response.message || '注册失败');
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : '注册失败'
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        error: null
      });
      
      localStorage.removeItem('user');
      document.cookie = 'username=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const response = await authAPI.checkSession();
      
      if (response.status === 'success' && response.user) {
        const userData = response.user;
        set({
          user: userData,
          isAuthenticated: true,
          isLoading: false
        });
        
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    } catch (error) {
      console.error('checkAuth错误:', error);
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    }
  },

  clearError: () => set({ error: null })
}));

// 导出 authStore 对象
export const authStore = {
  getState: () => useAuthStore.getState()
};
