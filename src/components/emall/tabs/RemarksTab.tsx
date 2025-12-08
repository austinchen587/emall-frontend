// src/components/emall/tabs/RemarksTab.tsx
import React from 'react';
import { ProcurementProgressData } from '../../../services/types';
import './RemarksTab.css';

interface RemarksTabProps {
  data: ProcurementProgressData;
  newRemark: string;
  onNewRemarkChange: (remark: string) => void;
  onAddRemark: () => void;
}

const RemarksTab: React.FC<RemarksTabProps> = ({
  data,
  newRemark,
  onNewRemarkChange,
  onAddRemark
}) => {
  return (
    <div className="remarks-tab">
      <div className="add-remark-section">
        <h4>添加新备注</h4>
        <div className="remark-form">
          <textarea
            value={newRemark}
            onChange={(e) => onNewRemarkChange(e.target.value)}
            placeholder="请输入备注内容..."
            className="remark-textarea"
            rows={3}
          />
          <div className="remark-controls">
            <button onClick={onAddRemark} className="btn-add-remark">
              添加备注
            </button>
          </div>
          <div className="remark-note">
            <small>备注将自动记录您的用户名</small>
          </div>
        </div>
      </div>

      <div className="remarks-history">
        <h4>备注历史</h4>
        {data.remarks_history && data.remarks_history.length > 0 ? (
          data.remarks_history.map(remark => (
            <div key={remark.id} className="remark-history-item">
              <div className="remark-meta">
                <span className="creator">{remark.created_by}</span>
                <span className="time">{remark.created_at_display}</span>
              </div>
              <p className="content">{remark.remark_content}</p>
            </div>
          ))
        ) : (
          <p className="no-remarks">暂无备注</p>
        )}
      </div>
    </div>
  );
};

export default RemarksTab;