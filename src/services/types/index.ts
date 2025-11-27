
export interface User {
  id: number
  name: string
  email: string
  created_at?: string
}
export interface HelloResponse {
  message: string
  status: string
}
export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}



// 采购项目数据类型定义 - 根据你的Django模型调整字段
export interface EmallItem {
  id: number;
  project_title: string;
  purchasing_unit: string;
  publish_date: string;
  region: string;
  project_name?: string;
  total_price_control?: string;
  quote_end_time?: string;
  project_type?: string;
  procurement_method?: string;
  budget_amount?: string;
  contact_person?: string;
  contact_phone?: string;
  // 添加其他你需要的字段...
}
// API 响应类型
export interface ApiResponse<T> {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
}
// 采购列表响应类型
export interface EmallListResponse extends ApiResponse<EmallItem> {}
// 基础响应类型（如果后端不使用分页）
export interface BaseResponse<T> {
  data: T;
  message?: string;
  status?: string;
}
// 错误响应类型
export interface ErrorResponse {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
}