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
  
  // [修改] 增加新疆的映射
  const provMap: Record<string, string> = { 
    JX: '江西', 
    HN: '湖南', 
    AH: '安徽', 
    ZJ: '浙江',
    XJ: '新疆' 
  };
  
  const { loading, list, total, filters, updateFilter, handlePageChange } = useBiddingList(province);

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
          {list.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[600px] bidding-list-container">
                {list.map(item => (
                  <ProjectCard key={item.id} data={item} />
                ))}
              </div>
              
              <div className="flex justify-center mt-10 pb-10">
                <Pagination
                  current={filters.page}
                  total={total}
                  pageSize={filters.page_size}
                  onChange={handlePageChange}
                  showTotal={(t) => `共 ${t} 条项目`}
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