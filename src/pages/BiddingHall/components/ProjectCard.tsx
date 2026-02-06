import React from 'react';
import { Tag } from 'antd';
import { Link } from 'react-router-dom'; // [新增] 引入 Link
import { ClockCircleOutlined } from '@ant-design/icons';
import { IBiddingProject } from '@/services/types/bidding';

interface Props {
  data: IBiddingProject;
}

export const ProjectCard: React.FC<Props> = ({ data }) => {
  // 简单计算剩余小时数
  const hoursLeft = Math.floor(data.countdown / 3600);
  const isUrgent = hoursLeft < 24 && data.status === 1;

  return (
    <Link 
      // [核心修改] 使用 Link 组件，to 属性会自动处理路由前缀
      to={`/bidding/detail/${data.id}`}
      target="_blank"                 // 新标签页打开
      rel="noopener noreferrer"       // 安全属性
      // className 保持不变，但 flex 布局对 a 标签同样有效
      className="bg-white rounded-xl border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group h-full block text-left"
      style={{ textDecoration: 'none' }} // 去掉链接下划线
    >
      {/* 头部：标签 */}
      <div className="p-4 pb-2 flex justify-between items-start">
        <div className="flex gap-2">
           <Tag color={data.mode === 'reverse' ? 'orange' : 'blue'} className="mr-0">
             {data.mode === 'reverse' ? '反拍' : '竞价'}
           </Tag>
           {isUrgent && <Tag color="red" className="animate-pulse">即将截止</Tag>}
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
          <div className="flex justify-between items-end border-b border-gray-50 pb-2">
            <span className="text-xs text-gray-400">控制价</span>
            <span className="text-lg font-bold text-red-600 font-mono">
              {data.price_display}
            </span>
          </div>
          
          <div className="flex justify-between items-center text-xs text-gray-500 pt-1">
            <div className="flex items-center gap-1">
              <ClockCircleOutlined />
              <span>{data.status === 0 ? '距开始:' : data.status === 1 ? '距结束:' : '已结束'}</span>
            </div>
            <span className={`font-mono ${isUrgent ? 'text-red-500 font-bold' : ''}`}>
              {hoursLeft > 0 ? `${hoursLeft}小时` : '-'}
            </span>
          </div>
        </div>
      </div>

      {/* 底部：按钮 */}
      <div className="p-3 bg-gray-50 border-t border-gray-100 group-hover:bg-blue-50 transition-colors">
        {/* [修改] 为了符合 HTML 规范，把 Button 换成 div 模拟样式，因为 Link 本身就是可点击的 */}
        <div className={`ant-btn ant-btn-primary ant-btn-block ${!isUrgent ? 'ant-btn-background-ghost text-blue-600 border-blue-200' : ''} w-full text-center`}>
          查看详情
        </div>
      </div>
    </Link>
  );
};