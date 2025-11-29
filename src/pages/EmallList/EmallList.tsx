// src/pages/EmallList/EmallList.tsx
import React, { useEffect } from 'react';
import ProjectDetailModal from '../../components/emall/ProjectDetailModal';
import ProcurementProgressModal from '../../components/emall/ProcurementProgressModal';
import FilterSection from './components/FilterSection';
import EmallTable from './components/EmallTable';
import { useEmallData } from './hooks/useEmallData';
import { useModalState } from './hooks/useModalState';
import { useExpandedRows } from './hooks/useExpandedRows';
import './EmallList.css';

const EmallList: React.FC = () => {
  const {
    emallItems,
    loading,
    error,
    totalCount,
    filters,
    fetchEmallList,
    handleSelectProcurement,
    handleFilterChange,
    resetFilters,
    utils
  } = useEmallData();

  const {
    modalState,
    openProjectDetail,
    openProcurementProgress,
    closeModals
  } = useModalState();

  const {
    expandedRows,
    toggleRowExpansion
  } = useExpandedRows();

  // 副作用 - 监听过滤器变化
  useEffect(() => {
    fetchEmallList();
  }, [fetchEmallList]);

  // 事件处理函数
  const handleProgressClick = (item: any) => {
    if (!item.is_selected) {
      alert('项目未被选中，无法查看采购进度');
      return;
    }
    openProcurementProgress(item.id, item.project_title);
  };

  const handleProjectNumberClick = (item: any) => {
    openProjectDetail(item);
  };

  const handleProjectTitleClick = (item: any) => {
    if (item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  };

  // 渲染加载状态
  if (loading && emallItems.length === 0) {
    return (
      <div className="emall-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="emall-container">
      {/* 头部信息 */}
      <div className="emall-header">
        <div className="header-content">
          <h1>采购项目列表</h1>
          <div className="header-stats">
            <span className="stats-badge">共 {totalCount} 个项目</span>
            <span className="stats-info">数据实时更新</span>
          </div>
        </div>
      </div>
      
      {/* 过滤器区域 */}
      <FilterSection
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
        onSearch={fetchEmallList}
      />
      
      {/* 错误提示 */}
      {error && (
        <div className="error-message">
          <div className="error-content">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
            <button onClick={fetchEmallList} className="retry-btn">
              重试
            </button>
          </div>
        </div>
      )}
      
      {/* 数据表格 */}
      <EmallTable
        emallItems={emallItems}
        expandedRows={expandedRows}
        onToggleExpand={toggleRowExpansion}
        onProjectNumberClick={handleProjectNumberClick}
        onProjectTitleClick={handleProjectTitleClick}
        onSelectProcurement={handleSelectProcurement}
        onProgressClick={handleProgressClick}
        {...utils}
        loading={loading}
        totalCount={totalCount}
      />
      
      {/* 模态框 */}
      <ProjectDetailModal
        isOpen={modalState.projectDetail.isOpen}
        onClose={closeModals}
        project={modalState.projectDetail.project}
      />
      
      <ProcurementProgressModal
        isOpen={modalState.procurementProgress.isOpen}
        onClose={closeModals}
        procurementId={modalState.procurementProgress.id!}
        procurementTitle={modalState.procurementProgress.title}
      />
    </div>
  );
};

export default EmallList;
