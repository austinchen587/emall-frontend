// src/pages/Procurement/components/LoadingError/LoadingError.tsx
import React from 'react';
import './LoadingError.css';

interface LoadingErrorProps {
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

const LoadingError: React.FC<LoadingErrorProps> = ({ loading, error, onRetry }) => {
  if (loading) {
    return (
      <div className="procurement-loading">
        <div className="loading-spinner"></div>
        <p>加载采购数据中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="procurement-error">
        <div className="error-icon">⚠️</div>
        <p>{error}</p>
        <button className="retry-button" onClick={onRetry}>
          重试
        </button>
      </div>
    );
  }

  return null;
};

export default LoadingError;
