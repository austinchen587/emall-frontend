// src/pages/Dashboard/index.tsx
import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useDashboardData } from './hooks/useDashboardData';
import { StatsCards } from './components/StatsCards';
import { StatusCharts } from './components/StatusCharts';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [selectedOwner, setSelectedOwner] = useState('陈少帅');
  
  const { data, loading, error, refetch } = useDashboardData(selectedOwner);

  const handleLogout = () => {
    logout();
  };

  const navigationItems = [
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
      icon: '💬', 
      title: '智能助手', 
      description: 'AI助手帮助处理业务',
      path: '/chat'
    },
  ];

  const ownerOptions = [
    { value: '陈少帅', label: '陈少帅' },
    { value: '胡夏阳', label: '胡夏阳' },
    { value: '董婷婷', label: '董婷婷' },
  ];

  return (
    <div className="dashboard-container">
      {/* 欢迎区域 */}
      <div className="welcome-section">
        <h1 className="welcome-title">欢迎回来, {user?.username || '用户'}!</h1>
        <p className="welcome-subtitle">采购项目数据分析面板</p>
      </div>

      {/* 数据分析区域 */}
      <div className="analytics-section">
        <div className="analytics-header">
          <h2>项目统计概览</h2>
          <div className="analytics-controls">
            <select 
              value={selectedOwner}
              onChange={(e) => setSelectedOwner(e.target.value)}
              className="owner-select"
            >
              {ownerOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button onClick={refetch} className="refresh-btn">
              🔄 刷新
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            ❌ {error}
            <button onClick={refetch} className="retry-btn">
              重试
            </button>
          </div>
        )}

        {/* 统计卡片 */}
        {data?.stats && (
          <StatsCards stats={data.stats} loading={loading} />
        )}

        {/* 状态统计图表 */}
        <div className="charts-grid">
          <div className="chart-column">
            {data?.statusStats && (
              <StatusCharts 
                statusStats={data.statusStats} 
                title="整体状态分布"
                loading={loading}
              />
            )}
          </div>
          <div className="chart-column">
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

      {/* 功能导航 */}
      <div className="navigation-section">
        <h2>功能导航</h2>
        <div className="nav-grid">
          {navigationItems.map((item, index) => (
            <div 
              key={index} 
              className="nav-card"
              onClick={() => navigate(item.path)}
            >
              <div className="nav-icon">{item.icon}</div>
              <div className="nav-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 登出按钮 */}
      <div className="logout-section">
        <button 
          onClick={handleLogout}
          className="logout-btn"
        >
          退出登录
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
