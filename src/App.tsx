// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Auth/login';
import Dashboard from './pages/Dashboard/Dashboard';
import EmallList from './pages/EmallList';
import Procurement from './pages/Procurement/Procurement';
import SupplierManagementPage from './pages/SupplierManagement';
import QuotedProjectsPage from './quoted-projects/QuotedProjectsPage';
import FpListPage from './pages/fp_emall/FpListPage'; // 导入反拍页面
import ProfitPage from './pages/profit'; // 导入利润分析页面
import './App.css';

// --- 竞价大厅组件 ---
import Portal from './pages/BiddingHall/Portal';         // 1. 门户
import BiddingHallPage from './pages/BiddingHall/index'; // 2. 列表
import BiddingDetail from './pages/BiddingHall/Detail';  // 3. 详情 (新增导入)

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

  // 如果指定了角色要求，检查用户角色
  if (requiredRoles.length > 0 && user) {
    // 这里假设 user 对象中有 role 属性，或者从其他地方获取用户角色
    // 实际项目中可能需要根据后端返回的用户信息结构调整
    const userRole = (user as any).role || 'guest';
    
    // 如果是 admin，通常拥有所有权限
    if (userRole === 'admin') {
      return <>{children}</>;
    }
    
    if (!requiredRoles.includes(userRole)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/emall-list" element={
            <ProtectedRoute requiredRoles={['admin', 'procurement_staff', 'supervisor']}>
              <EmallList />
            </ProtectedRoute>
          } />
          
          <Route path="/procurement" element={
            <ProtectedRoute requiredRoles={['admin', 'procurement_staff']}>
              <Procurement />
            </ProtectedRoute>
          } />

          {/* === 竞价大厅模块 (开始) === */}
          
          {/* 1. 门户 (省份选择) */}
          <Route path="/bidding" element={
            <ProtectedRoute requiredRoles={['admin', 'procurement_staff', 'supervisor']}>
              <Portal />
            </ProtectedRoute>
          } />
          
          {/* 2. 具体省份的大厅列表 */}
          <Route path="/bidding/hall" element={
            <ProtectedRoute requiredRoles={['admin', 'procurement_staff', 'supervisor']}>
              <BiddingHallPage />
            </ProtectedRoute>
          } />

          {/* 3. 项目详情页 (修复了这里) */}
          <Route path="/bidding/detail/:id" element={
            <ProtectedRoute requiredRoles={['admin', 'procurement_staff', 'supervisor']}>
               <BiddingDetail /> {/* 指向 Detail 组件 */}
            </ProtectedRoute>
          } />
          
          {/* === 竞价大厅模块 (结束) === */}
          
          {/* 供应商管理 */}
          <Route path="/suppliers" element={
           <ProtectedRoute requiredRoles={['admin', 'supplier_manager']}>
              <SupplierManagementPage />
           </ProtectedRoute>
           } />
          
          {/* 报价项目 */}
          <Route path="/quoted-projects" element={
            <ProtectedRoute requiredRoles={['admin', 'procurement_staff', 'supervisor']}>
              <QuotedProjectsPage />
            </ProtectedRoute>
          } />
          
          {/* 反拍管理 */}
          <Route path="/fg-emall" element={
            <ProtectedRoute requiredRoles={['admin', 'supplier_manager']}>
              <FpListPage />
            </ProtectedRoute>
          } />
          
          {/* 利润分析 */}
          <Route path="/profit" element={
            <ProtectedRoute requiredRoles={['admin']}>
              <ProfitPage />
            </ProtectedRoute>
          } />
          
          {/* 默认路由 */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;