// src/pages/SupplierManagement/components/EditSupplierModal.tsx
import React, { useState, useEffect } from 'react';
import { supplierAPI, Supplier, Commodity } from '../../../services/api_supplier';
import './Modals.css';

interface EditSupplierModalProps {
  supplier: Supplier;
  projectId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const EditSupplierModal: React.FC<EditSupplierModalProps> = ({
  supplier,
  projectId,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    name: supplier.name,
    source: supplier.source,
    contact: supplier.contact,
    store_name: supplier.store_name
  });
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 深拷贝商品数据，避免直接修改原始数据
    setCommodities(supplier.commodities.map(commodity => ({ ...commodity })));
  }, [supplier]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 根据您的 API 设计，可能需要同时传递 projectId 和 supplier.id
      await supplierAPI.updateSupplier(projectId, supplier.id, {
        ...formData,
        commodities: commodities
      });
      onSuccess();
    } catch (error) {
      console.error('更新供应商失败:', error);
      alert('更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const addCommodity = () => {
    setCommodities([...commodities, { 
      id: 0, // 新商品ID为0，后端会识别为新增
      name: '', 
      specification: '', 
      price: 0, 
      quantity: 1, 
      product_url: '' ,
      purchaser_created_by: '', // 添加审计字段
    purchaser_created_at: ''  // 添加审计字段
    }]);
  };

  const updateCommodity = (index: number, field: string, value: any) => {
    const updated = [...commodities];
    updated[index] = { ...updated[index], [field]: value };
    setCommodities(updated);
  };

  const removeCommodity = (index: number) => {
    setCommodities(commodities.filter((_, i) => i !== index));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>编辑供应商</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>供应商名称 *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>来源</label>
              <input
                type="text"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>联系方式</label>
              <input
                type="text"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>店铺名称</label>
            <input
              type="text"
              value={formData.store_name}
              onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
            />
          </div>

          <div className="commodities-section">
            <div className="section-header">
              <label>商品信息</label>
              <button type="button" onClick={addCommodity}>添加商品</button>
            </div>
            {/* 在这里添加审计信息部分 */}
<div className="audit-section">
  <div className="section-header">
    <label>审计信息</label>
  </div>
  <div className="audit-info">
    <div className="form-row">
      <div className="form-group">
        <label>创建人</label>
        <input
          type="text"
          value={supplier.purchaser_created_by || '未知'}
          disabled
          className="disabled-field"
        />
      </div>
      <div className="form-group">
        <label>创建时间</label>
        <input
          type="text"
          value={supplier.purchaser_created_at ? new Date(supplier.purchaser_created_at).toLocaleString('zh-CN') : '未知'}
          disabled
          className="disabled-field"
        />
      </div>
    </div>
    <div className="form-row">
      <div className="form-group">
        <label>最后更新人</label>
        <input
          type="text"
          value={supplier.purchaser_updated_by || '无'}
          disabled
          className="disabled-field"
        />
      </div>
      <div className="form-group">
        <label>最后更新时间</label>
        <input
          type="text"
          value={supplier.purchaser_updated_at ? new Date(supplier.purchaser_updated_at).toLocaleString('zh-CN') : '无'}
          disabled
          className="disabled-field"
        />
      </div>
    </div>
  </div>
</div>
            
            {commodities.map((commodity, index) => (
              <div key={commodity.id || `new-${index}`} className="commodity-item">
                <div className="commodity-header">
                  <span>商品 #{index + 1}</span>
                  <button type="button" onClick={() => removeCommodity(index)}>删除</button>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>商品名称</label>
                    <input
                      type="text"
                      value={commodity.name}
                      onChange={(e) => updateCommodity(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>规格</label>
                    <input
                      type="text"
                      value={commodity.specification}
                      onChange={(e) => updateCommodity(index, 'specification', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>价格</label>
                    <input
                      type="number"
                      step="0.01"
                      value={commodity.price}
                      onChange={(e) => updateCommodity(index, 'price', parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label>数量</label>
                    <input
                      type="number"
                      value={commodity.quantity}
                      onChange={(e) => updateCommodity(index, 'quantity', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>商品链接</label>
                  <input
                    type="url"
                    value={commodity.product_url}
                    onChange={(e) => updateCommodity(index, 'product_url', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose}>取消</button>
            <button type="submit" disabled={loading}>
              {loading ? '更新中...' : '更新供应商'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSupplierModal;
