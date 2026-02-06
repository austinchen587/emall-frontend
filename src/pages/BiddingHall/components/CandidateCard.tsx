import React from 'react';
import { Button, Tooltip, Badge } from 'antd';
import { ShopOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Candidate } from '../types'; // 引用上面定义的 types

interface CandidateCardProps {
  candidate: Candidate;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  const isTop1 = candidate.rank === 1;
  const platformColor = candidate.platform === '京东' ? '#e1251b' : candidate.platform === '1688' ? '#ff5000' : '#ff9000';

  return (
    <div className={`relative bg-white p-3 rounded-lg border-2 transition-all hover:shadow-md flex flex-col ${isTop1 ? 'border-blue-500 shadow-blue-100' : 'border-transparent shadow-sm'}`}>
      {isTop1 && (
        <div className="absolute -top-3 -left-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-br-lg rounded-tl-lg shadow-sm z-10 flex items-center gap-1">
          <CheckCircleOutlined /> 首选推荐
        </div>
      )}
      
      <div className="flex justify-between items-start mb-2">
        <Badge count={candidate.rank} style={{ backgroundColor: isTop1 ? '#1890ff' : '#d9d9d9' }} />
        <span 
          className="text-xs px-1 rounded border" 
          style={{ color: platformColor, borderColor: platformColor }}
        >
          {candidate.platform}
        </span>
      </div>

      <div className="font-mono text-lg font-bold text-red-600 mb-1">
        ¥ {candidate.price}
      </div>

      <div className="text-xs text-gray-500 mb-2 truncate">
        <ShopOutlined className="mr-1" />
        {candidate.shop}
      </div>

      <Tooltip title={candidate.reason}>
        <div className="bg-gray-50 p-2 rounded text-xs text-gray-600 mb-3 h-16 overflow-hidden leading-tight">
          {candidate.reason}
        </div>
      </Tooltip>

      <Button 
        type={isTop1 ? 'primary' : 'default'} 
        size="small" 
        block 
        href={candidate.detail_url} 
        target="_blank"
        className="mt-auto"
      >
        查看商品
      </Button>
    </div>
  );
};

export default CandidateCard;