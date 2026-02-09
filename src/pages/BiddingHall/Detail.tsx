import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spin, message, Empty, MenuProps, Modal } from 'antd';
import axios from 'axios';
import { emallApi } from '@/services/api_emall';

import BasicInfoSection from '@/components/emall/detail/components/BasicInfoSection';
import TimeInfoSection from '@/components/emall/detail/components/TimeInfoSection';
import CommodityTable from '@/components/emall/detail/components/CommodityTable';
import BusinessTable from '@/components/emall/detail/components/BusinessTable';
import FileLinksSection from '@/components/emall/detail/components/FileLinksSection';
import AIRecommendation from './components/AIRecommendation';
import DetailHeader from './components/DetailHeader'; 
import RemarksTab from '@/components/emall/tabs/RemarksTab';

import { ExtendedProjectDetail } from './types';
import { STATUS_OPTIONS } from './constants';
import { adaptProjectData } from './utils'; 

import '@/components/emall/tabs/RemarksTab.css';

const Detail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ExtendedProjectDetail | null>(null);
  const [transferring, setTransferring] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const [showRemarksTab, setShowRemarksTab] = useState(false);
  const [newRemark, setNewRemark] = useState('');
  const [remarksData, setRemarksData] = useState<any>({ remarks_history: [] });
  const [remarksLoading, setRemarksLoading] = useState(false);
  const [latestRemark, setLatestRemark] = useState<any>(null); // [新增] 最新备注状态

  const API_BASE_URL = '/api/emall/purchasing/procurement';

  useEffect(() => {
    if (id) {
      axios.get(`/api/bidding/project/${id}/`)
        .then((res: any) => setData(res.data))
        .catch((err) => { console.error(err); message.error('获取项目详情失败'); })
        .finally(() => setLoading(false));
    }
  }, [id]);

  // [新增] 当 data 加载完成后，自动加载一次备注，以便在 Header 显示最新备注
  useEffect(() => {
    if (data?.id) {
      loadRemarks();
    }
  }, [data?.id, data?.is_selected]);

  const adapterProject = useMemo(() => adaptProjectData(data), [data]);

  const handleToggleSelect = async () => {
     if (!data) return;
     setTransferring(true);
     try {
       const response = await emallApi.toggleProcurementSelection(data.id, !data.is_selected);
       const resData = response.data;
       if (resData.success) {
         setData(prev => prev ? { ...prev, is_selected: resData.is_selected, project_owner: resData.project_owner } : null);
         if (resData.is_selected) {
            Modal.confirm({
              title: '✅ 项目已成功认领', 
              content: '该项目已添加到您的采购工作台，是否立即前往处理？', 
              okText: '去处理 (新窗口)', 
              cancelText: '留在本页', centered: true,
              onOk: () => { window.open('/suppliers', '_blank'); },
            });
         } else { message.success('已取消选择'); }
       }
     } catch (err) { console.error(err); message.error('操作失败'); } finally { setTransferring(false); }
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

  // [修改] 加载备注并更新 latestRemark
  const loadRemarks = async () => {
    if (!data?.id) return;
    // 只有弹窗打开时才显示 loading，否则如果是 Header 自动加载则静默执行
    if (showRemarksTab) setRemarksLoading(true);
    
    try {
      let historyList = [];
      if (data.is_selected) {
        const res = await axios.get(`${API_BASE_URL}/${data.id}/progress/`);
        historyList = res.data.remarks_history || [];
      } else {
        const res = await axios.get(`${API_BASE_URL}/${data.id}/get_unified_remarks/`);
        historyList = res.data.remarks || [];
      }

      setRemarksData({ remarks_history: historyList });
      
      // [新增] 更新最新一条备注
      if (historyList.length > 0) {
        setLatestRemark(historyList[0]);
      } else {
        setLatestRemark(null);
      }

    } catch (error) {
      console.error('加载备注失败:', error);
    } finally {
      if (showRemarksTab) setRemarksLoading(false);
    }
  };

  const handleAddRemark = async () => {
    if (!data?.id || !newRemark.trim()) {
      return message.warning('请输入备注内容');
    }
    
    try {
      if (data.is_selected) {
        await axios.post(`${API_BASE_URL}/${data.id}/add-remark/`, {
          remark_content: newRemark.trim()
        });
      } else {
        await axios.post(`${API_BASE_URL}/${data.id}/add_unified_remarks/`, {
          remark_content: newRemark.trim(),
          remark_type: 'general'
        });
      }
      
      message.success('备注添加成功');
      setNewRemark('');
      loadRemarks(); // 刷新列表和 Header 显示
    } catch (error: any) {
      console.error('添加备注失败:', error);
      const errorMsg = error.response?.data?.error || '添加备注失败';
      message.error(errorMsg);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Spin size="large" /></div>;
  if (!data || !adapterProject) return <Empty description="未找到项目" className="mt-20" />;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <DetailHeader 
        data={data} transferring={transferring} statusUpdating={statusUpdating}
        latestRemark={latestRemark} // [新增] 传递最新备注
        onBack={() => navigate(-1)} onToggleSelect={handleToggleSelect} onStatusChange={handleStatusChange}
        onAddRemark={() => setShowRemarksTab(true)}
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
          <AIRecommendation 
            recommendations={data.recommendations} 
            isSelected={data.is_selected} 
          />
        </div>
      </div>

      {showRemarksTab && (
        <Modal
          title={null}
          open={showRemarksTab}
          onCancel={() => setShowRemarksTab(false)}
          footer={null}
          destroyOnClose={true}
          width={800}
          styles={{ body: { padding: 0 } }}
        >
          <div className="bg-white rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800 m-0">
                项目备注管理 
                <span className="ml-2 text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {data.is_selected ? '模式: 项目全流程' : '模式: 基础备注'}
                </span>
              </h3>
              <button className="text-gray-400 hover:text-gray-600 text-xl leading-none" onClick={() => setShowRemarksTab(false)}>×</button>
            </div>
            
            <Spin spinning={remarksLoading}>
              <RemarksTab
                data={remarksData}
                newRemark={newRemark}
                onNewRemarkChange={setNewRemark}
                onAddRemark={handleAddRemark}
                isReadOnly={false} 
              />
            </Spin>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Detail;