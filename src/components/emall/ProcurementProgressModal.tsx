// src/components/emall/ProcurementProgressModal.tsx
import React, { useState, useEffect } from 'react';
import { ProcurementProgressData } from '../../services/types';
import { emallApi } from '../../services/api_emall'; // 修改这里
import './ProcurementProgressModal.css';

interface ProcurementProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  procurementId: number;
  procurementTitle: string;
}

const ProcurementProgressModal: React.FC<ProcurementProgressModalProps> = ({
  isOpen,
  onClose,
  procurementId,
  procurementTitle
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'basic' | 'suppliers' | 'remarks'>('overview');
  const [progressData, setProgressData] = useState<ProcurementProgressData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newRemark, setNewRemark] = useState('');
  const [remarkCreator, setRemarkCreator] = useState('系统管理员');
  
  // 表单状态
  const [biddingStatus, setBiddingStatus] = useState('not_started');
  const [clientContact, setClientContact] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [supplierSelection, setSupplierSelection] = useState<{[key: number]: boolean}>({});

  useEffect(() => {
    if (isOpen && procurementId) {
      loadProgressData();
    }
  }, [isOpen, procurementId]);

  const loadProgressData = async () => {
    setLoading(true);
    try {
      const response = await emallApi.getProgressData(procurementId);
      setProgressData(response.data);
      
      // 初始化表单状态
      setBiddingStatus(response.data.bidding_status);
      setClientContact(response.data.client_contact || '');
      setClientPhone(response.data.client_phone || '');
      
      // 初始化供应商选择状态
      const selection: {[key: number]: boolean} = {};
      response.data.suppliers_info.forEach(supplier => {
        selection[supplier.id] = supplier.is_selected || false;
      });
      setSupplierSelection(selection);
      
    } catch (error) {
      console.error('加载采购进度数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAllData = async () => {
    setSaving(true);
    try {
      const updateData = {
        bidding_status: biddingStatus,
        client_contact: clientContact,
        client_phone: clientPhone,
        supplier_selection: Object.entries(supplierSelection).map(([supplierId, isSelected]) => ({
          supplier_id: parseInt(supplierId),
          is_selected: isSelected
        })),
        ...(newRemark.trim() && remarkCreator.trim() && {
          new_remark: {
            remark_content: newRemark,
            created_by: remarkCreator
          }
        })
      };

      await emallApi.updateProgressData(procurementId, updateData);
      
      // 重新加载数据
      await loadProgressData();
      setNewRemark('');
      
      alert('保存成功！');
    } catch (error) {
      console.error('保存数据失败:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleSupplierSelectionChange = (supplierId: number, isSelected: boolean) => {
    setSupplierSelection(prev => ({
      ...prev,
      [supplierId]: isSelected
    }));
  };

  const handleAddRemark = async () => {
    if (!newRemark.trim() || !remarkCreator.trim()) {
      alert('请填写备注内容和创建人');
      return;
    }

    try {
      const updateData = {
        new_remark: {
          remark_content: newRemark,
          created_by: remarkCreator
        }
      };

      await emallApi.updateProgressData(procurementId, updateData);
      
      // 重新加载数据
      await loadProgressData();
      setNewRemark('');
      
      alert('备注添加成功！');
    } catch (error) {
      console.error('添加备注失败:', error);
      alert('添加备注失败');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="procurement-progress-modal-overlay" onClick={onClose}>
      <div className="procurement-progress-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            📊 采购进度管理 - {procurementTitle}
          </h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* 标签页导航 */}
        <div className="modal-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📈 概况页面
          </button>
          <button 
            className={`tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            📝 基本信息管理
          </button>
          <button 
            className={`tab-btn ${activeTab === 'suppliers' ? 'active' : ''}`}
            onClick={() => setActiveTab('suppliers')}
          >
            👥 供应商管理
          </button>
          <button 
            className={`tab-btn ${activeTab === 'remarks' ? 'active' : ''}`}
            onClick={() => setActiveTab('remarks')}
          >
            💬 进度备注
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>加载中...</p>
            </div>
          ) : progressData ? (
            <>
              {/* 概况页面 */}
              {activeTab === 'overview' && (
                <div className="overview-tab">
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-value">{formatCurrency(progressData.total_budget)}</div>
                      <div className="stat-label">总预算</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">{progressData.suppliers_info.length}</div>
                      <div className="stat-label">供应商数量</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">{progressData.bidding_status_display}</div>
                      <div className="stat-label">竞标状态</div>
                    </div>
                  </div>

                  <div className="suppliers-overview">
                    <h4>供应商报价对比</h4>
                    <div className="suppliers-list">
                      {progressData.suppliers_info.map(supplier => (
                        <div key={supplier.id} className={`supplier-card ${supplier.is_selected ? 'selected' : ''}`}>
                          <div className="supplier-header">
                            <span className="supplier-name">{supplier.name}</span>
                            {supplier.is_selected && <span className="selected-badge">已选择</span>}
                          </div>
                          <div className="supplier-details">
                            <span>报价: {formatCurrency(supplier.total_quote)}</span>
                            <span className={`profit ${supplier.profit >= 0 ? 'positive' : 'negative'}`}>
                              利润: {formatCurrency(supplier.profit)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="remarks-preview">
                    <h4>最新备注</h4>
                    {progressData.remarks_history.slice(0, 3).map(remark => (
                      <div key={remark.id} className="remark-item">
                        <div className="remark-header">
                          <span className="remark-creator">{remark.created_by}</span>
                          <span className="remark-time">{remark.created_at_display}</span>
                        </div>
                        <p className="remark-content">{remark.remark_content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 基本信息管理 */}
              {activeTab === 'basic' && (
                <div className="basic-info-tab">
                  <div className="form-group">
                    <label>竞标状态</label>
                    <select 
                      value={biddingStatus} 
                      onChange={(e) => setBiddingStatus(e.target.value)}
                      className="form-select"
                    >
                      <option value="not_started">未开始</option>
                      <option value="in_progress">进行中</option>
                      <option value="successful">竞标成功</option>
                      <option value="failed">竞标失败</option>
                      <option value="cancelled">已取消</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>甲方联系人</label>
                    <input
                      type="text"
                      value={clientContact}
                      onChange={(e) => setClientContact(e.target.value)}
                      className="form-input"
                      placeholder="请输入联系人姓名"
                    />
                  </div>

                  <div className="form-group">
                    <label>甲方联系方式</label>
                    <input
                      type="text"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="form-input"
                      placeholder="请输入联系方式"
                    />
                  </div>
                </div>
              )}

              {/* 供应商管理 */}
              {activeTab === 'suppliers' && (
                <div className="suppliers-tab">
                  <div className="suppliers-header">
                    <h4>供应商列表</h4>
                    <button className="btn-primary">添加供应商</button>
                  </div>
                  
                  <div className="suppliers-list">
                    {progressData.suppliers_info.map(supplier => (
                      <div key={supplier.id} className="supplier-item">
                        <div className="supplier-main">
                          <div className="supplier-selection">
                            <input
                              type="checkbox"
                              checked={supplierSelection[supplier.id] || false}
                              onChange={(e) => handleSupplierSelectionChange(supplier.id, e.target.checked)}
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
              )}

              {/* 进度备注 */}
              {activeTab === 'remarks' && (
                <div className="remarks-tab">
                  <div className="add-remark-section">
                    <h4>添加新备注</h4>
                    <div className="remark-form">
                      <textarea
                        value={newRemark}
                        onChange={(e) => setNewRemark(e.target.value)}
                        placeholder="请输入备注内容..."
                        className="remark-textarea"
                        rows={3}
                      />
                      <div className="remark-controls">
                        <input
                          type="text"
                          value={remarkCreator}
                          onChange={(e) => setRemarkCreator(e.target.value)}
                          placeholder="创建人"
                          className="creator-input"
                        />
                        <button onClick={handleAddRemark} className="btn-add-remark">
                          添加备注
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="remarks-history">
                    <h4>备注历史</h4>
                    {progressData.remarks_history.map(remark => (
                      <div key={remark.id} className="remark-history-item">
                        <div className="remark-meta">
                          <span className="creator">{remark.created_by}</span>
                          <span className="time">{remark.created_at_display}</span>
                        </div>
                        <p className="content">{remark.remark_content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="error-state">
              <p>加载失败，请重试</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>关闭</button>
          <button 
            className="btn-primary" 
            onClick={handleSaveAllData}
            disabled={saving}
          >
            {saving ? '保存中...' : '保存所有更改'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcurementProgressModal;
