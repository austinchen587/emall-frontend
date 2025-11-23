// API 基础类型定义
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PaginationParams {
  page: number;
  page_size: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// 采购相关类型定义
export interface ProcurementItem {
  id: number;
  name: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface CreateProcurementRequest {
  name: string;
  description: string;
  quantity: number;
  unit_price: number;
}
