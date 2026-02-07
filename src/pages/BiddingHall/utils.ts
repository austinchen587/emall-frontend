import { ExtendedProjectDetail } from './types';

// 将原文件中庞大的 useMemo 逻辑提取为纯函数
export const adaptProjectData = (data: ExtendedProjectDetail | null) => {
  if (!data) return null;
  
  const provMap: Record<string, string> = { JX: '江西', HN: '湖南', AH: '安徽', ZJ: '浙江' };
  const reqs = data.requirements || {}; // 安全访问

  return {
    purchasing_unit: reqs.purchaser,
    project_number: reqs.project_code,
    project_name: data.title,
    project_title: data.title,
    region: provMap[data.province] || data.province,
    total_price_control: data.price_display, 
    total_price_numeric: 0, 
    publish_date: reqs.publish_date,
    quote_start_time: data.start_time ? data.start_time.replace('T', ' ').substring(0, 19) : '-',
    quote_end_time: data.end_time ? data.end_time.replace('T', ' ').substring(0, 19) : '-',
    commodity_names: [], 
    parameter_requirements: reqs.params || [],
    purchase_quantities: reqs.quantities || [],
    suggested_brands: reqs.brands || [],
    control_amounts: [],
    
    // [核心逻辑保持] 映射商务字段
    business_items: reqs.business_items || [], 
    business_requirements: reqs.business_reqs || [],
    
    // [核心逻辑保持] 映射附件字段
    download_files: reqs.file_names || [],
    related_links: reqs.file_urls || [],
    
    url: reqs.url
  };
};