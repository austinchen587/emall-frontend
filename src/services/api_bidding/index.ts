import axios from 'axios';
import { IBiddingProject, PaginatedResponse, IFilterParams, IProvinceStats } from '../types/bidding';

const API_PREFIX = '/api/bidding';

export const biddingApi = {
  /** 获取统计 */
  fetchStats: async (): Promise<IProvinceStats> => {
    const { data } = await axios.get<IProvinceStats>(`${API_PREFIX}/stats/provinces/`);
    return data;
  },

  /** 获取列表 (分页) */
  fetchList: async (params: IFilterParams): Promise<PaginatedResponse<IBiddingProject>> => {
    // 过滤空参数
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v != null && v !== '')
    );
    const { data } = await axios.get<PaginatedResponse<IBiddingProject>>(`${API_PREFIX}/list/`, { 
      params: cleanParams 
    });
    return data;
  },

  /** 获取详情 */
  fetchDetail: async (id: string | number): Promise<IBiddingProject> => {
    const { data } = await axios.get<IBiddingProject>(`${API_PREFIX}/project/${id}/`);
    return data;
  }
};