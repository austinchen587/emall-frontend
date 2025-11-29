// src/components/emall/ProcurementProgressModal.tsx
import React, { useState, useEffect } from 'react';
import { emallApi } from '../../services/api_emall';
import { ProcurementProgressData, UpdateProgressData } from '../../services/types'; // 确保从这里导入
import ModalTabs from './ModalTabs';
import OverviewTab from './tabs/OverviewTab';
import BasicInfoTab from './tabs/BasicInfoTab';
import SuppliersTab from './tabs/SuppliersTab';
import RemarksTab from './tabs/RemarksTab';
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
      const updateData: UpdateProgressData = {
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
      const updateData: UpdateProgressData = {
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

        <ModalTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="modal-body">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>加载中...</p>
            </div>
          ) : progressData ? (
            <>
              {activeTab === 'overview' && (
                <OverviewTab data={progressData} />
              )}

              {activeTab === 'basic' && (
                <BasicInfoTab
                  data={progressData}
                  biddingStatus={biddingStatus}
                  clientContact={clientContact}
                  clientPhone={clientPhone}
                  onBiddingStatusChange={setBiddingStatus}
                  onClientContactChange={setClientContact}
                  onClientPhoneChange={setClientPhone}
                />
              )}

              {activeTab === 'suppliers' && (
                <SuppliersTab
                  data={progressData}
                  supplierSelection={supplierSelection}
                  onSupplierSelectionChange={handleSupplierSelectionChange}
                />
              )}

              {activeTab === 'remarks' && (
                <RemarksTab
                  data={progressData}
                  newRemark={newRemark}
                  remarkCreator={remarkCreator}
                  onNewRemarkChange={setNewRemark}
                  onRemarkCreatorChange={setRemarkCreator}
                  onAddRemark={handleAddRemark}
                />
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
