// src/pages/BiddingHall/types.ts

export interface Candidate {
  sku: string;
  rank: number;
  shop: string;
  price: number;
  reason: string;
  platform: string;
  detail_url: string;
}

export interface RecommendationItem {
  item_name: string;
  specifications: string;
  brand?: string;
  reason: string;
  candidates: Candidate[];
  // [新增] 补充 AIRecommendation 组件需要的可选字段
  quantity?: number;
  unit?: string;
  key_word?: string;
  search_platform?: string;
  notes?: string;
}

export interface BiddingProjectDetail {
  id: number;
  title: string;
  province: string; // JX, HN...
  price_display: string;
  status: number;
  start_time: string;
  end_time: string;
  requirements: {
    project_code: string;
    publish_date: string;
    purchaser: string;
    params: any;     
    brands: any;     
    quantities: any; 
    url: string;
    files?: any[];
    // [新增] 解决 utils.ts 报错的字段
    business_items?: any[];
    business_reqs?: any[];
    file_names?: string[];
    file_urls?: string[];
  };
  recommendations: RecommendationItem[];
}

// 扩展接口定义
export interface ExtendedProjectDetail extends BiddingProjectDetail {
  is_selected: boolean;
  project_owner: string;
  bidding_status: string;        
  bidding_status_display: string; 
}