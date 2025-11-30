// src/components/emall/ProjectDetailModal.tsx
import React from 'react';
import { EmallItem } from '../../services/types';
import { useProjectDetail } from './detail/hooks/useProjectDetail';
import ModalHeader from './detail/components/ModalHeader';
import ModalBody from './detail/components/ModalBody';
import './ProjectDetailModal.css';

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: EmallItem | null;
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  project: initialProject 
}) => {
  const { project, loading, error } = useProjectDetail(isOpen, initialProject);

  console.log('Modal 组件渲染 - isOpen:', isOpen, 'initialProject:', initialProject);

  if (!isOpen) {
    return null;
  }

  if (loading) {
    return (
      <div className="modal-overlay active" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <ModalHeader title="加载中..." onClose={onClose} />
          <div className="modal-body">
            <div className="loading-spinner">正在加载项目详情...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modal-overlay active" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <ModalHeader title="错误" onClose={onClose} />
          <div className="modal-body">
            <div className="error-message">{error}</div>
            <div className="action-buttons">
              <button type="button" className="btn-secondary" onClick={onClose}>
                关闭
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="modal-overlay active" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <ModalHeader title="项目详情" onClose={onClose} />
          <div className="modal-body">
            <div className="no-data">无法加载项目数据</div>
            <div className="action-buttons">
              <button type="button" className="btn-secondary" onClick={onClose}>
                关闭
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log('渲染项目详情数据:', project);

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <ModalHeader title={`项目详情 - ${project.project_title}`} onClose={onClose} />
        <ModalBody project={project} onClose={onClose} />
      </div>
    </div>
  );
};

export default ProjectDetailModal;
