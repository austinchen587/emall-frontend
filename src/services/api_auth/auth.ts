// src/services/api_auth/auth.ts
import { apiClient } from './set_api';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email?: string;
  password: string;
  password_confirm: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export interface AuthResponse {
  status: string;
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login/', credentials);
    console.log('完整的登录响应:', response.data);

    // Session 认证，只保存用户信息，不保存 token
    if (response.data.status === 'success') {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      console.log('用户信息保存成功');
    }
    
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register/', userData);
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout/');
    } catch (error) {
      console.log('登出请求失败，继续清除本地存储');
    } finally {
      localStorage.removeItem('user');
    }
  },
  
  getCurrentUser: async (): Promise<AuthResponse> => {
    const response = await apiClient.get('/auth/user/');
    return response.data;
  }
};
