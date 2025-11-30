// src/components/emall/detail/utils/formatters.ts
export const formatCurrency = (amount: number | null): string => {
  if (amount === null || amount === undefined) return '-';
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
  } catch (error) {
    return dateString;
  }
};
