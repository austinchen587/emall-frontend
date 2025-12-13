// src/services/types/quoted_projects.ts

export type QuotedProjectType = 'bidding' | 'reverse';

export interface QuotedProject {
  project_id: string;
  project_name: string;
  status_category: string;
  bid_start_time: string;
  bid_end_time: string;
  expected_total_price: string;
  response_total: string;
}

export interface QuotedProjectsResponse {
  success: boolean;
  data: QuotedProject[];
  count?: number;
  error?: string;
}
