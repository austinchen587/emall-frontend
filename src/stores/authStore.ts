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
    
    // 根据实际的响应格式处理
    if (response.status === 'success') {
      // 保存用户信息和 token
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      set({
        user: response.user || null,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } else {
      // 如果 status 不是 success，抛出错误
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
      localStorage.removeItem('user');
      localStorage.removeItem('token');
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
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        const user = JSON.parse(userStr);
        // 验证 token 是否有效
        const response = await authAPI.verifyToken(token);
        
        if (response.status === 'success') {
          set({ user, isAuthenticated: true, isLoading: false });
        } else {
          // Token 无效，清除本地存储
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => set({ error: null })
}));
