import React from 'react';
import { Spin, Empty, Breadcrumb, Pagination } from 'antd';
import { useSearchParams, Link } from 'react-router-dom';
import { useBiddingList } from './hooks';
import { FilterSection } from './components/FilterSection';
import { ProjectCard } from './components/ProjectCard';
import BiddingStats from './components/BiddingStats';
import './BiddingHall.css';

const BiddingHallPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const province = searchParams.get('province') || 'JX';
  
  const provMap: Record<string, string> = { 
    JX: '江西', 
    HN: '湖南', 
    AH: '安徽', 
    ZJ: '浙江',
    XJ: '新疆' 
  };
  
  const { loading, list, total, filters, updateFilter, handlePageChange } = useBiddingList(province);

  // [前端排序优化]
  const sortedList = React.useMemo(() => {
    return [...list].sort((a, b) => {
      // 1. 优先级规则：即将过期优先 (进行中 status===1 且 < 24h)
      // 计算剩余小时数
      const hoursA = Math.floor((a.countdown || 0) / 3600);
      const hoursB = Math.floor((b.countdown || 0) / 3600);
      
      const isUrgentA = a.status === 1 && hoursA < 24;
      const isUrgentB = b.status === 1 && hoursB < 24;

      // 如果 A 急需而 B 不急 -> A 排前
      if (isUrgentA && !isUrgentB) return -1;
      // 如果 B 急需而 A 不急 -> B 排前
      if (!isUrgentA && isUrgentB) return 1;

      // 2. 次要规则：严格按照 ID 倒序排列 (ID 大的在前)
      // ID 是最可靠的发布时间代理指标
      const idA = Number(a.id) || 0;
      const idB = Number(b.id) || 0;
      
      return idB - idA;
    });
  }, [list]);

  const currentProvName = provMap[filters.province!] || '';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-6">
          <Breadcrumb 
            items={[
              { 
                title: <Link to="/dashboard">首页</Link> 
              }, 
              { 
                title: <Link to="/bidding">{currentProvName}竞价大厅</Link> 
              }
            ]} 
          />
        </div>

        <BiddingStats />

        <FilterSection filters={filters} onFilterChange={updateFilter} />

        <Spin spinning={loading}>
          {sortedList.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[600px] bidding-list-container">
                {sortedList.map(item => (
                  <ProjectCard key={item.id} data={item} />
                ))}
              </div>
              
              <div className="flex justify-center mt-10 pb-10">
                <Pagination
                  current={filters.page}
                  total={total}
                  pageSize={filters.page_size}
                  onChange={handlePageChange}
                  showTotal={(t: number) => `共 ${t} 条项目`}
                  showSizeChanger={false}
                />
              </div>
            </>
          ) : (
            <Empty description="暂无项目" className="mt-20" />
          )}
        </Spin>
      </div>
    </div>
  );
};

export default BiddingHallPage;