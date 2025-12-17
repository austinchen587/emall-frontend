// src/pages/EmallList/EmallList.tsx
import React, { useEffect } from 'react';
import ProjectDetailModal from '../../components/emall/ProjectDetailModal';
import ProcurementProgressModal from '../../components/emall/ProcurementProgressModal';
import AddRemarkModal from '../../components/emall/AddRemarkModal';
import FilterSection from './components/FilterSection';
import EmallTable from './components/EmallTable';
import { useEmallData } from './hooks/useEmallData';
import { useModalState } from './hooks/useModalState';
import { useExpandedRows } from './hooks/useExpandedRows';
import { useAuthStore } from '../../stores/authStore';
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
    utils,
    setEmallItems  // 确保有这个
  } = useEmallData();

  const {
    modalState,
    openProjectDetail,
    openProcurementProgress,
    closeModals,
    openAddRemark,
    closeAddRemark
  } = useModalState();

  const {
    expandedRows,
    toggleRowExpansion
  } = useExpandedRows();

  const { user } = useAuthStore();
  const userRole = user?.role || '';
  const isSupervisor = userRole === 'supervisor';
 const isReadOnly = isSupervisor;

  useEffect(() => {
    fetchEmallList();
  }, [fetchEmallList]);

  const handlePageChange = (page: number) => {
    handleFilterChange('page', page);
  };

  const handlePageSizeChange = (size: number) => {
    handleFilterChange('page_size', size);
  };

  const handleAddRemarkClick = (item: any) => {
    if (isReadOnly) {
      alert('您只有查看权限，无法添加备注');
      return;
    }

    if (!item.is_selected) {
      openAddRemark(item.id, item.project_title);
    } else {
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

  // 修复：添加第二个参数 isSelected
  const handleSelectProcurementClick = (item: any) => {
    if (isReadOnly) {
      alert('您只有查看权限，无法选择采购项目');
      return;
    }
    
    // 切换选择状态：如果当前是选中状态，则取消选中；如果当前是未选中状态，则选中
    const newSelectedState = !item.is_selected;
    handleSelectProcurement(item, newSelectedState);
  };

  const handleRemarkSuccess = (procurementId: number, newRemark: any) => {
    // 立即更新本地状态
    setEmallItems(prev => prev.map(item => 
      item.id === procurementId 
        ? { 
            ...item, 
            latest_remark: {
              content: newRemark.content || '',
              created_by: newRemark.created_by || '当前用户',
              created_at: newRemark.created_at || new Date().toISOString()
            }
          }
        : item
    ));
  };

  // 🔥 新增：处理采购进度中的备注成功回调
  const handleProgressRemarkSuccess = (procurementId: number, newRemark: any) => {
    // 立即更新本地状态
    setEmallItems(prev => prev.map(item => 
      item.id === procurementId 
        ? { 
            ...item, 
            latest_remark: {
              content: newRemark.content || '',
              created_by: newRemark.created_by || '当前用户',
              created_at: newRemark.created_at || new Date().toISOString()
            }
          }
        : item
    ));
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
            {isReadOnly && <span className="read-only-badge">只读模式</span>}
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
        onSelectProcurement={handleSelectProcurementClick}
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
        isReadOnly={isReadOnly}
      />
      
      <ProjectDetailModal
        isOpen={modalState.projectDetail.isOpen}
        onClose={closeModals}
        project={modalState.projectDetail.project}
        isReadOnly={isReadOnly}
      />
      
      <ProcurementProgressModal
        isOpen={modalState.procurementProgress.isOpen}
        onClose={closeModals}
        procurementId={modalState.procurementProgress.id!}
        procurementTitle={modalState.procurementProgress.title}
        isReadOnly={isReadOnly}
        onRemarkSuccess={handleProgressRemarkSuccess} // 🔥 新增：传递回调函数
      />
      
      <AddRemarkModal
        isOpen={modalState.addRemark.isOpen}
        onClose={closeAddRemark}
        procurementId={modalState.addRemark.id!}
        procurementTitle={modalState.addRemark.title}
        onSuccess={handleRemarkSuccess}
        isReadOnly={isReadOnly}
      />
    </div>
  );
};

export default EmallList;
