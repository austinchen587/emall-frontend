// src/services/api_supplier/index.ts
import apiClient from '../api_auth/set_api';

export interface Project {
  id: number;
  project_title: string;
  project_name: string;
  total_price_control: string;
  selected_at: string;
  supplier_count: number;
  project_owner: string;
}

export interface Commodity {
  id: number;
  name: string;
  specification: string;
  price: number;
  quantity: number;
  product_url: string;
  purchaser_created_by: string;
  purchaser_created_at: string;
}

export interface Supplier {
  id: number;
  name: string;
  source: string;
  contact: string;
  store_name: string;
  is_selected: boolean;
  total_quote: number;
  commodities: Commodity[];
  purchaser_created_by: string;
  purchaser_created_at: string;
  purchaser_updated_by?: string;
  purchaser_updated_at?: string;
  // 添加供应商关系审计字段
  procurement_supplier_created_by: string;
  procurement_supplier_created_at: string;
  procurement_supplier_updated_by?: string;
  procurement_supplier_updated_at?: string;
}

export interface ProjectSuppliersResponse {
  project_info: {
    id: number;
    project_title: string;
    total_budget: number;
    total_selected_quote: number;
    total_profit: number;
  };
  suppliers: Supplier[];
}

export interface TimeFilterOption {
  value: string;
  label: string;
  expanded?: boolean;
}

export const supplierAPI = {
  // 获取项目列表
  getProjects: async (timeFilter?: string): Promise<Project[]> => {
    const params = timeFilter ? { time_filter: timeFilter } : {};
    const response = await apiClient.get('/supplier/projects/', { params });
    return response.data;
  },

  // 获取项目供应商详情
  getProjectSuppliers: async (projectId: number): Promise<ProjectSuppliersResponse> => {
    const response = await apiClient.get(`/supplier/project-suppliers/?project_id=${projectId}`);
    return response.data;
  },

  // 切换供应商选择状态
  toggleSupplierSelection: async (projectId: number, supplierId: number, isSelected: boolean) => {
    const response = await apiClient.post('/supplier/suppliers/toggle-selection/', {
      project_id: projectId,
      supplier_id: supplierId,
      is_selected: isSelected
    });
    return response.data;
  },

  // 更新供应商信息
  updateSupplier: async (projectId: number, supplierId: number, updateData: any) => {
    const response = await apiClient.post('/supplier/suppliers/update/', {
      project_id: projectId,
      supplier_id: supplierId,
      update_data: updateData
    });
    return response.data;
  },

  // 添加供应商
  addSupplier: async (projectId: number, supplierData: any) => {
    const response = await apiClient.post('/supplier/suppliers/add/', {
      project_id: projectId,
      supplier_data: supplierData
    });
    return response.data;
  },

  // 删除供应商
  deleteSupplier: async (projectId: number, supplierId: number) => {
    const response = await apiClient.post('/supplier/suppliers/delete/', {
      project_id: projectId,
      supplier_id: supplierId
    });
    return response.data;
  }
};
