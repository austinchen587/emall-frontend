// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Auth/login'; // 确保这里的路径正确
import Dashboard from './pages/Dashboard/Dashboard';
import EmallList from './pages/EmallList';
import Procurement from './pages/Procurement/Procurement';
import './App.css';

// 角色权限检查函数
const hasPermission = (userRole: string, requiredRoles: string[]) => {
  return requiredRoles.includes(userRole) || userRole === 'admin';
};

// 保护的路由组件 - 添加角色检查
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  requiredRoles?: string[];
}> = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        加载中...
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 检查角色权限
  if (requiredRoles.length > 0 && user && !hasPermission(user.role, requiredRoles)) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        padding: '20px'
      }}>
        <h2>权限不足</h2>
        <p>您没有访问此页面的权限。</p>
        <button onClick={() => window.history.back()} style={{ marginTop: '20px' }}>
          返回上一页
        </button>
      </div>
    );
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 登录页 */}
          <Route path="/login" element={<Login />} />
          
          {/* Dashboard - 所有认证用户都可访问 */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* 采购项目列表 - 管理员和采购人员可访问 */}
          <Route path="/emall-list" element={
            <ProtectedRoute requiredRoles={['admin', 'procurement_staff']}>
              <EmallList />
            </ProtectedRoute>
          } />

          {/* 采购管理 - 管理员和采购人员可访问 */}
          <Route path="/procurement" element={
            <ProtectedRoute requiredRoles={['admin', 'procurement_staff']}>
              <Procurement />
            </ProtectedRoute>
          } />
          
          {/* 供应商管理 - 管理员和供应商管理员可访问 */}
          <Route path="/suppliers" element={
            <ProtectedRoute requiredRoles={['admin', 'supplier_manager']}>
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>供应商管理</h2>
                <p>功能开发中，敬请期待...</p>
              </div>
            </ProtectedRoute>
          } />
          
          {/* 智能助手 - 管理员和采购人员可访问 */}
          <Route path="/chat" element={
            <ProtectedRoute requiredRoles={['admin', 'procurement_staff']}>
              <div>聊天页面 - 待实现</div>
            </ProtectedRoute>
          } />
          
          {/* 默认重定向到 Dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
