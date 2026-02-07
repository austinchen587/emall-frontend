import React from 'react';
import { Tag } from 'antd';
import { Link } from 'react-router-dom';
import { 
  ClockCircleOutlined, 
  UserOutlined, 
  CheckCircleFilled 
} from '@ant-design/icons';
import { IBiddingProject } from '@/services/types/bidding';

// 状态映射配置
const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  'not_started': { label: '未开始', color: 'default' },
  'in_progress': { label: '进行中', color: 'processing' },
  'successful': { label: '竞标成功', color: 'success' },
  'failed': { label: '竞标失败', color: 'error' },
  'cancelled': { label: '已取消', color: 'warning' },
};

interface Props {
  data: IBiddingProject & {
    is_selected?: boolean;
    project_owner?: string;
    bidding_status?: string;
  };
}

export const ProjectCard: React.FC<Props> = ({ data }) => {
  // 1. 保留了紧急状态的计算逻辑
  const hoursLeft = Math.floor(data.countdown / 3600);
  const isUrgent = hoursLeft < 24 && data.status === 1;
  
  const statusConfig = STATUS_CONFIG[data.bidding_status || 'not_started'] || STATUS_CONFIG['not_started'];

  return (
    <Link 
      to={`/bidding/detail/${data.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        relative group flex flex-col h-full overflow-hidden rounded-xl border transition-all duration-300 block text-left
        ${data.is_selected 
          ? 'border-green-500 bg-green-50/30 shadow-md' 
          : 'bg-white border-gray-100 hover:shadow-xl hover:-translate-y-1'
        }
      `}
      style={{ textDecoration: 'none' }}
    >
      {/* 选中状态角标 */}
      {data.is_selected && (
        <div className="absolute top-0 right-0 z-10">
          <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-bl-lg flex items-center gap-1 shadow-sm">
            <CheckCircleFilled />
            <span>已选</span>
          </div>
        </div>
      )}

      {/* 头部：标签区域 */}
      <div className="p-4 pb-2 flex justify-between items-start">
        <div className="flex gap-2 flex-wrap">
           {/* 1. 模式标签 */}
           <Tag color={data.mode === 'reverse' ? 'orange' : 'blue'} className="mr-0">
             {data.mode === 'reverse' ? '反拍' : '竞价'}
           </Tag>
           
           {/* 2. 新增的状态标签 */}
           <Tag color={statusConfig.color} className="mr-0 border-transparent">
             {statusConfig.label}
           </Tag>

           {/* 3. 🔥【这里】闪烁功能完整保留！如果有 isUrgent，就会显示且闪烁 */}
           {isUrgent && (
             <Tag color="red" className="animate-pulse mr-0">
               即将截止
             </Tag>
           )}
        </div>
        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
          {data.sub_category || '通用'}
        </span>
      </div>

      {/* 内容：标题与价格 */}
      <div className="p-4 pt-0 flex-1 flex flex-col">
        <h3 className="text-base font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors h-12">
          {data.title}
        </h3>
        
        <div className="mt-auto space-y-2">
          {/* 价格行 */}
          <div className="flex justify-between items-end border-b border-gray-50 pb-2">
            <span className="text-xs text-gray-400">控制价</span>
            <span className="text-lg font-bold text-red-600 font-mono">
              {data.price_display}
            </span>
          </div>
          
          {/* 时间状态行 (倒计时红字变色逻辑也保留了) */}
          <div className="flex justify-between items-center text-xs text-gray-500 pt-1">
            <div className="flex items-center gap-1">
              <ClockCircleOutlined />
              <span>{data.status === 0 ? '距开始:' : data.status === 1 ? '距结束:' : '已结束'}</span>
            </div>
            <span className={`font-mono ${isUrgent ? 'text-red-500 font-bold' : ''}`}>
              {hoursLeft > 0 ? `${hoursLeft}小时` : '-'}
            </span>
          </div>

          {/* 归属人行 */}
          <div className="flex justify-between items-center text-xs pt-1 border-t border-dashed border-gray-100 mt-2">
             <div className="flex items-center gap-1 text-gray-500">
               <UserOutlined />
               <span>归属人:</span>
             </div>
             <span className={`font-medium ${!data.project_owner || data.project_owner === '未分配' ? 'text-gray-300' : 'text-blue-600'}`}>
               {data.project_owner || '未分配'}
             </span>
          </div>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className={`
        p-3 border-t transition-colors
        ${data.is_selected ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100 group-hover:bg-blue-50'}
      `}>
        {/* 保留了按钮的紧急状态逻辑：
            如果 !isUrgent (不紧急)，按钮是 ghost (白底蓝字)；
            如果 isUrgent (紧急)，!isUrgent 为 false，按钮变成默认 Primary (实心蓝底/红底)
        */}
        <div className={`
          w-full text-center py-1 rounded text-sm transition-colors
          ${data.is_selected 
            ? 'text-green-600 font-medium' 
            : `ant-btn ant-btn-primary ant-btn-block ${!isUrgent ? 'ant-btn-background-ghost text-blue-600 border-blue-200' : ''}`
          }
        `}>
          {data.is_selected ? '进入项目处理' : '查看详情'}
        </div>
      </div>
    </Link>
  );
};