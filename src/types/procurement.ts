export interface Procurement {
  id: number
  project_title: string
  project_number: string
  purchasing_unit: string
  region: string
  total_price_control: string
  publish_date: string
  quote_end_time: string
  quote_start_time?: string
  url?: string
  is_selected?: boolean
  commodity_names?: string[]
  parameter_requirements?: string[]
  purchase_quantities?: string[]
  control_amounts?: string[]
  suggested_brands?: string[]
  business_items?: string[]
  business_requirements?: string[]
  download_files?: string[]
}

export interface ProcurementFilters {
  project_title?: string
  purchasing_unit?: string
  project_number?: string
  total_price_control?: string
  show_selected_only?: boolean
}

export interface ProcurementResponse {
  data: Procurement[]
  recordsTotal: number
  recordsFiltered: number
  draw: number
}

export interface Supplier {
  id: number
  name: string
  source: string
  contact: string
  store_name: string
  is_selected: boolean
  commodities: Commodity[]
  total_quote: number
  profit: number
}

export interface Commodity {
  id: number
  name: string
  specification?: string
  price: number
  quantity: number
  product_url?: string
}

export interface ProcurementProgress {
  procurement_title: string
  procurement_number: string
  bidding_status: string
  client_contact?: string
  client_phone?: string
  total_budget: number
  suppliers_info: Supplier[]
  remarks_history: Remark[]
}

export interface Remark {
  id: number
  remark_content: string
  created_by: string
  created_at: string
  created_at_display: string
}
