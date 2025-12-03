// src/pages/Dashboard/utils/index.ts

// 导出接口定义
export interface DashboardStats {
  today_count: number;
  week_count: number;
  month_count: number;
  quarter_count: number;
  year_count: number;
  total_count: number;
}

export interface StatusStats {
  status: string;
  status_display: string;
  today: number;
  week: number;
  month: number;
  year: number;
  total: number;
}

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const getStatsPercentage = (current: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((current / total) * 100);
};

export const calculateCompletionRate = (stats: StatusStats[]): number => {
  const completed = stats.find(stat => stat.status === 'completed' || stat.status === 'successful');
  const total = stats.reduce((sum, stat) => sum + stat.total, 0);
  
  if (!completed || total === 0) return 0;
  return getStatsPercentage(completed.total, total);
};
