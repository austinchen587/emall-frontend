// src/stores/authStore.ts
import { create } from 'zustand';
import { authAPI, LoginRequest, RegisterRequest } from '@/services/api_auth/auth';

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

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login(credentials);
      
      console.log('authStore 接收到的响应:', response);
      
      if (response.status === 'success') {
        // Session 认证不需要存储 token，只需设置用户状态
        set({
          user: response.user || null,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      } else {
        throw new Error(response.message || '登录失败');
      }
    } catch (error) {
      console.error('登录错误:', error);
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
        set({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
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
      // Session 认证只需要清除前端状态，后端 session 会在服务器端失效
      set({
        user: null,
        isAuthenticated: false,
        error: null
      });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      // Session 认证：直接调用后端检查当前会话状态
      const response = await authAPI.checkSession();
      
      console.log('checkAuth 响应:', response);
      
      if (response.status === 'success' && response.user) {
        set({
          user: response.user,
          isAuthenticated: true,
          isLoading: false
        });
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
