import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBiddingStats } from './hooks';

const PROVINCES = [
  { key: 'JX', name: '江西省', color: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-200' },
  { key: 'HN', name: '湖南省', color: 'from-red-500 to-red-600', shadow: 'shadow-red-200' },
  { key: 'AH', name: '安徽省', color: 'from-green-500 to-green-600', shadow: 'shadow-green-200' },
  { key: 'ZJ', name: '浙江省', color: 'from-purple-500 to-purple-600', shadow: 'shadow-purple-200' },
];

const Portal: React.FC = () => {
  const navigate = useNavigate();
  const { stats } = useBiddingStats();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">政府采购竞价大厅</h1>
        <p className="text-gray-500 text-lg">请选择您要进入的省份区域</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl w-full">
        {PROVINCES.map((prov) => (
          <div 
            key={prov.key}
            onClick={() => navigate(`/bidding/hall?province=${prov.key}`)}
            className={`
              cursor-pointer rounded-2xl p-8 text-white relative overflow-hidden
              transform hover:-translate-y-2 hover:scale-105 transition-all duration-300
              bg-gradient-to-br ${prov.color} shadow-xl ${prov.shadow}
            `}
          >
            <div className="relative z-10">
              <div className="text-3xl font-bold mb-6 opacity-95">{prov.name}</div>
              <div className="flex items-end justify-between border-t border-white/20 pt-4">
                <span className="text-sm opacity-80 font-medium">进行中项目</span>
                <span className="text-4xl font-mono font-bold tracking-tight">
                  {stats[prov.key] || 0}
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