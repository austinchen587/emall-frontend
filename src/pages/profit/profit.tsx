// src/pages/profit/profit.tsx
import React from 'react';
import { useProfitData } from './hooks/useProfitData';
import { MonthCard } from './components/MonthCard';
import { MonthlySummaryTable } from './components/MonthlySummaryTable';
import { ProjectProfitTable } from './components/ProjectProfitTable';
import { sortMonthlyData } from './utils';
import './profit.css';

const ProfitPage: React.FC = () => {
  const {
    monthlySummary,
    projectStats,
    currentMonthSummary,
    selectedMonth,
    setSelectedMonth,
    loading,
    error,
  } = useProfitData();

  if (loading) {
    return (
      <div className="profit-page loading">
        <div className="loading-spinner">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profit-page error">
        <div className="error-message">
          <h3>数据加载失败</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            重新加载
          </button>
        </div>
      </div>
    );
  }

  // 确保monthlySummary是数组
  const safeMonthlySummary = Array.isArray(monthlySummary) ? monthlySummary : [];
  const sortedMonthlyData = sortMonthlyData(safeMonthlySummary);

  return (
    <div className="profit-page">
      <div className="page-header">
        <h1>利润分析</h1>
        <div className="selected-month">
          当前选择: {selectedMonth || '暂无数据'}
        </div>
      </div>
      
      <div className="profit-layout">
        {/* A模块 - 月份选择 */}
        <div className="month-selection-panel">
          <h2>月份选择</h2>
          <div className="month-cards">
            {sortedMonthlyData.length > 0 ? (
              sortedMonthlyData.map((monthData) => (
                <MonthCard
                  key={monthData.statistics_month}
                  monthData={monthData}
                  isSelected={monthData.statistics_month === selectedMonth}
                  onClick={setSelectedMonth}
                />
              ))
            ) : (
              <div className="no-month-data">暂无月份数据</div>
            )}
          </div>
        </div>

        {/* B模块 - 数据展示 */}
        <div className="data-display-panel">
          {/* B1模块 - 月度汇总 */}
          <div className="monthly-summary-section">
            <MonthlySummaryTable data={currentMonthSummary} />
          </div>

          {/* B2模块 - 项目明细 */}
          <div className="project-details-section">
            <ProjectProfitTable data={projectStats} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitPage;
