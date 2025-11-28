
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
  project_name: string;
  project_number: string;
  commodity_names: string[] | null;  // 改为数组类型
  parameter_requirements: string[] | null;
  purchase_quantities: string[] | null;
  control_amounts: string[] | null;
  suggested_brands: string[] | null;
  business_items: string[] | null;
  business_requirements: string[] | null;
  related_links: string[] | null;
  download_files: string[] | null;
  total_price_control: string;
  total_price_numeric: number | null;
  quote_start_time: string;
  quote_end_time: string;
  url?: string; // 使用模型中的url字段
}
export interface EmallListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: EmallItem[];
}
export interface EmallFilterParams {
  project_title?: string;
  purchasing_unit?: string;
  project_number?: string;
  total_price_condition?: string; // 改为条件筛选
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}