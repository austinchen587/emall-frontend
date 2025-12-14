// src/pages/SupplierManagement/components/SupplierManagement.tsx
import React, { useState, useEffect } from 'react';
import { Project, ProjectSuppliersResponse, Supplier, supplierAPI } from '../../../services/api_supplier';
import { EmallItem } from '../../../services/types';
import SupplierTable from './SupplierTable';
import AddSupplierModal from './AddSupplierModal';
import EditSupplierModal from './EditSupplierModal';
import ProjectDetailModal from '../../../components/emall/ProjectDetailModal';
import RemarksTab from '../../../components/emall/tabs/RemarksTab';
import './SupplierManagement.css';

interface SupplierManagementProps {
  selectedProject: Project | null;
  projectSuppliers: ProjectSuppliersResponse | null;
  loading: boolean;
  onRefresh: () => void;
}

const SupplierManagement: React.FC<SupplierManagementProps> = ({
  selectedProject,
  projectSuppliers,
  loading,
  onRefresh
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [showProjectDetail, setShowProjectDetail] = useState(false);
  const [showRemarksTab, setShowRemarksTab] = useState(false);
  const [newRemark, setNewRemark] = useState('');
  const [remarksData,setRemarksData] = useState<any>(null);
  const [remarksLoading, setRemarksLoading] = useState(false);
  const [latestRemark, setLatestRemark] = useState<any>(null); // 改为单个备注对象

  // 将 Project 转换为 EmallItem，确保 project_number = id
  const convertProjectToEmallItem = (project: Project): EmallItem => {
    const totalBudget = projectSuppliers?.project_info?.total_budget;
    return {
      id: project.id,
      project_title: project.project_title, // 注意这里应为 project_title
      project_name: project.project_name,
      purchasing_unit: '',
      publish_date: '',
      region: '',
      project_number: project.id.toString(),
      commodity_names: null,
      parameter_requirements: null,
      purchase_quantities: null,
      control_amounts: null,
      suggested_brands: null,
      business_items: null,
      business_requirements: null,
      related_links: null,
      download_files: null,
      total_price_control: projectSuppliers?.project_info?.total_budget?.toString() || '0',
      total_price_numeric: typeof totalBudget === 'number' ? totalBudget : 0,
      quote_start_time: '',
      quote_end_time: '',
      // 关键：确保 bidding_status 始终为 string
      bidding_status: typeof project.bidding_status === 'object' && project.bidding_status !== null
        ? project.bidding_status.status
        : project.bidding_status,
      project_owner: project.project_owner || ''
    };
  };

  const formatCurrency = (value: number | undefined): string => {
    if (typeof value !== 'number') return '¥0';
    return `¥${value.toLocaleString()}`;
  };

  // 加载备注数据
  const loadRemarks = async () => {
    if (!selectedProject) return;
    
    setRemarksLoading(true);
    try {
      const data = await supplierAPI.getRemarks(selectedProject.id);
      setRemarksData(data);
      // 设置最新备注（取第一条，即最新的）
      setLatestRemark(data.remarks_history?.[0] || null);
    } catch (error) {
      console.error('加载备注失败:', error);
      setRemarksData({ remarks_history: [] });
      setLatestRemark(null);
    } finally {
      setRemarksLoading(false);
    }
  };

  // 处理添加备注
  const handleAddRemark = async () => {
    if (!selectedProject || !newRemark.trim()) return;
    
    try {
      await supplierAPI.addRemark(selectedProject.id, newRemark.trim());
      await loadRemarks(); // 重新加载备注数据
      setNewRemark('');
    } catch (error) {
      console.error('添加备注失败:', error);
      alert('添加备注失败，请重试');
    }
  };

  // 当选择项目或显示备注弹窗时加载数据
  useEffect(() => {
    if (selectedProject) {
      loadRemarks();
    }
  }, [selectedProject]);

  //当显示备注弹窗时加载数据
  useEffect(() => {
    if (showRemarksTab && selectedProject) {
      loadRemarks();
    }
  }, [showRemarksTab, selectedProject]);

  // 状态按钮样式映射
  const getStatusButtonClass = (status: string) => {
    switch (status) {
      case '未开始':
        return 'btn btn-secondary status-not-started';
      case '进行中':
        return 'btn btn-primary status-in-progress';
      case '竞标成功':
        return 'btn btn-success status-successful';
      case '竞标失败':
        return 'btn btn-danger status-failed';
      case '已取消':
        return 'btn btn-cancelled status-cancelled';
      default:
        return 'btn btn-secondary';
    }
  };

  if (!selectedProject) {
    return (
      <div className="supplier-management-empty">
        <div className="empty-state">
          <h3>请选择项目</h3>
          <p>从左侧项目列表中选择一个项目来管理供应商</p>
        </div>
      </div>
    );
  }

  return (
    <div className="supplier-management">
      <div className="supplier-header">
        <div className="project-info">
          <h2 onClick={() => setShowProjectDetail(true)}>
            {selectedProject.project_name}
          </h2>
          <div className="project-stats">
            <span>甲方总预算: {formatCurrency(projectSuppliers?.project_info?.total_budget)}</span>
            <span>供应商采购成本: {formatCurrency(projectSuppliers?.project_info?.total_selected_quote)}</span>
            <span>采购利润: {formatCurrency(projectSuppliers?.project_info?.total_profit)}</span>
          </div>
        </div>
        <div className="supplier-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            添加供应商
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => setShowRemarksTab(true)}
          >
            添加备注
          </button>
          {/* 状态按钮，颜色根据状态变化 */}
          {(() => {
            // 兼容后端返回的 bidding_status 可能为 code 或 display
            const statusMap: Record<string, string> = {
              not_started: '未开始',
              in_progress: '进行中',
              successful: '竞标成功',
              failed: '竞标失败',
              cancelled: '已取消'
            };
            let status = selectedProject.bidding_status;
            // 兼容对象、字符串、中文
            if (typeof status === 'object' && status !== null) {
              status = status.status ?? '';
            }
            // 如果是英文 code，映射为中文
            if (typeof status === 'string' && statusMap[status]) {
              status = statusMap[status];
            }
            // 如果是空字符串或 null/undefined
            if (!status || typeof status !== 'string') status = '未知';
            return (
              <button
                className={getStatusButtonClass(status)}
                style={{ cursor: 'default', marginLeft: 8 }}
                disabled
              >
                {status}
              </button>
            );
          })()}
        </div>
      </div>

      <SupplierTable
        suppliers={projectSuppliers?.suppliers || []}
        projectId={selectedProject.id}
        loading={loading}
        onEditSupplier={setEditingSupplier}
        onRefresh={onRefresh}
      />

      {/* 最新备注显示区域 */}
      <div className="latest-remarks-section">
        <div className="section-header">
          <h3>最新备注</h3>
          <button 
            className="btn-view-all"
            onClick={() => setShowRemarksTab(true)}
          >
            查看全部
          </button>
        </div>
        
        {remarksLoading ? (
          <div className="remarks-loading">加载中...</div>
        ) : latestRemark ? (
          <div className="remarks-list">
            <div className="remark-item">
              <div className="remark-content">
                {latestRemark.remark_content}
              </div>
              <div className="remark-meta">
                <span className="remark-author">{latestRemark.created_by}</span>
                <span className="remark-time">{latestRemark.created_at_display}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-remarks">
            <p>暂无备注</p>
            <button 
              className="btn-add-remark"
              onClick={() => setShowRemarksTab(true)}
            >
              添加第一条备注
            </button>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddSupplierModal
          projectId={selectedProject.id}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            onRefresh();
          }}
        />
      )}

      {editingSupplier && (
        <EditSupplierModal
          supplier={editingSupplier}
          projectId={selectedProject.id}
          onClose={() => setEditingSupplier(null)}
          onSuccess={() => {
            setEditingSupplier(null);
            onRefresh();
          }}
        />
      )}

      <ProjectDetailModal
        isOpen={showProjectDetail}
        onClose={() => setShowProjectDetail(false)}
        project={convertProjectToEmallItem(selectedProject)}
      />

      {/* 备注弹窗 */}
      {showRemarksTab && (
        <div className="remarks-modal-overlay">
          <div className="remarks-modal-content">
            <div className="remarks-modal-header">
              <h3>项目备注 - {selectedProject.project_name}</h3>
              <button className="close-btn" onClick={() => setShowRemarksTab(false)}>×</button>
            </div>
            <RemarksTab
              data={remarksData || { remarks_history: [] }}
              newRemark={newRemark}
              onNewRemarkChange={setNewRemark}
              onAddRemark={handleAddRemark}
            />
            {remarksLoading && (
              <div className="remarks-loading">
                加载中...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierManagement;
