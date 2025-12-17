// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Auth/login'; // 确保这里的路径正确
import Dashboard from './pages/Dashboard/Dashboard';
import EmallList from './pages/EmallList';
import Procurement from './pages/Procurement/Procurement';
import SupplierManagementPage from './pages/SupplierManagement';
import QuotedProjectsPage from './quoted-projects/QuotedProjectsPage';
import FpListPage from './pages/fp_emall/FpListPage'; // 导入反拍页面
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

  //检查角色权限
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
          
          {/* 采购项目列表 - 管理员、采购人员和监事可访问 */}
          <Route path="/emall-list" element={
            <ProtectedRoute requiredRoles={['admin', 'procurement_staff', 'supervisor']}>
              <EmallList />
            </ProtectedRoute>
          } />

          {/* 采购管理 - 管理员、采购人员和监事可访问 */}
          <Route path="/procurement" element={
            <ProtectedRoute requiredRoles={['admin', 'procurement_staff', 'supervisor']}>
              <Procurement />
            </ProtectedRoute>
          } />
          
          {/* 供应商管理 - 管理员和供应商管理员可访问 */}
          <Route path="/suppliers" element={
           <ProtectedRoute requiredRoles={['admin', 'supplier_manager']}>
              <SupplierManagementPage />
           </ProtectedRoute>
           } />
          
          {/* 智能助手 - 管理员、采购人员和监事可访问 */}
          <Route path="/chat" element={
            <ProtectedRoute requiredRoles={['admin', 'procurement_staff', 'supervisor']}>
              <div>聊天页面 - 待实现</div>
            </ProtectedRoute>
          } />
          
          {/* 报价项目 - 管理员、采购人员和监事可访问 */}
          <Route path="/quoted-projects" element={
            <ProtectedRoute requiredRoles={['admin', 'procurement_staff', 'supervisor']}>
              <QuotedProjectsPage />
            </ProtectedRoute>
          } />
          
          {/* 反拍管理 - 只有 admin 和 supplier_manager 可以访问 */}
          <Route path="/fg-emall" element={
            <ProtectedRoute requiredRoles={['admin', 'supplier_manager']}>
              <FpListPage />
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
