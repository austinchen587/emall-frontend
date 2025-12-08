// src/stores/authStore.ts (修复版本)
import { create } from 'zustand';
import { authAPI, LoginRequest, RegisterRequest } from '../services/api_auth/auth';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
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
      
      if (response.status === 'success') {
        const userData = response.user || null;
        const userWithRole: User | null = userData ? {
          ...userData,
          role: (userData as any).role || 'unassigned'
        } : null;
        
        set({
          user: userWithRole,
          isAuthenticated: true,
 isLoading: false,
          error: null
        });
        
        if (userWithRole) {
          localStorage.setItem('user', JSON.stringify(userWithRole));
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
        const userWithRole: User = {
          ...userData,
          role: (userData as any).role || 'unassigned'
        };
        
        set({
          user: userWithRole,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        
        localStorage.setItem('user', JSON.stringify(userWithRole));
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
      
      console.log('checkAuth 响应:', response);
      
      if (response.status === 'success' && response.user) {
        // 关键修复：确保用户数据结构正确
        const userData = response.user;
        const userWithRole: User = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          role: (userData as any).role || 'unassigned'  // 使用类型断言
        };
        
        set({
          user: userWithRole,
          isAuthenticated: true,
          isLoading: false
        });
        
        localStorage.setItem('user', JSON.stringify(userWithRole));
      } else {
        // 关键修复：即使 status 是 success，但没有 user 数据也要视为未认证
        console.log('认证失败：缺少用户数据');
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('checkAuth错误:', error);
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
      localStorage.removeItem('user');
    }
  },

  clearError: () => set({ error: null })
}));

export const authStore = {
  getState: () => useAuthStore.getState()
};
