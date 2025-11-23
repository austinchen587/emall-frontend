import { create } from 'zustand';
import { ProcurementItem } from '../services/types';

interface ProcurementState {
  procurements: ProcurementItem[];
  loading: boolean;
  error: string | null;
  fetchProcurements: (params?: any) => Promise<void>;
  createProcurement: (data: any) => Promise<void>;
  updateProcurement: (id: number, data: any) => Promise<void>;
  deleteProcurement: (id: number) => Promise<void>;
}

export const useProcurementStore = create<ProcurementState>((set, get) => ({
  procurements: [],
  loading: false,
  error: null,

  fetchProcurements: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      // 模拟API调用
      setTimeout(() => {
        const mockData: ProcurementItem[] = [
          {
            id: 1,
            name: '笔记本电脑',
            description: '高性能办公笔记本',
            quantity: 10,
            unit_price: 5999,
            total_price: 59990,
            status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            created_by: '管理员'
          },
          {
            id: 2,
            name: '办公桌椅',
            description: '人体工学办公椅',
            quantity: 5,
            unit_price: 899,
            total_price: 4495,
            status: 'approved',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            created_by: '采购员'
          }
        ];
        set({ procurements: mockData, loading: false });
      }, 1000);
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createProcurement: async (data) => {
    set({ loading: true, error: null });
    try {
      // 模拟API调用
      setTimeout(() => {
        set({ loading: false });
      }, 1000);
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateProcurement: async (id, data) => {
    set({ loading: true, error: null });
    try {
      // 模拟API调用
      setTimeout(() => {
        set({ loading: false });
      }, 1000);
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deleteProcurement: async (id) => {
    set({ loading: true, error: null });
    try {
      // 模拟API调用
      setTimeout(() => {
        set({ loading: false });
      }, 1000);
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
