// src/pages/Procurement/hooks/useProcurementData.ts
import { useState, useEffect } from 'react';
import { procurementApi } from '../../../services/api_procurement';
import { DailyProfitStat } from '../../../services/types/procurement';

export const useProcurementData = () => {
  const [stats, setStats] = useState<DailyProfitStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadDailyProfitStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await procurementApi.getDailyProfitStats();
      
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError(response.error || '获取数据失败');
      }
    } catch (err: any) {
      setError(err.message || '网络错误，请稍后重试');
      console.error('Error loading daily profit stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDailyProfitStats();
  }, []);

  return {
    stats,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    loadDailyProfitStats
  };
};
