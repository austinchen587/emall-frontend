// src/pages/Procurement/Procurement.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { procurementApi } from '../../services/api_procurement';
import { DailyProfitStat } from '../../services/types/procurement';
import { useAuthStore } from '../../stores/authStore';
import './Procurement.css';

const Procurement: React.FC = () => {
  const [stats, setStats] = useState<DailyProfitStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [finalQuotes, setFinalQuotes] = useState<Record<string, number>>({});
  const [savingQuotes, setSavingQuotes] = useState<Record<string, boolean>>({});
  const [saveTimeouts, setSaveTimeouts] = useState<Record<string, NodeJS.Timeout>>({});
  
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role || '';
  const isProcurementStaff = userRole === 'procurement_staff';
  const canEditFinalQuote = !isProcurementStaff;

  useEffect(() => {
    loadDailyProfitStats();
  }, []);

  const loadDailyProfitStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await procurementApi.getDailyProfitStats();
      
      if (response.success && response.data) {
        setStats(response.data);
        
        // 初始化最终报价数据 - 使用数据库中的实际值
        const initialQuotes: Record<string, number> = {};
        response.data.forEach((stat: DailyProfitStat) => {
          // 如果数据库中有最终报价，使用数据库的值；否则显示0
          initialQuotes[stat.project_name] = stat.final_negotiated_quote || 0;
        });
        setFinalQuotes(initialQuotes);
      } else {
        setError(response.error || '获取数据失败');
      }
    } catch (err: any) {
      setError(err.message || '网络错误，请稍后重试');
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

  // 保存最终报价到后端
  const saveFinalQuote = useCallback(async (projectName: string, quote: number) => {
    if (!canEditFinalQuote) {
      console.warn('无权限修改最终报价');
      return;
    }

    try {
      setSavingQuotes(prev => ({ ...prev, [projectName]: true }));
      
      const response = await procurementApi.updateFinalQuote({
        project_name: projectName,
        final_quote: quote,
        modified_by: user?.username || 'unknown',
        modified_role: userRole
      });
      
      if (response.success) {
        console.log(`成功保存项目 ${projectName} 的最终报价: ${quote}`);
        
        // 更新本地状态
        setStats(prev => prev.map(stat => 
          stat.project_name === projectName 
            ? { ...stat, final_negotiated_quote: quote }
            : stat
        ));
      } else {
        throw new Error(response.error || '保存失败');
      }
    } catch (err: any) {
      console.error(`保存项目 ${projectName} 的最终报价失败:`, err);
      
      // 回滚本地状态
      setFinalQuotes(prev => ({
        ...prev,
        [projectName]: stats.find(s => s.project_name === projectName)?.final_negotiated_quote || 0
      }));
      
      alert(`保存失败: ${err.message}`);
    } finally {
      setSavingQuotes(prev => ({ ...prev, [projectName]: false }));
    }
  }, [canEditFinalQuote, user, userRole, stats]);

  // 处理最终报价编辑（带防抖）
  const handleFinalQuoteChange = (projectName: string, value: string) => {
    if (!canEditFinalQuote) return;

    const numValue = parseFloat(value) || 0;
    
    // 立即更新本地状态
    setFinalQuotes(prev => ({
      ...prev,
      [projectName]: numValue
    }));

    // 清除之前的定时器
    if (saveTimeouts[projectName]) {
      clearTimeout(saveTimeouts[projectName]);
    }

    // 设置新的定时器（1秒后保存）
    const timeoutId = setTimeout(() => {
      // 无论值是多少都保存，包括0（表示清除报价）
      saveFinalQuote(projectName, numValue);
    }, 1000);

    setSaveTimeouts(prev => ({
      ...prev,
      [projectName]: timeoutId
    }));
  };

  // 计算利润 - 修复逻辑：没有最终报价时不计算利润
  const calculateProfit = (stat: DailyProfitStat) => {
    const finalQuote = finalQuotes[stat.project_name] || 0;
    const totalQuote = stat.total_quote || 0;
    
    // 如果没有最终报价（为0），则利润显示为"-"或0
    if (finalQuote === 0) {
      return null; // 返回null表示没有利润数据
    }
    
    return finalQuote - totalQuote;
  };

  // 格式化利润显示
  const formatProfit = (profit: number | null) => {
    if (profit === null) {
      return '-'; // 没有最终报价时显示"-"
    }
    return formatCurrency(profit);
  };

  // 获取利润CSS类名
  const getProfitClass = (profit: number | null) => {
    if (profit === null) return 'profit-neutral'; // 没有数据时使用中性颜色
    if (profit > 0) return 'profit-positive';
    if (profit < 0) return 'profit-negative';
    return 'profit-neutral';
  };

  // 排序功能 - 修复利润排序
  const sortedStats = React.useMemo(() => {
    if (!sortConfig) return filteredStats;
    
    return [...filteredStats].sort((a, b) => {
      let aValue: any = a[sortConfig.key as keyof DailyProfitStat];
      let bValue: any = b[sortConfig.key as keyof DailyProfitStat];
      
      if (sortConfig.key === 'final_negotiated_quote') {
        aValue = finalQuotes[a.project_name] || 0;
        bValue = finalQuotes[b.project_name] || 0;
      }
      
      if (sortConfig.key === 'profit') {
        aValue = calculateProfit(a);
        bValue = calculateProfit(b);
        
        // 处理null值排序：没有利润数据的排最后
        if (aValue === null && bValue === null) return 0;
        if (aValue === null) return sortConfig.direction === 'asc' ? 1 : -1;
        if (bValue === null) return sortConfig.direction === 'asc' ? -1 : 1;
      }
      
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.direction === 'asc' ? -1 : 1;
      if (bValue == null) return sortConfig.direction === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue, 'zh-CN');
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }
      
      return 0;
    });
  }, [filteredStats, sortConfig, finalQuotes]);

  const handleSort = (key: string) => {
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

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      Object.values(saveTimeouts).forEach(timeout => clearTimeout(timeout));
    };
  }, [saveTimeouts]);

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
        <p>{error}</p>
        <button className="retry-button" onClick={loadDailyProfitStats}>
          重试
        </button>
      </div>
    );
  }

  return (
    <div className="procurement-container">
      <div className="procurement-header">
        <h1>采购利润分析</h1>
        <p>最终报价权限: {canEditFinalQuote ? '可编辑' : '只读'}</p>
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
              {!isProcurementStaff && (
                <th onClick={() => handleSort('total_quote')}>
                  采购成本 {sortConfig?.key === 'total_quote' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
              )}
              <th>最终报价</th>
              {!isProcurementStaff && (
                <th onClick={() => handleSort('profit')}>
                  利润 {sortConfig?.key === 'profit' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
              )}
              <th>最新备注</th>
            </tr>
          </thead>
          <tbody>
            {sortedStats.map((stat, index) => (
              <tr key={index} className="table-row">
                <td className="project-name">{stat.project_name}</td>
                <td className="project-owner">{stat.project_owner}</td>
                <td className="price-control">{formatCurrency(stat.total_price_control)}</td>
                <td>{stat.supplier_name}</td>
                {!isProcurementStaff && (
                  <td className="total-quote">{formatCurrency(stat.total_quote)}</td>
                )}
                <td>
                  <div className="final-quote-container">
                    <input
                      type="number"
                      value={finalQuotes[stat.project_name] || ''}
                      onChange={(e) => handleFinalQuoteChange(stat.project_name, e.target.value)}
                      placeholder="输入最终报价"
                      className="final-quote-input"
                      disabled={!canEditFinalQuote || savingQuotes[stat.project_name]}
                      min="0"
                      step="0.01"
                    />
                    {savingQuotes[stat.project_name] && <span>保存中...</span>}
                  </div>
                </td>
                {!isProcurementStaff && (
                  <td className={`profit ${getProfitClass(calculateProfit(stat))}`}>
                    {formatProfit(calculateProfit(stat))}
                  </td>
                )}
                <td className="latest-remark">{stat.latest_remark || '无备注'}</td>
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
