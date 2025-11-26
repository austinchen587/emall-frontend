// src/api/api/api.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    const method = config.method?.toUpperCase() || 'UNKNOWN';
    const url = config.url || 'unknown';
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
    return Promise.reject(error);
  }
);

export default apiClient;
 