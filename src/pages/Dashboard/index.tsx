// src/pages/Dashboard/index.tsx
import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

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

  return (
    <div className="dashboard-container">
      {/* 欢迎区域 */}
      <div className="welcome-section">
        <h1 className="welcome-title">欢迎回来, {user?.username || '用户'}!</h1>
        <p className="welcome-subtitle">请选择要操作的功能模块</p>
      </div>

      {/* 功能导航 */}
      <div className="navigation-section">
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
