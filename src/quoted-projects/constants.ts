import { QuotedProjectType } from '../services/types/quoted_projects';

export const typeLabels: Record<QuotedProjectType, string> = {
  bidding: '竞价项目',
  reverse: '反拍项目',
};

export const detailStatusColors: Record<string, string> = {
  '已失效': '#f5222d',
  '已成交': '#52c41a',
  '已报价': '#1890ff',
  '未成交': '#fa8c16',
  '未报价': '#8c8c8c',
  '结果评审中': '#722ed1',
  '默认': '#8c8c8c'
};
