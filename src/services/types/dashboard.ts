// src/services/types/dashboard.ts
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

export interface StatusStatsOwner {
  status: string;
  status_display: string;
  today: number;
  week: number;
  month: number;
  year: number;
  total: number;
}

export interface DashboardData {
  stats: DashboardStats;
  statusStats: StatusStats[];
  ownerStats: StatusStatsOwner[];
}
