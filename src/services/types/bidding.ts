// 定义基础类型
export type BidMode = 'bidding' | 'reverse';
export type BidStatus = 0 | 1 | 2; // 0:即将开始, 1:进行中, 2:已结束

// 推荐候选人类型
export interface IRecommendationCandidate {
  rank: number;
  sku: string;
  shop: string;
  price: number;
  platform: string; // '京东' | '1688' | '淘宝'
  detail_url: string;
  reason: string;
}

// 推荐商品项类型
export interface IRecommendationItem {
  item_name: string;
  specifications: string;
  reason: string;
  candidates: IRecommendationCandidate[];
}

// 原始需求类型
export interface IBiddingRequirements {
  params: string;
  brands: string;
  quantities: string;
  project_code: string;
  publish_date: string;
  purchaser: string;
  url: string;
}

// 核心项目类型 (包含列表和详情字段)
export interface IBiddingProject {
  id: number;
  title: string;
  province: string;
  root_category: 'goods' | 'service' | 'project';
  sub_category?: string;
  mode: BidMode;
  price_display: string;
  start_time: string;
  end_time: string;
  status: BidStatus;
  status_text: string;
  countdown: number;
  raw_id: number;
  // 详情页可选字段
  requirements?: IBiddingRequirements;
  recommendations?: IRecommendationItem[];
}

// 分页响应结构
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// 筛选参数类型
export interface IFilterParams {
  province?: string;
  root?: string;
  sub?: string;
  mode?: string;
  search?: string; // 新增搜索字段
  page?: number;
  page_size?: number;
}

// 省份统计类型
export interface IProvinceStats {
  [key: string]: number;
}