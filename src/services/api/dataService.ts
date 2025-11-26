// src/services/dataService.ts
import api from './api';
import { User, HelloResponse } from '../types';

export const dataService = {
  // 测试连接
  helloWorld: async (): Promise<HelloResponse> => {
    const response = await api.get('/hello_world/');
    return response.data;
  },

  // 获取用户列表
  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/user_list/');
    return response.data;
  },

  // 添加用户
  addUser: async (userData: Omit<User, 'id'>): Promise<User> => {
    const response = await api.post('/user_list/', userData);
    return response.data;
  },

  // 更新用户
  updateUser: async (id: number, userData: Partial<User>): Promise<User> => {
    const response = await api.put(`/user_list/${id}/`, userData);
    return response.data;
  },

  // 删除用户
  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/user_list/${id}/`);
  }
};

export default dataService;
