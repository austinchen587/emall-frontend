// src/services/api_dashboard/index.ts
import apiClient from '../api_auth/set_api';
import { DashboardStats, StatusStats, StatusStatsOwner } from '../types/dashboard';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class DashboardAPI {
  private async fetchData<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    try {
      const response = await apiClient.get(`/analysis${endpoint}`, {
        params: params
      });

      const data: ApiResponse<T> = response.data;
      
      if (!data.success) {
        throw new Error(data.error || 'API request failed');
      }

      return data.data as T;
    } catch (error: any) {
      if (error.response?.data) {
        const apiError = error.response.data;
        throw new Error(apiError.error || apiError.message || 'API request failed');
      }
      throw error;
    }
  }

  async getDashboardStats(): Promise<DashboardStats> {
    return this.fetchData<DashboardStats>('/dashboard-stats/');
  }

  async getStatusStats(): Promise<StatusStats[]> {
    return this.fetchData<StatusStats[]>('/status-stats/');
  }

  async getStatusStatsByOwner(owner: string): Promise<StatusStatsOwner[]> {
    return this.fetchData<StatusStatsOwner[]>('/status-stats-owner/', { owner });
  }
}

export const dashboardAPI = new DashboardAPI();

// 导出类型
export type { DashboardStats, StatusStats, StatusStatsOwner };
