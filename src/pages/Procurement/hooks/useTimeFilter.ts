// src/pages/Procurement/hooks/useTimeFilter.ts
import { useState, useMemo } from 'react';
import { DailyProfitStat } from '../../../services/types/procurement';
import { calculateProfit } from '../utils/calculations';

export const useTimeFilter = (stats: DailyProfitStat[]) => {
  const [timeRange, setTimeRange] = useState('today');

  const filteredStats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return stats.filter(stat => {
      // 安全检查：确保 selected_at 存在且不是 null
      if (!stat.selected_at) {
        console.warn('Missing or null selected_at for project:', stat.project_name);
        return timeRange === 'all';
      }
      
      try {
        // 直接解析日期字符串
        const selectedDate = new Date(stat.selected_at);
        
        // 验证日期是否有效
        if (isNaN(selectedDate.getTime())) {
          console.warn('Invalid date for project:', stat.project_name, 'Value:', stat.selected_at);
          return timeRange === 'all';
        }
        
        // 创建只包含年月日的日期对象用于比较
        const statDate = new Date(
          selectedDate.getFullYear(), 
          selectedDate.getMonth(), 
          selectedDate.getDate()
        );
        
        switch (timeRange) {
          case 'today':
            return statDate.getTime() === today.getTime();
          case 'yesterday':
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return statDate.getTime() === yesterday.getTime();
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return statDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return statDate >= monthAgo;
          case 'all':
            return true;
          default:
            return true;
        }
      } catch (error) {
        console.error('Error parsing selected_at date:', error, 'Project:', stat.project_name, 'Value:', stat.selected_at);
        return timeRange === 'all';
      }
    });
  }, [stats, timeRange]);

  const summary = useMemo(() => {
    const projectCount = filteredStats.length;
    const totalProfit = filteredStats.reduce((sum, stat) => {
      const profit = calculateProfit(stat, { [stat.project_name]: stat.final_negotiated_quote || 0 });
      return sum + (profit || 0);
    }, 0);

    // 修改：判断依据改为利润为 null
    const noFinalQuoteCount = filteredStats.filter(stat => 
      calculateProfit(stat, { [stat.project_name]: stat.final_negotiated_quote || 0 }) === null
    ).length;

    return { 
      projectCount, 
      totalProfit, 
      noFinalQuoteCount 
    };
  }, [filteredStats]);

  return {
    timeRange,
    setTimeRange,
    filteredStats,
    summary
  };
};
