// src/components/emall/ModalTabs.tsx
import React from 'react';
import './ModalTabs.css';

interface ModalTabsProps {
  activeTab: 'overview' | 'basic' | 'suppliers' | 'remarks';
  onTabChange: (tab: 'overview' | 'basic' | 'suppliers' | 'remarks') => void;
}

const ModalTabs: React.FC<ModalTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { key: 'overview', label: '📈 概况页面' },
    { key: 'basic', label: '📝 基本信息管理' },
    { key: 'suppliers', label: '👥 供应商管理' },
    { key: 'remarks', label: '💬 进度备注' }
  ] as const;

  return (
    <div className="modal-tabs">
      {tabs.map(tab => (
        <button 
          key={tab.key}
          className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
          onClick={() => onTabChange(tab.key as any)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ModalTabs;
