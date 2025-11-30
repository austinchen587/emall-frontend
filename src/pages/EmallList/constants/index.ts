// src/pages/EmallList/constants/index.ts
export const DEFAULT_FILTERS = {
  project_title: '',
  purchasing_unit: '',
  project_number: '',
  total_price_condition: '',
  search: '',
  show_selected_only: false, // 新增
  page: 1,
  page_size: 100, // 改为100条/页
  project_owner: '',
};

export const STATUS_DISPLAY_MAP: Record<string, string> = {
  'not_started': '未开始',
  'in_progress': '进行中',
  'successful': '竞标成功',
  'failed': '竞标失败',
  'cancelled': '已取消'
};
