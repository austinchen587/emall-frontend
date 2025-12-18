// src/pages/profit/hooks/useProfitData.ts
import { useState, useEffect } from 'react';
import { profitApi } from '../../../services/api_profit';
import { MonthlyProfitSummary, ProjectProfitStats } from '../../../services/types/profit';

export const useProfitData = () => {
  const [monthlySummary, setMonthlySummary] = useState<MonthlyProfitSummary[]>([]);
  const [projectStats, setProjectStats] = useState<ProjectProfitStats[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [summaryData, statsData] = await Promise.all([
          profitApi.getMonthlyProfitSummary(),
          profitApi.getProjectProfitStats(),
        ]);

        // 确保数据是数组类型
        const safeSummaryData = Array.isArray(summaryData) ? summaryData : [];
        const safeStatsData = Array.isArray(statsData) ? statsData : [];

        setMonthlySummary(safeSummaryData);
        setProjectStats(safeStatsData);
        
        // 默认选择最新的月份
        if (safeSummaryData.length > 0) {
          setSelectedMonth(safeSummaryData[0].statistics_month);
        }
      } catch (err) {
        console.error('获取利润数据失败:', err);
        setError(err instanceof Error ? err.message : '获取数据失败');
        // 设置空数组作为fallback
        setMonthlySummary([]);
        setProjectStats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 过滤出选定月份的数据 - 添加安全检查
  const filteredProjectStats = Array.isArray(projectStats) 
    ? projectStats.filter(project => project.statistics_month === selectedMonth)
    : [];

  const currentMonthSummary = Array.isArray(monthlySummary) 
    ? monthlySummary.find(summary => summary.statistics_month === selectedMonth)
    : undefined;

  return {
    monthlySummary,
    projectStats: filteredProjectStats,
    currentMonthSummary,
    selectedMonth,
    setSelectedMonth,
    loading,
    error,
  };
};
