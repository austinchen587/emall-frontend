import React, { useEffect, useState } from 'react';
import { Spin, Progress, Tag, Empty, Avatar, Modal, Button, Tooltip } from 'antd';
import { 
  ShopOutlined, 
  UserOutlined, 
  BarChartOutlined,
  TrophyOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

interface OwnerDetail {
  name: string;
  count: number;
}

interface SubCatStat {
  key: string;
  label: string;
  total: number;
  selected: number;
  unselected: number;
  owners: OwnerDetail[]; 
}

interface OwnerStat {
  name: string;
  count: number;
}

interface StatsData {
  sub_cats: SubCatStat[];
  status_dist: Record<string, number>;
  owner_dist: OwnerStat[];
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  'not_started': { label: '未开始', color: 'default' },
  'bidding': { label: '竞价中', color: 'processing' },
  'bargaining': { label: '议价中', color: 'warning' },
  'pending_contract': { label: '待签合同', color: 'purple' },
  'completed': { label: '已完成', color: 'success' },
  'unknown': { label: '未知', color: 'default' }
};

const BiddingStats: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<StatsData | null>(null);
  const [searchParams] = useSearchParams();
  
  const province = searchParams.get('province') || '';

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/bidding/project/stats/`, {
        params: { province }
      });
      setData(res.data);
    } catch (error) {
      console.error("获取统计失败", error);
    } finally {
      setLoading(false);
    }
  };

  // 当弹窗打开时才去获取数据（节省资源）
  useEffect(() => {
    if (visible) {
      fetchStats();
    }
  }, [visible, province]);

  const totalGoods = data?.sub_cats.reduce((acc, cur) => acc + cur.total, 0) || 0;

  return (
    <>
      {/* 1. 触发按钮区：放在列表页顶部 */}
      <div className="mb-4 flex justify-end">
        <Button 
          type="primary" 
          icon={<PieChartOutlined />} 
          onClick={() => setVisible(true)}
          className="bg-indigo-600 hover:bg-indigo-500 border-indigo-600 shadow-sm"
        >
          查看寻源进度统计
        </Button>
      </div>

      {/* 2. 统计详情弹窗 */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <ShopOutlined className="text-blue-600" />
            <span>物资类寻源统计看板</span>
            <Tag color="blue" className="ml-2 font-normal">
              当前省份未过期项目: {loading ? '...' : totalGoods}
            </Tag>
          </div>
        }
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={1200} // 宽屏弹窗
        centered
        bodyStyle={{ padding: '24px', backgroundColor: '#f8fafc' }}
      >
        {loading && !data ? (
          <div className="p-12 text-center"><Spin size="large" tip="数据分析中..." /></div>
        ) : data ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* === 左侧：分类详情 (占 3/4) === */}
            <div className="lg:col-span-3 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.sub_cats.map((cat) => (
                  <div key={cat.key} className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    
                    {/* 标题 */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-gray-800">{cat.label}</span>
                      <span className="text-xs text-gray-400 font-mono">Total: {cat.total}</span>
                    </div>

                    {/* 进度条 */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-blue-600 font-medium">已选 {cat.selected}</span>
                        <span className="text-gray-400">未选 {cat.unselected}</span>
                      </div>
                      <Progress 
                        percent={cat.total > 0 ? Math.round((cat.selected / cat.total) * 100) : 0} 
                        size="small" 
                        showInfo={false}
                        strokeColor={cat.selected > 0 ? "#1890ff" : "#d9d9d9"} 
                      />
                    </div>

                    {/* 归属人列表 */}
                    <div className="border-t border-gray-50 pt-3">
                      <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                        <UserOutlined /> 认领详情:
                      </div>
                      
                      {cat.owners && cat.owners.length > 0 ? (
                        <div className="space-y-1.5 max-h-[120px] overflow-y-auto custom-scrollbar pr-1">
                          {cat.owners.map((owner) => (
                            <div key={owner.name} className="flex justify-between items-center text-xs bg-gray-50 p-1.5 rounded border border-gray-100">
                              <div className="flex items-center gap-2">
                                <Avatar size={18} style={{ backgroundColor: '#e6f7ff', color: '#1890ff', fontSize: '10px' }}>
                                  {owner.name[0]}
                                </Avatar>
                                <span className="text-gray-600">{owner.name}</span>
                              </div>
                              <span className="font-bold text-blue-600">
                                {owner.count}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-300 py-2 text-center bg-gray-50 rounded italic">
                          暂无认领
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* === 右侧：总状态分布 (占 1/4) === */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-50">
                  <BarChartOutlined className="text-purple-600" />
                  <h3 className="text-gray-700 font-bold m-0 text-sm">已选项目状态</h3>
                </div>
                
                <div className="space-y-2">
                  {Object.keys(data.status_dist).length > 0 ? (
                    Object.entries(data.status_dist).map(([key, count]) => {
                      const conf = STATUS_MAP[key] || STATUS_MAP['unknown'];
                      return (
                        <div key={key} className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full bg-${conf.color === 'processing' ? 'blue' : conf.color === 'success' ? 'green' : 'gray'}-500`} />
                            <span className="text-sm text-gray-600">{conf.label}</span>
                          </div>
                          <span className="font-mono font-bold text-gray-700">{count}</span>
                        </div>
                      );
                    })
                  ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <TrophyOutlined /> 活跃采购员
                   </div>
                   <div className="text-xl font-bold text-gray-800">
                     {data.owner_dist.length} <span className="text-xs font-normal text-gray-400">人</span>
                   </div>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <Empty description="暂无数据" />
        )}
      </Modal>
    </>
  );
};

export default BiddingStats;