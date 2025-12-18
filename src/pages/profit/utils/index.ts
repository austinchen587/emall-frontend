// src/pages/profit/utils/index.ts
import { MonthlyProfitSummary } from '../../../services/types/profit';

// 格式化金额显示
export const formatCurrency = (amount: string | null): string => {
  if (!amount) return '0.00';
  const num = parseFloat(amount);
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// 格式化百分比
export const formatPercentage = (value: string): string => {
  if (!value) return '0.00%';
  const num = parseFloat(value);
  return `${(num * 100).toFixed(2)}%`;
};

// 获取利润颜色
export const getProfitColor = (profit: string): string => {
  if (!profit) return '#000000';
  const num = parseFloat(profit);
  if (num > 0) return '#52c41a'; // 绿色
  if (num < 0) return '#f5222d'; // 红色
  return '#000000'; // 黑色
};

// 格式化周期天数
export const formatCycleDays = (days: number): string => {
  return `${days || 0}天`;
};

// 排序月度数据（最新的在前面）
export const sortMonthlyData = (data: MonthlyProfitSummary[]): MonthlyProfitSummary[] => {
  return data.sort((a, b) => b.statistics_month.localeCompare(a.statistics_month));
};
