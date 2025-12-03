// src/pages/Procurement/Procurement.tsx
import React, { useState, useEffect } from 'react';
import { procurementApi } from '../../services/api_procurement';
import { DailyProfitStat } from '../../services/types/procurement';
import './Procurement.css';

const Procurement: React.FC = () => {
  const [stats, setStats] = useState<DailyProfitStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof DailyProfitStat; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    loadDailyProfitStats();
  }, []);

  const loadDailyProfitStats = async () => {
    try {
      setLoading(true);
      const response = await procurementApi.getDailyProfitStats();
      if (response.success) {
        setStats(response.data);
      } else {
        setError('获取数据失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
      console.error('Error loading daily profit stats:', err);
    } finally {
      setLoading(false);
    }
  };

  // 搜索过滤
  const filteredStats = stats.filter(stat =>
    stat.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stat.project_owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stat.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 修复的排序功能
  const sortedStats = React.useMemo(() => {
    if (!sortConfig) return filteredStats;
    
    return [...filteredStats].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      // 处理 null 或 undefined 值
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.direction === 'asc' ? -1 : 1;
      if (bValue == null) return sortConfig.direction === 'asc' ? 1 : -1;
      
      // 数值比较
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // 字符串比较
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue, 'zh-CN');
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }
      
      // 默认比较
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      
      return 0;
    });
  }, [filteredStats, sortConfig]);

  const handleSort = (key: keyof DailyProfitStat) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getProfitClass = (profit: number) => {
    if (profit > 0) return 'profit-positive';
    if (profit < 0) return 'profit-negative';
    return 'profit-neutral';
  };

  if (loading) {
    return (
      <div className="procurement-loading">
        <div className="loading-spinner"></div>
        <p>加载采购数据中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="procurement-error">
        <div className="error-icon">⚠️</div>
        <h3>加载失败</h3>
        <p>{error}</p>
        <button onClick={loadDailyProfitStats} className="retry-button">
          重试
        </button>
      </div>
    );
  }

  return (
    <div className="procurement-container">
      <div className="procurement-header">
        <h1>采购利润分析</h1>
        <p>今日发布的采购项目利润统计</p>
      </div>

      <div className="procurement-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="搜索项目名称、负责人或供应商..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <div className="stats-summary">
          <div className="stat-card">
            <span className="stat-label">总项目数</span>
            <span className="stat-value">{stats.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">总利润</span>
            <span className="stat-value profit-total">
              {formatCurrency(stats.reduce((sum, stat) => sum + stat.profit, 0))}
            </span>
          </div>
        </div>
      </div>

      <div className="procurement-table-container">
        <table className="procurement-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('project_name')}>
                项目名称 {sortConfig?.key === 'project_name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('project_owner')}>
                负责人 {sortConfig?.key === 'project_owner' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('total_price_control')}>
                控制价 {sortConfig?.key === 'total_price_control' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('supplier_name')}>
                供应商 {sortConfig?.key === 'supplier_name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('total_quote')}>
                总报价 {sortConfig?.key === 'total_quote' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('profit')}>
                利润 {sortConfig?.key === 'profit' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>最新备注</th>
            </tr>
          </thead>
          <tbody>
            {sortedStats.map((stat, index) => (
              <tr key={index} className="table-row">
                <td className="project-name">{stat.project_name}</td>
                <td className="project-owner">{stat.project_owner}</td>
                <td className="price-control">{formatCurrency(stat.total_price_control)}</td>
                <td className="supplier-name">{stat.supplier_name}</td>
                <td className="total-quote">{formatCurrency(stat.total_quote)}</td>
                <td className={`profit ${getProfitClass(stat.profit)}`}>
                  {formatCurrency(stat.profit)}
                </td>
                <td className="latest-remark">
                  {stat.latest_remark || '无备注'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {sortedStats.length === 0 && (
          <div className="no-data">
            <p>暂无数据</p>
          </div>
        )}
      </div>

      <div className="procurement-footer">
        <button onClick={loadDailyProfitStats} className="refresh-button">
          刷新数据
        </button>
        <span className="last-updated">
          最后更新: {new Date().toLocaleString('zh-CN')}
        </span>
      </div>
    </div>
  );
};

export default Procurement;
