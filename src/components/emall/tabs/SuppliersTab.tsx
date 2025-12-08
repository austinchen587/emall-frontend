// src/components/emall/tabs/SuppliersTab.tsx
import React, { useState } from 'react';
import { ProcurementProgressData } from '../../../services/types'; 
import { formatCurrency } from '../utils';
import EditSupplierModal from './suppliers/EditSupplierModal';
import AddSupplierModal from './suppliers/AddSupplierModal';
import './SuppliersTab.css';

interface SuppliersTabProps {
  data: ProcurementProgressData;
  supplierSelection: { [key: number]: boolean };
  onSupplierSelectionChange: (supplierId: number, isSelected: boolean) => void;
  procurementId: number;
  onSupplierUpdate: () => void;
}

const SuppliersTab: React.FC<SuppliersTabProps> = ({
  data,
  supplierSelection,
  onSupplierSelectionChange,
  procurementId,
  onSupplierUpdate
}) => {
  const [editingSupplier, setEditingSupplier] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleEditSupplier = (supplierId: number) => {
    setEditingSupplier(supplierId);
  };

  const handleDeleteSupplier = async (supplierId: number) => {
    if (window.confirm('确定要删除这个供应商吗？此操作不可撤销！')) {
      try {
        // 这里需要实现删除供应商的API调用
        console.log('删除供应商:', supplierId);
        onSupplierUpdate();
      } catch (error) {
        console.error('删除供应商失败:', error);
        alert('删除失败，请重试');
      }
    }
  };

  const handleAddSupplier = () => {
    setShowAddModal(true);
  };

  const handleSupplierUpdateSuccess = () => {
    onSupplierUpdate();
    setEditingSupplier(null);
    setShowAddModal(false);
  };

  const getSupplierById = (id: number) => {
    return data.suppliers_info.find(supplier => supplier.id === id) || null;
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
      <EditSupplierModal
        isOpen={editingSupplier !== null}
        onClose={() => setEditingSupplier(null)}
        supplier={editingSupplier ? getSupplierById(editingSupplier) : null}
        procurementId={procurementId}
        onSuccess={handleSupplierUpdateSuccess}
      />

      {/* 添加供应商模态框 */}
      <AddSupplierModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        procurementId={procurementId}
        onSuccess={handleSupplierUpdateSuccess}
      />

      <div className="suppliers-header">
        <h4>供应商列表</h4>
        <button className="btn-primary" onClick={handleAddSupplier}>
          添加供应商
        </button>
      </div>
      
      <div className="suppliers-list">
        {data.suppliers_info.map(supplier => (
          <div key={supplier.id} className="supplier-item">
            <div className="supplier-main">
              <div className="supplier-selection">
                <input
                  type="checkbox"
                  checked={supplierSelection[supplier.id] || false}
                  onChange={(e) => onSupplierSelectionChange(supplier.id, e.target.checked)}
                />
                <span className="supplier-name">{supplier.name}</span>
              </div>
              <div className="supplier-actions">
                <button 
                  className="btn-edit" 
                  onClick={() => handleEditSupplier(supplier.id)}
                >
                  编辑
                </button>
                <button 
                  className="btn-delete" 
                  onClick={() => handleDeleteSupplier(supplier.id)}
                >
                  删除
                </button>
              </div>
            </div>
            
            <div className="supplier-details">
              {/* 重新梳理的基本信息布局 */}
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
