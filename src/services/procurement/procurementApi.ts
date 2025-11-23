import api from '../api/api';
import { ProcurementItem, CreateProcurementRequest, PaginatedResponse } from '../types';

export const procurementApi = {
  // 获取采购列表
  getProcurements: (params: any) => 
    api.get<PaginatedResponse<ProcurementItem>>('/procurements/', { params }),
  
  // 创建采购项
  createProcurement: (data: CreateProcurementRequest) => 
    api.post<ProcurementItem>('/procurements/', data),
  
  // 更新采购项
  updateProcurement: (id: number, data: Partial<ProcurementItem>) => 
    api.patch<ProcurementItem>(`/procurements/${id}/`, data),
  
  // 删除采购项
  deleteProcurement: (id: number) => 
    api.delete(`/procurements/${id}/`),
};
