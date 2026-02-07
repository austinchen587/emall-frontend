import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Button, Spin, message, Modal, Empty, Tag, Dropdown, MenuProps 
} from 'antd'; // [新增] 引入 Dropdown, MenuProps
import { 
  ArrowLeftOutlined, ShoppingCartOutlined, UserOutlined, 
  CheckCircleOutlined, DownOutlined, LoadingOutlined // [新增] 图标
} from '@ant-design/icons';
import axios from 'axios';
import { emallApi } from '@/services/api_emall'; // 确保引入 API

// 引入现有组件...
import BasicInfoSection from '@/components/emall/detail/components/BasicInfoSection';
import TimeInfoSection from '@/components/emall/detail/components/TimeInfoSection';
import CommodityTable from '@/components/emall/detail/components/CommodityTable';
import BusinessTable from '@/components/emall/detail/components/BusinessTable';
import FileLinksSection from '@/components/emall/detail/components/FileLinksSection';
import AIRecommendation from './components/AIRecommendation';
import { BiddingProjectDetail as BaseDetail } from './types';

// [修改] 扩展接口定义，增加 bidding_status 原始字段
interface ExtendedProjectDetail extends BaseDetail {
  is_selected: boolean;
  project_owner: string;
  bidding_status: string;        // [新增] 原始状态码 (如 'bidding')
  bidding_status_display: string; // 显示文本 (如 '竞价中')
}

// [新增] 定义状态选项配置
const STATUS_OPTIONS = [
  { key: 'not_started', label: '未开始', color: 'default' },
  { key: 'in_progress', label: '进行中', color: 'processing' }, // 对应 'in_progress'
  { key: 'successful', label: '竞标成功', color: 'success' },   // 对应 'successful'
  { key: 'failed', label: '竞标失败', color: 'error' },         // 对应 'failed'
  { key: 'cancelled', label: '已取消', color: 'warning' },      // 对应 'cancelled'
];

const Detail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ExtendedProjectDetail | null>(null);
  const [transferring, setTransferring] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false); // [新增] 状态更新loading

  // 获取详情数据...
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

  // [修改 1] 更新数据转换逻辑，接收 files 数据
  const adapterProject = useMemo(() => {
    if (!data) return null;
    const provMap: Record<string, string> = { JX: '江西', HN: '湖南', AH: '安徽', ZJ: '浙江' };
    
    // 获取 requirements 数据 (使用 as any 规避 TS 类型检查)
    const reqs = data.requirements as any;

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
      
      // [核心修改 1] 映射商务字段
      // BusinessTable 组件读取的是 business_items 和 business_requirements
      business_items: reqs?.business_items || [], 
      business_requirements: reqs?.business_reqs || [],
      
      // [核心修改 2] 映射附件字段 (保持之前的修复)
      download_files: reqs?.file_names || [],
      related_links: reqs?.file_urls || [],
      
      url: data.requirements?.url
    };
  }, [data]);

  const handleToggleSelect = async () => {
     // ... (保持原有的选择/取消逻辑不变)
     if (!data) return;
     setTransferring(true);
     try {
       const targetState = !data.is_selected;
       const response = await emallApi.toggleProcurementSelection(data.id, targetState);
       const resData = response.data;
 
       if (resData.success) {
         setData(prev => prev ? {
           ...prev,
           is_selected: resData.is_selected,
           project_owner: resData.project_owner
         } : null);
         message.success(resData.is_selected ? '已选择该项目，归属人已更新' : '已取消选择，归属人已重置');
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

  // [新增] 处理状态变更逻辑
  const handleStatusChange: MenuProps['onClick'] = async ({ key }) => {
    if (!data || !data.is_selected) {
      message.warning('请先选择该项目，才能修改竞标状态');
      return;
    }
    
    setStatusUpdating(true);
    try {
      // [核心修改] 把 updateProcurementProgress 改为 updateProgressData
      // 因为你的 index.ts 里定义的是 updateProgressData
      await emallApi.updateProgressData(data.id, {
        bidding_status: key
      });

      // 找到对应的配置项以获取 label 和 color
      const selectedOption = STATUS_OPTIONS.find(opt => opt.key === key);
      
      // 更新本地状态
      setData(prev => prev ? {
        ...prev,
        bidding_status: key,
        bidding_status_display: selectedOption?.label || key
      } : null);

      message.success('状态更新成功');
    } catch (error) {
      console.error('更新状态失败:', error);
      message.error('状态更新失败');
    } finally {
      setStatusUpdating(false);
    }
  };

  // [新增] 下拉菜单配置
  const menuProps: MenuProps = {
    items: STATUS_OPTIONS.map(opt => ({
      key: opt.key,
      label: (
        <span>
          <Tag color={opt.color} className="mr-2">{opt.label}</Tag>
          {data?.bidding_status === opt.key && <CheckCircleOutlined className="text-blue-500" />}
        </span>
      )
    })),
    onClick: handleStatusChange,
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Spin size="large" /></div>;
  if (!data || !adapterProject) return <Empty description="未找到项目" className="mt-20" />;

  // 获取当前状态对应的颜色
  const currentStatusConfig = STATUS_OPTIONS.find(opt => opt.key === data.bidding_status) || STATUS_OPTIONS[0];

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
              
              <div className="flex items-center gap-2 ml-4 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                <UserOutlined className="text-blue-500" />
                <span className="text-gray-600">归属人: <span className="font-medium text-gray-900">{data.project_owner}</span></span>
              </div>
              
              {/* [核心修改] 交互式状态标签 */}
              <Dropdown menu={menuProps} trigger={['click']} disabled={!data.is_selected}>
                <Tag 
                  color={currentStatusConfig.color} 
                  className={`cursor-pointer select-none transition-all hover:opacity-80 flex items-center gap-1 px-3 py-1 text-sm ${!data.is_selected ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {statusUpdating ? <LoadingOutlined /> : null}
                  {data.bidding_status_display}
                  <DownOutlined className="text-xs ml-1 opacity-60" />
                </Tag>
              </Dropdown>

            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <div className="text-xs text-gray-400">控制总价</div>
            <div className="text-2xl font-bold text-red-600 font-mono">{data.price_display}</div>
          </div>
          
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
        {/* 左侧及右侧内容保持不变 */}
        <div className="lg:col-span-5 space-y-4">
          {/* [修改 2] 布局优化：去掉 maxHeight 和 overflow-y-auto */}
          <div className="bg-white rounded-xl shadow-sm p-4 h-auto"> {/* h-full 改为 h-auto */}
            <BasicInfoSection project={adapterProject as any} />
            <TimeInfoSection project={adapterProject as any} />
            <div className="info-section mt-4"><h4 className="text-gray-900 font-bold mb-3 border-l-4 border-blue-500 pl-3">商品信息</h4><CommodityTable project={adapterProject as any} /></div>
            <div className="info-section mt-4"><BusinessTable project={adapterProject as any} /></div>
            
            {/* 这个组件现在可以接收到 adapterProject 中的 download_files 了 */}
            <FileLinksSection project={adapterProject as any} />
            
            <div className="mt-6 pt-4 border-t text-center">
              <Button type="dashed" block href={data.requirements?.url} target="_blank">查看原始公告网页</Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <AIRecommendation 
            recommendations={data.recommendations} 
            isSelected={data.is_selected} 
          />
        </div>
      </div>
    </div>
  );
};

export default Detail;