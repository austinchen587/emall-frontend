
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
  // 新增字段
  is_selected?: boolean;
  bidding_status?: string;
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
  show_selected_only?: boolean; // 添加这个字段
}



export interface ProcurementProgressData {
  procurement_id: number;
  procurement_title: string;
  procurement_number: string;
  bidding_status: string;
  bidding_status_display: string;
  client_contact: string;
  client_phone: string;
  client_contacts: ClientContact[];
  total_budget: number;
  suppliers_info: Supplier[];
  remarks_history: ProcurementRemark[];
  created_at?: string;
  updated_at?: string;
}
export interface ClientContact {
  name: string;
  phone: string;
}
export interface Supplier {
  id: number;
  name: string;
  source: string;
  contact: string;
  store_name: string;
  commodities: Commodity[];
  total_quote: number;
  profit: number;
  is_selected: boolean;
}
export interface Commodity {
  id?: number;
  name: string;
  specification: string;
  price: number;
  quantity: number;
  product_url: string;
  total?: number;
}
export interface ProcurementRemark {
  id: number;
  remark_content: string;
  created_by: string;
  created_at: string;
  created_at_display: string;
}