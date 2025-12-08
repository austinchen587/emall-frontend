// src/pages/SupplierManagement/components/SupplierTable.tsx
import React from 'react';
import { Supplier } from '../../../services/api_supplier';
import { supplierAPI } from '../../../services/api_supplier';
import './SupplierTable.css';

interface SupplierTableProps {
  suppliers: Supplier[];
  projectId: number; // 添加 projectId 属性
 loading: boolean;
  onEditSupplier: (supplier: Supplier) => void;
  onRefresh: () => void;
}

const SupplierTable: React.FC<SupplierTableProps> = ({
  suppliers,
  projectId,
  loading,
  onEditSupplier,
  onRefresh
}) => {
  const handleToggleSelection = async (supplierId: number, isSelected: boolean) => {
    try {
      await supplierAPI.toggleSupplierSelection(projectId, supplierId, !isSelected);
      onRefresh();
    } catch (error) {
      console.error('切换选择状态失败:', error);
      alert('操作失败，请重试');
    }
  };

  const handleDeleteSupplier = async (supplierId: number) => {
    if (!confirm('确定要删除这个供应商吗？')) return;
    
    try {
      await supplierAPI.deleteSupplier(projectId, supplierId);
      onRefresh();
    } catch (error) {
      console.error('删除供应商失败:', error);
      alert('删除失败，请重试');
    }
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  if (suppliers.length === 0) {
    return <div className="no-suppliers">暂无供应商数据</div>;
  }

  return (
    <div className="supplier-table">
      <table>
        <thead>
          <tr>
            <th>选择</th>
            <th>供应商名称</th>
            <th>来源</th>
            <th>联系方式</th>
            <th>店铺名称</th>
            <th>总报价</th>
            <th>商品数量</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map(supplier => (
            <tr 
              key={supplier.id} 
              className={supplier.is_selected ? 'selected' : ''}
              style={{ cursor: 'pointer' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.01)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <td>
                <input
                  type="checkbox"
                  checked={supplier.is_selected}
                  onChange={() => handleToggleSelection(supplier.id, supplier.is_selected)}
                />
              </td>
              <td>{supplier.name}</td>
              <td>{supplier.source}</td>
              <td>{supplier.contact}</td>
              <td>{supplier.store_name}</td>
              <td>¥{supplier.total_quote.toLocaleString()}</td>
              <td>{supplier.commodities.length}</td>
              <td>
                <button 
                  className="btn-edit"
                  onClick={() => onEditSupplier(supplier)}
                >
                  编辑
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => handleDeleteSupplier(supplier.id)}
                >
                  删除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierTable;
