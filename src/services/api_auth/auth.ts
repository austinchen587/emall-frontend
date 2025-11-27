// src/services/api_auth/auth.ts
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  status: 'success' | 'error';
  message: string;
  user?: {
    id: number;
    username: string;
    email: string;
  };
  token?: string;
}

// 模拟的 authAPI - 连接您的 Django 后端
const API_BASE_URL = 'http://192.168.10.10:8000'; // 使用服务器 IP
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      console.log('发送登录请求:', credentials);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      console.log('响应状态:', response.status, response.statusText);
      
      if (!response.ok) {
        // 获取详细的错误信息
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('后端返回的数据:', data);
      
      // 直接返回后端的数据，不要二次包装
      return data;
      
    } catch (error) {
      console.error('Login error:', error);
      // 错误时返回统一的错误格式
      return {
        status: 'error',
        message: error instanceof Error ? error.message : '登录失败'
      };
    }
  },
  // 同样修复 register 方法
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await fetch('${API_BASE_URL}/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data; // 直接返回后端数据
      
    } catch (error) {
      console.error('Register error:', error);
      return {
        status: 'error',
        message: error instanceof Error ? error.message : '注册失败'
      };
    }
  },

  logout: async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:8000/api/auth/logout/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // 添加 token 验证
  verifyToken: async (token: string): Promise<AuthResponse> => {
    try {
      const response = await fetch('${API_BASE_URL}/api/auth/verify/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Token verification failed');
      }

      const data = await response.json();
      return {
        status: 'success',
        message: 'Token verified',
        user: data.user
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Token verification failed'
      };
    }
  }
};
