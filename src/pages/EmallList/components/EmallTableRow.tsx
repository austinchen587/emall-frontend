// src/pages/EmallList/components/EmallTableRow.tsx
import React, { useState, useEffect } from 'react';
import { EmallItem } from '../../../services/types';
import './TableRowStyles.css';
import './ActionButtons.css';

interface UnifiedRemark {
  id: number;
  remark_content: string;
  created_by: string;
  remark_type: string;
  remark_type_display: string;
  created_at: string;
  created_at_display: string;
  updated_at: string | null;
}

interface EmallTableRowProps {
  item: EmallItem;
  isExpanded: boolean;
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
  isReadOnly?: boolean;
}

const EmallTableRow: React.FC<EmallTableRowProps> = ({
  item,
  isExpanded,
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
  isReadOnly = false
}) => {
  const isTitleLong = isTextLong(item.project_title);
  const [unifiedRemark, setUnifiedRemark] = useState<UnifiedRemark | null>(null);
  const [loadingRemark, setLoadingRemark] = useState(false);

  const fetchUnifiedRemark = async (procurementId: number) => {
    if (!procurementId) return;
    
    setLoadingRemark(true);
    try {
      const response = await fetch(`/api/emall/purchasing/procurement/${procurementId}/get_unified_remarks/`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.remarks && data.remarks.length > 0) {
          setUnifiedRemark(data.remarks[0]);
        } else {
          setUnifiedRemark(null);
        }
      }
    } catch (error) {
      console.error('获取统一备注失败:', error);
    } finally {
      setLoadingRemark(false);
    }
  };

useEffect(() => {
  if (!item.is_selected && item.id) {
    fetchUnifiedRemark(item.id);
  }
}, [item.is_selected, item.id, item.latest_remark]); // 移除 !unifiedRemark 条件
const getDisplayRemark = () => {
  // 如果项目已选中，显示项目备注
  if (item.is_selected) {
    return item.latest_remark;
  }
  
  // 如果项目未选中，但有最新的项目备注（可能发生在刚取消选择时），优先显示
  if (item.latest_remark && item.latest_remark.content) {
    return item.latest_remark;
  }
  
  // 否则显示统一备注
  return unifiedRemark;
};

  const displayRemark = getDisplayRemark();

  const getRemarkContent = () => {
    if (!displayRemark) return '';
    
    if ('remark_content' in displayRemark) {
      return displayRemark.remark_content;
    }
    if ('content' in displayRemark) {
      return displayRemark.content;
    }
    return '';
  };

  const getRemarkAuthor = () => {
    if (!displayRemark) return '';
    return displayRemark.created_by || '';
  };

  const getRemarkDate = () => {
    if (!displayRemark) return '';
    return displayRemark.created_at || '';
  };

  const remarkContent = getRemarkContent();
  const remarkAuthor = getRemarkAuthor();
  const remarkDate = getRemarkDate();

  const handleSelectProcurement = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isReadOnly) {
      alert('您只有查看权限，无法选择采购项目');
      return;
    }
    onSelectProcurement(item, e.target.checked);
  };

  const handleAddRemark = () => {
    if (isReadOnly) {
      alert('您只有查看权限，无法添加备注');
      return;
    }
    onAddRemarkClick(item);
  };

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
              onChange={handleSelectProcurement}
              className="procurement-checkbox"
              disabled={isReadOnly}
            />
          </div>
        </td>
        
        <td className="owner-cell">
          <span className="owner-text">
            {item.project_owner || '-'}
          </span>
        </td>
        
        <td className="remark-cell">
          {loadingRemark ? (
            <div className="remark-loading">加载中...</div>
          ) : displayRemark ? (
            <div className="remark-content">
              <div className="remark-text" title={remarkContent}>
                {remarkContent.length > 20 
                  ? `${remarkContent.substring(0, 20)}...`
                  : remarkContent
                }
              </div>
              <div className="remark-meta">
                <span className="remark-author">{remarkAuthor}</span>
                <span className="remark-time">{formatDate(remarkDate)}</span>
              </div>
            </div>
          ) : (
            <button 
              className="add-remark-btn"
              onClick={handleAddRemark}
              title="添加备注"
              disabled={isReadOnly}
            >
              添加备注
            </button>
          )}
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
          <td colSpan={10}>
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
                  {displayRemark && (
                    <div className="detail-item">
                      <label>备注信息:</label>
                      <div>
                        <div>{remarkContent}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {remarkAuthor} - {formatDate(remarkDate)}
                        </div>
                        <div style={{ fontSize: '12px', color: '#888' }}>
                          {!item.is_selected ? '（统一备注）' : '（项目备注）'}
                        </div>
                      </div>
                    </div>
                  )}
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
