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
  // 🔥 新增：本地状态管理输入值
  const [localFilters, setLocalFilters] = React.useState({
    project_title: filters.project_title || '',
    purchasing_unit: filters.purchasing_unit || '',
    project_number: filters.project_number || '',
    total_price_condition: filters.total_price_condition || '',
    project_owner: filters.project_owner || '',
    search: filters.search || ''
  });

  // 🔥 新增：同步props变化到本地状态
  React.useEffect(() => {
    setLocalFilters({
      project_title: filters.project_title || '',
      purchasing_unit: filters.purchasing_unit || '',
 project_number: filters.project_number || '',
      total_price_condition: filters.total_price_condition || '',
      project_owner: filters.project_owner || '',
      search: filters.search || ''
    });
  }, [filters]);

  // 🔥 新增：处理输入变化，只更新本地状态
  const handleInputChange = (key: keyof typeof localFilters, value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // 🔥 新增：手动触发搜索
  const handleManualSearch = () => {
    // 将所有本地状态同步到父组件
    Object.entries(localFilters).forEach(([key, value]) => {
      onFilterChange(key as keyof EmallFilterParams, value);
    });
    onSearch();
  };

  return (
    <div className="filter-section">
      <div className="filter-header">
        <h3>筛选条件</h3>
        <div className="filter-controls">
          <button onClick={onReset} className="reset-btn">
            <span className="btn-icon">↺</span>
            重置
          </button>
          <button onClick={handleManualSearch} className="search-btn">
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
            value={localFilters.project_title}
            onChange={(e) => handleInputChange('project_title', e.target.value)}
            placeholder="输入项目标题关键词..."
            className="filter-input"
          />
        </div>
        
        <div className="filter-group">
          <label className="filter-label">采购单位</label>
          <input
            type="text"
            value={localFilters.purchasing_unit}
            onChange={(e) => handleInputChange('purchasing_unit', e.target.value)}
            placeholder="输入采购单位名称..."
            className="filter-input"
          />
        </div>
        
        <div className="filter-group">
          <label className="filter-label">项目编号</label>
          <input
            type="text"
            value={localFilters.project_number}
            onChange={(e) => handleInputChange('project_number', e.target.value)}
            placeholder="输入项目编号..."
            className="filter-input"
          />
        </div>
        
        <div className="filter-group">
          <label className="filter-label">价格条件</label>
          <input
            type="text"
            value={localFilters.total_price_condition}
            onChange={(e) => handleInputChange('total_price_condition', e.target.value)}
            placeholder="例如: >1000, <=50000, =2000"
            className="filter-input"
          />
        </div>
        
        <div className="filter-group">
          <label className="filter-label">项目归属人</label>
          <input
            type="text"
            value={localFilters.project_owner}
            onChange={(e) => handleInputChange('project_owner', e.target.value)}
            placeholder="输入归属人姓名..."
            className="filter-input"
          />
        </div>
        
        <div className="filter-group">
          <label className="filter-label">全局搜索</label>
          <input
            type="text"
            value={localFilters.search}
            onChange={(e) => handleInputChange('search', e.target.value)}
            placeholder="输入任意关键词搜索..."
            className="filter-input"
          />
        </div>
        
        {/* 复选框保持实时响应 */}
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
