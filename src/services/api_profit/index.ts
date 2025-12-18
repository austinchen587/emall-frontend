// src/services/api_profit/index.ts
import apiClient from '../api_auth/set_api';
import { MonthlyProfitSummary, ProjectProfitStats } from '../types/profit';

export const profitApi = {
  // 获取月度利润汇总
  async getMonthlyProfitSummary(): Promise<MonthlyProfitSummary[]> {
    const response = await apiClient.get('/analysis/monthly-profit-summary/');
    return response.data.data; // 修正：返回 data 字段
  },

  // 获取项目利润统计
  async getProjectProfitStats(): Promise<ProjectProfitStats[]> {
    const response = await apiClient.get('/analysis/project-profit-stats/');
    return response.data.data; // 修正：返回 data 字段
  },
};
