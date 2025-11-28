// src/pages/EmallList/EmallList.tsx
import React, { useState, useEffect } from 'react';
import { emallApi } from '../../services/api_emall';
import { EmallItem, EmallFilterParams } from '../../services/types';
import ProjectDetailModal from '../../components/emall/ProjectDetailModal';
import ProcurementProgressModal from '../../components/emall/ProcurementProgressModal'; // 新增导入
import './EmallList.css';

const EmallList: React.FC = () => {
  const [emallItems, setEmallItems] = useState<EmallItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [selectedProject, setSelectedProject] = useState<EmallItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 新增采购进度相关状态
  const [isProcurementModalOpen, setIsProcurementModalOpen] = useState(false);
  const [selectedProcurementId, setSelectedProcurementId] = useState<number | null>(null);
  const [selectedProcurementTitle, setSelectedProcurementTitle] = useState<string>('');
  
  // 筛选状态
  const [filters, setFilters] = useState<EmallFilterParams>({
    project_title: '',
    purchasing_unit: '',
    project_number: '',
    total_price_condition: '', // 改为条件筛选
    search: '',
    page: 1,
    page_size: 20
  });

  // 处理选择采购状态
  const handleSelectProcurement = async (item: EmallItem, isSelected: boolean) => {
    try {
      // 调用后端API更新选择状态
      await emallApi.toggleProcurementSelection(item.id, isSelected);
      
      // 更新本地状态
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
  // 在 EmallList.tsx 中，修改 handleProgressClick 函数，添加类型保护
const handleProgressClick = (item: EmallItem) => {
  // 添加类型检查
  if (!item.is_selected) {
    console.warn('项目未被选中，无法查看采购进度');
    return;
  }
  
  setSelectedProcurementId(item.id);
  setSelectedProcurementTitle(item.project_title);
  setIsProcurementModalOpen(true);
};
// 修改竞标状态显示函数，处理 undefined 情况
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

  useEffect(() => {
    fetchEmallList();
  }, [filters]);

  const fetchEmallList = async () => {
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
    
    // 为每个项目添加默认值
    const processedItems = items.map((item: EmallItem) => ({
      ...item,
      is_selected: item.is_selected || false,
      bidding_status: item.bidding_status || 'not_started'
    }));
    
    setEmallItems(processedItems);
    
  } catch (err: any) {
    console.error('获取采购数据失败:', err);
    setError(err.response?.data?.detail || err.response?.data?.message || '获取数据失败，请稍后重试');
  } finally {
    setLoading(false);
  }
};
  // 处理项目编号点击事件
  const handleProjectNumberClick = (item: EmallItem) => {
    console.log('点击项目编号:', item.project_number);
    console.log('项目数据:', item);
    setSelectedProject(item);
    setIsModalOpen(true);
    console.log('isModalOpen 设置为:', true); // 添加调试
  };
  // 在渲染部分检查
 console.log('当前 isModalOpen:', isModalOpen);
 console.log('当前 selectedProject:', selectedProject);
  // 关闭弹窗
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  // 处理筛选条件变化
  const handleFilterChange = (key: keyof EmallFilterParams, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // 重置页码
    }));
  };

  // 重置筛选条件
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

  // 格式化金额显示
  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // 格式化日期显示
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  // 处理项目标题点击事件
  const handleProjectTitleClick = (item: EmallItem) => {
    if (item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('该项目没有链接:', item.project_title);
    }
  };

  // 验证URL是否有效
  const isValidUrl = (url: string | undefined): boolean => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // 切换行展开状态
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

  // 检查文本是否过长需要展开
  const isTextLong = (text: string, maxLength: number = 50) => {
    return text && text.length > maxLength;
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
      
      {/* 筛选区域 */}
      <div className="filter-section">
        <div className="filter-header">
          <h3>筛选条件</h3>
          <div className="filter-controls">
            <button onClick={resetFilters} className="reset-btn">
              <span className="btn-icon">↺</span>
              重置
            </button>
            <button onClick={fetchEmallList} className="search-btn">
              <span className="btn-icon">🔍</span>
              搜索
            </button>
          </div>
        </div>
        
        <div className="filter-grid">
          <div className="filter-group">
            <label className="filter-label">项目标题</label>
            <input
              type="text"
              value={filters.project_title || ''}
              onChange={(e) => handleFilterChange('project_title', e.target.value)}
              placeholder="输入项目标题关键词..."
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label className="filter-label">采购单位</label>
            <input
              type="text"
              value={filters.purchasing_unit || ''}
              onChange={(e) => handleFilterChange('purchasing_unit', e.target.value)}
              placeholder="输入采购单位名称..."
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label className="filter-label">项目编号</label>
            <input
              type="text"
              value={filters.project_number || ''}
              onChange={(e) => handleFilterChange('project_number', e.target.value)}
              placeholder="输入项目编号..."
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label className="filter-label">价格条件</label>
            <input
              type="text"
              value={filters.total_price_condition || ''}
              onChange={(e) => handleFilterChange('total_price_condition', e.target.value)}
              placeholder="例如: >1000, <=50000, =2000"
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label className="filter-label">全局搜索</label>
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="输入任意关键词搜索..."
              className="filter-input"
            />
          </div>
        </div>
      </div>
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
      <div className="table-wrapper">
        <div className="table-header">
          <div className="table-info">显示 {emallItems.length} 个项目，共 {totalCount} 个</div>
        </div>
        
        <div className="emall-table-container">
          <table className="emall-table">
            <thead>
              <tr>
                <th className="col-title">项目标题</th>
                <th className="col-number">项目编号</th>
                <th className="col-unit">采购单位</th>
                <th className="col-price">总控制价格</th>
                <th className="col-date">发布时间</th>
                <th className="col-date">截止时间</th>
                <th className="col-select">选择项目</th>
                <th className="col-progress">采购进度</th>
              </tr>
            </thead>
            <tbody>
              {emallItems.map((item) => {
                const isExpanded = expandedRows.has(item.id);
                const isTitleLong = isTextLong(item.project_title);
                
                return (
                  <React.Fragment key={item.id}>
                    <tr className={`emall-row ${isExpanded ? 'expanded' : ''}`}>
                      {/* 项目标题 */}
                      <td className="project-title-cell">
                        <div className="title-content">
                          {isValidUrl(item.url) ? (
                            <a
                              href={item.url!}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="project-link"
                              onClick={(e) => {
                                e.preventDefault();
                                handleProjectTitleClick(item);
                              }}
                              title="点击查看项目详情"
                            >
                              {item.project_title}
                            </a>
                          ) : (
                            <span className="project-title-text">
                              {item.project_title}
                            </span>
                          )}
                          {isTitleLong && (
                            <button 
                              className="expand-btn"
                              onClick={() => toggleRowExpansion(item.id)}
                              title={isExpanded ? '收起' : '展开'}
                            >
                              {isExpanded ? '▲' : '▼'}
                            </button>
                          )}
                        </div>
                      </td>
                      
                      {/* 项目编号 */}
                      <td className="project-number-cell">
                        <code 
                          className="project-number clickable"
                          onClick={() => handleProjectNumberClick(item)}
                          title="点击查看项目详情"
                        >
                          {item.project_number || '-'}
                        </code>
                      </td>
                      
                      {/* 采购单位 */}
                      <td className="purchasing-unit-cell">
                        <span className="unit-text">{item.purchasing_unit}</span>
                      </td>
                      
                      {/* 总控制价格 */}
                      <td className="price-cell">
                        <span className="price-value">
                          {formatCurrency(item.total_price_numeric)}
                        </span>
                      </td>
                      
                      {/* 发布时间 */}
                      <td className="date-cell">
                        <span className="date-value">{formatDate(item.publish_date)}</span>
                      </td>
                      
                      {/* 截止时间 */}
                      <td className="date-cell">
                        <span className="date-value">{formatDate(item.quote_end_time)}</span>
                      </td>
                      
                      {/* 选择项目 */}
                      <td className="select-cell">
                        <div className="select-checkbox">
                          <input
                            type="checkbox"
                            checked={item.is_selected || false}
                            onChange={(e) => handleSelectProcurement(item, e.target.checked)}
                            className="procurement-checkbox"
                          />
                        </div>
                      </td>
                      
                      {/* 采购进度 */}
                      <td className="progress-cell">
                        {item.is_selected && item.bidding_status && (
                          <button
                            className="progress-btn"
                            onClick={() => handleProgressClick(item)}
                            title="查看采购进度"
                            data-status={item.bidding_status}
                          >
                            {getBiddingStatusDisplay(item.bidding_status)}
                          </button>
                        )}
                      </td>
                    </tr>
                    
                    {isExpanded && (
                      <tr className="detail-row">
                        <td colSpan={8}>
                          <div className="project-details">
                            <div className="detail-section">
                              <h4>项目详情</h4>
                              <div className="detail-grid">
                                <div className="detail-item">
                                  <label>项目名称:</label>
                                  <span>{item.project_name || '-'}</span>
                                </div>
                                <div className="detail-item">
                                  <label>所在地区:</label>
                                  <span>{item.region || '-'}</span>
                                </div>
                                <div className="detail-item">
                                  <label>商品名称:</label>
                                  <span>{item.commodity_names || '-'}</span>
                                </div>
                                <div className="detail-item">
                                  <label>报价开始:</label>
                                  <span>{formatDate(item.quote_start_time)}</span>
                                </div>
                              </div>
                            </div>
                            {item.url && (
                              <div className="detail-section">
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="detail-link"
                                >
                                  📎 查看完整项目信息
                                </a>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {emallItems.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>暂无数据</h3>
            <p>请尝试调整筛选条件或稍后重试</p>
          </div>
        )}
        
        {loading && emallItems.length > 0 && (
          <div className="loading-more">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            加载更多数据...
          </div>
        )}
      </div>
      
      {/* 项目详情弹窗 */}
      <ProjectDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        project={selectedProject}
      />
      
      {/* 采购进度弹窗 */}
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
