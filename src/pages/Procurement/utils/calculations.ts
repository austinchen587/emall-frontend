// src/pages/Procurement/utils/calculations.ts
// 在calculations.ts文件顶部添加导入
import { DailyProfitStat } from '../../../services/types/procurement';


export const calculateProfit = (stat: DailyProfitStat, finalQuotes: Record<string, number>) => {
  // 优先使用stat中的final_negotiated_quote，如果没有则使用finalQuotes中的值
  const finalQuoteValue = stat.final_negotiated_quote !== undefined 
    ? stat.final_negotiated_quote 
    : finalQuotes[stat.project_name];
  
  // 如果最终报价是undefined、null、空字符串，返回null
  if (finalQuoteValue === undefined || finalQuoteValue === null) {
    return null;
  }
  
  // 转换为数字类型
  const finalQuote = Number(finalQuoteValue);
  
  // 如果转换后是NaN或0，返回null
  if (isNaN(finalQuote) || finalQuote === 0) {
    return null;
  }
  
  const totalQuote = Number(stat.total_quote) || 0;
  return finalQuote - totalQuote;
};

export const getProfitClass = (profit: number | null) => {
  if (profit === null) return 'profit-neutral';
  if (profit > 0) return 'profit-positive';
  if (profit < 0) return 'profit-negative';
  return 'profit-neutral';
};

export const formatProfit = (profit: number | null) => {
  if (profit === null) return '-';
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2
  }).format(profit);
};
