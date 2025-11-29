// src/components/emall/tabs/SuppliersTab.tsx
import React from 'react';
import { ProcurementProgressData } from '../../../services/types'; 
import { formatCurrency } from '../utils';

interface SuppliersTabProps {
  data: ProcurementProgressData;
  supplierSelection: { [key: number]: boolean };
  onSupplierSelectionChange: (supplierId: number, isSelected: boolean) => void;
}

const SuppliersTab: React.FC<SuppliersTabProps> = ({
  data,
  supplierSelection,
  onSupplierSelectionChange
}) => {
  return (
    <div className="suppliers-tab">
      <div className="suppliers-header">
        <h4>供应商列表</h4>
        <button className="btn-primary">添加供应商</button>
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
                <button className="btn-edit">编辑</button>
                <button className="btn-delete">删除</button>
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
