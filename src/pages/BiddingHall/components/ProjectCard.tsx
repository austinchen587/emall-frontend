import React from 'react';
import { Tag, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { 
  ClockCircleOutlined, 
  UserOutlined, 
  CheckCircleFilled,
  InfoCircleOutlined 
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
           <Tag color={data.mode === 'reverse' ? 'orange' : 'blue'} className="mr-0">
             {data.mode === 'reverse' ? '反拍' : '竞价'}
           </Tag>
           <Tag color={statusConfig.color} className="mr-0 border-transparent">
             {statusConfig.label}
           </Tag>
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

      {/* 内容主体 */}
      <div className="p-4 pt-0 flex-1 flex flex-col">
        {/* 标题 */}
        <h3 className="text-base font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors h-12">
          {data.title}
        </h3>
        
        {/* 此处原有的备注代码已移至下方 */}

        <div className="mt-auto space-y-2">
          {/* 价格行 */}
          <div className="flex justify-between items-end border-b border-gray-50 pb-2">
            <span className="text-xs text-gray-400">控制价</span>
            <span className="text-lg font-bold text-red-600 font-mono">
              {data.price_display}
            </span>
          </div>
          
          {/* 时间状态行 */}
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

          {/* [移动到此处] 最新备注显示区域 */}
          {data.latest_remark_content ? (
            <div className="mt-2 bg-orange-50 border border-orange-100 rounded px-2 py-1.5 text-xs">
              <div className="flex items-start gap-1 text-orange-800 mb-1">
                <InfoCircleOutlined className="mt-0.5 flex-shrink-0" />
                <Tooltip title={data.latest_remark_content}>
                  <span className="line-clamp-2 font-medium leading-tight cursor-help">
                    {data.latest_remark_content}
                  </span>
                </Tooltip>
              </div>
              <div className="flex justify-between text-orange-400 scale-95 origin-left w-full">
                <span>{data.latest_remark_by}</span>
                <span>{data.latest_remark_at?.substring(5, 16) || '-'}</span>
              </div>
            </div>
          ) : (
            /* 占位，保持卡片高度一致性 */
            <div className="mt-2 h-[54px] flex items-center justify-center text-gray-300 text-xs border border-dashed border-gray-100 rounded bg-gray-50/50">
              暂无备注
            </div>
          )}
        </div>
      </div>

      {/* 底部按钮 */}
      <div className={`
        p-3 border-t transition-colors
        ${data.is_selected ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100 group-hover:bg-blue-50'}
      `}>
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