import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spin, message, Modal, Empty } from 'antd';
import { ArrowLeftOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import axios from 'axios';

// 引入现有 Emall 组件 (路径保持不变)
import BasicInfoSection from '@/components/emall/detail/components/BasicInfoSection';
import TimeInfoSection from '@/components/emall/detail/components/TimeInfoSection';
import CommodityTable from '@/components/emall/detail/components/CommodityTable';
import BusinessTable from '@/components/emall/detail/components/BusinessTable';
import FileLinksSection from '@/components/emall/detail/components/FileLinksSection';

// 引入新拆分的组件和类型
import AIRecommendation from './components/AIRecommendation';
import { BiddingProjectDetail } from './types';

const Detail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<BiddingProjectDetail | null>(null);
  const [transferring, setTransferring] = useState(false);

  useEffect(() => {
    if (id) {
      axios.get(`/api/bidding/project/${id}/`)
        .then((res: any) => setData(res.data))
        .catch((err) => { console.error(err); message.error('获取项目详情失败'); })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const adapterProject = useMemo(() => {
    if (!data) return null;
    const provMap: Record<string, string> = { JX: '江西', HN: '湖南', AH: '安徽', ZJ: '浙江' };
    
    return {
      purchasing_unit: data.requirements?.purchaser,
      project_number: data.requirements?.project_code,
      project_name: data.title,
      project_title: data.title,
      region: provMap[data.province] || data.province,
      total_price_control: data.price_display, 
      total_price_numeric: 0, 
      publish_date: data.requirements?.publish_date,
      quote_start_time: data.start_time ? data.start_time.replace('T', ' ').substring(0, 19) : '-',
      quote_end_time: data.end_time ? data.end_time.replace('T', ' ').substring(0, 19) : '-',
      commodity_names: [], 
      parameter_requirements: data.requirements?.params || [],
      purchase_quantities: data.requirements?.quantities || [],
      suggested_brands: data.requirements?.brands || [],
      control_amounts: [],
      business_items: [], business_requirements: [], download_files: [], related_links: [],
      url: data.requirements?.url
    };
  }, [data]);

  const handleTransfer = async () => {
    if (!data) return;
    setTransferring(true);
    try {
      await axios.post(`/api/emall/purchasing/procurement/${data.id}/select/`);
      Modal.success({
        title: '✅ 项目已转入采购工作台',
        content: 'AI 推荐的供应商数据已同步，您可以直接发起询价。',
        okText: '立即处理',
        cancelText: '稍后',
        onOk: () => navigate('/procurement'),
      });
    } catch { message.error('转入失败'); } finally { setTransferring(false); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Spin size="large" /></div>;
  if (!data || !adapterProject) return <Empty description="未找到项目" className="mt-20" />;

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
          <Button type="primary" size="large" icon={<ShoppingCartOutlined />} loading={transferring} onClick={handleTransfer} className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-200">转入采购</Button>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 左侧：原始需求信息 (复用组件) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-4 h-full custom-scrollbar overflow-y-auto" style={{maxHeight: 'calc(100vh - 120px)'}}>
            <BasicInfoSection project={adapterProject as any} />
            <TimeInfoSection project={adapterProject as any} />
            <div className="info-section mt-4"><h4 className="text-gray-900 font-bold mb-3 border-l-4 border-blue-500 pl-3">商品信息</h4><CommodityTable project={adapterProject as any} /></div>
            <div className="info-section mt-4"><BusinessTable project={adapterProject as any} /></div>
            <FileLinksSection project={adapterProject as any} />
            <div className="mt-6 pt-4 border-t text-center">
              <Button type="dashed" block href={data.requirements?.url} target="_blank">查看原始公告网页</Button>
            </div>
          </div>
        </div>

        {/* 右侧：AI 推荐结果 (新组件) */}
        <div className="lg:col-span-7 space-y-4">
          <AIRecommendation recommendations={data.recommendations} />
        </div>
      </div>
    </div>
  );
};

export default Detail;