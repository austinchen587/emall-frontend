import { create } from 'zustand';
import { authAPI, LoginRequest } from '../services/api_auth/auth';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,

  login: async (credentials: LoginRequest) => {
    set({ isLoading: true });
    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem('token', response.token);
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false
      });
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
      localStorage.removeItem('token');
      set({
        user: null,
        token: null,
        isAuthenticated: false
      });
    }
  },

  checkAuth: async () => {
    const token = get().token;
    if (!token) return;

    set({ isLoading: true });
    try {
      const user = await authAPI.getCurrentUser();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  }
}));
