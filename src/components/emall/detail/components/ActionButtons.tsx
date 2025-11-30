// src/components/emall/detail/components/ActionButtons.tsx
import React from 'react';
import { EmallItem } from '../../../../services/types';

interface ActionButtonsProps {
  project: EmallItem;
  onClose: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ project, onClose }) => {
  return (
    <div className="action-buttons">
      {project.url && (
        <a 
          href={project.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn-primary"
        >
          查看原链接
        </a>
      )}
      <button type="button" className="btn-secondary" onClick={onClose}>
        关闭
      </button>
    </div>
  );
};

export default ActionButtons;
