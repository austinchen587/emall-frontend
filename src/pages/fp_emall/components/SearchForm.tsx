// src/pages/fp_emall/components/SearchForm.tsx
import React, { useState } from 'react';
import { SearchField, FpSearchParams } from '../../../services/types/fpTypes';
import './SearchForm.css';

interface SearchFormProps {
  searchFields: SearchField[];
  onSearch: (values: FpSearchParams) => void;
  onReset: () => void;
  loading?: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ 
  searchFields, 
  onSearch, 
  onReset, 
  loading = false 
}) => {
  const [selectedField, setSelectedField] = useState<string>('fp_project_name');
  const [searchValue, setSearchValue] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const handleFieldChange = (field: string) => {
    setSelectedField(field);
  };

  const handleValueChange = (value: string) => {
    setSearchValue(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchValue.trim()) {
      onSearch({
        search: searchValue.trim(),
        search_field: selectedField
      });
    } else {
      // 如果没有搜索值，执行重置
      handleReset();
    }
  };

  const handleReset = () => {
    setSearchValue('');
    setSelectedField('fp_project_name');
    onReset();
  };

  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced);
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="search-form-header">
        <h3 className="search-form-title">筛选条件</h3>
        <button 
          type="button" 
          className="search-form-toggle"
          onClick={toggleAdvanced}
        >
          {showAdvanced ? '收起' : '展开'}更多筛选
        </button>
      </div>

      <div className="search-form-fields">
        {/* 搜索字段选择器 */}
        <div className="form-field">
          <label className="field-label">搜索字段</label>
          <select 
            className="field-select"
            value={selectedField}
            onChange={(e) => handleFieldChange(e.target.value)}
            disabled={loading}
          >
            {searchFields.map(field => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>
        </div>

        {/* 搜索关键词输入框 */}
        <div className="form-field">
          <label className="field-label">搜索关键词</label>
          <input
            type="text"
            className="field-input"
            placeholder="请输入搜索关键词"
            value={searchValue}
            onChange={(e) => handleValueChange(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* 高级筛选区域 */}
        {showAdvanced && (
          <>
            {/* 可以在这里添加更多筛选字段 */}
            <div className="form-field">
              <label className="field-label">项目状态</label>
              <select className="field-select" disabled={loading}>
                <option value="">全部状态</option>
                <option value="active">活跃</option>
                <option value="inactive">非活跃</option>
              </select>
            </div>

            <div className="form-field">
              <label className="field-label">价格范围</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="number"
                  className="field-input"
                  placeholder="最低价格"
                  style={{ flex: 1 }}
                  disabled={loading}
                />
                <span style={{ lineHeight: '40px', color: '#999' }}>至</span>
                <input
                  type="number"
                  className="field-input"
                  placeholder="最高价格"
                  style={{ flex: 1 }}
                  disabled={loading}
                />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="form-actions">
        <button 
          type="submit" 
          className="search-btn"
          disabled={loading}
        >
          {loading ? '搜索中...' : '搜索'}
        </button>
        <button 
          type="button" 
          className="reset-btn"
          onClick={handleReset}
          disabled={loading}
        >
          重置
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
