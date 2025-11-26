import { apiClient } from './set_api';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/api/auth/login/', credentials);
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    await apiClient.post('/api/auth/logout/');
  },
  
  getCurrentUser: async () => {
    const response = await apiClient.get('/api/auth/user/');
    return response.data;
  }
};
