// src/components/emall/detail/components/TimeInfoSection.tsx
import React from 'react';
import { EmallItem } from '../../../../services/types';
import { formatDate } from '../utils/formatters';

interface TimeInfoSectionProps {
  project: EmallItem;
}

const TimeInfoSection: React.FC<TimeInfoSectionProps> = ({ project }) => {
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
      </div>
    </div>
  );
};

export default TimeInfoSection;
