// src/services/types/procurement.ts
export interface DailyProfitStat {
  project_name: string;
  project_owner: string;
  total_price_control: number;
  supplier_name: string;
  total_quote: number;
  final_negotiated_quote?: number;
  latest_remark?: string;
}

export interface UpdateFinalQuoteRequest {
  project_name: string;
  final_quote: number;
  modified_by: string;
  modified_role: string;
}

export interface ProcurementStatsResponse {
  success: boolean;
  data: DailyProfitStat[];
  count?: number;
  error?: string;
}
