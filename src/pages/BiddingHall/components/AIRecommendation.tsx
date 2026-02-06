import React from 'react';
import { Tag, Spin, Empty } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';
import { RecommendationItem } from '../types';
import CandidateCard from './CandidateCard';

interface AIRecommendationProps {
  recommendations: RecommendationItem[];
  isSelected: boolean; // 接收选中状态
}

const AIRecommendation: React.FC<AIRecommendationProps> = ({ recommendations, isSelected }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border-t-4 border-blue-600 min-h-[600px]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ThunderboltOutlined className="text-2xl text-blue-600" />
          <h2 className="text-lg font-bold m-0">AI 智能寻源结果</h2>
          {/* 根据状态显示不同的标签 */}
          {isSelected ? (
             <Tag color="purple">全网比价进行中</Tag>
          ) : (
             <Tag color="default">未启动</Tag>
          )}
        </div>
        <span className="text-gray-400 text-sm">数据来源: 京东 / 1688 / 淘宝</span>
      </div>

      {recommendations && recommendations.length > 0 ? (
        <div className="space-y-8">
          {recommendations.map((item, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-800 m-0">
                    {idx + 1}. {item.item_name}
                  </h3>
                  <div className="text-xs text-gray-500 mt-1 max-w-2xl leading-relaxed">
                    <span className="mr-3">规格：{item.specifications || "未指定"}</span>
                    {item.brand && item.brand !== '-' && (
                      <Tag color="geekblue" className="ml-2">建议品牌：{item.brand}</Tag>
                    )}
                  </div>
                </div>
                {item.reason && (
                  <Tag color="cyan">AI 推荐理由: {item.reason.substring(0, 20)}...</Tag>
                )}
              </div>

              {/* [核心修改] */}
              {item.candidates && item.candidates.length > 0 ? (
                // 1. 如果有数据，直接显示候选人列表
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {item.candidates.map((cand, cIdx) => (
                    <CandidateCard key={cIdx} candidate={cand} />
                  ))}
                </div>
              ) : (
                // 2. 如果没有数据：
                // 只有当 isSelected 为 true 时，才显示加载框
                // 如果 isSelected 为 false，直接返回 null (隐藏，什么都不显示)
                isSelected && (
                  <div className="bg-white border-dashed border-2 border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-400">
                    <Spin size="small" className="mb-2" />
                    <span className="text-sm">⏳ AI 正在全网寻源中，请稍后刷新...</span>
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      ) : (
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
          description="暂无 AI 推荐数据" 
        />
      )}
    </div>
  );
};

export default AIRecommendation;