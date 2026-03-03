import React, { useState, useEffect } from 'react';
import { Tag, Spin, Empty, Tooltip, Button, Modal, Input, message, Select } from 'antd';
import { 
  ThunderboltOutlined, 
  SearchOutlined,      
  ShopOutlined,        
  NumberOutlined,
  InfoCircleOutlined,
  SyncOutlined 
} from '@ant-design/icons';
import axios from 'axios'; 
import CandidateCard from './CandidateCard';

export interface ExtendedRecommendationItem {
  brand_id?: number;
  item_name?: string;
  quantity?: number;
  unit?: string;
  specifications?: string;
  key_word?: string;
  search_platform?: string;
  notes?: string; 
  brand?: string;
  reason?: string;
  candidates?: any[]; 
}

interface AIRecommendationProps {
  recommendations: ExtendedRecommendationItem[];
  isSelected: boolean;
  onRefresh?: () => void; 
}

const AIRecommendation: React.FC<AIRecommendationProps> = ({ recommendations, isSelected, onRefresh }) => {
  // [核心修复] 使用本地 State 托管数据，实现点击后“瞬间同步更新”体验
  const [localRecs, setLocalRecs] = useState<ExtendedRecommendationItem[]>([]);
  
  const [retryModalVisible, setRetryModalVisible] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [currentRetryItem, setCurrentRetryItem] = useState<ExtendedRecommendationItem | null>(null);
  const [newKeyword, setNewKeyword] = useState('');
  const [retryPlatform, setRetryPlatform] = useState('京东');

  // 当外部传入的数据更新时，同步到本地
  useEffect(() => {
    setLocalRecs(recommendations || []);
  }, [recommendations]);

  const handleOpenRetry = (item: ExtendedRecommendationItem) => {
    if (!item.brand_id) {
      return message.warning('该商品缺少 ID 标识，无法重试');
    }
    setCurrentRetryItem(item);
    setNewKeyword(item.key_word || item.item_name || '');
    
    // 如果已有平台则带入，没有则默认京东。控制在三个选项内
    const initialPlatform = item.search_platform || '京东';
    setRetryPlatform(['京东', '1688', '淘宝'].includes(initialPlatform) ? initialPlatform : '京东');
    
    setRetryModalVisible(true);
  };

  const handleRetrySubmit = async () => {
    if (!currentRetryItem?.brand_id) return;
    
    setRetrying(true);
    try {
      const res = await axios.post('/api/bidding/item/retry/', {
        brand_id: currentRetryItem.brand_id,
        new_keyword: newKeyword.trim(),
        new_platform: retryPlatform // 传递平台给后端
      });
      
      if (res.data.success) {
        message.success({ content: '✅ 已加入寻源队列', duration: 2 });
        setRetryModalVisible(false);
        
        // [核心修复] 直接在前端更新本地数据结构，外层标签瞬间改变！
        setLocalRecs(prev => prev.map(item => {
          if (item.brand_id === currentRetryItem.brand_id) {
            return {
              ...item,
              key_word: newKeyword.trim(),
              search_platform: retryPlatform,
              reason: 'AI 正在全网寻源中，请稍后刷新...', // 状态变更为分析中
              candidates: [] // 清空旧的推荐商品
            };
          }
          return item;
        }));

        // 静默触发外部刷新，获取最新状态
        if (onRefresh) onRefresh();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      message.error('请求失败，请检查网络');
    } finally {
      setRetrying(false);
    }
  };

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

      {localRecs && localRecs.length > 0 ? (
        <div className="space-y-8">
          {localRecs.map((item, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 pr-4"> 
                  
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

                    {isSelected && (
                      <Tooltip title="抓取结果不满意？修改平台或关键词让 AI 重新找">
                        <Button 
                          type="dashed" 
                          size="small" 
                          icon={<SyncOutlined />} 
                          className="text-blue-500 border-blue-200 hover:bg-blue-50 hover:border-blue-400"
                          onClick={() => handleOpenRetry(item)}
                        >
                          重新寻源
                        </Button>
                      </Tooltip>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 mb-2 leading-relaxed">
                    <div>
                      <span className="font-medium text-gray-400">规格需求：</span>
                      <span>{item.specifications || "无具体规格描述"}</span>
                    </div>

                    {item.notes && (
                      <div className="mt-1 text-orange-600 flex items-start gap-1">
                        <InfoCircleOutlined className="mt-0.5" />
                        <span className="font-medium">备注要求：</span>
                        <span>{item.notes}</span>
                      </div>
                    )}
                  </div>

                  {/* 标签同步更新展示区 */}
                  <div className="flex flex-wrap gap-2 items-center mt-1">
                    {item.search_platform && (
                        <Tag variant="filled" color="blue" className="m-0 text-xs flex items-center gap-1 px-2">
                            <ShopOutlined /> {item.search_platform}
                        </Tag>
                    )}

                    {item.key_word && (
                      <Tooltip title={`搜索使用的关键词: ${item.key_word}`}>
                        <Tag 
                          variant="filled" 
                          color="orange" 
                          className="m-0 text-xs flex items-center gap-1 px-2 whitespace-normal h-auto py-1"
                        >
                          <SearchOutlined className="flex-shrink-0" /> 
                          <span>{item.key_word}</span>
                        </Tag>
                      </Tooltip>
                    )}

                    {item.brand && item.brand !== '-' && (
                      <Tag variant="filled" color="geekblue" className="m-0 text-xs px-2">
                        品牌: {item.brand}
                      </Tag>
                    )}
                  </div>
                </div>

                {item.reason && (
                  <div className="flex-shrink-0 ml-2 max-w-[200px] text-right">
                    <Tag 
                      color={item.reason.includes('分析中') || item.reason.includes('寻源中') ? 'processing' : 'cyan'} 
                      className="mr-0 whitespace-normal text-left"
                    >
                      {item.reason.includes('分析中') || item.reason.includes('寻源中') ? <Spin size="small" className="mr-1"/> : null}
                      AI: {item.reason.substring(0, 15)}...
                    </Tag>
                  </div>
                )}
              </div>

              {item.candidates && item.candidates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {item.candidates.map((cand: any, cIdx: number) => (
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

      <Modal
        title={
          <div className="flex items-center gap-2">
            <SyncOutlined className="text-blue-500" />
            <span>重新全网寻源</span>
          </div>
        }
        open={retryModalVisible}
        onOk={handleRetrySubmit}
        onCancel={() => setRetryModalVisible(false)}
        confirmLoading={retrying}
        okText="派单给 AI"
        cancelText="取消"
        centered
        destroyOnClose
      >
        <div className="py-4">
          <div className="mb-4 text-gray-600">
            您正在对 <span className="font-bold text-gray-800">[{currentRetryItem?.item_name}]</span> 发起重新抓取。
            <br/>请精简关键词，并指定目标寻源平台：
          </div>

          <div className="font-bold mb-2">搜索关键词：</div>
          <Input 
            size="large"
            value={newKeyword} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewKeyword(e.target.value)}
            placeholder="请输入最核心的商品名称..."
            allowClear
            prefix={<SearchOutlined className="text-gray-400" />}
          />

          {/* 只保留三个选项 */}
          <div className="font-bold mb-2 mt-4">目标寻源平台：</div>
          <Select
            size="large"
            value={retryPlatform}
            // [修复] 显式声明 val 的类型为 string
            onChange={(val: string) => setRetryPlatform(val)}
            style={{ width: '100%' }}
            options={[
              { label: '京东 (JD.com)', value: '京东' },
              { label: '1688 (阿里巴巴)', value: '1688' },
              { label: '淘宝 (Taobao)', value: '淘宝' },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
};

export default AIRecommendation;