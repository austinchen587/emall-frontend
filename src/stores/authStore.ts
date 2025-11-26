// src/stores/authStore.ts
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
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (credentials: LoginRequest) => {
    set({ isLoading: true });
    try {
      const response = await authAPI.login(credentials);
      if (response.status === 'success') {
        set({
          user: response.user,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (userData: RegisterRequest) => {
    set({ isLoading: true });
    try {
      const response = await authAPI.register(userData);
      if (response.status === 'success') {
        // 注册成功后自动登录
        const loginResponse = await authAPI.login({
          username: userData.username,
          password: userData.password
        });
        set({
          user: loginResponse.user,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      set({ isLoading: false });
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
      set({
        user: null,
        isAuthenticated: false
      });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      // 检查本地存储的用户信息
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      localStorage.removeItem('user');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  }
}));
