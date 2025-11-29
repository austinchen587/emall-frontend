// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Auth/login';
import Dashboard from './pages/Dashboard';
import EmallList from './pages/EmallList';
import './App.css';

// 完全保护的路由组件
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
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
  
  return <>{children}</>;
};

// 部分保护的路由 - 允许访问但某些功能需要认证
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 登录页 */}
          <Route path="/login" element={<Login />} />
          
          {/* 需要完全认证的路由 */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* EmallList 公开访问 */}
          <Route path="/emall-list" element={
            <PublicRoute>
              <EmallList />
            </PublicRoute>
          } />

          <Route path="/procurement" element={
            <ProtectedRoute>
              <div>采购管理页面 - 待实现</div>
            </ProtectedRoute>
          } />
          
          <Route path="/chat" element={
            <ProtectedRoute>
              <div>聊天页面 - 待实现</div>
            </ProtectedRoute>
          } />
          
          {/* 默认重定向 */}
          <Route path="/" element={<Navigate to="/emall-list" replace />} />
          <Route path="*" element={<Navigate to="/emall-list" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
