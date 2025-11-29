// src/pages/EmallList/hooks/useModalState.ts
import { useState } from 'react';
import { EmallItem } from '../../../services/types';

interface ModalState {
  projectDetail: {
    isOpen: boolean;
    project: EmallItem | null;
  };
  procurementProgress: {
    isOpen: boolean;
    id: number | null;
    title: string;
  };
}

export const useModalState = () => {
  const [modalState, setModalState] = useState<ModalState>({
    projectDetail: { isOpen: false, project: null },
    procurementProgress: { isOpen: false, id: null, title: '' }
  });

  const openProjectDetail = (project: EmallItem) => {
    setModalState(prev => ({
      ...prev,
      projectDetail: { isOpen: true, project }
    }));
  };

  const openProcurementProgress = (id: number, title: string) => {
    setModalState(prev => ({
      ...prev,
      procurementProgress: { isOpen: true, id, title }
    }));
  };

  const closeModals = () => {
    setModalState({
      projectDetail: { isOpen: false, project: null },
      procurementProgress: { isOpen: false, id: null, title: '' }
    });
  };

  return {
    modalState,
    openProjectDetail,
    openProcurementProgress,
    closeModals
  };
};
