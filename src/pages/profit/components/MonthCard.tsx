// src/pages/profit/components/MonthCard.tsx
import React from 'react';
import { MonthlyProfitSummary } from '../../../services/types/profit';
import { formatCurrency, getProfitColor } from '../utils';
import './MonthCard.css';

interface MonthCardProps {
  monthData: MonthlyProfitSummary;
  isSelected: boolean;
  onClick: (month: string) => void;
}

export const MonthCard: React.FC<MonthCardProps> = ({ monthData, isSelected, onClick }) => {
  // 处理结算资金率，防止NaN
  const formatSettlementRate = (rate: string): string => {
    const num = parseFloat(rate);
    if (isNaN(num)) return '0.00%';
    return `${(num * 100).toFixed(2)}%`;
  };

  return (
    <div 
      className={`month-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(monthData.statistics_month)}
    >
      <div className="month-header">
        <div className="month-title">{monthData.statistics_month}</div>
        <div className="project-count">{monthData.project_count}个项目</div>
      </div>
      <div className="month-stats">
        <div className="stat-item">
          <span className="stat-label">采购金额:</span>
          <span className="stat-value">{formatCurrency(monthData.total_purchase_amount)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">总利润:</span>
          <span className="stat-value" style={{ color: getProfitColor(monthData.total_profit) }}>
            {formatCurrency(monthData.total_profit)}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">结算资金率:</span>
          <span className="stat-value">{formatSettlementRate(monthData.settlement_fund_rate)}</span>
        </div>
      </div>
    </div>
  );
};
