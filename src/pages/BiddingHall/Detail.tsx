import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Button, Spin, message, Modal, Empty, Tag 
} from 'antd';
import { 
  ArrowLeftOutlined, ShoppingCartOutlined, UserOutlined, 
  CheckCircleOutlined 
} from '@ant-design/icons';
import axios from 'axios'; // 保持 axios 用于获取详情（GET请求）

// [新增] 引入封装好的 API 服务
import { emallApi } from '@/services/api_emall';

// 引入现有组件
import BasicInfoSection from '@/components/emall/detail/components/BasicInfoSection';
import TimeInfoSection from '@/components/emall/detail/components/TimeInfoSection';
import CommodityTable from '@/components/emall/detail/components/CommodityTable';
import BusinessTable from '@/components/emall/detail/components/BusinessTable';
import FileLinksSection from '@/components/emall/detail/components/FileLinksSection';
import AIRecommendation from './components/AIRecommendation';
import { BiddingProjectDetail as BaseDetail } from './types';

// 扩展接口定义，包含新字段
interface ExtendedProjectDetail extends BaseDetail {
  is_selected: boolean;
  project_owner: string;
  bidding_status_display: string;
}

const Detail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ExtendedProjectDetail | null>(null);
  const [transferring, setTransferring] = useState(false);

  // 获取详情数据
  const fetchDetail = () => {
    if (id) {
      axios.get(`/api/bidding/project/${id}/`)
        .then((res: any) => setData(res.data))
        .catch((err) => { console.error(err); message.error('获取项目详情失败'); })
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    fetchDetail();
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

  // [修改] 处理选择/取消选择逻辑 - 使用 emallApi 修复 403 问题
  const handleToggleSelect = async () => {
    if (!data) return;
    setTransferring(true);
    try {
      // 计算目标状态（取反）
      const targetState = !data.is_selected;
      
      // 使用封装好的 API 发送请求，它会自动携带 CSRF Token 和 Cookie
      const response = await emallApi.toggleProcurementSelection(data.id, targetState);
      const resData = response.data;

      if (resData.success) {
        // 更新本地状态
        setData(prev => prev ? {
          ...prev,
          is_selected: resData.is_selected,
          project_owner: resData.project_owner
        } : null);
        
        message.success(resData.is_selected ? '已选择该项目，归属人已更新' : '已取消选择，归属人已重置');
        
        // 如果是选中状态，引导用户跳转
        if (resData.is_selected) {
           Modal.confirm({
             title: '✅ 项目已转入采购工作台',
             content: '您现在要去处理该项目吗？',
             okText: '去处理',
             cancelText: '留在此处',
             onOk: () => navigate('/procurement'),
           });
        }
      }
    } catch (err) { 
      console.error(err);
      message.error('操作失败，请检查登录状态或权限'); 
    } finally { 
      setTransferring(false); 
    }
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
            <div className="text-gray-500 text-xs mt-1 flex gap-4 items-center">
              <span>编号: {data.requirements?.project_code}</span>
              {/* 显示归属人和状态 */}
              <div className="flex items-center gap-2 ml-4 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                <UserOutlined className="text-blue-500" />
                <span className="text-gray-600">归属人: <span className="font-medium text-gray-900">{data.project_owner}</span></span>
              </div>
              <Tag color={data.bidding_status_display === '未开始' ? 'default' : 'processing'}>
                {data.bidding_status_display}
              </Tag>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <div className="text-xs text-gray-400">控制总价</div>
            <div className="text-2xl font-bold text-red-600 font-mono">{data.price_display}</div>
          </div>
          
          {/* 交互按钮：根据是否选中显示不同状态 */}
          <Button 
            type={data.is_selected ? "default" : "primary"}
            size="large" 
            icon={data.is_selected ? <CheckCircleOutlined /> : <ShoppingCartOutlined />}
            loading={transferring}
            onClick={handleToggleSelect}
            className={data.is_selected 
              ? "bg-green-50 text-green-600 border-green-200 hover:text-green-700 hover:border-green-300" 
              : "bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-200"
            }
          >
            {data.is_selected ? "已选择 (点击取消)" : "选择项目"}
          </Button>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 左侧：原始需求信息 */}
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

        {/* 右侧：AI 推荐结果 */}
        <div className="lg:col-span-7 space-y-4">
          <AIRecommendation recommendations={data.recommendations} />
        </div>
      </div>
    </div>
  );
};

export default Detail;