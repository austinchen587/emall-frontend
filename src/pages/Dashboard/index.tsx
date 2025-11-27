// src/pages/Dashboard/index.tsx
import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuthStore();

  const stats = [
    { title: '总采购单', value: '156', change: '+12%', description: '本月新增' },
    { title: '进行中', value: '23', change: '+5%', description: '待处理' },
    { title: '已完成', value: '89', change: '+8%', description: '本月完成' },
    { title: '供应商', value: '45', change: '+3%', description: '合作中' },
  ];

  const quickActions = [
    { icon: '📋', title: '新建采购单', description: '创建新的采购订单' },
    { icon: '👥', title: '供应商管理', description: '管理供应商信息' },
    { icon: '📊', title: '数据报表', description: '查看业务报表' },
    { icon: '⚙️', title: '系统设置', description: '系统配置管理' },
  ];

  const recentActivities = [
    { action: '创建采购单', item: 'PO-2024-001', time: '2分钟前' },
    { action: '更新供应商', item: 'ABC公司', time: '1小时前' },
    { action: '完成采购', item: 'PO-2023-156', time: '3小时前' },
    { action: '新增用户', item: '李四', time: '昨天' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard-container">
      {/* 欢迎区域 */}
      <div className="welcome-section">
        <h1 className="welcome-title">欢迎回来, {user?.username || '用户'}!</h1>
        <p className="welcome-subtitle">以下是今天的业务概览</p>
      </div>

      {/* 数据统计卡片 */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.5rem' }}>
                {stat.title}
              </h3>
              <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.25rem' }}>
                {stat.value}
              </div>
              <p style={{ fontSize: '0.75rem', color: '#10b981' }}>
                {stat.change} {stat.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 快捷操作区域 */}
      <div className="quick-actions">
        <h2 className="section-title">快捷操作</h2>
        <div className="actions-grid">
          {quickActions.map((action, index) => (
            <div key={index} className="action-card">
              <div className="action-icon">{action.icon}</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{action.title}</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{action.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 最近活动 */}
      <div className="recent-activity">
        <h2 className="section-title">最近活动</h2>
        {recentActivities.map((activity, index) => (
          <div key={index} className="activity-item">
            <div className="activity-dot"></div>
            <div className="activity-content">
              <div>
                <span style={{ fontWeight: '500' }}>{activity.action}</span>
                <span style={{ color: '#6b7280', marginLeft: '0.5rem' }}>{activity.item}</span>
              </div>
              <div className="activity-time">{activity.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 登出按钮 */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button 
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          退出登录
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
