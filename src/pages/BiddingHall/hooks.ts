import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { biddingApi } from '@/services/api_bidding';
import { IBiddingProject, IProvinceStats, IFilterParams } from '@/services/types/bidding';

// Hook 1: 统计数据
export const useBiddingStats = () => {
  const [stats, setStats] = useState<IProvinceStats>({});
  useEffect(() => {
    biddingApi.fetchStats().catch(() => {});
  }, []);
  return { stats };
};

// Hook 2: 列表逻辑 (含分页)
export const useBiddingList = (initialProvince: string = 'JX') => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<IBiddingProject[]>([]);
  const [total, setTotal] = useState(0); // 总条数
  
  const [filters, setFilters] = useState<IFilterParams>({
    province: initialProvince,
    root: 'goods',
    sub: '',
    mode: '',
    search: '', // [新增] 初始化搜索词
    page: 1,
    page_size: 16 // 默认为 16 (4x4布局)
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await biddingApi.fetchList(filters);
      setList(data.results); // 这是一个数组
      setTotal(data.count);  // 这是一个数字
    } catch (error) {
      console.error(error);
      message.error('获取列表失败');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // 监听筛选条件变化自动刷新
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 更新筛选 (重置页码)
  const updateFilter = (key: keyof IFilterParams, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  // 翻页
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return { loading, list, total, filters, updateFilter, handlePageChange };
};