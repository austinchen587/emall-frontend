// src/pages/EmallList/components/FilterSection.tsx
import React from 'react';
import { EmallFilterParams } from '../../../services/types';
import './FilterSection.css';

interface FilterSectionProps {
  filters: EmallFilterParams;
  onFilterChange: (key: keyof EmallFilterParams, value: any) => void;
  onReset: () => void;
  onSearch: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  filters,
  onFilterChange,
  onReset,
  onSearch
}) => {
  return (
    <div className="filter-section">
      <div className="filter-header">
        <h3>筛选条件</h3>
        <div className="filter-controls">
          <button onClick={onReset} className="reset-btn">
            <span className="btn-icon">↺</span>
            重置
          </button>
          <button onClick={onSearch} className="search-btn">
            <span className="btn-icon">🔍</span>
            搜索
          </button>
        </div>
      </div>
      
      <div className="filter-grid">
        <div className="filter-group">
          <label className="filter-label">项目标题</label>
          <input
            type="text"
            value={filters.project_title || ''}
            onChange={(e) => onFilterChange('project_title', e.target.value)}
            placeholder="输入项目标题关键词..."
            className="filter-input"
          />
        </div>
        
        <div className="filter-group">
          <label className="filter-label">采购单位</label>
          <input
            type="text"
           value={filters.purchasing_unit || ''}
            onChange={(e) => onFilterChange('purchasing_unit', e.target.value)}
            placeholder="输入采购单位名称..."
            className="filter-input"
          />
        </div>
        
        <div className="filter-group">
          <label className="filter-label">项目编号</label>
          <input
            type="text"
            value={filters.project_number || ''}
            onChange={(e) => onFilterChange('project_number', e.target.value)}
            placeholder="输入项目编号..."
            className="filter-input"
          />
        </div>
        
        <div className="filter-group">
          <label className="filter-label">价格条件</label>
          <input
            type="text"
            value={filters.total_price_condition || ''}
            onChange={(e) => onFilterChange('total_price_condition', e.target.value)}
            placeholder="例如: >1000, <=50000, =2000"
            className="filter-input"
          />
        </div>
        {/* 新增：项目归属人筛选 */}
        <div className="filter-group">
          <label className="filter-label">项目归属人</label>
          <input
            type="text"
            value={filters.project_owner || ''}
            onChange={(e) => onFilterChange('project_owner', e.target.value)}
            placeholder="输入归属人姓名..."
            className="filter-input"
          />
        </div>
        
        <div className="filter-group">
          <label className="filter-label">全局搜索</label>
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            placeholder="输入任意关键词搜索..."
            className="filter-input"
          />
        </div>
        
        {/* 新增：只看选择项目复选框 */}
        <div className="filter-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            id="show_selected_only"
            checked={filters.show_selected_only || false}
            onChange={(e) => onFilterChange('show_selected_only', e.target.checked)}
            style={{ width: '16px', height: '16px' }}
          />
          <label htmlFor="show_selected_only" className="filter-label" style={{ margin: 0 }}>
            只看选择项目
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
