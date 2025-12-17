// src/pages/fp_emall/hooks/useFpList.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import { fpEmallApi } from '../../../services/api_fg/fpEmallApi';
import { FpItem, FpSearchParams, PaginationParams } from '../../../services/types/fpTypes';

interface UseFpListReturn {
  loading: boolean;
  tableData: FpItem[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  searchParams: FpSearchParams;
  handleSearch: (values: FpSearchParams) => void;
  handleReset: () => void;
  handlePageChange: (page: number, pageSize?: number) => void;
}

export const useFpList = (): UseFpListReturn => {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<FpItem[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
const [searchParams, setSearchParams] = useState<FpSearchParams>({});

  // 使用 useRef 保存最新的状态
  const paginationRef = useRef(pagination);
  const searchParamsRef = useRef(searchParams);

  // 更新 ref 的值
  paginationRef.current = pagination;
  searchParamsRef.current = searchParams;

  const fetchData = useCallback(async (params: Partial<PaginationParams & FpSearchParams> = {}) => {
    setLoading(true);
    try {
      const { page = paginationRef.current.current, page_size = paginationRef.current.pageSize, ...search } = params;
      
      console.log('API请求参数:', { page, page_size, ...search }); // 调试日志
      
      let response;
      
      // 关键修改：根据是否有搜索条件选择不同的API
      if (search.search && search.search.trim()) {
        console.log('调用搜索接口'); // 调试日志
        response = await fpEmallApi.searchFpList({
          page: page || 1,
          page_size: page_size || paginationRef.current.pageSize,
          ...search,
        });
      } else {
        console.log('调用列表接口'); // 调试日志
        response = await fpEmallApi.getFpList({
          page: page || 1,
          page_size: page_size || paginationRef.current.pageSize,
          ...search,
        });
      }

      console.log('API响应:', response); // 调试日志

      if (response.success) {
        setTableData(response.data);
        setPagination(prev => ({
          ...prev,
          current: page || 1,
          pageSize: page_size || prev.pageSize,
          total: response.pagination.total_count,
        }));
      } else {
        console.error('获取数据失败:', response.error);
      }
    } catch (error) {
      console.error('网络请求失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 添加 useEffect 在组件挂载时加载数据
  useEffect(() => {
    fetchData({ 
      page: 1,
      page_size: pagination.pageSize 
    });
  }, []); // 只会在组件挂载时执行一次

  const handleSearch = useCallback((values: FpSearchParams) => {
    setSearchParams(values);
    fetchData({ 
      ...values, 
      page: 1,
      page_size: paginationRef.current.pageSize 
    });
  }, []);

  const handleReset = useCallback(() => {
    setSearchParams({});
    fetchData({ 
      page: 1,
      page_size: paginationRef.current.pageSize 
    });
  }, []);

  const handlePageChange = useCallback((page: number, pageSize?: number) => {
    fetchData({ 
      ...searchParamsRef.current, 
      page, 
      page_size: pageSize || paginationRef.current.pageSize 
    });
  }, []);

  return {
    loading,
    tableData,
    pagination,
    searchParams,
    handleSearch,
    handleReset,
    handlePageChange,
  };
};
