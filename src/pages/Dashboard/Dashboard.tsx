// src/pages/Dashboard/Dashboard.tsx
import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useDashboardData } from './hooks/useDashboardData';
import { StatsCards } from './components/StatsCards';
import { StatusCharts } from './components/StatusCharts';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  // 使用选择器函数获取状态
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  
  const navigate = useNavigate();
  const [selectedOwner, setSelectedOwner] = useState('陈少帅');
  
  const { data, loading, error, refetch } = useDashboardData(selectedOwner);

  const handleLogout = () => {
    logout();
  };

  // 根据用户角色定义可访问的导航项
  const getNavigationItems = () => {
    const baseItems = [
      { 
        icon: '📋', 
        title: '采购项目列表', 
        description: '查看和管理所有采购项目',
        path: '/emall-list'
      },
      { 
        icon: '🛒', 
        title: '采购管理', 
        description: '创建和编辑采购订单',
        path: '/procurement'
      },
      { 
        icon: '👥', 
        title: '供应商管理', 
        description: '管理供应商信息',
        path: '/suppliers'
      },
      { 
        icon: '📊', 
        title: '已报价项目管理', 
        description: '集中管理竞价与反拍项目',
        path: '/quoted-projects'
      },
      { 
        icon: '💬', 
        title: 'AI助手', 
        description: 'AI助手帮助处理业务',
        path: '/chat'
      },
    ];

    // 添加反拍模块 - 只有 admin 和 supplier_manager 可以看到
    if (user?.role === 'admin' || user?.role === 'supplier_manager') {
      baseItems.push({
        icon: '🔁',
        title: '反拍管理',
        description: '反拍项目管理',
        path: '/fg-emall'
      });
    }

    switch (user?.role) {
      case 'admin':
        // 管理员显示全部模块
        return baseItems;
      
      case 'procurement_staff':
      case 'supervisor': // 监事和采购人员看到相同的模块
        // 采购人员和监事显示特定模块
        return baseItems.filter(item => 
          item.path === '/emall-list' || 
          item.path === '/procurement' || 
          item.path === '/chat' ||
          item.path === '/quoted-projects'   
        );
      
      case 'supplier_manager':
        // 供应商管理员显示供应商管理和反拍管理模块
        return baseItems.filter(item => 
          item.path === '/suppliers' || 
          item.path === '/chat' ||
          item.path === '/fg-emall'
        );
      
      case 'unassigned':
      default:
        // 未分配角色不显示任何导航项
        return [];
    }
  };

  const ownerOptions = [
    { value: '陈少帅', label: '陈少帅' },
    { value: '胡夏阳', label: '胡夏阳' },
    { value: '董婷婷', label: '董婷婷' },
  ];

  const navigationItems = getNavigationItems();

  // 根据角色判断是否显示数据分析区域
  const showAnalytics = user?.role === 'admin' || 
                       user?.role === 'procurement_staff' || 
                       user?.role === 'supervisor'; // 监事也显示数据分析

  return (
    <div className="dashboard-container">
      {/* 欢迎区域 */}
      <div className="dashboard-welcome-section">
        <h1 className="dashboard-welcome-title">欢迎回来, {user?.username || '用户'}!</h1>
        <p className="dashboard-welcome-subtitle">
          {user?.role === 'admin' && '系统管理面板'}
          {user?.role === 'procurement_staff' && '采购项目数据分析面板'}
          {user?.role === 'supervisor' && '采购项目数据分析面板'} {/* 监事显示相同描述 */}
          {user?.role === 'supplier_manager' && '供应商管理面板'}
          {user?.role === 'unassigned' && '请联系管理员分配权限'}
        </p>
      </div>

      {/* 未分配角色提示 */}
      {user?.role === 'unassigned' && (
        <div className="dashboard-unassigned-section">
          <div className="dashboard-unassigned-message">
            <h3>⚠️ 权限提示</h3>
            <p>您的账户尚未分配角色，请联系系统管理员为您分配相应的权限。</p>
          </div>
        </div>
      )}

      {/* 主要内容区域 */}
      {user?.role !== 'unassigned' && (
        <div className="dashboard-main-content">
          {/* 功能导航 */}
          {navigationItems.length > 0 && (
            <div className="dashboard-navigation-section">
              <h2>功能导航</h2>
              <div className="dashboard-nav-grid">
                {navigationItems.map((item, index) => (
                  <div 
                    key={index} 
                    className="dashboard-nav-card"
                    onClick={() => navigate(item.path)}
                  >
                    <div className="dashboard-nav-icon">{item.icon}</div>
                    <div className="dashboard-nav-content">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 数据分析区域 - 仅对管理员、采购人员和监事显示 */}
          {showAnalytics && (
            <div className="dashboard-analytics-section">
              <div className="dashboard-analytics-header">
                <h2>项目统计概览</h2>
              </div>

              {/* 筛选控件 - 均匀分布 */}
              <div className="dashboard-filter-section">
                <span className="dashboard-filter-label">筛选条件:</span>
                <div className="dashboard-filter-controls">
                  <select 
                    value={selectedOwner}
                    onChange={(e) => setSelectedOwner(e.target.value)}
                    className="dashboard-owner-select"
                  >
                    {ownerOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button onClick={refetch} className="dashboard-refresh-btn">
                    🔄 刷新数据
                  </button>
                </div>
              </div>

              {error && (
                <div className="dashboard-error-message">
                  ❌ {error}
                  <button onClick={refetch} className="dashboard-retry-btn">
                    重试
                  </button>
                </div>
              )}

              {/* 统计卡片 */}
              <div className="dashboard-stats-section">
                {data?.stats && (
                  <StatsCards stats={data.stats} loading={loading} />
                )}
              </div>

              {/* 状态统计图表 - 并排显示 */}
              <div className="dashboard-charts-grid">
                <div className="dashboard-chart-column">
                  {data?.statusStats && (
                    <StatusCharts 
                      statusStats={data.statusStats} 
                      title="整体状态分布"
                      loading={loading}
                    />
                  )}
                </div>
                <div className="dashboard-chart-column">
                  {data?.ownerStats && (
                    <StatusCharts 
                      statusStats={data.ownerStats} 
                      title={`${selectedOwner}的状态分布`}
                      loading={loading}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 登出按钮 - 对所有角色显示 */}
      <div className="dashboard-logout-section">
        <button 
          onClick={handleLogout}
          className="dashboard-logout-btn"
        >
          退出登录
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
