// src/services/api_fg/fpEmallApi.ts
import apiClient from '../api_auth/set_api';
import { ApiResponse, FpItem, FpSearchParams, PaginationParams, SearchField } from '../types/fpTypes';

export const fpEmallApi = {
  // 获取FP项目列表
  getFpList: async (params: PaginationParams & FpSearchParams): Promise<ApiResponse<FpItem[]>> => {
    const response = await apiClient.get('/fp_emall/list/', {
      params
    });
    return response.data;
  },

  // 搜索FP项目
  searchFpList: async (params: FpSearchParams): Promise<ApiResponse<FpItem[]>> => {
    const response = await apiClient.get('/fp_emall/search/', {
      params
    });
    return response.data;
  },

  // 获取搜索字段配置
  getSearchFields: async (): Promise<SearchField[]> => {
    const response = await apiClient.get('/fp_emall/search/fields/');
    return response.data;
  }
};
