// src/components/emall/detail/components/BasicInfoSection.tsx
import React from 'react';
import { EmallItem } from '../../../../services/types';
import { formatCurrency } from '../utils/formatters';

interface BasicInfoSectionProps {
  project: EmallItem;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ project }) => {
  return (
    <div className="info-section">
      <h4>基本信息</h4>
      <div className="info-grid">
        <div className="info-item">
          <label>采购单位</label>
          <span>{project.purchasing_unit || '-'}</span>
        </div>
        <div className="info-item">
          <label>项目编号</label>
          <span className="project-number">{project.project_number || '-'}</span>
        </div>
        <div className="info-item">
          <label>项目名称</label>
          <span>{project.project_name || project.project_title || '-'}</span>
        </div>
        <div className="info-item">
          <label>所在地区</label>
          <span className="region-badge">{project.region || '-'}</span>
        </div>
        <div className="info-item">
          <label>总控制价格</label>
          <span className="price-amount">
            {formatCurrency(project.total_price_numeric)}
          </span>
        </div>
        <div className="info-item">
          <label>价格控制</label>
          <span>{project.total_price_control || '-'}</span>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;
