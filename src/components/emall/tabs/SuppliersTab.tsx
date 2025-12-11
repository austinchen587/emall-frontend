// src/components/emall/tabs/SuppliersTab.tsx
import React, { useState } from 'react';
import { ProcurementProgressData } from '../../../services/types'; 
import { formatCurrency } from '../utils';
// 移除有问题的导入，使用默认导出
import EditSupplierModal from './suppliers/EditSupplierModal';
import AddSupplierModal from './suppliers/AddSupplierModal';
import { useAuthStore } from '../../../stores/authStore';
import './SuppliersTab.css';

interface SuppliersTabProps {
  data: ProcurementProgressData;
  supplierSelection: { [key: number]: boolean };
  onSupplierSelectionChange: (supplierId: number, isSelected: boolean) => void;
  procurementId: number;
  onSupplierUpdate: () => void;
  isReadOnly?: boolean;
}

const SuppliersTab: React.FC<SuppliersTabProps> = ({
  data,
  supplierSelection,
  onSupplierSelectionChange,
  procurementId,
  onSupplierUpdate,
  isReadOnly = false
}) => {
  const [editingSupplier, setEditingSupplier] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // 从 authStore获取用户角色
  const userRole = useAuthStore((state) => state.user?.role || 'unassigned');

  // 根据用户角色过滤供应商
  const filteredSuppliers = userRole === 'admin' 
    ? data.suppliers_info 
    : data.suppliers_info.filter(supplier => 
        supplier.supplier_relation_info?.purchaser_created_role === 'procurement_staff'
      );

  const handleEditSupplier = (supplierId: number) => {
    if (isReadOnly) {
      alert('您只有查看权限，无法编辑供应商');
      return;
    }
    setEditingSupplier(supplierId);
  };

  const handleDeleteSupplier = async (supplierId: number) => {
    if (isReadOnly) {
      alert('您只有查看权限，无法删除供应商');
      return;
    }
    if (window.confirm('确定要删除这个供应商吗？此操作不可撤销！')) {
      try {
        console.log('删除供应商:', supplierId);
        onSupplierUpdate();
      } catch (error) {
        console.error('删除供应商失败:', error);
        alert('删除失败，请重试');
      }
    }
  };

  const handleAddSupplier = () => {
    if (isReadOnly) {
      alert('您只有查看权限，无法添加供应商');
      return;
    }
    setShowAddModal(true);
  };

  const handleSupplierUpdateSuccess = () => {
    onSupplierUpdate();
    setEditingSupplier(null);
    setShowAddModal(false);
  };

  const getSupplierById = (id: number) => {
    return filteredSuppliers.find(supplier => supplier.id === id) || null;
  };

  // 格式化时间显示
  const formatDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return '未知时间';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '未知时间';
    }
  };

  return (
    <div className="suppliers-tab">
      {/* 编辑供应商模态框 */}
      {editingSupplier && (
        <EditSupplierModal
          isOpen={editingSupplier !== null}
          onClose={() => setEditingSupplier(null)}
          supplier={getSupplierById(editingSupplier)}
          procurementId={procurementId}
          onSuccess={handleSupplierUpdateSuccess}
          isReadOnly={isReadOnly}
        />
      )}

      {/* 添加供应商模态框 */}
      <AddSupplierModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        procurementId={procurementId}
        onSuccess={handleSupplierUpdateSuccess}
        isReadOnly={isReadOnly}
      />

      <div className="suppliers-header">
        <h4>供应商列表</h4>
        <button 
          className="btn-primary" 
          onClick={handleAddSupplier}
          disabled={isReadOnly}
        >
          添加供应商
        </button>
      </div>
      
      <div className="suppliers-list">
        {filteredSuppliers.map(supplier => (
          <div key={supplier.id} className="supplier-item">
            <div className="supplier-main">
              <div className="supplier-selection">
                <input
                  type="checkbox"
                  checked={supplierSelection[supplier.id] || false}
                  onChange={(e) => {
                    if (isReadOnly) {
                      alert('您只有查看权限，无法选择供应商');
                      return;
                    }
                    onSupplierSelectionChange(supplier.id, e.target.checked);
                  }}
                  disabled={isReadOnly}
                />
                <span className="supplier-name">{supplier.name}</span>
              </div>
              <div className="supplier-actions">
                <button 
                  className="btn-edit" 
                  onClick={() => handleEditSupplier(supplier.id)}
                  disabled={isReadOnly}
                >
                  编辑
                </button>
                <button 
                  className="btn-delete" 
                  onClick={() => handleDeleteSupplier(supplier.id)}
                  disabled={isReadOnly}
                >
                  删除
                </button>
              </div>
            </div>
            
            <div className="supplier-details">
              {/* 基本信息布局 */}
              <div className={`supplier-basic-info ${supplier.is_selected ? 'profit-info' : ''}`}>
                <div className="info-group">
                  <span className="info-label">渠道</span>
                  <span className="info-value">{supplier.source || '未填写'}</span>
                </div>
                <div className="info-group">
                  <span className="info-label">联系方式</span>
                  <span className="info-value">{supplier.contact || '未填写'}</span>
                </div>
                <div className="info-group">
                  <span className="info-label">总报价</span>
                  <span className="info-value">{formatCurrency(supplier.total_quote)}</span>
                </div>
                <div className="info-group">
                  <span className="info-label">利润</span>
                  <span className={`info-value profit-value ${supplier.profit >= 0 ? '' : 'negative'}`}>
                    {formatCurrency(supplier.profit)}
                  </span>
                </div>
                
                {/* 利润计算说明 */}
                {supplier.is_selected && (
                  <div className="profit-explanation">
                    <small>利润 = 总预算 - 所有被选中供应商报价总和</small>
                  </div>
                )}
              </div>
              
              {/* 商品信息 */}
              <div className="commodities-list">
                <h5>商品信息</h5>
                <div className="commodities-grid">
                  {supplier.commodities.map((commodity, index) => (
                    <div key={index} className="commodity-card">
                      <div className="commodity-header">
                        <span className="commodity-name">{commodity.name}</span>
                        <span className="commodity-price">
                          {commodity.quantity} × {formatCurrency(commodity.price)}
                        </span>
                      </div>
                      <div className="commodity-details">
                        <span className="commodity-spec">{commodity.specification || '无规格说明'}</span>
                        {commodity.product_url && (
                          <a 
                            href={commodity.product_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="commodity-link"
                          >
                            商品链接
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 采购审计信息 */}
              <div className="purchaser-audit-info">
                <div className="audit-section">
                  <h6>采购信息</h6>
                  <div className="audit-details">
                    <div className="audit-item">
                      <span className="audit-label">创建人:</span>
                      <span className="audit-value">{supplier.purchaser_created_by || '未知用户'}</span>
                    </div>
                    <div className="audit-item">
                      <span className="audit-label">创建时间:</span>
                      <span className="audit-value">{formatDateTime(supplier.purchaser_created_at)}</span>
                    </div>
                    {supplier.purchaser_updated_by && (
                      <div className="audit-item">
                        <span className="audit-label">更新人:</span>
                        <span className="audit-value">{supplier.purchaser_updated_by}</span>
                      </div>
                    )}
                    {supplier.purchaser_updated_at && (
                      <div className="audit-item">
                        <span className="audit-label">更新时间:</span>
                        <span className="audit-value">{formatDateTime(supplier.purchaser_updated_at)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 供应商关系审计信息 */}
                {supplier.supplier_relation_info && (
                  <div className="audit-section">
                    <h6>供应商关系信息</h6>
                    <div className="audit-details">
                      <div className="audit-item">
                        <span className="audit-label">供应商创建人:</span>
                        <span className="audit-value">{supplier.supplier_relation_info.purchaser_created_by || '未知用户'}</span>
                      </div>
                      <div className="audit-item">
                        <span className="audit-label">供应商创建时间:</span>
                        <span className="audit-value">{formatDateTime(supplier.supplier_relation_info?.purchaser_created_at)}</span>
                      </div>
                      {supplier.supplier_relation_info.purchaser_updated_by && (
                        <div className="audit-item">
                          <span className="audit-label">供应商更新人:</span>
                          <span className="audit-value">{supplier.supplier_relation_info.purchaser_updated_by}</span>
                        </div>
                      )}
                      {supplier.supplier_relation_info.purchaser_updated_at && (
                        <div className="audit-item">
                          <span className="audit-label">供应商更新时间:</span>
                          <span className="audit-value">{formatDateTime(supplier.supplier_relation_info.purchaser_updated_at)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 商品审计信息 */}
                {supplier.commodities.map((commodity, index) => (
                  commodity.purchaser_created_by && (
                    <div key={`commodity-audit-${index}`} className="audit-section commodity-audit">
                      <h6>商品审计信息 - {commodity.name}</h6>
                      <div className="audit-details">
                        <div className="audit-item">
                          <span className="audit-label">商品创建人:</span>
                          <span className="audit-value">{commodity.purchaser_created_by || '未知用户'}</span>
                        </div>
                        <div className="audit-item">
                          <span className="audit-label">商品创建时间:</span>
                          <span className="audit-value">{formatDateTime(commodity.purchaser_created_at)}</span>
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuppliersTab;
