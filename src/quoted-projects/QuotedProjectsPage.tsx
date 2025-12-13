import React, { useState, useMemo } from 'react';
import { useQuotedProjects } from './hooks';
import { QuotedProjectType } from '../services/types/quoted_projects';
import './QuotedProjectsPage.css';

const typeLabels: Record<QuotedProjectType, string> = {
  bidding: '竞价项目',
  reverse: '反拍项目',
};

// 根据 detail_status 设置颜色
const detailStatusColors: Record<string, string> = {
  '已失效': '#f5222d',
  '已成交': '#52c41a',
  '已报价': '#1890ff',
  '未成交': '#fa8c16',
  '未报价': '#8c8c8c',
  '结果评审中': '#722ed1',
  '默认': '#8c8c8c'
};

export default function QuotedProjectsPage() {
  const [type, setType] = useState<QuotedProjectType>('bidding');
  const { data = [], loading } = useQuotedProjects(type);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // 分类统计
  const statusCategories = useMemo(() => {
    const map: Record<string, number> = {};
    (data as any[]).forEach(item => {
      map[item.status_category] = (map[item.status_category] || 0) + 1;
    });
    return Object.entries(map).map(([status, count]) => ({ status, count }));
  }, [data]);

  // 过滤数据
  const filtered = useMemo(
    () =>
      selectedStatus
        ? (data as any[]).filter(item => item.status_category === selectedStatus)
        : (data as any[]),
    [data, selectedStatus]
  );

  const getDetailStatusColor = (detailStatus: string) => {
    return detailStatusColors[detailStatus] || detailStatusColors['默认'];
  };

  const formatPrice = (price: string | number) => {
    const num = typeof price === 'string' ? Number(price) : price;
    if (isNaN(num)) return '-';
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="quoted-projects-container">
      {/* 页面标题 */}
      <header className="page-header">
        <h1 className="page-title">报价项目管理</h1>
        <div className="page-subtitle">查看和管理所有报价项目</div>
      </header>

      <div className="quoted-projects-content">
        {/* 左侧导航 */}
        <aside className="projects-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">项目类型</h3>
            <div className="type-selector">
              {(['bidding', 'reverse'] as QuotedProjectType[]).map(t => (
                <button
                  key={t}
                  className={`type-button ${type === t ? 'active' : ''}`}
                  onClick={() => { setType(t); setSelectedStatus(null); }}
                >
                  <span className="type-icon">
                    {t === 'bidding' ? '💰' : '🔄'}
                  </span>
                  {typeLabels[t]}
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-divider"></div>

          <div className="sidebar-section">
            <div className="sidebar-header">
              <h3 className="sidebar-title">状态筛选</h3>
              <button 
                className="clear-filter"
                onClick={() => setSelectedStatus(null)}
                disabled={!selectedStatus}
              >
                清除
              </button>
            </div>
            <div className="status-filters">
              {statusCategories.map(({ status, count }) => (
                <button
                  key={status}
                  className={`status-filter ${selectedStatus === status ? 'active' : ''}`}
                  onClick={() => setSelectedStatus(status)}
                >
                  <span 
                    className="status-dot" 
                    style={{ backgroundColor: getDetailStatusColor(status) }}
                  ></span>
                  <span className="status-label">{status}</span>
                  <span className="status-count">{count}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* 右侧内容 */}
        <main className="projects-main">
          <div className="main-header">
            <div className="header-info">
              <h2 className="main-title">
                {typeLabels[type]}项目
                {selectedStatus && (
                  <span className="filter-indicator"> - {selectedStatus}</span>
                )}
              </h2>
              <div className="result-count">
                共 {filtered.length} 个项目
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <div className="loading-text">加载中...</div>
            </div>
          ) : (
            <div className="table-container">
              <table className="projects-table">
                <thead>
                  <tr>
                    <th className="project-name">项目名称</th>
                    <th className="project-status">状态</th>
                    <th className="project-date">开始时间</th>
                    <th className="project-date">结束时间</th>
                    <th className="project-price">期望总价</th>
                    <th className="project-price">响应总额</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="empty-state">
                        <div className="empty-content">
                          📝 暂无项目数据
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map(item => (
                      <tr key={item.project_id} className="project-row">
                        <td className="project-name">
                          <div className="project-name-content">
                            <span className="name-text">{item.project_name}</span>
                            <span className="project-id">#{item.project_id}</span>
                          </div>
                        </td>
                        <td className="project-status">
                          <span 
                            className="status-badge"
                            style={{ 
                              backgroundColor: getDetailStatusColor(item.detail_status || item.status_category),
                              color: '#fff'
                            }}
                          >
                            {item.detail_status || item.status_category}
                          </span>
                        </td>
                        <td className="project-date">
                          {formatDate(item.bid_start_time)}
                        </td>
                        <td className="project-date">
                          {formatDate(item.bid_end_time)}
                        </td>
                        <td className="project-price">
                          {formatPrice(item.expected_total_price)}
                        </td>
                        <td className="project-price">
                          <span className={`price-amount ${Number(item.response_total) > 0 ? 'has-response' : ''}`}>
                            {formatPrice(item.response_total)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
