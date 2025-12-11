// src/components/emall/tabs/suppliers/AddSupplierModal.tsx
import React, { useState } from 'react';
import { CommodityInfo } from '../../../../services/types';
import { emallApi } from '../../../../services/api_emall';
import './SupplierModals.css';

interface AddSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  procurementId: number;
  onSuccess: () => void;
  isReadOnly?: boolean; // 添加 isReadOnly 属性
}

const AddSupplierModal: React.FC<AddSupplierModalProps> = ({
  isOpen,
  onClose,
  procurementId,
  onSuccess,
  isReadOnly = false // 默认值设为 false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    source: '',
    contact_info: '',
    store_name: '',
    is_selected: false
  });
  const [commodities, setCommodities] = useState<CommodityInfo[]>([{
    id: Date.now(),
    name: '',
    specification: '',
    price: 0,
    quantity: 1,
    product_url: ''
  }]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '供应商名称不能为空';
    }

    if (commodities.length === 0) {
      newErrors.commodities = '请至少添加一个商品';
    }

    commodities.forEach((commodity, index) => {
      if (!commodity.name.trim()) {
        newErrors[`commodity_${index}_name`] = '商品名称不能为空';
      }
      if (commodity.price <= 0) {
        newErrors[`commodity_${index}_price`] = '价格必须大于0';
      }
      if (commodity.quantity <= 0) {
        newErrors[`commodity_${index}_quantity`] = '数量必须大于0';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isReadOnly) return; // 只读模式下阻止输入
    
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCommodityChange = (index: number, field: keyof CommodityInfo, value: string | number) => {
    if (isReadOnly) return; // 只读模式下阻止输入
    
    const updatedCommodities = [...commodities];
    updatedCommodities[index] = {
      ...updatedCommodities[index],
      [field]: value
    };
    setCommodities(updatedCommodities);

    const errorKey = `commodity_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const addCommodity = () => {
    if (isReadOnly) {
      alert('您只有查看权限，无法添加商品');
      return;
    }
    setCommodities(prev => [...prev, {
      id: Date.now(),
      name: '',
      specification: '',
      price: 0,
      quantity: 1,
      product_url: ''
    }]);
  };

  const removeCommodity = (index: number) => {
    if (isReadOnly) {
      alert('您只有查看权限，无法删除商品');
      return;
    }
    if (commodities.length > 1) {
      setCommodities(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isReadOnly) {
      alert('您只有查看权限，无法添加供应商');
      return;
    }
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await emallApi.addSupplier(procurementId, {
        ...formData,
        commodities: commodities.map(commodity => ({
          name: commodity.name,
          specification: commodity.specification,
          price: Number(commodity.price),
          quantity: Number(commodity.quantity),
          product_url: commodity.product_url
        }))
      });
      onSuccess();
      onClose();
      // 重置表单
      setFormData({
        name: '',
        source: '',
        contact_info: '',
        store_name: '',
        is_selected: false
      });
      setCommodities([{
        id: Date.now(),
        name: '',
        specification: '',
        price: 0,
        quantity: 1,
        product_url: ''
      }]);
    } catch (error) {
      console.error('添加供应商失败:', error);
      alert('添加失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const totalQuote = commodities.reduce((sum, commodity) => 
    sum + (commodity.price * commodity.quantity), 0
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content supplier-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            添加供应商
            {isReadOnly && <span style={{fontSize: '14px', marginLeft: '10px', opacity: 0.8}}>🔒 只读模式</span>}
          </h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h4>供应商基本信息</h4>
            <div className="form-row">
              <div className="form-group">
                <label>供应商名称 *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? 'error' : ''}
                  disabled={isReadOnly}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label>获取渠道</label>
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  placeholder="如：淘宝、京东、线下等"
                  disabled={isReadOnly}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>联系方式</label>
                <input
                  type="text"
                  name="contact_info"
                  value={formData.contact_info}
                  onChange={handleInputChange}
                  placeholder="电话/微信/QQ"
                  disabled={isReadOnly}
                />
              </div>
              <div className="form-group">
                <label>店铺名称</label>
                <input
                  type="text"
                  name="store_name"
                  value={formData.store_name}
                  onChange={handleInputChange}
                  placeholder="线上店铺或公司名称"
                  disabled={isReadOnly}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_selected"
                  checked={formData.is_selected}
                  onChange={handleInputChange}
                  disabled={isReadOnly}
                />
                选择此供应商作为主要供应商
              </label>
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <h4>商品信息</h4>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={addCommodity}
                disabled={isReadOnly}
              >
                添加商品
              </button>
            </div>
            
            {errors.commodities && (
              <div className="error-message">{errors.commodities}</div>
            )}

            <div className="total-preview">
              当前总报价: <strong>¥{totalQuote.toFixed(2)}</strong>
            </div>

            <div className="commodities-container">
              {commodities.map((commodity, index) => (
                <div key={commodity.id} className="commodity-card">
                  <div className="commodity-header">
                    <h5>商品信息</h5>
                    <button 
                      type="button" 
                      className="btn-danger"
                      onClick={() => removeCommodity(index)}
                      disabled={commodities.length === 1 || isReadOnly}
                    >
                      删除
                    </button>
                  </div>
                  
                  <div className="commodity-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>商品名称 *</label>
                        <input
                          type="text"
                          value={commodity.name}
                          onChange={(e) => handleCommodityChange(index, 'name', e.target.value)}
                          className={errors[`commodity_${index}_name`] ? 'error' : ''}
                          disabled={isReadOnly}
                        />
                        {errors[`commodity_${index}_name`] && (
                          <span className="error-text">{errors[`commodity_${index}_name`]}</span>
                        )}
                      </div>
                      <div className="form-group">
                        <label>商品规格</label>
                        <input
                          type="text"
                          value={commodity.specification}
                          onChange={(e) => handleCommodityChange(index, 'specification', e.target.value)}
                          placeholder="型号、尺寸、配置等"
                          disabled={isReadOnly}
                        />
                      </div>
                      <div className="form-group">
                        <label>产品链接</label>
                        <input
                          type="url"
                          value={commodity.product_url}
                          onChange={(e) => handleCommodityChange(index, 'product_url', e.target.value)}
                          placeholder="https://..."
                          disabled={isReadOnly}
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>价格 (元) *</label>
                        <input
                          type="number"
                          value={commodity.price}
                          onChange={(e) => handleCommodityChange(index, 'price', e.target.value)}
                          step="0.01"
                          min="0"
                          className={errors[`commodity_${index}_price`] ? 'error' : ''}
                          disabled={isReadOnly}
                        />
                        {errors[`commodity_${index}_price`] && (
                          <span className="error-text">{errors[`commodity_${index}_price`]}</span>
                        )}
                      </div>
                      <div className="form-group">
                        <label>数量 *</label>
                        <input
                          type="number"
                          value={commodity.quantity}
                          onChange={(e) => handleCommodityChange(index, 'quantity', e.target.value)}
                          min="1"
                          className={errors[`commodity_${index}_quantity`] ? 'error' : ''}
                          disabled={isReadOnly}
                        />
                        {errors[`commodity_${index}_quantity`] && (
                          <span className="error-text">{errors[`commodity_${index}_quantity`]}</span>
                        )}
                      </div>
                      <div className="form-group">
                        <label>小计</label>
                        <div className="subtotal">
                          ¥{(commodity.price * commodity.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              关闭
            </button>
            {!isReadOnly && (
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? '添加中...' : '添加供应商'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSupplierModal;
