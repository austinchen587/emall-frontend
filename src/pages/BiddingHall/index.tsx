import React from 'react';
import { Spin, Empty, Breadcrumb, Pagination } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { useBiddingList } from './hooks';
import { FilterSection } from './components/FilterSection';
import { ProjectCard } from './components/ProjectCard';
import './BiddingHall.css';

const BiddingHallPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const province = searchParams.get('province') || 'JX';
  const provMap: Record<string, string> = { JX: '江西', HN: '湖南', AH: '安徽', ZJ: '浙江' };
  
  // 使用 Hook
  const { loading, list, total, filters, updateFilter, handlePageChange } = useBiddingList(province);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-6">
          <Breadcrumb items={[{ title: '首页' }, { title: `${provMap[filters.province!] || ''}竞价大厅` }]} />
        </div>

        {/* 筛选组件 */}
        <FilterSection filters={filters} onFilterChange={updateFilter} />

        {/* 列表内容区 */}
        <Spin spinning={loading}>
          {list.length > 0 ? (
            <>
              {/* 4列网格布局 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[600px] bidding-list-container">
                {list.map(item => (
                  <ProjectCard key={item.id} data={item} />
                ))}
              </div>
              
              {/* 分页器 */}
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