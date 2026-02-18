// src/pages/Dashboard/Dashboard.tsx
import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useDashboardData } from './hooks/useDashboardData';
import { StatsCards } from './components/StatsCards';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  // 实际场景可能不需要这个状态，这里保留原有逻辑
  const [selectedOwner] = useState(user?.username || 'Current User');
  
  const { data, loading, error, refetch } = useDashboardData(selectedOwner);

  const handleLogout = () => {
    logout();
  };

  const getNavigationItems = () => {
    const baseItems = [
      { 
        icon: '⚖️',
        title: '竞价大厅', 
        description: '查看全省实时竞价与反拍项目',
        path: '/bidding',
        color: '#eff6ff', 
        accent: '#3b82f6' 
      },
      { 
        icon: '📋', 
        title: '采购项目列表', 
        description: '查看和管理所有采购项目',
        path: '/emall-list',
        color: '#fdf4ff',
        accent: '#d946ef'
      },
      { 
        icon: '🛒', 
        title: '采购管理', 
        description: '创建和编辑采购订单',
        path: '/procurement',
        color: '#f0fdf4',
        accent: '#22c55e'
      },
      { 
        icon: '👥', 
        title: '供应商管理', 
        description: '管理供应商信息',
        path: '/suppliers',
        color: '#fff7ed',
        accent: '#f97316'
      },
      { 
        icon: '📊', 
        title: '已报价项目', 
        description: '集中管理竞价与反拍项目',
        path: '/quoted-projects',
        color: '#f5f3ff',
        accent: '#8b5cf6'
      },
    ];

    if (user?.role === 'admin') {
      baseItems.push({
        icon: '💰',
        title: '利润分析',
        description: '利润成本管理与分析',
        path: '/profit',
        color: '#fffbeb',
        accent: '#f59e0b'
      });
    }

    // 简化的权限过滤逻辑
    const allowedRoles = ['admin', 'procurement_staff', 'supervisor', 'supplier_manager'];
    if (!allowedRoles.includes(user?.role || '')) return [];

    if (user?.role === 'admin') return baseItems;

    const rolePaths: Record<string, string[]> = {
      procurement_staff: ['/emall-list', '/procurement', '/chat', '/quoted-projects'],
      supervisor: ['/emall-list', '/procurement', '/chat', '/quoted-projects'],
      supplier_manager: ['/suppliers', '/chat']
    };

    return baseItems.filter(item => rolePaths[user?.role || '']?.includes(item.path));
  };

  const navigationItems = getNavigationItems();

  // 角色名称映射
  const getRoleDisplayName = (role?: string) => {
    const map: Record<string, string> = {
      admin: '管理员',
      procurement_staff: '采购专员',
      supervisor: '监事',
      supplier_manager: '供应商管理员',
      unassigned: '待分配用户'
    };
    return role ? (map[role] || role) : '访客';
  };

  return (
    <div className="dashboard-container">
      {/* 顶部 Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="header-title">工作台</h1>
          <div className="user-profile">
            <span className="user-avatar">{user?.username?.[0]?.toUpperCase() || 'U'}</span>
            <div className="user-info">
              <span className="user-name">{user?.username}</span>
              <span className={`user-role role-${user?.role}`}>
                {getRoleDisplayName(user?.role)}
              </span>
            </div>
          </div>
        </div>
        <button onClick={handleLogout} className="header-logout-btn">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          <span>退出</span>
        </button>
      </header>

      <main className="dashboard-content fade-in">
        {/* 1. 数据统计区域 */}
        {user?.role !== 'unassigned' && (
          <section className="section-stats">
            <div className="section-header">
              <h2>数据概览</h2>
              <span className="section-subtitle">实时更新的项目动态</span>
            </div>
            
            {error && <div className="dashboard-alert error">加载失败: {error} <button onClick={refetch}>重试</button></div>}

            {/* 如果 StatsCards 组件内部没有包含 <div className="stats-cards"> 容器，
                你可能需要在这里手动包裹一层，或者确保组件内部输出了正确的类名 */}
            {data?.stats ? (
              <StatsCards stats={data.stats} loading={loading} />
            ) : (
              <div className="stats-placeholder">
                {loading ? '数据加载中...' : '暂无数据'}
              </div>
            )}
          </section>
        )}

        {/* 2. 功能导航区域 */}
        {navigationItems.length > 0 && (
          <section className="section-navigation">
            <div className="section-header">
              <h2>常用功能</h2>
              <span className="section-subtitle">快速访问您的业务模块</span>
            </div>
            
            <div className="nav-grid">
              {navigationItems.map((item, index) => (
                <div 
                  key={index} 
                  className="nav-card"
                  onClick={() => navigate(item.path)}
                  style={{ '--accent-color': item.accent, '--bg-color': item.color } as React.CSSProperties}
                >
                  <div className="nav-icon-wrapper">
                    {item.icon}
                  </div>
                  <div className="nav-content">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                  <div className="nav-arrow">→</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 无权限提示 */}
        {user?.role === 'unassigned' && (
          <div className="dashboard-alert warning">
            <h3>⚠️ 权限待分配</h3>
            <p>您的账户尚未分配角色，请联系管理员。</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;