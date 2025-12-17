// src/components/emall/ProcurementProgressModal.tsx
import React, { useState, useEffect } from 'react';
import { emallApi } from '../../services/api_emall';
import { ProcurementProgressData, UpdateProgressData, ClientContact } from '../../services/types';
import ModalTabs from './ModalTabs';
import OverviewTab from './tabs/OverviewTab';
import BasicInfoTab from './tabs/BasicInfoTab';
import SuppliersTab from './tabs/SuppliersTab';
import RemarksTab from './tabs/RemarksTab';
import './ProcurementProgressModal.css';
import './ModalTabs.css';
import { useAuthStore } from '../../stores/authStore';

interface ProcurementProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  procurementId: number;
  procurementTitle: string;
  isReadOnly?: boolean;
  onRemarkSuccess?: (procurementId: number, newRemark: any) => void;
}

const ProcurementProgressModal: React.FC<ProcurementProgressModalProps> = ({
  isOpen,
  onClose,
  procurementId,
  procurementTitle,
  onRemarkSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'basic' | 'suppliers' | 'remarks'>('overview');
  const [progressData, setProgressData] = useState<ProcurementProgressData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newRemark, setNewRemark] = useState('');
  
  // 表单状态
  const [biddingStatus, setBiddingStatus] = useState('not_started');
  const [clientContacts, setClientContacts] = useState<ClientContact[]>([]);
  const [supplierSelection, setSupplierSelection] = useState<{[key: number]: boolean}>({});
  // 新增：用 state 管理结算相关字段
  const [winningDate, setWinningDate] = useState<string | null>(null);
  const [settlementDate, setSettlementDate] = useState<string | null>(null);
  const [settlementAmount, setSettlementAmount] = useState<number | null>(null);

  // 从 authStore 获取用户角色
  const userRole = useAuthStore((state) => state.user?.role || 'unassigned');
  const isReadOnly = userRole === 'supervisor';

  useEffect(() => {
    if (isOpen && procurementId) {
      console.log('弹窗打开，准备加载采购进度数据', { isOpen, procurementId });
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
      setClientContacts(response.data.client_contacts || []);
      setWinningDate(response.data.winning_date ?? null);
      setSettlementDate(response.data.settlement_date ?? null);
      setSettlementAmount(response.data.settlement_amount ?? null);
      
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
    if (isReadOnly) {
      alert('您只有查看权限，无法保存数据');
      return;
    }

    setSaving(true);
    try {
      // 构建更新数据，带上结算相关字段
      const updateData: UpdateProgressData = {
        bidding_status: biddingStatus,
        client_contacts: clientContacts,
        supplier_selection: Object.entries(supplierSelection).map(([supplierId, isSelected]) => ({
          supplier_id: parseInt(supplierId),
          is_selected: isSelected
        })),
        winning_date: winningDate,
        settlement_date: settlementDate,
        settlement_amount: settlementAmount,
      };

      // 如果有新备注，添加到更新数据中
      if (newRemark.trim()) {
        updateData.new_remark = {
          remark_content: newRemark
        };
        
        // 构建备注对象并调用回调函数
        const remarkData = {
          content: newRemark,
          created_by: '当前用户',
          created_at: new Date().toISOString()
        };
        
        if (onRemarkSuccess) {
          onRemarkSuccess(procurementId, remarkData);
        }
      }

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
    if (isReadOnly) {
      alert('您只有查看权限，无法选择供应商');
      return;
    }
    setSupplierSelection(prev => ({
      ...prev,
      [supplierId]: isSelected
    }));
  };

  const handleAddRemark = async () => {
    if (isReadOnly) {
      alert('您只有查看权限，无法添加备注');
      return;
    }

    if (!newRemark.trim()) {
      alert('请填写备注内容');
      return;
    }

    try {
      const updateData: UpdateProgressData = {
        new_remark: {
          remark_content: newRemark
        }
      };

      await emallApi.updateProgressData(procurementId, updateData);
      
      // 构建备注对象并调用回调函数
      const remarkData = {
        content: newRemark,
        created_by: '当前用户',
        created_at: new Date().toISOString()
      };
      
      // 调用父组件的回调函数
      if (onRemarkSuccess) {
        onRemarkSuccess(procurementId, remarkData);
      }
      
      // 重新加载数据
      await loadProgressData();
      setNewRemark('');
      
      alert('备注添加成功！');
    } catch (error) {
      console.error('添加备注失败:', error);
      alert('添加备注失败');
    }
  };

  const handleClientContactsChange = (contacts: ClientContact[]) => {
    if (isReadOnly) {
      alert('您只有查看权限，无法修改联系人');
      return;
    }
    setClientContacts(contacts);
  };

  useEffect(() => {
    if (progressData) {
      setWinningDate(progressData.winning_date ?? null);
      setSettlementDate(progressData.settlement_date ?? null);
      setSettlementAmount(progressData.settlement_amount ?? null);
    }
  }, [progressData]);

  if (!isOpen) return null;

  // debug: 打印当前状态
  console.log('ProcurementProgressModal 渲染', { isOpen, procurementId, progressData, loading });

  return (
    <div className="procurement-progress-modal-overlay" onClick={onClose}>
      <div className="procurement-progress-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            📊 采购进度管理 - {procurementTitle}
            {isReadOnly && <span style={{fontSize: '14px', marginLeft: '10px', opacity: 0.8}}>🔒 只读模式</span>}
          </h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <ModalTabs activeTab={activeTab} onTabChange={setActiveTab} isReadOnly={isReadOnly} />

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
                  clientContacts={clientContacts}
                  onBiddingStatusChange={setBiddingStatus}
                  onClientContactsChange={handleClientContactsChange}
                  isReadOnly={isReadOnly}
                  winningDate={winningDate}
                  settlementDate={settlementDate}
                  settlementAmount={settlementAmount}
                  onWinningDateChange={setWinningDate}
                  onSettlementDateChange={setSettlementDate}
                  onSettlementAmountChange={setSettlementAmount}
                />
              )}

              {activeTab === 'suppliers' && (
                <SuppliersTab
                  data={progressData}
                  supplierSelection={supplierSelection}
                  onSupplierSelectionChange={handleSupplierSelectionChange}
                  procurementId={procurementId}
                  onSupplierUpdate={loadProgressData}
                  isReadOnly={isReadOnly}
                />
              )}

              {activeTab === 'remarks' && (
                <RemarksTab
                  data={progressData}
                  newRemark={newRemark}
                  onNewRemarkChange={setNewRemark}
                  onAddRemark={handleAddRemark}
                  isReadOnly={isReadOnly}
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
            disabled={saving || isReadOnly}
          >
            {saving ? '保存中...' : isReadOnly ? '只读模式' : '保存所有更改'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcurementProgressModal;
