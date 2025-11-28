// src/components/emall/ProjectDetailModal.tsx
import React from 'react';
import { EmallItem } from '../../services/types';
import './ProjectDetailModal.css'; // 添加这行

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
  if (!isOpen || !project) return null;

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
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  

  // 渲染表格数据
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
              <th className="bg-light-blue">商品名称</th>
              <th className="bg-light-blue">参数要求</th>
              <th className="bg-light-blue">购买数量</th>
              <th className="bg-light-blue">控制金额(元)</th>
              <th className="bg-light-blue">建议品牌</th>
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

  // 渲染商务要求表格
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
              <th className="bg-light-blue">商务项目</th>
              <th className="bg-light-blue">商务要求</th>
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            <i className="icon-document"></i>
            项目详情 - {project.project_title}
          </h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="modal-body custom-scrollbar">
          {/* 基本信息卡片 */}
          <div className="card mb-4">
            <div className="card-header bg-light-blue">
              <h6 className="mb-0">
                <i className="icon-info"></i>
                基本信息
              </h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <table className="info-table">
                    <tbody>
                      <tr>
                        <th className="text-muted">采购单位</th>
                        <td className="fw-bold">{project.purchasing_unit || '-'}</td>
                      </tr>
                      <tr>
                        <th className="text-muted">项目编号</th>
                        <td className="font-monospace">{project.project_number || '-'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-md-6">
                  <table className="info-table">
                    <tbody>
                      <tr>
                        <th className="text-muted">预算控制</th>
                        <td className="fw-bold text-success">
                          {formatCurrency(project.total_price_numeric)}
                        </td>
                      </tr>
                      <tr>
                        <th className="text-muted">地区</th>
                        <td>
                          <span className="badge bg-secondary">
                            {project.region || '-'}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          
          {/* 时间信息卡片 */}
          <div className="card mb-4">
            <div className="card-header bg-light-green">
              <h6 className="mb-0">
                <i className="icon-clock"></i>
                时间信息
              </h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 text-center">
                  <div className="time-block text-success">
                    <div className="time-icon">📅</div>
                    <div className="time-label">发布日期</div>
                    <div className="time-value fw-bold">{formatDate(project.publish_date)}</div>
                  </div>
                </div>
                <div className="col-md-4 text-center">
                  <div className="time-block text-primary">
                    <div className="time-icon">▶️</div>
                    <div className="time-label">报价开始</div>
                    <div className="time-value fw-bold">{formatDate(project.quote_start_time)}</div>
                  </div>
                </div>
                <div className="col-md-4 text-center">
                  <div className="time-block text-warning">
                    <div className="time-icon">⏹️</div>
                    <div className="time-label">报价截止</div>
                    <div className="time-value fw-bold">{formatDate(project.quote_end_time)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 商品信息表格 */}
          <div className="section mb-4">
            <h6 className="section-title bg-primary">
              <i className="icon-table"></i>
              商品信息
            </h6>
            {renderCommodityTable()}
          </div>
          
          {/* 商务要求表格 */}
          <div className="section mb-4">
            <h6 className="section-title bg-primary">
              <i className="icon-table"></i>
              商务要求
            </h6>
            {renderBusinessTable()}
          </div>
          
          {/* 下载文件 */}
          <div className="section mb-4">
            <h6 className="section-title bg-primary">
              <i className="icon-download"></i>
              下载文件
            </h6>
            {renderDownloadFiles()}
          </div>
          
          {/* 操作按钮 */}
          <div className="text-center mt-4 pt-3 border-top">
            {project.url && (
              <a 
                href={project.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <i className="icon-external"></i>
                查看原链接
              </a>
            )}
            <button 
              type="button" 
              className="btn btn-outline-secondary ms-2" 
              onClick={onClose}
            >
              <i className="icon-close"></i>
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
