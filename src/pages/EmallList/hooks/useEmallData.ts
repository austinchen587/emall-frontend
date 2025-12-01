// src/pages/EmallList/hooks/useEmallData.ts
import { useState, useCallback, useMemo } from 'react';
import { emallApi } from '../../../services/api_emall';
import { EmallItem, EmallFilterParams } from '../../../services/types';
import { DEFAULT_FILTERS } from '../constants';
import { emallUtils } from '../utils';

export const useEmallData = () => {
  const [emallItems, setEmallItems] = useState<EmallItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<EmallFilterParams>(DEFAULT_FILTERS);

  // 数据获取
  const fetchEmallList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await emallApi.getEmallList(filters);
      
      console.log('🔍 API响应数据结构检查:', {
        dataType: typeof response.data,
        isArray: Array.isArray(response.data),
        keys: Object.keys(response.data || {}),
        hasResults: 'results' in response.data,
        resultsCount: response.data?.results?.length,
        totalSize: JSON.stringify(response.data).length
      });
      
      let items: EmallItem[] = [];
      let count = 0;
      
      if (Array.isArray(response.data)) {
        items = response.data;
        count = response.data.length;
      } else if (response.data?.results) {
        items = response.data.results;
        count = response.data.count || items.length;
      }
      
      // 🔍 调试 project_owner 和 is_selected 字段
      if (items.length > 0) {
        console.log('🔍 字段调试 - 前3个项目:');
        items.slice(0, 3).forEach((item, index) => {
          console.log(`项目 ${index + 1}:`, {
            id: item.id,
            project_title: item.project_title,
            has_project_owner: 'project_owner' in item,
            project_owner: item.project_owner,
            project_owner_type: typeof item.project_owner,
            has_is_selected: 'is_selected' in item,
            is_selected: item.is_selected,
            is_selected_type: typeof item.is_selected,
            bidding_status: item.bidding_status,
            all_keys: Object.keys(item)
          });
        });
      }
      
      const processedItems = items.map((item: EmallItem) => ({
        ...item,
        is_selected: Boolean(item.is_selected),
        bidding_status: item.bidding_status || 'not_started',
        project_owner: item.project_owner ? item.project_owner : '未分配',
        // 如果后端返回的字段名不同，需要映射
        latest_remark: item.latest_remark ? {
          content: item.latest_remark.content || '',
          created_by: item.latest_remark.created_by || '',
          created_at: item.latest_remark.created_at || ''
        } : undefined
      }));
      
      setEmallItems(processedItems);
      setTotalCount(count);
      
    } catch (err) {
      console.error('获取采购列表失败:', err);
      setError(err instanceof Error ? err.message : '获取数据失败');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // 选择项目处理
  const handleSelectProcurement = useCallback(async (item: EmallItem, isSelected: boolean) => {
    try {
      // 先更新本地状态，提供即时反馈
      setEmallItems(prev => prev.map(emallItem => 
        emallItem.id === item.id 
          ? { ...emallItem, is_selected: isSelected }
          : emallItem
      ));
      
      // 调用 API 更新后端状态
      const response = await emallApi.toggleProcurementSelection(item.id, isSelected);
      console.log('选择状态更新响应:', response.data);
      
      // 如果 API 调用成功，重新获取数据以确保状态同步
      if (response.data && response.data.success) {
        // 延迟一小段时间后重新获取数据，确保后端数据已更新
        setTimeout(() => {
          fetchEmallList();
        }, 100);
      }
    } catch (error) {
      console.error('更新采购选择状态失败:', error);
      // 回滚到之前的状态
      setEmallItems(prev => prev.map(emallItem => 
        emallItem.id === item.id 
          ? { ...emallItem, is_selected: !isSelected }
          : emallItem
      ));
      alert('操作失败，请重试');
    }
  }, [fetchEmallList]);

  // 过滤器处理
  const handleFilterChange = useCallback((key: keyof EmallFilterParams, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 1
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // 工具函数
  const utils = useMemo(() => emallUtils, []);

  return {
    emallItems,
    loading,
    error,
    totalCount,
    filters,
    setEmallItems,
    setLoading,
    setError,
    fetchEmallList,
    handleSelectProcurement,
    handleFilterChange,
    resetFilters,
    utils
  };
};
