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
  const [remarksData, setRemarksData] = useState<any>(null);
  const [remarksLoading, setRemarksLoading] = useState(false);
  const [latestRemark, setLatestRemark] = useState<any>(null);

  const convertProjectToEmallItem = (project: Project): EmallItem => {
    const totalBudget = projectSuppliers?.project_info?.total_budget;
    return {
      id: project.id,
      project_title: project.project_title,
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

  const loadRemarks = async () => {
    if (!selectedProject) return;
    setRemarksLoading(true);
    try {
      const data = await supplierAPI.getRemarks(selectedProject.id);
      setRemarksData(data);
      setLatestRemark(data.remarks_history?.[0] || null);
    } catch (error) {
      console.error('加载备注失败:', error);
      setRemarksData({ remarks_history: [] });
      setLatestRemark(null);
    } finally {
      setRemarksLoading(false);
    }
  };

  const handleAddRemark = async () => {
    if (!selectedProject || !newRemark.trim()) return;
    try {
      await supplierAPI.addRemark(selectedProject.id, newRemark.trim());
      await loadRemarks();
      setNewRemark('');
    } catch (error) {
      console.error('添加备注失败:', error);
      alert('添加备注失败，请重试');
    }
  };

  useEffect(() => {
    if (selectedProject) loadRemarks();
  }, [selectedProject]);

  useEffect(() => {
    if (showRemarksTab && selectedProject) loadRemarks();
  }, [showRemarksTab, selectedProject]);

  const getStatusButtonClass = (status: string) => {
    const base = 'status-badge-large';
    switch (status) {
      case '未开始': return `${base} status-not-started`;
      case '进行中': return `${base} status-in-progress`;
      case '竞标成功': return `${base} status-successful`;
      case '竞标失败': return `${base} status-failed`;
      case '已取消': return `${base} status-cancelled`;
      default: return `${base} status-not-started`;
    }
  };

  if (!selectedProject) {
    return (
      <div className="supplier-management-empty">
        <div className="empty-state">
          <h3>请选择项目</h3>
          <p>从左侧列表选择一个项目开始管理</p>
        </div>
      </div>
    );
  }

  return (
    <div className="supplier-management">
      <div className="supplier-header-card">
        <div className="header-top-row">
          <div className="project-title-area">
            <h2 onClick={() => setShowProjectDetail(true)}>
              {selectedProject.project_name}
            </h2>
            <span className="info-icon" title="查看详情">ⓘ</span>
            {(() => {
              const statusMap: Record<string, string> = {
                not_started: '未开始', in_progress: '进行中', successful: '竞标成功', failed: '竞标失败', cancelled: '已取消'
              };
              let status = selectedProject.bidding_status;
              if (typeof status === 'object' && status !== null) status = status.status ?? '';
              if (typeof status === 'string' && statusMap[status]) status = statusMap[status];
              
              return <span className={getStatusButtonClass(status as string || '未知')}>{status || '未知'}</span>;
            })()}
          </div>
          
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={() => setShowRemarksTab(true)}>备注管理</button>
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>+ 添加供应商</button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">所在地区</span>
            <span className="stat-value text-normal">{selectedProject?.region || '-'}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">甲方总预算</span>
            <span className="stat-value highlight">{formatCurrency(projectSuppliers?.project_info?.total_budget)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">供应商成本</span>
            <span className="stat-value">{formatCurrency(projectSuppliers?.project_info?.total_selected_quote)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">采购利润</span>
            <span className="stat-value highlight-green">
              {formatCurrency(projectSuppliers?.project_info?.total_profit)}
            </span>
          </div>
        </div>
      </div>

      <div className="table-section">
        {/* [核心修复] 透传 requirements 参数 */}
        <SupplierTable
          suppliers={projectSuppliers?.suppliers || []}
          projectId={selectedProject.id}
          loading={loading}
          onEditSupplier={setEditingSupplier}
          onRefresh={onRefresh}
          requirements={(projectSuppliers as any)?.requirements || {}}
        />
      </div>

      <div className="remark-bar">
        <div className="remark-header">
          <span className="remark-title">最新备注</span>
          <button className="btn-link" onClick={() => setShowRemarksTab(true)}>查看全部 &rarr;</button>
        </div>
        
        {remarksLoading ? (
           <div className="remark-preview loading-state">
             <span className="remark-text">加载中...</span>
           </div>
        ) : latestRemark ? (
          <div className="remark-preview">
            <span className="remark-text" title={latestRemark.remark_content}>{latestRemark.remark_content}</span>
            <span className="remark-date">{latestRemark.created_at_display}</span>
          </div>
        ) : (
          <span className="remark-empty">暂无备注信息</span>
        )}
      </div>

      {showAddModal && (
        <AddSupplierModal
          projectId={selectedProject.id}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => { setShowAddModal(false); onRefresh(); }}
        />
      )}
      {editingSupplier && (
        <EditSupplierModal
          supplier={editingSupplier}
          projectId={selectedProject.id}
          projectStatus={selectedProject.bidding_status as string}
          onClose={() => setEditingSupplier(null)}
          onSuccess={() => { setEditingSupplier(null); onRefresh(); }}
        />
      )}
      <ProjectDetailModal
        isOpen={showProjectDetail}
        onClose={() => setShowProjectDetail(false)}
        project={convertProjectToEmallItem(selectedProject)}
      />
      {showRemarksTab && (
        <div className="remarks-modal-overlay">
          <div className="remarks-modal-content">
            <div className="remarks-modal-header">
              <h3>项目备注</h3>
              <button className="close-btn" onClick={() => setShowRemarksTab(false)}>×</button>
            </div>
            <RemarksTab
              data={remarksData || { remarks_history: [] }}
              newRemark={newRemark}
              onNewRemarkChange={setNewRemark}
              onAddRemark={handleAddRemark}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierManagement;