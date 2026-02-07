import React from 'react';
import { Tag, Spin, Empty, Tooltip } from 'antd';
import { 
  ThunderboltOutlined, 
  SearchOutlined,      
  ShopOutlined,        
  NumberOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { RecommendationItem } from '../types';
import CandidateCard from './CandidateCard';

// [修改] 扩展接口，严格对应 serializers.py 返回的字段
interface ExtendedRecommendationItem extends RecommendationItem {
  quantity?: number;
  unit?: string;
  key_word?: string;
  search_platform?: string;
  notes?: string; // [对应] 后端返回的 notes 字段
}

interface AIRecommendationProps {
  recommendations: ExtendedRecommendationItem[];
  isSelected: boolean;
}

const AIRecommendation: React.FC<AIRecommendationProps> = ({ recommendations, isSelected }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border-t-4 border-blue-600 min-h-[600px]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ThunderboltOutlined className="text-2xl text-blue-600" />
          <h2 className="text-lg font-bold m-0">AI 智能寻源结果</h2>
          {isSelected ? (
             <Tag color="purple">全网比价进行中</Tag>
          ) : (
             <Tag color="default">未启动</Tag>
          )}
        </div>
        <span className="text-gray-400 text-sm">核心模型引擎：qwen3:8b</span>
      </div>

      {recommendations && recommendations.length > 0 ? (
        <div className="space-y-8">
          {recommendations.map((item, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              {/* === 头部信息区域 === */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 pr-4"> 
                  
                  {/* 第一行：序号 + 名称 + 数量/单位 */}
                  <div className="flex items-center flex-wrap gap-3 mb-2">
                    <h3 className="text-base font-bold text-gray-800 m-0">
                      {idx + 1}. {item.item_name}
                    </h3>
                    
                    {(item.quantity || item.unit) && (
                      <span className="bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
                        <NumberOutlined />
                        <span>{item.quantity || '-'} {item.unit || '件'}</span>
                      </span>
                    )}
                  </div>

                  {/* 第二行：规格信息 + 备注(notes) */}
                  <div className="text-xs text-gray-500 mb-2 leading-relaxed">
                    {/* 规格 */}
                    <div>
                      <span className="font-medium text-gray-400">规格需求：</span>
                      <span>{item.specifications || "无具体规格描述"}</span>
                    </div>

                    {/* [修复] 使用 notes 字段显示备注 */}
                    {item.notes && (
                      <div className="mt-1 text-orange-600 flex items-start gap-1">
                        <InfoCircleOutlined className="mt-0.5" />
                        <span className="font-medium">备注要求：</span>
                        <span>{item.notes}</span>
                      </div>
                    )}
                  </div>

                  {/* 第三行：寻源参数 (Tags 组合展示) */}
                  <div className="flex flex-wrap gap-2 items-center mt-1">
                    
                    {/* 1. 平台 (有值才显示，直接显示 '1688' 等) */}
                    {item.search_platform && (
                        <Tag variant="filled" color="blue" className="m-0 text-xs flex items-center gap-1 px-2">
                            <ShopOutlined /> {item.search_platform}
                        </Tag>
                    )}

                    {/* 2. 关键词 */}
                    {item.key_word && (
                      <Tooltip title={`搜索使用的关键词: ${item.key_word}`}>
                        <Tag 
                          variant="filled" 
                          color="orange" 
                          // [核心修改] 
                          // 1. 去掉了 'max-w-[150px]' 和 'truncate' (解除宽度限制)
                          // 2. 加上 'whitespace-normal' 和 'h-auto' (允许长文字自动换行并撑开高度)
                          className="m-0 text-xs flex items-center gap-1 px-2 whitespace-normal h-auto py-1"
                        >
                          <SearchOutlined className="flex-shrink-0" /> 
                          <span>{item.key_word}</span>
                        </Tag>
                      </Tooltip>
                    )}

                    {/* 3. 建议品牌 */}
                    {item.brand && item.brand !== '-' && (
                      <Tag variant="filled" color="geekblue" className="m-0 text-xs px-2">
                        品牌: {item.brand}
                      </Tag>
                    )}
                  </div>
                </div>

                {/* 右侧：AI 推荐理由 */}
                {item.reason && (
                  <div className="flex-shrink-0 ml-2">
                    <Tag color="cyan" className="mr-0">AI 推荐: {item.reason.substring(0, 15)}...</Tag>
                  </div>
                )}
              </div>

              {/* === 下方：候选供应商卡片区域 === */}
              {item.candidates && item.candidates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {item.candidates.map((cand, cIdx) => (
                    <CandidateCard key={cIdx} candidate={cand} />
                  ))}
                </div>
              ) : (
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