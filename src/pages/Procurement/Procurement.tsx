// src/pages/Procurement/Procurement.tsx
import React from 'react';
import { useProcurementData } from './hooks/useProcurementData';
import { useTimeFilter } from './hooks/useTimeFilter';
import { useSorting } from './hooks/useSorting';
import { useFinalQuotes } from './hooks/useFinalQuotes';
import TimeFilterPanel from './components/TimeFilterPanel';
import ProcurementTable from './components/ProcurementTable';
import SearchBox from './components/SearchBox';
import LoadingError from './components/LoadingError';
import { useAuthStore } from '../../stores/authStore';
import './Procurement.css';

const Procurement: React.FC = () => {
  const { stats, loading, error, searchTerm, setSearchTerm, loadDailyProfitStats } = useProcurementData();
  const { timeRange, setTimeRange, filteredStats, summary } = useTimeFilter(stats);
  const { sortConfig, handleSort, sortedStats } = useSorting(filteredStats, searchTerm);
  const { finalQuotes, savingQuotes, handleFinalQuoteChange } = useFinalQuotes(filteredStats);
  
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role || '';
  const isProcurementStaff = userRole === 'procurement_staff';
  const isSupervisor = userRole === 'supervisor';
  const canEditFinalQuote = !isProcurementStaff && !isSupervisor;

  if (loading || error) {
    return <LoadingError loading={loading} error={error} onRetry={loadDailyProfitStats} />;
  }

  return (
    <div className="procurement-container">
      <div className="procurement-header">
        <h1>采购利润分析</h1>
        <p>最终报价权限: {canEditFinalQuote ? '可编辑' : '只读'}</p>
      </div>

      <div className="procurement-content">
        <div className="time-filter-panel">
          <TimeFilterPanel
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            summary={summary}
          />
        </div>
        
        <div className="procurement-table-section">
          <div className="procurement-controls">
            <SearchBox searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </div>

          <div className="procurement-table-container">
            <ProcurementTable
              stats={sortedStats}
              sortConfig={sortConfig}
              finalQuotes={finalQuotes}
              savingQuotes={savingQuotes}
              isProcurementStaff={isProcurementStaff}
              isSupervisor={isSupervisor}
              canEditFinalQuote={canEditFinalQuote}
              onSort={handleSort}
              onFinalQuoteChange={handleFinalQuoteChange}
            />
            
            {sortedStats.length === 0 && (
              <div className="no-data">
                <p>暂无数据</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="procurement-footer">
        <button className="refresh-button" onClick={loadDailyProfitStats}>
          刷新数据
        </button>
        <div className="last-updated">
          最后更新: {new Date().toLocaleString('zh-CN')}
        </div>
      </div>
    </div>
  );
};

export default Procurement;
