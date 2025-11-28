// src/components/emall/ProjectDetailModal.tsx
import React from 'react';
import { EmallItem } from '../../services/types';
import './ProjectDetailModal.css';

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: EmallItem | null;
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  project 
}) => {
  console.log('Modal 组件渲染 - isOpen:', isOpen, 'project:', project);

  // 如果 modal 不打开或没有项目数据，直接返回 null
  if (!isOpen || !project) {
    console.log('Modal 条件不满足，不渲染');
    return null;
  }

  // 格式化金额显示
  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // 格式化日期显示
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('zh-CN');
    } catch (error) {
      return dateString; // 如果日期格式不正确，返回原字符串
    }
  };

  // 检查数组数据
  const hasArrayData = (array: any[] | null | undefined): boolean => {
    return Array.isArray(array) && array.length > 0;
  };

  // 渲染商品信息表格 - 移除序号列
  const renderCommodityTable = () => {
    const commodityNames = project.commodity_names || [];
    const parameterRequirements = project.parameter_requirements || [];
    const purchaseQuantities = project.purchase_quantities || [];
    const controlAmounts = project.control_amounts || [];
    const suggestedBrands = project.suggested_brands || [];

    const maxRows = Math.max(
      commodityNames.length,
      parameterRequirements.length,
      purchaseQuantities.length,
      controlAmounts.length,
      suggestedBrands.length
    );

    if (maxRows === 0) {
      return <div className="no-data">暂无商品信息</div>;
    }

    return (
      <div className="table-responsive">
        <table className="commodity-table">
          <thead>
            <tr>
              <th>商品名称</th>
              <th>参数要求</th>
              <th>购买数量</th>
              <th>控制金额</th>
              <th>建议品牌</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxRows }).map((_, index) => (
              <tr key={index}>
                <td>{commodityNames[index] || '-'}</td>
                <td>{parameterRequirements[index] || '-'}</td>
                <td>{purchaseQuantities[index] || '-'}</td>
                <td>{controlAmounts[index] || '-'}</td>
                <td>{suggestedBrands[index] || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // 渲染商务要求表格 - 移除序号列
  const renderBusinessTable = () => {
    const businessItems = project.business_items || [];
    const businessRequirements = project.business_requirements || [];

    const maxRows = Math.max(businessItems.length, businessRequirements.length);

    if (maxRows === 0) {
      return <div className="no-data">暂无商务要求</div>;
    }

    return (
      <div className="table-responsive">
        <table className="business-table">
          <thead>
            <tr>
              <th>商务项目</th>
              <th>商务要求</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxRows }).map((_, index) => (
              <tr key={index}>
                <td>{businessItems[index] || '-'}</td>
                <td>{businessRequirements[index] || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // 渲染下载文件
  const renderDownloadFiles = () => {
    const files = project.download_files || [];
    
    if (files.length === 0) {
      return <div className="no-data">暂无下载文件</div>;
    }

    return (
      <div className="download-files">
        {files.map((file, index) => (
          <div key={index} className="file-item">
            <span className="file-icon">📎</span>
            <span className="file-name">{file}</span>
            <button className="download-btn">下载</button>
          </div>
        ))}
      </div>
    );
  };

  // 渲染相关链接
  const renderRelatedLinks = () => {
    const links = project.related_links || [];
    
    if (links.length === 0) {
      return <div className="no-data">暂无相关链接</div>;
    }

    return (
      <div className="related-links">
        {links.map((link, index) => (
          <div key={index} className="link-item">
            <span className="link-icon">🔗</span>
            <a href={link} target="_blank" rel="noopener noreferrer" className="link-url">
              {link}
            </a>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            项目详情 - {project.project_title}
          </h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="modal-body custom-scrollbar">
          {/* 基本信息 */}
          <div className="info-section">
            <h4>基本信息</h4>
            <div className="info-grid">
              <div className="info-item">
                <label>采购单位</label>
                <span>{project.purchasing_unit || '-'}</span>
              </div>
              <div className="info-item">
                <label>项目编号</label>
                <span className="project-number">{project.project_number || '-'}</span>
              </div>
              <div className="info-item">
                <label>项目名称</label>
                <span>{project.project_name || project.project_title || '-'}</span>
              </div>
              <div className="info-item">
                <label>所在地区</label>
                <span className="region-badge">{project.region || '-'}</span>
              </div>
              <div className="info-item">
                <label>总控制价格</label>
                <span className="price-amount">{formatCurrency(project.total_price_numeric)}</span>
              </div>
              <div className="info-item">
                <label>价格控制</label>
                <span>{project.total_price_control || '-'}</span>
              </div>
            </div>
          </div>

          {/* 时间信息 */}
          <div className="info-section">
            <h4>时间信息</h4>
            <div className="time-grid">
              <div className="time-item">
                <span className="time-label">发布日期</span>
                <span className="time-value">{formatDate(project.publish_date)}</span>
              </div>
              <div className="time-item">
                <span className="time-label">报价开始</span>
                <span className="time-value">{formatDate(project.quote_start_time)}</span>
              </div>
              <div className="time-item">
                <span className="time-label">报价截止</span>
                <span className="time-value">{formatDate(project.quote_end_time)}</span>
              </div>
            </div>
          </div>

          {/* 商品信息 */}
          {hasArrayData(project.commodity_names) && (
            <div className="info-section">
              <h4>商品信息</h4>
              {renderCommodityTable()}
            </div>
          )}

          {/* 商务要求 */}
          {hasArrayData(project.business_items) && (
            <div className="info-section">
              <h4>商务要求</h4>
              {renderBusinessTable()}
            </div>
          )}

          {/* 相关链接 */}
          {hasArrayData(project.related_links) && (
            <div className="info-section">
              <h4>相关链接</h4>
              {renderRelatedLinks()}
            </div>
          )}

          {/* 下载文件 */}
          {hasArrayData(project.download_files) && (
            <div className="info-section">
              <h4>下载文件</h4>
              {renderDownloadFiles()}
            </div>
          )}

          {/* 操作按钮 */}
          <div className="action-buttons">
            {project.url && (
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                查看原链接
              </a>
            )}
            <button type="button" className="btn-secondary" onClick={onClose}>
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
