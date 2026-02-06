// 定义所有相关的接口，供其他组件复用

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
  };
  recommendations: RecommendationItem[];
}