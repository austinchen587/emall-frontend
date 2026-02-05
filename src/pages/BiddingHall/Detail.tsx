import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Button, Tag, Spin, message, Modal, Empty, Badge, Tooltip 
} from 'antd';
import { 
  ArrowLeftOutlined, ShoppingCartOutlined, 
  LinkOutlined, ShopOutlined, SafetyCertificateOutlined,
  ThunderboltOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';
// import { biddingApi } from '@/services/api_bidding'; // [修改] 暂时注释掉，直接用 axios

// === 1. 接口定义 (包含新增的 brand 字段) ===
interface Candidate {
  sku: string;
  rank: number;
  shop: string;
  price: number;
  reason: string;
  platform: string;
  detail_url: string;
}

interface RecommendationItem {
  item_name: string;
  specifications: string;
  brand?: string; // [新增] 建议品牌 (后端返回时可能没有，所以设为可选)
  reason: string;
  candidates: Candidate[];
}

interface BiddingProjectDetail {
  id: number;
  title: string;
  price_display: string;
  status: number;
  requirements: {
    project_code: string;
    publish_date: string;
    purchaser: string;
    params: any;
    brands: any;
    quantities: any;
    url: string;
  };
  recommendations: RecommendationItem[];
}

const Detail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<BiddingProjectDetail | null>(null);
  const [transferring, setTransferring] = useState(false);

  // === 2. 数据获取逻辑 (直接请求 API) ===
  useEffect(() => {
    if (id) {
      // [修改] 直接使用你提供的 API 地址格式
      const apiUrl = `/api/bidding/project/${id}/`;
      console.log("正在请求:", apiUrl);

      axios.get(apiUrl)
        .then((res: any) => {
          // 兼容处理：res.data 是实际数据
          const projectData = res.data;
          console.log("API 返回数据:", projectData);
          setData(projectData);
        })
        .catch((err) => {
          console.error("请求失败:", err);
          message.error('获取项目详情失败，请检查控制台网络日志');
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  // === 3. 转入采购逻辑 ===
  const handleTransfer = async () => {
    if (!data) return;
    setTransferring(true);
    try {
      // [修改] 直接使用 data.id (它就是原始 ID)
      await axios.post(`/api/emall/purchasing/procurement/${data.id}/select/`);
      Modal.success({
        title: '✅ 项目已转入采购工作台',
        content: 'AI 推荐的供应商数据已同步，您可以直接发起询价。',
        okText: '立即处理',
        cancelText: '稍后',
        onOk: () => navigate('/procurement'),
      });
    } catch {
      message.error('转入失败');
    } finally {
      setTransferring(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Spin size="large" /></div>;
  if (!data) return <Empty description="未找到项目" className="mt-20" />;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* 顶部导航栏 */}
      <div className="max-w-[1600px] mx-auto mb-4 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>返回</Button>
          <div>
            <h1 className="text-xl font-bold text-gray-800 m-0 truncate max-w-2xl">{data.title}</h1>
            <div className="text-gray-500 text-xs mt-1 flex gap-4">
              <span>编号: {data.requirements?.project_code}</span>
              <span>发布: {data.requirements?.publish_date}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <div className="text-xs text-gray-400">控制总价</div>
            <div className="text-2xl font-bold text-red-600 font-mono">{data.price_display}</div>
          </div>
          <Button 
            type="primary" 
            size="large" 
            icon={<ShoppingCartOutlined />}
            loading={transferring}
            onClick={handleTransfer}
            className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-200"
          >
            转入采购
          </Button>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* === 左侧：原始需求信息 (占 4/12) === */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-6 border-t-4 border-gray-600 h-full">
            <div className="flex items-center gap-2 mb-6">
              <SafetyCertificateOutlined className="text-2xl text-gray-600" />
              <h2 className="text-lg font-bold m-0">原始采购需求</h2>
            </div>

            <div className="space-y-6">
              <InfoBlock label="采购单位" value={data.requirements?.purchaser} />
              
              <InfoBlock 
                label="需求参数" 
                value={data.requirements?.params} 
                isCode 
              />
              
              <InfoBlock 
                label="建议品牌" 
                value={data.requirements?.brands} 
                isTag 
              />

              <InfoBlock label="采购数量" value={data.requirements?.quantities} />

              <div className="pt-4 border-t">
                <Button 
                  type="dashed" 
                  block 
                  icon={<LinkOutlined />} 
                  href={data.requirements?.url} 
                  target="_blank"
                >
                  查看原始公告网页
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* === 右侧：AI 推荐结果 (占 8/12) === */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-6 border-t-4 border-blue-600 min-h-[600px]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <ThunderboltOutlined className="text-2xl text-blue-600" />
                <h2 className="text-lg font-bold m-0">AI 智能寻源结果</h2>
                <Tag color="purple">全网比价完成</Tag>
              </div>
              <span className="text-gray-400 text-sm">数据来源: 京东 / 1688 / 淘宝</span>
            </div>

            {/* 渲染商品列表 */}
            {data.recommendations && data.recommendations.length > 0 ? (
              <div className="space-y-8">
                {data.recommendations.map((item, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    {/* 商品头信息 */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-base font-bold text-gray-800 m-0">
                          {idx + 1}. {item.item_name}
                        </h3>
                        {/* 规格和品牌显示区域 */}
                        <div className="text-xs text-gray-500 mt-1 max-w-2xl leading-relaxed">
                          <span className="mr-3">规格：{item.specifications || "未指定"}</span>
                          
                          {/* [修改] 如果后端返回了 brand 字段，这里就会显示 */}
                          {item.brand && item.brand !== '-' && (
                            <Tag color="geekblue" className="ml-2">
                              建议品牌：{item.brand}
                            </Tag>
                          )}
                        </div>
                      </div>
                      
                      {/* 推荐理由 */}
                      {item.reason && (
                        <Tag color="cyan">AI 推荐理由: {item.reason.substring(0, 20)}...</Tag>
                      )}
                    </div>

                    {/* 推荐候选人列表 */}
                    {item.candidates && item.candidates.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {item.candidates.map((cand, cIdx) => (
                          <CandidateCard key={cIdx} candidate={cand} />
                        ))}
                      </div>
                    ) : (
                      /* [占位符] 当没有候选商品时显示 */
                      <div className="bg-white border-dashed border-2 border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-400">
                        <Spin size="small" className="mb-2" />
                        <span className="text-sm">⏳ AI 正在全网寻源中，请稍后刷新...</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
                description="暂无 AI 推荐数据 (请确认是否导入了 brand/result 表)" 
              />
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

// --- 子组件保持不变 ---
const InfoBlock = ({ label, value, isCode, isTag }: any) => {
  if (!value || value === '{}') return null;
  return (
    <div>
      <div className="text-xs font-bold text-gray-400 mb-1 uppercase">{label}</div>
      {isCode ? (
        <div className="bg-gray-50 p-3 rounded text-xs text-gray-600 leading-relaxed font-mono whitespace-pre-wrap border">
          {typeof value === 'string' ? value.replace(/[{}"']/g, '') : value}
        </div>
      ) : isTag ? (
        <div className="flex flex-wrap gap-2">
          {String(value).replace(/[{}"']/g, '').split(',').map((t, i) => (
            <Tag key={i} color="blue">{t}</Tag>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-700 font-medium">{value}</div>
      )}
    </div>
  );
};

const CandidateCard = ({ candidate }: { candidate: Candidate }) => {
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

export default Detail;