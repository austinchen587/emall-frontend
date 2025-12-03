// src/services/api_procurement/index.ts
import apiClient from '../api_auth/set_api';
import { ProcurementStatsResponse } from '../types/procurement';

export const procurementApi = {
  // 获取每日利润统计
  getDailyProfitStats: async (): Promise<ProcurementStatsResponse> => {
    const response = await apiClient.get('/analysis/daily-profit-stats/');
    return response.data;
  },

  // 获取仪表盘统计
  getDashboardStats: async () => {
    const response = await apiClient.get('/analysis/dashboard-stats/');
    return response.data;
  },

  // 获取状态统计
  getStatusStats: async () => {
    const response = await apiClient.get('/analysis/status-stats/');
    return response.data;
  },

  // 获取按归属人统计
  getStatusStatsByOwner: async () => {
    const response = await apiClient.get('/analysis/status-stats-owner/');
    return response.data;
  }
};
