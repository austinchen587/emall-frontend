// src/services/dataService.ts
import api from './set_api';
import { User, HelloResponse } from '../types';

export const dataService = {
  // 测试连接
  helloWorld: async (): Promise<HelloResponse> => {
    const response = await api.get('/hello/');
    return response.data;
  },

  // 获取用户列表
  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/users/');
    return response.data;
  }
};

export default dataService;
