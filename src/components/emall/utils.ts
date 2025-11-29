// src/components/emall/utils.ts
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('zh-CN');
  } catch {
    return dateString;
  }
};
