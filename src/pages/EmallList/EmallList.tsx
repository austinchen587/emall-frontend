// src/pages/EmallList/EmallList.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { emallApi } from '../../services/api_emall';
import { EmallItem, EmallFilterParams } from '../../services/types';
import ProjectDetailModal from '../../components/emall/ProjectDetailModal';
import ProcurementProgressModal from '../../components/emall/ProcurementProgressModal';
import FilterSection from './components/FilterSection';
import EmallTable from './components/EmallTable';
import './EmallList.css';

const EmallList: React.FC = () => {
  const [emallItems, setEmallItems] = useState<EmallItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [selectedProject, setSelectedProject] = useState<EmallItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcurementModalOpen, setIsProcurementModalOpen] = useState(false);
  const [selectedProcurementId, setSelectedProcurementId] = useState<number | null>(null);
  const [selectedProcurementTitle, setSelectedProcurementTitle] = useState<string>('');
  
  const [filters, setFilters] = useState<EmallFilterParams>({
    project_title: '',
    purchasing_unit: '',
    project_number: '',
    total_price_condition: '',
    search: '',
    page: 1,
    page_size: 20
  });

  // 数据获取 - 直接获取，不需要认证检查
  useEffect(() => {
    fetchEmallList();
  }, [filters]);

  const fetchEmallList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => 
          value !== '' && value !== undefined && value !== null
        )
      );
      
      const response = await emallApi.getEmallList(cleanFilters);
      
      let items = [];
      if (response.data.results) {
        items = response.data.results;
        setTotalCount(response.data.count || response.data.results.length);
      } else {
        items = response.data as any;
        setTotalCount((response.data as any).length);
      }
      
      const processedItems = items.map((item: EmallItem) => ({
        ...item,
        is_selected: item.is_selected || false,
        bidding_status: item.bidding_status || 'not_started'
      }));
      
      setEmallItems(processedItems);
      
    } catch (err: any) {
      setError(err.response?.data?.detail || err.response?.data?.message || '获取数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // 工具函数
  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  const isValidUrl = (url: string | undefined): boolean => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isTextLong = (text: string) => {
    return text ? text.length > 50 : false;
  };

  const getBiddingStatusDisplay = (status?: string) => {
    const statusMap: { [key: string]: string } = {
      'not_started': '未开始',
      'in_progress': '进行中',
      'successful': '竞标成功',
      'failed': '竞标失败',
      'cancelled': '已取消'
    };
    return status ? statusMap[status] || '未开始' : '未开始';
  };

  // 事件处理函数
  const handleFilterChange = (key: keyof EmallFilterParams, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const resetFilters = () => {
    setFilters({
      project_title: '',
      purchasing_unit: '',
      project_number: '',
      total_price_condition: '',
      search: '',
      page: 1,
      page_size: 20
    });
  };

  const handleSelectProcurement = async (item: EmallItem, isSelected: boolean) => {
    try {
      await emallApi.toggleProcurementSelection(item.id, isSelected);
      setEmallItems(prev => prev.map(emallItem => 
        emallItem.id === item.id 
          ? { ...emallItem, is_selected: isSelected }
          : emallItem
      ));
    } catch (error) {
      console.error('更新采购选择状态失败:', error);
      alert('操作失败，请重试');
    }
  };

  const handleProgressClick = (item: EmallItem) => {
    if (!item.is_selected) {
      console.warn('项目未被选中，无法查看采购进度');
      return;
    }
    setSelectedProcurementId(item.id);
    setSelectedProcurementTitle(item.project_title);
    setIsProcurementModalOpen(true);
  };

  const handleProjectNumberClick = (item: EmallItem) => {
    setSelectedProject(item);
    setIsModalOpen(true);
  };

  const handleProjectTitleClick = (item: EmallItem) => {
    if (item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  };

  const toggleRowExpansion = (id: number) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  // 渲染逻辑 - 移除认证检查
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
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        isValidUrl={isValidUrl}
        isTextLong={isTextLong}
        getBiddingStatusDisplay={getBiddingStatusDisplay}
        loading={loading}
        totalCount={totalCount}
      />
      
      <ProjectDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        project={selectedProject}
      />
      
      <ProcurementProgressModal
        isOpen={isProcurementModalOpen}
        onClose={() => setIsProcurementModalOpen(false)}
        procurementId={selectedProcurementId!}
        procurementTitle={selectedProcurementTitle}
      />
    </div>
  );
};

export default EmallList;
