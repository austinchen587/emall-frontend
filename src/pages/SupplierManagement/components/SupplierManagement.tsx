// src/pages/SupplierManagement/components/SupplierManagement.tsx
import React, { useState } from 'react';
import { Project, ProjectSuppliersResponse, Supplier } from '../../../services/api_supplier';
import SupplierTable from './SupplierTable';
import AddSupplierModal from './AddSupplierModal';
import EditSupplierModal from './EditSupplierModal';
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
          <h2>{selectedProject.project_name}</h2>
          <div className="project-stats">
            <span>总预算: ¥{projectSuppliers?.project_info.total_budget.toLocaleString()}</span>
            <span>已选报价: ¥{projectSuppliers?.project_info.total_selected_quote.toLocaleString()}</span>
            <span>利润: ¥{projectSuppliers?.project_info.total_profit.toLocaleString()}</span>
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
        projectId={selectedProject.id} // 添加这行
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
    </div>
  );
};

export default SupplierManagement;
