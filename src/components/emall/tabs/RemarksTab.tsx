// src/components/emall/tabs/RemarksTab.tsx
import React from 'react';
import { ProcurementProgressData } from '../../../services/types'; // 修正导入路径

interface RemarksTabProps {
  data: ProcurementProgressData;
  newRemark: string;
  remarkCreator: string;
  onNewRemarkChange: (remark: string) => void;
  onRemarkCreatorChange: (creator: string) => void;
  onAddRemark: () => void;
}

const RemarksTab: React.FC<RemarksTabProps> = ({
  data,
  newRemark,
  remarkCreator,
  onNewRemarkChange,
  onRemarkCreatorChange,
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
            <input
              type="text"
              value={remarkCreator}
              onChange={(e) => onRemarkCreatorChange(e.target.value)}
              placeholder="创建人"
              className="creator-input"
            />
            <button onClick={onAddRemark} className="btn-add-remark">
              添加备注
            </button>
          </div>
        </div>
      </div>

      <div className="remarks-history">
        <h4>备注历史</h4>
        {data.remarks_history.map(remark => (
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
  );
};

export default RemarksTab;
