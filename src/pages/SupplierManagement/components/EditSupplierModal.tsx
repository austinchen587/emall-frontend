// src/pages/SupplierManagement/components/EditSupplierModal.tsx
import React, { useState, useEffect } from 'react';
import { supplierAPI, Supplier, Commodity } from '../../../services/api_supplier';
import { useAuthStore } from '../../../stores/authStore'; // 导入 authStore
import './Modals.css';

interface EditSupplierModalProps {
  supplier: Supplier;
  projectId: number;
  projectStatus: string; // 从父组件传入项目状态
  onClose: () => void;
  onSuccess: () => void;
}

const EditSupplierModal: React.FC<EditSupplierModalProps> = ({
  supplier,
  projectId,
  projectStatus, // 接收项目状态
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
  
  // 使用 useAuthStore 获取用户信息
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role || '';

  useEffect(() => {
    // 深拷贝商品数据，避免直接修改原始数据
    setCommodities(supplier.commodities.map(commodity => ({ ...commodity })));
    console.log('[DEBUG] Loaded supplier:', supplier);
    console.log('[DEBUG] Loaded commodities:', supplier.commodities);
  }, [supplier]);

  // 将条件判断移到 useEffect 中或使用 useMemo 确保在 userRole 更新后重新计算
  const canEditPaymentAndLogistics = React.useMemo(() => {
    if (!projectStatus || projectStatus === 'unknown') {
      console.warn('[DEBUG] Project info not loaded yet');
      return false;
    }

    console.log('[DEBUG] User role:', userRole);
    console.log('[DEBUG] Project bidding status:', projectStatus);
    console.log('[DEBUG] Supplier is selected:', supplier.is_selected);

    const canEdit = 
      projectStatus === 'successful' && 
      supplier.is_selected === true &&
      (userRole === 'supplier_manager' || userRole === 'admin');

    console.log('[DEBUG] Can edit payment and logistics:', canEdit);
    return canEdit;
  }, [projectStatus, supplier.is_selected, userRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('[DEBUG] Submitting form data:', formData, commodities);
      await supplierAPI.updateSupplier(projectId, supplier.id, {
        ...formData,
        commodities: commodities
      });
      onSuccess();
    } catch (error) {
      console.error('[DEBUG] 更新供应商失败:', error);
      alert('更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const addCommodity = () => {
    const newCommodity = {
      id: 0,
      name: '',
      specification: '',
      price: 0,
      quantity: 0,
      product_url: '',
      purchaser_created_by: '',
      purchaser_created_at: '',
      payment_amount: null,
      tracking_number: ''
    };
    console.log('[DEBUG] Adding new commodity:', newCommodity);
    setCommodities([...commodities, newCommodity]);
  };

  const updateCommodity = (index: number, field: string, value: any) => {
    const updated = [...commodities];
    updated[index] = { ...updated[index], [field]: value };
    console.log(`[DEBUG] Updating commodity at index ${index}:`, updated[index]);
    setCommodities(updated);
  };

  const removeCommodity = (index: number) => {
    console.log(`[DEBUG] Removing commodity at index ${index}:`, commodities[index]);
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
                      value={commodity.price === 0 ? '' : commodity.price}
                      onChange={(e) => updateCommodity(index, 'price', e.target.value ? parseFloat(e.target.value) : 0)}
                      placeholder="请输入价格"
                    />
                  </div>
                  <div className="form-group">
                    <label>数量</label>
                    <input
                      type="number"
                      value={commodity.quantity === 0 ? '' : commodity.quantity}
                      onChange={(e) => updateCommodity(index, 'quantity', e.target.value ? parseInt(e.target.value) : 0)}
                      placeholder="请输入数量"
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

                {/* 新增：支付和物流字段，仅在条件满足时显示 */}
                {canEditPaymentAndLogistics && (
                  <div className="form-row">
                    <div className="form-group">
                      <label>支付金额</label>
                      <input
                        type="number"
                        value={commodity.payment_amount !== null ? commodity.payment_amount : ''}
                        onChange={(e) => updateCommodity(index, 'payment_amount', e.target.value ? parseFloat(e.target.value) : null)}
                        placeholder="请输入支付金额"
                        step="0.01"
                      />
                    </div>
                    <div className="form-group">
                      <label>物流单号</label>
                      <input
                        type="text"
                        value={commodity.tracking_number || ''}
                        onChange={(e) => updateCommodity(index, 'tracking_number', e.target.value)}
                        placeholder="请输入物流单号"
                      />
                    </div>
                  </div>
                )}
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
