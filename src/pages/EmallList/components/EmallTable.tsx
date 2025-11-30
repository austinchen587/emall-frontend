// src/pages/EmallList/components/EmallTable.tsx
import React from 'react';
import { EmallItem } from '../../../services/types';
import EmallTableRow from './EmallTableRow';
import Pagination from './Pagination';

interface EmallTableProps {
  emallItems: EmallItem[];
  expandedRows: Set<number>;
  onToggleExpand: (id: number) => void;
  onProjectNumberClick: (item: EmallItem) => void;
  onProjectTitleClick: (item: EmallItem) => void;
  onSelectProcurement: (item: EmallItem, isSelected: boolean) => void;
  onProgressClick: (item: EmallItem) => void;
  onAddRemarkClick: (item: EmallItem) => void;
  formatCurrency: (amount: number | null) => string;
  formatDate: (dateString: string) => string;
  isValidUrl: (url: string | undefined) => boolean;
  isTextLong: (text: string) => boolean;
  getBiddingStatusDisplay: (status?: string) => string;
  loading: boolean;
 totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const EmallTable: React.FC<EmallTableProps> = ({
  emallItems,
  expandedRows,
  onToggleExpand,
  onProjectNumberClick,
  onProjectTitleClick,
  onSelectProcurement,
  onProgressClick,
  onAddRemarkClick,
  formatCurrency,
  formatDate,
  isValidUrl,
  isTextLong,
  getBiddingStatusDisplay,
  loading,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="table-wrapper">
      <div className="table-header">
        <div className="table-info">
          显示 {emallItems.length} 个项目，共 {totalCount} 个
        </div>
      </div>
      
      <div className="emall-table-container">
        <table className="emall-table">
          <thead>
            <tr>
              <th className="col-title">项目标题</th>
              <th className="col-number">项目编号</th>
              <th className="col-unit">采购单位</th>
              <th className="col-price">总控制价格</th>
              <th className="col-date">发布时间</th>
              <th className="col-date">截止时间</th>
              <th className="col-select">选择项目</th>
              <th className="col-owner">项目归属人</th>
              <th className="col-remark">最新备注</th>
              <th className="col-progress">采购进度</th>
            </tr>
          </thead>
          <tbody>
            {emallItems.map((item) => (
              <EmallTableRow
                key={item.id}
                item={item}
                isExpanded={expandedRows.has(item.id)}
                onToggleExpand={onToggleExpand}
                onProjectNumberClick={onProjectNumberClick}
                onProjectTitleClick={onProjectTitleClick}
                onSelectProcurement={onSelectProcurement}
                onProgressClick={onProgressClick}
                onAddRemarkClick={onAddRemarkClick}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                isValidUrl={isValidUrl}
                isTextLong={isTextLong}
                getBiddingStatusDisplay={getBiddingStatusDisplay}
              />
            ))}
          </tbody>
        </table>
      </div>
      
      {emallItems.length === 0 && !loading && (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>暂无数据</h3>
          <p>请尝试调整筛选条件或稍后重试</p>
        </div>
      )}
      
      {loading && emallItems.length > 0 && (
        <div className="loading-more">
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          加载更多数据...
        </div>
      )}
      
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
};

export default EmallTable;
