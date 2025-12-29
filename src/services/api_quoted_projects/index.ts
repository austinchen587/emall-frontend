import apiClient from '../api_auth/set_api';
import { QuotedProjectType, QuotedProject } from '../types/quoted_projects';

export const quotedProjectsApi = {
  // 获取竞价项目
  getBiddingProjects: async (): Promise<QuotedProject[]> => {
    const response = await apiClient.get('/analysis/ht-emall/records/');
    return response.data.data;
  },

  // 获取反拍项目
  getReverseProjects: async (): Promise<QuotedProject[]> => {
    const response = await apiClient.get('/analysis/ht-emall-reverse/records/');
    return response.data.data;
  },

  // 通用方法，根据类型获取
  getProjectsByType: async (type: QuotedProjectType): Promise<QuotedProject[]> => {
    if (type === 'bidding') {
      return quotedProjectsApi.getBiddingProjects();
    } else {
      return quotedProjectsApi.getReverseProjects();
    }
  }
};
