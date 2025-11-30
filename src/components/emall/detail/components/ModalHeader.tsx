// src/components/emall/detail/components/ModalHeader.tsx
import React from 'react';

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose }) => {
  return (
    <div className="modal-header">
      <h3 className="modal-title">{title}</h3>
      <button className="close-btn" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

export default ModalHeader;
