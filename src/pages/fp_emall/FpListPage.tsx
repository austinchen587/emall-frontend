// src/pages/fp_emall/FpListPage.tsx
import React from 'react';
import { useFpList } from './hooks/useFpList';
import SearchForm from './components/SearchForm';
import DataTable from './components/DataTable';
import { SearchField } from '../../services/types/fpTypes';
import './FpListPage.css';

const FpListPage: React.FC = () => {
  const {
    loading,
    tableData,
    pagination,
    handleSearch,
    handleReset,
    handlePageChange,
  } = useFpList();

  const searchFields: SearchField[] = [
    { value: 'fp_project_name', label: '项目名称' },
    { value: 'fp_project_number', label: '项目编号' },
    { value: 'fp_purchasing_unit', label: '采购单位' },
    { value: 'converted_price', label: '转换价格', type: 'number' },
  ];

  return (
    <div className="fp-list-page">
      <div className="page-card">
        <div className="page-header">
          <h1>FP项目管理</h1>
          <p className="page-description">FP项目信息查询与管理</p>
        </div>

        <SearchForm
          searchFields={searchFields}
          onSearch={handleSearch}
          onReset={handleReset}
          loading={loading}
        />

        <DataTable
          data={tableData}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default FpListPage;
