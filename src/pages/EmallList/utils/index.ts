// src/pages/EmallList/utils/index.ts
import { STATUS_DISPLAY_MAP } from '../constants';

export const formatCurrency = (amount: number | null): string => {
  if (amount == null) return '-';
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('zh-CN');
};

export const isValidUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isTextLong = (text: string): boolean => text ? text.length > 50 : false;

export const getBiddingStatusDisplay = (status?: string): string => 
  status ? STATUS_DISPLAY_MAP[status] || '未开始' : '未开始';

// 导出所有工具函数
export const emallUtils = {
  formatCurrency,
  formatDate,
  isValidUrl,
  isTextLong,
  getBiddingStatusDisplay
};
