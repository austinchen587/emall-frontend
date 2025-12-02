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
              <div className="detail-item">
                <span>渠道: {supplier.source}</span>
                <span>联系方式: {supplier.contact}</span>
              </div>
              <div className="detail-item">
                <span>总报价: {formatCurrency(supplier.total_quote)}</span>
                <span>利润: {formatCurrency(supplier.profit)}</span>
              </div>
              
              <div className="commodities-list">
                <h5>商品信息</h5>
                {supplier.commodities.map((commodity, index) => (
                  <div key={index} className="commodity-item">
                    <span>{commodity.name}</span>
                    <span>{commodity.specification}</span>
                    <span>{commodity.quantity} × {formatCurrency(commodity.price)}</span>
                    {commodity.product_url && (
                      <span>
                        <a href={commodity.product_url} target="_blank" rel="noopener noreferrer">
                          商品链接
                        </a>
                      </span>
                    )}
                  </div>
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
