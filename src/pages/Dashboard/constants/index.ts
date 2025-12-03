// src/pages/Dashboard/constants/index.ts
export const STATS_CARDS = [
  {
    key: 'today_count' as const,
    label: '今日新增',
    color: 'blue' as const,
    icon: '📊',
  },
  {
    key: 'week_count' as const,
    label: '本周新增',
    color: 'green' as const,
    icon: '📈',
  },
  {
    key: 'month_count' as const,
    label: '本月新增',
    color: 'purple' as const,
    icon: '🗓️',
  },
  {
    key: 'total_count' as const,
    label: '累计总数',
    color: 'orange' as const,
    icon: '📦',
  },
];

export const STATUS_COLORS = {
  not_started: '#6B7280',
  in_progress: '#F59E0B',
  successful: '#10B981',
  failed: '#EF4444',
  cancelled: '#9CA3AF',
  draft: '#6B7280',
  review: '#8B5CF6',
  completed: '#10B981',
};

export const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
};
