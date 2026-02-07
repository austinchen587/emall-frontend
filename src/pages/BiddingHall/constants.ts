import { MenuProps } from 'antd';

// 定义状态选项配置
export const STATUS_OPTIONS = [
  { key: 'not_started', label: '未开始', color: 'default' },
  { key: 'in_progress', label: '进行中', color: 'processing' }, 
  { key: 'successful', label: '竞标成功', color: 'success' },   
  { key: 'failed', label: '竞标失败', color: 'error' },         
  { key: 'cancelled', label: '已取消', color: 'warning' },      
];

// 获取状态配置的辅助函数
export const getStatusConfig = (statusKey: string) => {
  return STATUS_OPTIONS.find(opt => opt.key === statusKey) || STATUS_OPTIONS[0];
};