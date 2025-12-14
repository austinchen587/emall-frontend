// src/components/emall/detail/components/TimeInfoSection.tsx
import React, { useState } from 'react';
import { EmallItem } from '../../../../services/types';
import { formatDate } from '../utils/formatters';

interface TimeInfoSectionProps {
  project: EmallItem;
}

const TimeInfoSection: React.FC<TimeInfoSectionProps> = ({ project }) => {
  // 本地 state，初始值从 project 取，若没有则为空
  const [winningDate, setWinningDate] = useState<string>(project.winning_date ?? '');
  const [settlementDate, setSettlementDate] = useState<string>(project.settlement_date ?? '');
  const [settlementAmount, setSettlementAmount] = useState<string>(
    project.settlement_amount !== undefined && project.settlement_amount !== null
      ? String(project.settlement_amount)
      : ''
  );

  return (
    <div className="info-section">
      <h4>时间信息</h4>
      <div className="time-grid">
        <div className="time-item">
          <span className="time-label">发布日期</span>
          <span className="time-value">{formatDate(project.publish_date)}</span>
        </div>
        <div className="time-item">
          <span className="time-label">报价开始</span>
          <span className="time-value">{project.quote_start_time || '-'}</span>
        </div>
        <div className="time-item">
          <span className="time-label">报价截止</span>
          <span className="time-value">{project.quote_end_time || '-'}</span>
        </div>
        <div className="time-item">
          <span className="time-label">中标日期</span>
          <input
            type="date"
            value={winningDate}
            onChange={e => setWinningDate(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="time-item">
          <span className="time-label">结算日期</span>
          <input
            type="date"
            value={settlementDate}
            onChange={e => setSettlementDate(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="time-item">
          <span className="time-label">结算金额</span>
          <input
            type="number"
            step="0.01"
            value={settlementAmount}
            onChange={e => setSettlementAmount(e.target.value)}
            className="form-input"
          />
        </div>
      </div>
    </div>
  );
};

export default TimeInfoSection;
