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

  // [新增] 前端排序逻辑
  const sortedList = React.useMemo(() => {
    // 浅拷贝数组以避免直接修改原引用
    return [...list].sort((a, b) => {
      // 1. 优先级规则：即将过期优先
      // 逻辑复用 ProjectCard: hoursLeft < 24 && status === 1
      const hoursA = Math.floor((a.countdown || 0) / 3600);
      const isUrgentA = a.status === 1 && hoursA < 24;

      const hoursB = Math.floor((b.countdown || 0) / 3600);
      const isUrgentB = b.status === 1 && hoursB < 24;

      // 如果 A 是急需而 B 不是，A 排在 B 前面 (-1)
      if (isUrgentA && !isUrgentB) return -1;
      // 如果 B 是急需而 A 不是，B 排在 A 前面 (1)
      if (!isUrgentA && isUrgentB) return 1;

      // 2. 次要规则：其他全部按照发布时间 desc 顺序排列
      // [修复] 使用 (x as any) 绕过类型检查，并尝试读取 publish_date 或 id
      const itemA = a as any;
      const itemB = b as any;
      
      // 尝试获取时间字段，如果不存在则使用 0
      const dateStrA = itemA.publish_date || itemA.publish_time || itemA.create_time || '';
      const dateStrB = itemB.publish_date || itemB.publish_time || itemB.create_time || '';
      
      const timeA = new Date(dateStrA).getTime() || 0;
      const timeB = new Date(dateStrB).getTime() || 0;
      
      // 时间戳大的（新的）排在前面
      return timeB - timeA;
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
                  // [修复] 显式指定参数类型 (t: number)
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