// src/pages/Dashboard/Dashboard.tsx
import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useDashboardData } from './hooks/useDashboardData';
import { StatsCards } from './components/StatsCards';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  // 使用选择器函数获取状态
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  
  const navigate = useNavigate();
  // 保留 state 用于数据获取的默认值，虽然 UI 上不能切换了
  const [selectedOwner] = useState('陈少帅');
  
  const { data, loading, error, refetch } = useDashboardData(selectedOwner);

  const handleLogout = () => {
    logout();
  };

  // 根据用户角色定义可访问的导航项
  const getNavigationItems = () => {
    const baseItems = [
      { 
        icon: '⚖️',
        title: '竞价大厅', 
        description: '查看全省实时竞价与反拍项目',
        path: '/bidding' 
      },
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
    ];

    // [已移除] 反拍模块逻辑

    // 添加利润分析模块 - 只有 admin 可以看到
    if (user?.role === 'admin') {
      baseItems.push({
        icon: '💰',
        title: '利润分析',
        description: '利润成本管理与分析',
        path: '/profit'
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
        // 供应商管理员显示供应商管理模块 (移除了反拍)
        return baseItems.filter(item => 
          item.path === '/suppliers' || 
          item.path === '/chat'
        );
      
      case 'unassigned':
      default:
        // 未分配角色不显示任何导航项
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  // 根据角色判断是否显示数据分析区域
  const showAnalytics = user?.role === 'admin' || 
                       user?.role === 'procurement_staff' || 
                       user?.role === 'supervisor';

  return (
    <div className="dashboard-container">
      {/* 欢迎区域 */}
      <div className="dashboard-welcome-section">
        <h1 className="dashboard-welcome-title">欢迎回来, {user?.username || '用户'}!</h1>
        <p className="dashboard-welcome-subtitle">
          {user?.role === 'admin' && '系统管理面板'}
          {user?.role === 'procurement_staff' && '采购项目数据分析面板'}
          {user?.role === 'supervisor' && '采购项目数据分析面板'}
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

              {/* [修改] 移除了 dashboard-filter-section (筛选条件和刷新按钮) */}

              {error && (
                <div className="dashboard-error-message">
                  ❌ {error}
                  <button onClick={refetch} className="dashboard-retry-btn">
                    重试
                  </button>
                </div>
              )}

              {/* 统计卡片 - 仅保留此模块 */}
              <div className="dashboard-stats-section">
                {data?.stats && (
                  <StatsCards stats={data.stats} loading={loading} />
                )}
              </div>

              {/* [已移除] 图表区域 */}
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