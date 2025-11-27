import apiClient from '../api_auth/set_api'; // 使用你现有的apiClient
import { EmallListResponse, EmallItem, EmallFilterParams } from '../types';

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
    apiClient.get(`/emall/detail/${id}/`),
  
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
};

export default emallApi;
