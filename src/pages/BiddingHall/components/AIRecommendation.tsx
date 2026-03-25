import React, { useState, useEffect } from 'react';
import { Tag, Spin, Empty, Tooltip, Button, Modal, Input, message, Select, Typography } from 'antd'; // 👈 修复：加入了 Typography
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
import RawSearchList from './RawSearchList';
import RawDetailList from './RawDetailList';

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
  const [localRecs, setLocalRecs] = useState<ExtendedRecommendationItem[]>([]);
  
  // 重新寻源相关状态
  const [retryModalVisible, setRetryModalVisible] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [currentRetryItem, setCurrentRetryItem] = useState<ExtendedRecommendationItem | null>(null);
  const [newKeyword, setNewKeyword] = useState('');
  const [retryPlatform, setRetryPlatform] = useState('京东');

  // [修复新增] 原数据查询相关状态
  const [rawModalVisible, setRawModalVisible] = useState(false);
  const [rawDataType, setRawDataType] = useState<'search' | 'detail'>('search');
  const [rawData, setRawData] = useState<any[]>([]);
  const [rawLoading, setRawLoading] = useState(false);

  useEffect(() => {
    setLocalRecs(recommendations || []);
  }, [recommendations]);

  // [修改] 处理查看原数据逻辑 - 增加嵌套数据解析
  const handleOpenRawData = async (item: ExtendedRecommendationItem, type: 'search' | 'detail') => {
    if (!item.brand_id) return message.warning('缺少商品 ID标识');
    
    setRawDataType(type);
    setCurrentRetryItem(item);
    setRawModalVisible(true);
    setRawLoading(true);
    setRawData([]); 
    
    try {
      const res = await axios.get('/api/bidding/raw-data/', {
        params: {
          brand_id: item.brand_id,
          platform: item.search_platform || '京东',
          type: type
        }
      });

      if (res.data.success) {
        const dbRows = res.data.data || [];
        let finalDisplayData = dbRows;

        // 🌟 【关键修复】如果是 Search 类型，从 raw_data 字符串中解析出 items.item 数组
        if (type === 'search' && dbRows.length > 0) {
          try {
            const latestRecord = dbRows[0];
            let rawObj = latestRecord.raw_data;
            if (typeof rawObj === 'string') {
              // 兼容双引号转义
              rawObj = JSON.parse(rawObj.replace(/""/g, '"'));
            }
            finalDisplayData = rawObj?.items?.item || [];
          } catch (e) {
            console.error("解析 raw_data 失败:", e);
          }
        }
        
        // 如果是 Detail，直接将整个 dbRows (包含 raw_data.item 等) 传给组件渲染
        setRawData(finalDisplayData);
      } else {
        message.error(res.data.error || '获取失败');
      }
    } catch (error) {
      message.error('请求原数据接口失败');
    } finally {
      setRawLoading(false);
    }
  };

  const handleOpenRetry = (item: ExtendedRecommendationItem) => {
    if (!item.brand_id) {
      return message.warning('该商品缺少 ID 标识，无法重试');
    }
    setCurrentRetryItem(item);
    setNewKeyword(item.key_word || item.item_name || '');
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
        new_platform: retryPlatform
      });
      if (res.data.success) {
        message.success('✅ 已加入寻源队列');
        setRetryModalVisible(false);
        setLocalRecs(prev => prev.map(item => {
          if (item.brand_id === currentRetryItem.brand_id) {
            return {
              ...item,
              key_word: newKeyword.trim(),
              search_platform: retryPlatform,
              reason: 'AI 正在全网寻源中，请稍后刷新...',
              candidates: []
            };
          }
          return item;
        }));
        if (onRefresh) onRefresh();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      message.error('请求失败');
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
          {isSelected ? <Tag color="purple">全网比价进行中</Tag> : <Tag color="default">未启动</Tag>}
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
                    <h3 className="text-base font-bold text-gray-800 m-0">{idx + 1}. {item.item_name}</h3>
                    {(item.quantity || item.unit) && (
                      <span className="bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
                        <NumberOutlined /><span>{item.quantity || '-'} {item.unit || '件'}</span>
                      </span>
                    )}

                    {/* 操作按钮组 */}
                    {isSelected && (
                      <div className="flex gap-2 flex-wrap">
                        {/* [新增的两个原数据按钮] */}
                        <Tooltip title="查看爬虫搜索到的原始列表数据">
                          <Button 
                            size="small" 
                            icon={<SearchOutlined />} 
                            onClick={() => handleOpenRawData(item, 'search')}
                          >
                            Search原数据
                          </Button>
                        </Tooltip>
                        <Tooltip title="查看爬虫进入详情页抓取的规格参数数据">
                          <Button 
                            size="small" 
                            icon={<InfoCircleOutlined />} 
                            onClick={() => handleOpenRawData(item, 'detail')}
                          >
                            Detail原数据
                          </Button>
                        </Tooltip>
                        
                        <Button 
                          type="dashed" 
                          size="small" 
                          icon={<SyncOutlined />} 
                          className="text-blue-500 border-blue-200"
                          onClick={() => handleOpenRetry(item)}
                        >
                          重新寻源
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 mb-2 leading-relaxed">
                    <div><span className="font-medium text-gray-400">规格需求：</span><span>{item.specifications || "无具体规格描述"}</span></div>
                    {item.notes && (
                      <div className="mt-1 text-orange-600 flex items-start gap-1">
                        <InfoCircleOutlined className="mt-0.5" /><span className="font-medium">备注要求：</span><span>{item.notes}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 items-center mt-1">
                    {item.search_platform && <Tag color="blue" className="m-0 text-xs flex items-center gap-1 px-2"><ShopOutlined /> {item.search_platform}</Tag>}
                    {item.key_word && (
                      <Tooltip title={`搜索关键词: ${item.key_word}`}>
                        <Tag color="orange" className="m-0 text-xs flex items-center gap-1 px-2 whitespace-normal h-auto py-1"><SearchOutlined /><span>{item.key_word}</span></Tag>
                      </Tooltip>
                    )}
                  </div>
                </div>

                {item.reason && (
                  <div className="flex-shrink-0 ml-2 max-w-[200px] text-right">
                    <Tag color={item.reason.includes('分析中') || item.reason.includes('寻源中') ? 'processing' : 'cyan'} className="mr-0 whitespace-normal text-left">
                      {item.reason.includes('分析中') || item.reason.includes('寻源中') ? <Spin size="small" className="mr-1"/> : null}
                      AI: {item.reason.substring(0, 15)}...
                    </Tag>
                  </div>
                )}
              </div>

              {item.candidates && item.candidates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {item.candidates.map((cand: any, cIdx: number) => <CandidateCard key={cIdx} candidate={cand} />)}
                </div>
              ) : isSelected && (
                <div className="bg-white border-dashed border-2 border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-400">
                  <Spin size="small" className="mb-2" /><span className="text-sm">⏳ AI 正在全网寻源中，请稍后刷新...</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无 AI 推荐数据" />}

      {/* 重新寻源 Modal */}
      <Modal
        title={<div className="flex items-center gap-2"><SyncOutlined className="text-blue-500" /><span>重新全网寻源</span></div>}
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
          <div className="mb-4 text-gray-600">您正在对 <span className="font-bold text-gray-800">[{currentRetryItem?.item_name}]</span> 发起重新抓取。<br/>请精简关键词，并指定目标寻源平台：</div>
          <div className="font-bold mb-2">搜索关键词：</div>
          <Input size="large" value={newKeyword} onChange={(e) => setNewKeyword(e.target.value)} placeholder="请输入关键词..." allowClear prefix={<SearchOutlined className="text-gray-400" />} />
          <div className="font-bold mb-2 mt-4">目标寻源平台：</div>
          <Select size="large" value={retryPlatform} onChange={(val) => setRetryPlatform(val)} style={{ width: '100%' }} options={[{ label: '京东 (JD.com)', value: '京东' }, { label: '1688 (阿里巴巴)', value: '1688' }, { label: '淘宝 (Taobao)', value: '淘宝' }]} />
        </div>
      </Modal>

      {/* [新增] 原数据展示 Modal - 解决变量未读和闭合错误 */}
      <Modal
  title={
    <div className="flex items-center gap-2">
      {/* 👈 修复：明确使用 Typography.Text */}
      <Typography.Text strong>{currentRetryItem?.item_name}</Typography.Text>
      <Tag color={rawDataType === 'search' ? 'orange' : 'purple'}>
        {rawDataType === 'search' ? '回采搜索列表' : '回采商品详情'}
      </Tag>
    </div>
  }
  open={rawModalVisible}
  onCancel={() => setRawModalVisible(false)}
  footer={null}
  width={rawDataType === 'search' ? 1100 : 1200}
  centered
  destroyOnClose
>
  <Spin spinning={rawLoading}>
    <div className="max-h-[80vh] overflow-y-auto">
      {rawData && rawData.length > 0 ? (
        rawDataType === 'search' ? (
          <RawSearchList data={rawData} platform={currentRetryItem?.search_platform} />
        ) : (
          <RawDetailList data={rawData} />
        )
      ) : (
        <Empty description="数据库中暂无相关记录" className="py-20" />
      )}
    </div>
  </Spin>
</Modal>
    </div>
  );
};

export default AIRecommendation;