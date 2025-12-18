// src/pages/profit/components/MonthlySummaryTable.tsx
import React from 'react';
import { MonthlyProfitSummary } from '../../../services/types/profit';
import { formatCurrency, formatPercentage, getProfitColor, formatCycleDays } from '../utils';
import './MonthlySummaryTable.css';

interface MonthlySummaryTableProps {
  data: MonthlyProfitSummary | undefined;
}

export const MonthlySummaryTable: React.FC<MonthlySummaryTableProps> = ({ data }) => {
  if (!data) {
    return <div className="no-data">请选择月份查看汇总数据</div>;
  }

  const isProfit = parseFloat(data.total_profit) > 0;
  const profitClass = isProfit ? 'summary-profit' : parseFloat(data.total_profit) < 0 ? 'summary-loss' : '';

  return (
    <div className="monthly-summary-table">
      <h3>月度汇总统计</h3>
      <div className="summary-grid">
        <div className="summary-item">
          <div className="summary-label">项目数量</div>
          <div className="summary-value">{data.project_count}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">响应总金额</div>
          <div className="summary-value">{formatCurrency(data.total_response_amount)}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">采购总金额</div>
          <div className="summary-value">{formatCurrency(data.total_purchase_amount)}</div>
        </div>
        <div className={`summary-item ${profitClass}`}>
          <div className="summary-label">总利润</div>
          <div className="summary-value" style={{ color: getProfitColor(data.total_profit) }}>
            {formatCurrency(data.total_profit)}
          </div>
        </div>
        <div className={`summary-item ${profitClass}`}>
          <div className="summary-label">总利润率</div>
          <div className="summary-value" style={{ color: getProfitColor(data.total_profit_margin) }}>
            {formatPercentage(data.total_profit_margin)}
          </div>
        </div>
        <div className="summary-item">
          <div className="summary-label">结算资金率</div>
          <div className="summary-value">{formatPercentage(data.settlement_fund_rate)}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">平均竞标周期</div>
          <div className="summary-value">{formatCycleDays(parseFloat(data.avg_bid_cycle) || 0)}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">平均结算周期</div>
          <div className="summary-value">{formatCycleDays(parseFloat(data.avg_settlement_cycle) || 0)}</div>
        </div>
      </div>
    </div>
  );
};
