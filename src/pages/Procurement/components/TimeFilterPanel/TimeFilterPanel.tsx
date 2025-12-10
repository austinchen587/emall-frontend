// src/pages/Procurement/components/TimeFilterPanel/TimeFilterPanel.tsx
import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import './TimeFilterPanel.css';

interface TimeFilterPanelProps {
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  summary: {
    projectCount: number;
    totalProfit: number;
    noFinalQuoteCount: number;  // 新增字段
  };
}

const TimeFilterPanel: React.FC<TimeFilterPanelProps> = ({
  timeRange,
  onTimeRangeChange,
  summary
}) => {
  const timeRanges = [
    { value: 'today', label: '今天' },
    { value: 'yesterday', label: '昨天' },
    { value: 'week', label: '本周' },
    { value: 'month', label: '本月' },
    { value: 'all', label: '全部' }
  ];

  return (
    <div className="time-filter-panel">
      <div className="time-filter-header">
        <h3>时间筛选</h3>
      </div>
      
      <div className="time-filter-buttons">
        {timeRanges.map(range => (
          <button
            key={range.value}
            data-range={range.value}
            className={`time-filter-btn ${timeRange === range.value ? 'active' : ''}`}
            onClick={() => onTimeRangeChange(range.value)}
          >
            {range.label}
          </button>
        ))}
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-label">项目数量</div>
          <div className="summary-value">{summary.projectCount}</div>
        </div>
        
        <div className="summary-card">
          <div className="summary-label">利润总计</div>
          <div className="summary-value profit-total">
            {formatCurrency(summary.totalProfit)}
          </div>
        </div>
        
        {/* 新增：未最终报价统计 */}
        <div className="summary-card">
          <div className="summary-label">未最终报价</div>
          <div className="summary-value no-final-quote">
            {summary.noFinalQuoteCount}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeFilterPanel;
