// src/services/types/profit.ts
export interface MonthlyProfitSummary {
  statistics_month: string;
  project_count: number;
  total_response_amount: string;
  total_purchase_amount: string;
  total_profit: string;
  total_profit_margin: string;
  settlement_fund_rate: string;
  avg_bid_cycle: string;
  avg_settlement_cycle: string;
}

export interface ProjectProfitStats {
  project_name: string;
  start_time: string;
  end_time: string;
  project_status: string;
  project_owner: string;
  expected_total_price: string;
  response_total: string | null;
  winning_date: string;
 settlement_amount: string;
  settlement_date: string;
  final_quote: string | null;
  purchase_payment_amount: string | null;
  procurement_id: number;
  project_number: string;
  bid_cycle_days: number;
  settlement_cycle_days: number;
  project_profit: string;
  project_profit_margin: string;
  statistics_month: string;
}

export interface ProfitData {
  monthlySummary: MonthlyProfitSummary[];
  projectStats: ProjectProfitStats[];
}
