// src/services/types/fpTypes.ts

export interface FpItem {
  id: string | number;
  fp_project_name: string;
  fp_project_number: string;
  fp_purchasing_unit: string;
  converted_price: number;
  fp_url: string; // 新增字段
  create_time?: string;
  update_time?: string;
  status?: string;
}

export interface FpSearchParams {
  search?: string;
  search_field?: string;
  // 保留原有的字段用于向后兼容
  fp_project_name?: string;
  fp_project_number?: string;
  fp_purchasing_unit?: string;
  converted_price?: number;
    // 添加分页参数到搜索参数类型
  page?: number;
  page_size?: number;
}

export interface PaginationParams {
  page: number;
  page_size: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination: {
    total_count: number;
    current_page: number;
    total_pages: number;
  };
  error?: string;
}

export interface SearchField {
  value: keyof FpSearchParams;
  label: string;
  type?: 'input' | 'number' | 'select';
  options?: { label: string; value: string | number }[];
}
