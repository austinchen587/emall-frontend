import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Spin } from 'antd'; // 引入 Ant Design 组件
import axios from 'axios'; // 确保已安装 axios
import { useBiddingStats } from './hooks';

const PROVINCES = [
  { key: 'JX', name: '江西省', color: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-200' },
  { key: 'HN', name: '湖南省', color: 'from-red-500 to-red-600', shadow: 'shadow-red-200' },
  { key: 'AH', name: '安徽省', color: 'from-green-500 to-green-600', shadow: 'shadow-green-200' },
  { key: 'ZJ', name: '浙江省', color: 'from-purple-500 to-purple-600', shadow: 'shadow-purple-200' },
  // [新增] 新疆入口 (橙色主题)
  { key: 'XJ', name: '新疆', color: 'from-orange-500 to-orange-600', shadow: 'shadow-orange-200' },
  { key: 'GZ', name: '贵州省', color: 'from-teal-500 to-teal-600', shadow: 'shadow-teal-200' },
];

const Portal: React.FC = () => {
  const navigate = useNavigate();
  const { stats } = useBiddingStats(); 
  const [syncing, setSyncing] = useState<string | null>(null); // 记录正在同步的省份

  const handleProvinceClick = async (provKey: string) => {
    // 防止重复点击
    if (syncing) return;
    
    setSyncing(provKey);
    message.loading({ content: '正在同步最新数据...', key: 'sync_msg' });

    try {
      // 1. 调用后台同步接口
      // 假设您的 API 基础路径已配置，如果没有，请加上 http://localhost:8000
      await axios.post('/api/bidding/sync/', { province: provKey });
      
      message.success({ content: '同步指令已发送，即将进入大厅', key: 'sync_msg', duration: 1 });
      
      // 2. 跳转页面 (给一点延迟让用户看到反馈，或者立即跳转)
      setTimeout(() => {
        navigate(`/bidding/hall?province=${provKey}`);
      }, 500);
      
    } catch (error) {
      console.error('Sync trigger failed:', error);
      // 即使同步接口失败，也允许用户进入查看历史数据
      message.warning({ content: '同步服务响应超时，但这不影响您浏览历史数据', key: 'sync_msg' });
      navigate(`/bidding/hall?province=${provKey}`);
    } finally {
      setSyncing(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">政府采购竞价大厅</h1>
        <p className="text-gray-500 text-lg">请选择您要进入的省份区域</p>
      </div>
      
      {/* 调整 grid 布局，适配更多卡片 (lg:grid-cols-5 如果屏幕够宽，或者保持 4 列自动换行) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 max-w-7xl w-full">
        {PROVINCES.map((prov) => (
          <div 
            key={prov.key}
            onClick={() => handleProvinceClick(prov.key)} 
            className={`
              cursor-pointer rounded-2xl p-8 text-white relative overflow-hidden
              transform hover:-translate-y-2 hover:scale-105 transition-all duration-300
              bg-gradient-to-br ${prov.color} shadow-xl ${prov.shadow}
              ${syncing === prov.key ? 'opacity-80 scale-95 pointer-events-none ring-4 ring-offset-2 ring-blue-300' : ''}
            `}
          >
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div className="text-3xl font-bold mb-6 opacity-95">{prov.name}</div>
                {/* 如果正在同步，显示 Loading 图标 */}
                {syncing === prov.key && <Spin size="default" />}
              </div>
              
              <div className="flex items-end justify-between border-t border-white/20 pt-4">
                 <span className="text-sm opacity-80 font-medium">进行中项目</span>
                 <span className="text-4xl font-mono font-bold tracking-tight">
                   {stats?.[prov.key] || 0}
                 </span>
              </div>

            </div>
            {/* 装饰圆圈 */}
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-black/5 rounded-full blur-xl" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Portal;