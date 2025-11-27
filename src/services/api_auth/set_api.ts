// src/services/api_auth/set_api.ts
import axios from 'axios';

// 获取 CSRF token 的函数
const getCSRFToken = (): string | null => {
  const name = 'csrftoken';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

export const apiClient = axios.create({
  baseURL: 'http://192.168.10.10:3000/api',
  timeout: 10000,
  withCredentials: false, // 恢复这个配置
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    const method = config.method?.toUpperCase() || 'UNKNOWN';
    const url = config.url || 'unknown';
    
    // 为 POST/PUT/DELETE 请求添加 CSRF token
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      const csrfToken = getCSRFToken();
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
    }
    
    console.log(`请求: ${method} ${url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    console.log('响应:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API错误:', error.response?.status, error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
