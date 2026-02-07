import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spin, message, Modal, Empty, MenuProps } from 'antd';
import axios from 'axios';
import { emallApi } from '@/services/api_emall';

// 组件引用
import BasicInfoSection from '@/components/emall/detail/components/BasicInfoSection';
import TimeInfoSection from '@/components/emall/detail/components/TimeInfoSection';
import CommodityTable from '@/components/emall/detail/components/CommodityTable';
import BusinessTable from '@/components/emall/detail/components/BusinessTable';
import FileLinksSection from '@/components/emall/detail/components/FileLinksSection';
import AIRecommendation from './components/AIRecommendation';
import DetailHeader from './components/DetailHeader'; 

// 逻辑引用
import { ExtendedProjectDetail } from './types';
import { STATUS_OPTIONS } from './constants';
import { adaptProjectData } from './utils'; 

const Detail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ExtendedProjectDetail | null>(null);
  const [transferring, setTransferring] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      axios.get(`/api/bidding/project/${id}/`)
        .then((res: any) => setData(res.data))
        .catch((err) => { console.error(err); message.error('获取项目详情失败'); })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const adapterProject = useMemo(() => adaptProjectData(data), [data]);

  const handleToggleSelect = async () => {
     if (!data) return;
     setTransferring(true);
     try {
       const response = await emallApi.toggleProcurementSelection(data.id, !data.is_selected);
       const resData = response.data;
       if (resData.success) {
         setData(prev => prev ? { ...prev, is_selected: resData.is_selected, project_owner: resData.project_owner } : null);
         message.success(resData.is_selected ? '已选择该项目' : '已取消选择');
         if (resData.is_selected) {
            Modal.confirm({
              title: '✅ 项目已转入采购工作台', content: '您现在要去处理该项目吗？', okText: '去处理', cancelText: '留在此处',
              onOk: () => navigate('/procurement'),
            });
         }
       }
     } catch (err) { message.error('操作失败'); } finally { setTransferring(false); }
  };

  const handleStatusChange: MenuProps['onClick'] = async ({ key }) => {
    if (!data?.is_selected) return message.warning('请先选择该项目');
    setStatusUpdating(true);
    try {
      await emallApi.updateProgressData(data.id, { bidding_status: key });
      const selectedOption = STATUS_OPTIONS.find(opt => opt.key === key);
      setData(prev => prev ? { ...prev, bidding_status: key, bidding_status_display: selectedOption?.label || key } : null);
      message.success('状态更新成功');
    } catch (error) { message.error('状态更新失败'); } finally { setStatusUpdating(false); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Spin size="large" /></div>;
  if (!data || !adapterProject) return <Empty description="未找到项目" className="mt-20" />;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <DetailHeader 
        data={data} transferring={transferring} statusUpdating={statusUpdating}
        onBack={() => navigate(-1)} onToggleSelect={handleToggleSelect} onStatusChange={handleStatusChange}
      />

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-4 h-auto">
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

        <div className="lg:col-span-7 space-y-4">
          {/* [修复] 添加 isSelected 属性 */}
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