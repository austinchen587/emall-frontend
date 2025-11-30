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

// 获取 username 的函数
const getUsername = (): string | null => {
  const cookies = document.cookie.split(';');
  const usernameCookie = cookies.find(cookie => cookie.trim().startsWith('username='));
  if (usernameCookie) {
    return decodeURIComponent(usernameCookie.split('=')[1]);
  }
  return null;
};

// 从 localStorage 获取用户信息的函数
const getUserFromStorage = (): { username: string } | null => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
  } catch (error) {
    console.error('解析用户信息失败:', error);
  }
  return null;
};

export const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    const method = config.method?.toUpperCase() || 'UNKNOWN';
    const url = config.url || 'unknown';
    
    console.log(`请求: ${method} ${url}`);
    
    // 为 POST/PUT/DELETE 请求添加 CSRF token
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      const csrfToken = getCSRFToken();
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
    }
    
    // 添加用户名到请求头
    let username: string | null = null;
    
    // 1. 首先尝试从 cookie 获取
    username = getUsername();
    
    // 2. 如果 cookie 中没有，尝试从 localStorage 获取
    if (!username) {
      const userFromStorage = getUserFromStorage();
      if (userFromStorage && userFromStorage.username) {
        username = userFromStorage.username;
      }
    }
    
    if (username) {
      config.headers['X-Username'] = username;
      console.log('添加用户名到请求头:', username);
    }
    
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
      document.cookie = 'username=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
