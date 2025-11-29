// src/components/emall/tabs/BasicInfoTab.tsx
import React from 'react';
import { ProcurementProgressData } from '../../../services/types';

interface BasicInfoTabProps {
  data: ProcurementProgressData;
  biddingStatus: string;
  clientContact: string;
  clientPhone: string;
  onBiddingStatusChange: (status: string) => void;
  onClientContactChange: (contact: string) => void;
  onClientPhoneChange: (phone: string) => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
  
  biddingStatus,
  clientContact,
  clientPhone,
  onBiddingStatusChange,
  onClientContactChange,
  onClientPhoneChange
}) => {
  return (
    <div className="basic-info-tab">
      <div className="form-group">
        <label>竞标状态</label>
        <select 
          value={biddingStatus} 
          onChange={(e) => onBiddingStatusChange(e.target.value)}
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
          onChange={(e) => onClientContactChange(e.target.value)}
          className="form-input"
          placeholder="请输入联系人姓名"
        />
      </div>

      <div className="form-group">
        <label>甲方联系方式</label>
        <input
          type="text"
          value={clientPhone}
          onChange={(e) => onClientPhoneChange(e.target.value)}
          className="form-input"
          placeholder="请输入联系方式"
        />
      </div>
    </div>
  );
};

export default BasicInfoTab;
