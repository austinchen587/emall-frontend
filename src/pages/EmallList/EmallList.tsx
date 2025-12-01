// src/pages/EmallList/EmallList.tsx
import React, { useEffect } from 'react';
import ProjectDetailModal from '../../components/emall/ProjectDetailModal';
import ProcurementProgressModal from '../../components/emall/ProcurementProgressModal';
import AddRemarkModal from '../../components/emall/AddRemarkModal'; // 导入 AddRemarkModal
import FilterSection from './components/FilterSection';
import EmallTable from './components/EmallTable';
import { useEmallData } from './hooks/useEmallData';
import { useModalState } from './hooks/useModalState';
import { useExpandedRows } from './hooks/useExpandedRows';
import './EmallList.css';
import './components/Header.css';

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
    closeModals,
    // 添加新的模态框状态管理
    openAddRemark,
    closeAddRemark
  } = useModalState();

  const {
    expandedRows,
    toggleRowExpansion
  } = useExpandedRows();

  useEffect(() => {
    fetchEmallList();
  }, [fetchEmallList]);

  const handlePageChange = (page: number) => {
    handleFilterChange('page', page);
  };

  const handlePageSizeChange = (size: number) => {
    handleFilterChange('page_size', size);
  };

  // 修复：添加备注处理函数
  const handleAddRemarkClick = (item: any) => {
    if (!item.is_selected) {
      // 如果 is_selected 是 false，打开 AddRemarkModal
      openAddRemark(item.id, item.project_title);
    } else {
      // 否则打开采购进度模态框
      openProcurementProgress(item.id, item.project_title);
    }
  };

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

  // 备注添加成功后的回调
  const handleRemarkSuccess = () => {
    fetchEmallList(); // 刷新列表数据
  };

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
      <div className="emall-header">
        <div className="header-content">
          <h1>采购项目列表</h1>
          <div className="header-stats">
            <span className="stats-badge">共 {totalCount} 个项目</span>
            <span className="stats-info">数据实时更新</span>
          </div>
        </div>
      </div>
      
      <FilterSection
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
        onSearch={fetchEmallList}
      />
      
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
      
      <EmallTable
        emallItems={emallItems}
        expandedRows={expandedRows}
        onToggleExpand={toggleRowExpansion}
        onProjectNumberClick={handleProjectNumberClick}
        onProjectTitleClick={handleProjectTitleClick}
        onSelectProcurement={handleSelectProcurement}
        onProgressClick={handleProgressClick}
        onAddRemarkClick={handleAddRemarkClick}
        formatCurrency={utils.formatCurrency}
        formatDate={utils.formatDate}
        isValidUrl={utils.isValidUrl}
        isTextLong={utils.isTextLong}
        getBiddingStatusDisplay={utils.getBiddingStatusDisplay}
        loading={loading}
        totalCount={totalCount}
        currentPage={filters.page || 1}
        pageSize={filters.page_size || 100}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
      
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
      
      {/* 添加 AddRemarkModal */}
      <AddRemarkModal
        isOpen={modalState.addRemark.isOpen}
        onClose={closeAddRemark}
        procurementId={modalState.addRemark.id!}
        procurementTitle={modalState.addRemark.title}
        onSuccess={handleRemarkSuccess}
      />
    </div>
  );
};

export default EmallList;
