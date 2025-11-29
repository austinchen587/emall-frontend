// src/pages/EmallList/components/EmallTableRow.tsx
import React from 'react';
import { EmallItem } from '../../../services/types';

interface EmallTableRowProps {
  item: EmallItem;
  isExpanded: boolean;
  onToggleExpand: (id: number) => void;
  onProjectNumberClick: (item: EmallItem) => void;
  onProjectTitleClick: (item: EmallItem) => void;
  onSelectProcurement: (item: EmallItem, isSelected: boolean) => void;
  onProgressClick: (item: EmallItem) => void;
  formatCurrency: (amount: number | null) => string;
  formatDate: (dateString: string) => string;
  isValidUrl: (url: string | undefined) => boolean;
  isTextLong: (text: string) => boolean;
  getBiddingStatusDisplay: (status?: string) => string;
}

const EmallTableRow: React.FC<EmallTableRowProps> = ({
  item,
  isExpanded,
  onToggleExpand,
  onProjectNumberClick,
  onProjectTitleClick,
  onSelectProcurement,
  onProgressClick,
  formatCurrency,
  formatDate,
  isValidUrl,
  isTextLong,
  getBiddingStatusDisplay
}) => {
  const isTitleLong = isTextLong(item.project_title);

  return (
    <React.Fragment>
      <tr className={`emall-row ${isExpanded ? 'expanded' : ''}`}>
        <td className="project-title-cell">
          <div className="title-content">
            {isValidUrl(item.url) ? (
              <a
                href={item.url!}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link"
                onClick={(e) => {
                  e.preventDefault();
                  onProjectTitleClick(item);
                }}
                title="点击查看项目详情"
              >
                {item.project_title}
              </a>
            ) : (
              <span className="project-title-text">
                {item.project_title}
              </span>
            )}
            {isTitleLong && (
              <button 
                className="expand-btn"
                onClick={() => onToggleExpand(item.id)}
                title={isExpanded ? '收起' : '展开'}
              >
                {isExpanded ? '▲' : '▼'}
              </button>
            )}
          </div>
        </td>
        
        <td className="project-number-cell">
          <code 
            className="project-number clickable"
            onClick={() => onProjectNumberClick(item)}
            title="点击查看项目详情"
          >
            {item.project_number || '-'}
          </code>
        </td>
        
        <td className="purchasing-unit-cell">
          <span className="unit-text">{item.purchasing_unit}</span>
        </td>
        
        <td className="price-cell">
          <span className="price-value">
            {formatCurrency(item.total_price_numeric)}
          </span>
        </td>
        
        <td className="date-cell">
          <span className="date-value">{formatDate(item.publish_date)}</span>
        </td>
        
        <td className="date-cell">
          <span className="date-value">{formatDate(item.quote_end_time)}</span>
        </td>
        
        <td className="select-cell">
          <div className="select-checkbox">
            <input
              type="checkbox"
              checked={item.is_selected || false}
              onChange={(e) => onSelectProcurement(item, e.target.checked)}
              className="procurement-checkbox"
            />
          </div>
        </td>
        
        <td className="progress-cell">
          {item.is_selected && item.bidding_status && (
            <button
              className="progress-btn"
              onClick={() => onProgressClick(item)}
              title="查看采购进度"
              data-status={item.bidding_status}
            >
              {getBiddingStatusDisplay(item.bidding_status)}
            </button>
          )}
        </td>
      </tr>
      
      {isExpanded && (
        <tr className="detail-row">
          <td colSpan={8}>
            <div className="project-details">
              <div className="detail-section">
                <h4>项目详情</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>项目名称:</label>
                    <span>{item.project_name || '-'}</span>
                  </div>
                  <div className="detail-item">
                    <label>所在地区:</label>
                    <span>{item.region || '-'}</span>
                  </div>
                  <div className="detail-item">
                    <label>商品名称:</label>
                    <span>{item.commodity_names || '-'}</span>
                  </div>
                  <div className="detail-item">
                    <label>报价开始:</label>
                    <span>{formatDate(item.quote_start_time)}</span>
                  </div>
                </div>
              </div>
              {item.url && (
                <div className="detail-section">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="detail-link"
                  >
                    📎 查看完整项目信息
                  </a>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};

export default EmallTableRow;
