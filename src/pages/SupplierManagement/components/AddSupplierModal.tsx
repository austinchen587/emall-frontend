// src/pages/SupplierManagement/components/AddSupplierModal.tsx
import React, { useState } from 'react';
import { supplierAPI, Commodity } from '../../../services/api_supplier';
import './Modals.css';

interface AddSupplierModalProps {
  projectId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const AddSupplierModal: React.FC<AddSupplierModalProps> = ({
  projectId,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    name: '',
    source: '',
    contact: '',
    store_name: '',
    is_selected: false
  });
  const [commodities, setCommodities] = useState<Partial<Commodity>[]>([
    { name: '', specification: '', price: 0, quantity: 1, product_url: '' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await supplierAPI.addSupplier(projectId, {
        ...formData,
        commodities: commodities.filter(c => c.name) // 只提交有名称的商品
      });
      onSuccess();
    } catch (error) {
      console.error('添加供应商失败:', error);
      alert('添加失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const addCommodity = () => {
    setCommodities([...commodities, { name: '', specification: '', price: 0, quantity: 1, product_url: '' }]);
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
          <h3>添加供应商</h3>
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
            
            {commodities.map((commodity, index) => (
              <div key={index} className="commodity-item">
                <div className="commodity-header">
                  <span>商品 #{index + 1}</span>
                  {commodities.length > 1 && (
                    <button type="button" onClick={() => removeCommodity(index)}>删除</button>
                  )}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>商品名称</label>
                    <input
                      type="text"
                      value={commodity.name || ''}
                      onChange={(e) => updateCommodity(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>规格</label>
                    <input
                      type="text"
                      value={commodity.specification || ''}
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
                      value={commodity.price || 0}
                      onChange={(e) => updateCommodity(index, 'price', parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label>数量</label>
                    <input
                      type="number"
                      value={commodity.quantity || 1}
                      onChange={(e) => updateCommodity(index, 'quantity', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>商品链接</label>
                  <input
                    type="url"
                    value={commodity.product_url || ''}
                    onChange={(e) => updateCommodity(index, 'product_url', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose}>取消</button>
            <button type="submit" disabled={loading}>
              {loading ? '添加中...' : '添加供应商'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSupplierModal;
