// src/pages/Dashboard/hooks/useDashboardData.ts
import { useState, useEffect } from 'react';
import { dashboardAPI, DashboardStats, StatusStats, StatusStatsOwner } from '../../../services/api_dashboard';

export interface DashboardData {
  stats: DashboardStats;
  statusStats: StatusStats[];
  ownerStats: StatusStatsOwner[];
}

export const useDashboardData = (owner: string = '陈少帅') => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [stats, statusStats, ownerStats] = await Promise.all([
        dashboardAPI.getDashboardStats(),
        dashboardAPI.getStatusStats(),
        dashboardAPI.getStatusStatsByOwner(owner),
      ]);

      setData({
        stats,
        statusStats,
        ownerStats,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [owner]);

  const refetch = () => {
    fetchDashboardData();
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
};
