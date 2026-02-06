// src/stores/authStore.ts (修复初始化版本)
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

// [新增] 辅助函数：安全读取 LocalStorage
const getInitialState = () => {
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      return {
        user: JSON.parse(storedUser),
        isAuthenticated: true
      };
    }
  } catch (e) {
    console.error('读取 LocalStorage 失败', e);
  }
  return { user: null, isAuthenticated: false };
};

// [修改] 获取初始值
const { user: initialUser, isAuthenticated: initialAuth } = getInitialState();

export const useAuthStore = create<AuthState>((set) => ({
  // [关键修改] 使用 LocalStorage 里的值作为初始状态，而不是 null/false
  user: initialUser,
  isAuthenticated: initialAuth,
  
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
        
        // 更新状态并写入缓存
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
      // 清除状态和缓存
      set({
        user: null,
        isAuthenticated: false,
        error: null
      });
      
      localStorage.removeItem('user');
      // 清除 Cookie (保持你原有的逻辑)
      document.cookie = 'username=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  },

  checkAuth: async () => {
    // [优化] 如果本地已有用户数据，不要让 isLoading 变成 true 导致页面闪烁或重定向
    // 仅在后台静默检查
    // set({ isLoading: true }); 
    
    try {
      const response = await authAPI.checkSession();
      
      if (response.status === 'success' && response.user) {
        const userData = response.user;
        const userWithRole: User = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          role: (userData as any).role || 'unassigned'
        };
        
        // 会话有效，更新最新信息
        set({
          user: userWithRole,
          isAuthenticated: true,
          isLoading: false
        });
        localStorage.setItem('user', JSON.stringify(userWithRole));
      } else {
        // 会话失效，清除本地登录状态
        console.log('会话已失效');
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