// src/pages/EmallList/hooks/useModalState.ts
import { useState } from 'react';

interface ModalState {
  projectDetail: {
    isOpen: boolean;
    project: any | null;
  };
  procurementProgress: {
    isOpen: boolean;
    id: number | null;
    title: string;
  };
  addRemark: {
    isOpen: boolean;
    id: number | null;
    title: string;
  };
}

export const useModalState = () => {
  const [modalState, setModalState] = useState<ModalState>({
    projectDetail: {
      isOpen: false,
      project: null
    },
    procurementProgress: {
      isOpen: false,
      id: null,
      title: ''
    },
    addRemark: {
      isOpen: false,
      id: null,
      title: ''
    }
  });

  const openProjectDetail = (project: any) => {
    setModalState(prev => ({
      ...prev,
      projectDetail: {
        isOpen: true,
        project
      }
    }));
  };

  const openProcurementProgress = (id: number, title: string) => {
    setModalState(prev => ({
      ...prev,
      procurementProgress: {
        isOpen: true,
        id,
        title
      }
    }));
  };

  const openAddRemark = (id: number, title: string) => {
    setModalState(prev => ({
      ...prev,
      addRemark: {
        isOpen: true,
        id,
        title
      }
    }));
  };

  const closeModals = () => {
    setModalState(prev => ({
      ...prev,
      projectDetail: {
        isOpen: false,
        project: null
      },
      procurementProgress: {
        isOpen: false,
        id: null,
       title: ''
      }
    }));
  };

  const closeAddRemark = () => {
    setModalState(prev => ({
      ...prev,
      addRemark: {
        isOpen: false,
        id: null,
        title: ''
      }
    }));
  };

  return {
    modalState,
    openProjectDetail,
    openProcurementProgress,
    openAddRemark,
    closeModals,
    closeAddRemark
  };
};
