// src/pages/Procurement/hooks/useSorting.ts
import { useState, useMemo } from 'react';
import { DailyProfitStat } from '../../../services/types/procurement';
import { calculateProfit } from '../utils/calculations';

export const useSorting = (stats: DailyProfitStat[], searchTerm: string) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // 添加搜索过滤逻辑
  const filteredStats = useMemo(() => 
    stats.filter(stat =>
      stat.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stat.project_owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stat.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [stats, searchTerm]);

  const sortedStats = useMemo(() => {
    if (!sortConfig) return filteredStats;
    
    return [...filteredStats].sort((a, b) => {
      let aValue: any = a[sortConfig.key as keyof DailyProfitStat];
      let bValue: any = b[sortConfig.key as keyof DailyProfitStat];
      
      if (sortConfig.key === 'profit') {
        aValue = calculateProfit(a, { [a.project_name]: a.final_negotiated_quote || 0 });
        bValue = calculateProfit(b, { [b.project_name]: b.final_negotiated_quote || 0 });
        
        // 处理null值排序：没有利润数据的排最后
        if (aValue === null && bValue === null) return 0;
        if (aValue === null) return sortConfig.direction === 'asc' ? 1 : -1;
        if (bValue === null) return sortConfig.direction === 'asc' ? -1 : 1;
      }
      
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.direction === 'asc' ? -1 : 1;
      if (bValue == null) return sortConfig.direction === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue, 'zh-CN');
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }
      
      return 0;
    });
  }, [filteredStats, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return {
    sortConfig,
    handleSort,
    sortedStats
  };
};
