// src/components/emall/detail/components/ModalBody.tsx
import React from 'react';
import { EmallItem } from '../../../../services/types';
import BasicInfoSection from './BasicInfoSection';
import TimeInfoSection from './TimeInfoSection';
import CommodityTable from './CommodityTable';
import BusinessTable from './BusinessTable';
import FileLinksSection from './FileLinksSection';
import ActionButtons from './ActionButtons';

interface ModalBodyProps {
  project: EmallItem;
  onClose: () => void;
}

const ModalBody: React.FC<ModalBodyProps> = ({ project, onClose }) => {
  return (
    <div className="modal-body custom-scrollbar">
      <BasicInfoSection project={project} />
      <TimeInfoSection project={project} />
      
      <div className="info-section">
        <h4>商品信息</h4>
        <CommodityTable project={project} />
      </div>

      <div className="info-section">
        <h4>商务要求</h4>
        <BusinessTable project={project} />
      </div>

      <FileLinksSection project={project} />
      <ActionButtons project={project} onClose={onClose} />
    </div>
  );
};

export default ModalBody;
