// src/pages/SupplierManagement/components/SupplierManagement.tsx
import React, { useState } from 'react';
import { Project, ProjectSuppliersResponse, Supplier } from '../../../services/api_supplier';
import { EmallItem } from '../../../services/types';
import SupplierTable from './SupplierTable';
import AddSupplierModal from './AddSupplierModal';
import EditSupplierModal from './EditSupplierModal';
import ProjectDetailModal from '../../../components/emall/ProjectDetailModal';
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

  // 将 Project 转换为 EmallItem
  const convertProjectToEmallItem = (project: Project): EmallItem => {
    // 安全地获取 total_budget
    const totalBudget = projectSuppliers?.project_info?.total_budget;
    
    // 根据 EmallItem 接口定义创建对象
    return {
      id: project.id,
      project_title: project.project_name,
      project_name: project.project_name,
      purchasing_unit: '',
      publish_date: '',
      region: '',
      project_number: '',
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
      bidding_status: '未知状态',
      project_owner: ''
    };
  };

  // 安全的数值格式化函数
  const formatCurrency = (value: number | undefined): string => {
    if (typeof value !== 'number') return '¥0';
    return `¥${value.toLocaleString()}`;
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
            <span>总预算: {formatCurrency(projectSuppliers?.project_info?.total_budget)}</span>
            <span>已选报价: {formatCurrency(projectSuppliers?.project_info?.total_selected_quote)}</span>
            <span>利润: {formatCurrency(projectSuppliers?.project_info?.total_profit)}</span>
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
            onClick={onRefresh}
            disabled={loading}
          >
            {loading ? '刷新中...' : '刷新'}
          </button>
        </div>
      </div>

      <SupplierTable
        suppliers={projectSuppliers?.suppliers || []}
        projectId={selectedProject.id}
        loading={loading}
        onEditSupplier={setEditingSupplier}
        onRefresh={onRefresh}
      />

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
    </div>
  );
};

export default SupplierManagement;
