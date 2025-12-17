// src/pages/fp_emall/components/DataTable.tsx
import React from 'react';
import { FpItem } from '../../../services/types/fpTypes';
import './DataTable.css';

interface DataTableProps {
  data: FpItem[];
  loading?: boolean;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  onPageChange: (page: number, pageSize?: number) => void;
}

const DataTable: React.FC<DataTableProps> = ({ 
  data, 
  loading = false, 
  pagination, 
  onPageChange 
}) => {
  const columns = [
    { key: 'fp_project_name', label: '项目名称' },
    { key: 'fp_project_number', label: '项目编号' },
    { key: 'fp_purchasing_unit', label: '采购单位' },
    { key: 'converted_price', label: '转换价格' },
  ];

  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  const handlePageChange = (page: number) => {
    onPageChange(page, pagination.pageSize);
  };

  const handleSizeChange = (pageSize: number) => {
    onPageChange(1, pageSize);
  };

  // 处理项目名称点击事件，在新窗口中打开链接
  const handleProjectNameClick = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return <div className="table-loading">加载中...</div>;
  }

  return (
    <div className="data-table">
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id || `row-${index}`}>
                <td>
                  {item.fp_url ? (
                    <a 
                      href={item.fp_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="project-name-link"
                      onClick={(e) => {
                        e.preventDefault();
                        handleProjectNameClick(item.fp_url);
                      }}
                      title="点击查看项目详情"
                    >
                      {item.fp_project_name || '-'}
                    </a>
                  ) : (
                    item.fp_project_name || '-'
                  )}
                </td>
                <td>{item.fp_project_number || '-'}</td>
                <td>{item.fp_purchasing_unit || '-'}</td>
                <td>{item.converted_price ? `¥${item.converted_price.toLocaleString()}` : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && !loading && (
        <div className="table-loading">暂无数据</div>
      )}

      <div className="pagination">
        <div className="pagination-info">
          共 {pagination.total} 条记录
        </div>
        <div className="pagination-controls">
          <button 
            className="pagination-btn"
            disabled={pagination.current === 1}
            onClick={() => handlePageChange(pagination.current - 1)}
          >
            上一页
          </button>
          
          <span className="pagination-current">
            第 {pagination.current} 页 / 共 {totalPages} 页
          </span>
          
          <button 
            className="pagination-btn"
            disabled={pagination.current === totalPages}
            onClick={() => handlePageChange(pagination.current + 1)}
          >
            下一页
          </button>
          
          <select 
            className="page-size-select"
            value={pagination.pageSize}
            onChange={(e) => handleSizeChange(Number(e.target.value))}
          >
            <option value={10}>10条/页</option>
            <option value={20}>20条/页</option>
            <option value={50}>50条/页</option>
            <option value={100}>100条/页</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
