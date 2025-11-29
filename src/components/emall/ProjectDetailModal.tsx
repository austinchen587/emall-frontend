// src/components/emall/ProjectDetailModal.tsx
import React, { useEffect, useState } from 'react';
import { EmallItem } from '../../services/types';
import { emallApi } from '../../services/api_emall';
import './ProjectDetailModal.css';

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: EmallItem | null;
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  project: initialProject 
}) => {
  const [project, setProject] = useState<EmallItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('Modal 组件渲染 - isOpen:', isOpen, 'initialProject:', initialProject);

  // 当modal打开时获取详细数据
  useEffect(() => {
    const fetchProjectDetail = async () => {
      if (!isOpen || !initialProject) {
        setProject(null);
        return;
      }

      // 先使用初始项目数据
      setProject(initialProject);
      setLoading(true);
      setError(null);

      try {
        console.log(`开始获取项目 ${initialProject.id} 的详细数据`);
        const response = await emallApi.getEmallDetail(initialProject.id);
        console.log('获取到的详细项目数据:', response.data);
        setProject(response.data);
      } catch (err) {
        console.error('获取项目详情失败:', err);
        setError('获取项目详情失败，请稍后重试');
        // 如果获取详细数据失败，保留初始数据
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetail();
  }, [isOpen, initialProject]);

  // 关闭modal时重置状态
  useEffect(() => {
    if (!isOpen) {
      setProject(null);
      setLoading(false);
      setError(null);
    }
  }, [isOpen]);

  // 如果 modal 不打开，直接返回 null
  if (!isOpen) {
    return null;
  }

  // 显示加载状态
  if (loading) {
    return (
      <div className="modal-overlay active" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3 className="modal-title">加载中...</h3>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div className="modal-body">
            <div className="loading-spinner">正在加载项目详情...</div>
          </div>
        </div>
      </div>
    );
  }

  // 显示错误状态
  if (error) {
    return (
      <div className="modal-overlay active" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3 className="modal-title">错误</h3>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div className="modal-body">
            <div className="error-message">{error}</div>
            <div className="action-buttons">
              <button type="button" className="btn-secondary" onClick={onClose}>
                关闭
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 如果没有项目数据
  if (!project) {
    return (
      <div className="modal-overlay active" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3 className="modal-title">项目详情</h3>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div className="modal-body">
            <div className="no-data">无法加载项目数据</div>
            <div className="action-buttons">
              <button type="button" className="btn-secondary" onClick={onClose}>
                关闭
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log('渲染项目详情数据:', project);
  console.log('商品名称数组:', project.commodity_names);
  console.log('商务项目数组:', project.business_items);

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
      return dateString;
    }
  };

  // 安全获取数组
  const getSafeArray = (array: any[] | null | undefined): any[] => {
    if (Array.isArray(array)) {
      return array;
    }
    // 如果数据是字符串，尝试解析为数组
    if (typeof array === 'string') {
      try {
        const parsed = JSON.parse(array);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  // 检查数组是否有数据
  const hasArrayData = (array: any[] | null | undefined): boolean => {
    const safeArray = getSafeArray(array);
    return safeArray.length > 0;
  };

  // 渲染商品信息表格
  const renderCommodityTable = () => {
    const commodityNames = getSafeArray(project.commodity_names);
    const parameterRequirements = getSafeArray(project.parameter_requirements);
    const purchaseQuantities = getSafeArray(project.purchase_quantities);
    const controlAmounts = getSafeArray(project.control_amounts);
    const suggestedBrands = getSafeArray(project.suggested_brands);

    console.log('商品表格数据:', {
      commodityNames,
      parameterRequirements,
      purchaseQuantities,
      controlAmounts,
      suggestedBrands,
      commodityNamesLength: commodityNames.length,
      parameterRequirementsLength: parameterRequirements.length
    });

    const maxRows = Math.max(
      commodityNames.length,
      parameterRequirements.length,
      purchaseQuantities.length,
      controlAmounts.length,
      suggestedBrands.length,
      1
    );

    if (maxRows === 0 || (commodityNames.length === 0 && parameterRequirements.length === 0)) {
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
                <td className="parameter-cell">
                  {parameterRequirements[index] || '-'}
                </td>
                <td>{purchaseQuantities[index] || '-'}</td>
                <td>
                  {controlAmounts[index] ? 
                    (typeof controlAmounts[index] === 'number' ? 
                      formatCurrency(controlAmounts[index]) : 
                      `¥${controlAmounts[index]}`) 
                    : '-'}
                </td>
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
    const businessItems = getSafeArray(project.business_items);
    const businessRequirements = getSafeArray(project.business_requirements);

    console.log('商务表格数据:', {
      businessItems,
      businessRequirements,
      businessItemsLength: businessItems.length,
      businessRequirementsLength: businessRequirements.length
    });

    const maxRows = Math.max(businessItems.length, businessRequirements.length, 1);

    if (maxRows === 0 || (businessItems.length === 0 && businessRequirements.length === 0)) {
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
                <td className="business-item-cell">{businessItems[index] || '-'}</td>
                <td className="business-requirement-cell">
                  {businessRequirements[index] || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // 渲染下载文件
  const renderDownloadFiles = () => {
    const files = getSafeArray(project.download_files);
    
    console.log('下载文件数据:', files);

    if (files.length === 0) {
      return <div className="no-data">暂无下载文件</div>;
    }

    return (
      <div className="download-files">
        {files.map((file, index) => (
          <div key={index} className="file-item">
            <span className="file-icon">📎</span>
            <span className="file-name">{file}</span>
          </div>
        ))}
      </div>
    );
  };

  // 渲染相关链接
  const renderRelatedLinks = () => {
    const links = getSafeArray(project.related_links);
    
    console.log('相关链接数据:', links);

    if (links.length === 0) {
      return <div className="no-data">暂无相关链接</div>;
    }

    return (
      <div className="related-links">
        {links.map((link, index) => (
          <div key={index} className="link-item">
            <span className="link-icon">🔗</span>
            <a 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="link-url"
              title={link}
            >
              {link.length > 50 ? `${link.substring(0, 50)}...` : link}
            </a>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
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
                <span className="price-amount">
                  {formatCurrency(project.total_price_numeric)}
                </span>
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
                <span className="time-value">{project.quote_start_time || '-'}</span>
              </div>
              <div className="time-item">
                <span className="time-label">报价截止</span>
                <span className="time-value">{project.quote_end_time || '-'}</span>
              </div>
            </div>
          </div>

          {/* 商品信息 - 总是显示标题，但根据条件显示内容 */}
          <div className="info-section">
            <h4>商品信息</h4>
            {renderCommodityTable()}
          </div>

          {/* 商务要求 - 总是显示标题，但根据条件显示内容 */}
          <div className="info-section">
            <h4>商务要求</h4>
            {renderBusinessTable()}
          </div>

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
              <a 
                href={project.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-primary"
              >
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
