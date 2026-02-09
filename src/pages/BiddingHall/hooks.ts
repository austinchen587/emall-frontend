// src/pages/BiddingHall/hooks.ts
import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { biddingApi } from '@/services/api_bidding';
import { IBiddingProject, IFilterParams } from '@/services/types/bidding';

export const useBiddingStats = () => {
  const [stats, setStats] = useState<any>({});
  useEffect(() => {
    biddingApi.fetchStats().then(res => setStats(res.data)).catch(() => {});
  }, []);
  return { stats };
};

export const useBiddingList = (initialProvince: string = 'JX') => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<IBiddingProject[]>([]);
  const [total, setTotal] = useState(0);
  
  const [filters, setFilters] = useState<IFilterParams>({
    province: initialProvince,
    root: 'goods',
    sub: '',
    mode: '',
    search: '',
    owner: '',       // [调试] 显式初始化
    is_selected: '', // [调试] 显式初始化
    page: 1,
    page_size: 16
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 🔥 [前端调试点 1] 检查发送给后端的参数
      console.log('🚀 [前端 Request] 发起列表请求, 参数:', JSON.stringify(filters, null, 2));

      const data = await biddingApi.fetchList(filters);
      
      // 🔥 [前端调试点 2] 检查后端返回的数据数量
      console.log(`✅ [前端 Response] 收到数据: ${data.results.length} 条 (总数: ${data.count})`);
      
      setList(data.results);
      setTotal(data.count);
    } catch (error) {
      console.error('❌ [前端 Error] 请求失败:', error);
      message.error('获取列表失败');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateFilter = (key: keyof IFilterParams, value: string) => {
    // 🔥 [前端调试点 3] 检查 UI 是否触发了状态更新
    console.log(`🔄 [前端 Action] 更新筛选条件: ${key} = ${value}`);
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return { loading, list, total, filters, updateFilter, handlePageChange };
};