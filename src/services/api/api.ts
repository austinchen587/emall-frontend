// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',  // 添加 /api 前缀
  timeout: 10000,
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    console.log(`请求: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    console.log('响应:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API错误:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export default api;
