// src/services/api_emall/index.ts
import apiClient from '../api_auth/set_api';
import { EmallListResponse, EmallItem, EmallFilterParams, ProcurementProgressData } from '../types';

export const emallApi = {
  /**
   * 获取采购项目列表
   */
  getEmallList: (params?: EmallFilterParams): Promise<{ data: EmallListResponse }> => 
    apiClient.get('/emall/list/', { params }),
  
  /**
   * 获取单个采购项目详情
   */
  getEmallDetail: (id: number): Promise<{ data: EmallItem }> => 
    apiClient.get(`/procurements/${id}/`),
  
  /**
   * 创建采购项目
   */
  createEmallItem: (data: Partial<EmallItem>): Promise<{ data: EmallItem }> => 
    apiClient.post('/emall/create/', data),
  
  /**
   * 更新采购项目
   */
  updateEmallItem: (id: number, data: Partial<EmallItem>): Promise<{ data: EmallItem }> => 
    apiClient.put(`/emall/update/${id}/`, data),
  
  /**
   * 删除采购项目
   */
  deleteEmallItem: (id: number): Promise<void> => 
    apiClient.delete(`/emall/delete/${id}/`),
  
  /**
   * 批量操作（如果需要）
   */
  batchUpdateEmallItems: (ids: number[], data: Partial<EmallItem>): Promise<{ data: EmallItem[] }> =>
    apiClient.post('/emall/batch-update/', { ids, ...data }),

  /**
   * 切换采购选择状态
   */
  toggleProcurementSelection: (procurementId: number, isSelected: boolean): Promise<any> => 
    apiClient.post(`/emall/purchasing/procurement/${procurementId}/select/`, { 
      is_selected: isSelected 
    }),

  /**
   * 获取采购进度数据
   */
  getProgressData: (procurementId: number): Promise<{ data: ProcurementProgressData }> => 
    apiClient.get(`/emall/purchasing/procurement/${procurementId}/progress/`),

  /**
   * 更新采购进度数据
   */
  updateProgressData: (procurementId: number, data: any): Promise<any> => 
    apiClient.post(`/emall/purchasing/procurement/${procurementId}/update/`, data),

  /**
   * 添加供应商
   */
  addSupplier: (procurementId: number, supplierData: any): Promise<any> => 
    apiClient.post(`/emall/purchasing/procurement/${procurementId}/add-supplier/`, supplierData),

  /**
   * 删除供应商
   */
  deleteSupplier: (supplierId: number): Promise<any> => 
    apiClient.delete(`/emall/purchasing/supplier/${supplierId}/delete/`),

  /**
   * 更新供应商
   */
  updateSupplier: (supplierId: number, supplierData: any): Promise<any> => 
    apiClient.put(`/emall/purchasing/supplier/${supplierId}/update/`, supplierData),

  /**
   * 添加备注（使用 UnifiedProcurementRemark）
   */
  addRemark: (procurementId: number, remarkContent: string): Promise<any> => 
    apiClient.post(`/emall/purchasing/procurement/${procurementId}/add-remark/`, {
      remark_content: remarkContent
    }),

  /**
   * 获取项目备注列表
   */
  getRemarks: (procurementId: number): Promise<any> => 
    apiClient.get(`/emall/purchasing/procurement/${procurementId}/remarks/`),

  /**
   * 删除备注
   */
  deleteRemark: (remarkId: number): Promise<any> => 
    apiClient.delete(`/emall/purchasing/remark/${remarkId}/delete/`),
  // 添加统一备注
  addUnifiedRemark: (procurementId: number, remarkContent: string) => {
    return apiClient.post(`/emall/purchasing/procurement/${procurementId}/add_unified_remarks/`, {
      remark_content: remarkContent
    });
  },
  
  // 获取统一备注列表
  getUnifiedRemarks: (procurementId: number) => {
    return apiClient.get(`/emall/purchasing/procurement/${procurementId}/get_unified_remarks/`);
  },
  
  // 删除统一备注
  deleteUnifiedRemark: (remarkId: number) => {
    return apiClient.delete(`/emall/remarks/${remarkId}/delete_unified_remark/`);
  }
};

export default emallApi;
