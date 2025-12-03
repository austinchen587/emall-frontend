// src/services/types/procurement.ts
export interface DailyProfitStat {
  project_name: string;
  project_owner: string;
  total_price_control: number;
  supplier_name: string;
  total_quote: number;
  profit: number;
  latest_remark: string | null;
}

export interface ProcurementStatsResponse {
  success: boolean;
  data: DailyProfitStat[];
  count: number;
}
