// src/services/types/index.ts
export * from './dashboard';


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

// 采购项目数据类型定义
export interface EmallItem {
	id: number;
	project_title: string;
	purchasing_unit: string;
	publish_date: string;
	region: string;
	project_name: string;
	project_number: string;
	commodity_names: string[] | null;
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
	url?: string;
	is_selected?: boolean;
	bidding_status?: string;
  project_owner?: string;
  latest_remark?: {
    content: string;
    created_by: string;
    created_at: string;
  };
  unified_remark?: {
    content: string;
    created_by: string;
    created_at: string;
  };
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
	total_price_condition?: string;
	search?: string;
	ordering?: string;
	page?: number;
	page_size?: number;
	show_selected_only?: boolean;
	project_owner?: string; // 新增项目归属人筛选
}

// 采购进度数据类型定义 - 使用统一的接口
export interface ProcurementProgressData {
	id: number;
	procurement_id: number;
	procurement_title: string;
	procurement_number: string;
	bidding_status: string;
	bidding_status_display: string;
	client_contacts: ClientContact[];
	total_budget: number;
	suppliers_info: SupplierInfo[];
	remarks_history: ProcurementRemark[];
	created_at?: string;
	updated_at?: string;
}

export interface ClientContact {
	id?: number;  // 添加可选id字段
	name: string;
	contact_info: string;  // 修改为 contact_info，与后端和组件保持一致
}

export interface SupplierInfo {
	id: number;
	name: string;
	source: string;
	
	contact: string;
	store_name: string;
	total_quote: number;
	profit: number;
	is_selected: boolean;
	commodities: CommodityInfo[];
}

export interface CommodityInfo {
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

export interface SupplierSelection {
	supplier_id: number;
	is_selected: boolean;
}

export interface UpdateProgressData {
	bidding_status?: string;
	client_contacts?: ClientContact[];
	supplier_selection?: SupplierSelection[];
	new_remark?: {
		remark_content: string;
	};
}
