import React, { useState, useEffect } from 'react';
import { Radio, Input, Select } from 'antd'; 
import { IFilterParams } from '@/services/types/bidding';

const { Search } = Input;
const { Option } = Select;

interface Props {
  filters: IFilterParams;
  onFilterChange: (key: keyof IFilterParams, val: string) => void;
}

export const FilterSection: React.FC<Props> = ({ filters, onFilterChange }) => {
  // [新增] 本地状态，用于实现防抖
  const [localOwner, setLocalOwner] = useState(filters.owner || '');

  // [新增] 当父组件重置筛选(filters.owner变空)时，同步清空本地输入框
  useEffect(() => {
    setLocalOwner(filters.owner || '');
  }, [filters.owner]);

  // [核心优化] 防抖逻辑：只有当 localOwner 变化且停止输入 1秒 后，才触发筛选
  useEffect(() => {
    // 设置定时器
    const timer = setTimeout(() => {
      // 只有当本地值和父组件值不一样时才更新，避免死循环或无效刷新
      if (localOwner !== (filters.owner || '')) {
        onFilterChange('owner', localOwner);
      }
    }, 1000); // [修改] 延迟 1000ms

    // 清理定时器（如果用户在 1000ms 内又打字了，上一个定时器会被取消）
    return () => clearTimeout(timer);
  }, [localOwner, filters.owner, onFilterChange]);

  const GOODS_CATS = [
    { label: '行政办公', value: 'office' }, { label: '清洁日化', value: 'cleaning' },
    { label: '数码家电', value: 'digital' }, { label: '体育器材', value: 'sports' },
    { label: '工业设备', value: 'industrial' }, { label: '食品饮品', value: 'food' },
    { label: '其他服务', value: 'service_other' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6 space-y-4">
      {/* 顶部综合搜索栏 */}
      <div className="flex flex-wrap items-center border-b border-gray-100 pb-4 mb-2 gap-4">
        {/* 关键词 (原本就是按回车或点击按钮触发，无需防抖) */}
        <div className="flex items-center min-w-[300px] flex-1">
          <span className="w-20 font-bold text-gray-500">项目搜索:</span>
          <Search
            placeholder="输入项目关键词..."
            allowClear
            enterButton="搜索"
            size="middle"
            onSearch={(value) => onFilterChange('search', value)}
          />
        </div>

        {/* 归属人 - 绑定本地状态 localOwner */}
        <div className="flex items-center">
          <span className="font-bold text-gray-500 mr-2">归属人:</span>
          <Input 
            placeholder="输入姓名" 
            style={{ width: 120 }} 
            allowClear
            value={localOwner} 
            onChange={(e) => setLocalOwner(e.target.value)} // 只更新本地显示
          />
        </div>

        {/* 状态筛选 (下拉框无需防抖，直接触发) */}
        <div className="flex items-center">
          <span className="font-bold text-gray-500 mr-2">状态:</span>
          <Select
            placeholder="选择状态"
            style={{ width: 120 }}
            allowClear
            value={filters.is_selected}
            onChange={(val) => onFilterChange('is_selected', val)}
          >
            <Option value="true">✅ 已选择</Option>
            <Option value="false">⬜ 未选择</Option>
          </Select>
        </div>
      </div>

      {/* 1. 一级分类 */}
      <div className="flex items-center">
        <span className="w-20 font-bold text-gray-500">采购类型:</span>
        <Radio.Group 
          value={filters.root} 
          onChange={e => onFilterChange('root', e.target.value)} 
          buttonStyle="solid"
        >
          <Radio.Button value="goods">物资类</Radio.Button>
          <Radio.Button value="service">服务类</Radio.Button>
          <Radio.Button value="project">工程类</Radio.Button>
        </Radio.Group>
      </div>

      {/* 2. 二级分类 (仅 Goods 显示) */}
      {filters.root === 'goods' && (
        <div className="flex items-center">
          <span className="w-20 font-bold text-gray-500">商品分类:</span>
          <div className="flex gap-2 flex-wrap">
            <FilterTag 
              active={!filters.sub} 
              label="全部" 
              onClick={() => onFilterChange('sub', '')} 
            />
            {GOODS_CATS.map(c => (
              <FilterTag
                key={c.value}
                active={filters.sub === c.value}
                label={c.label}
                onClick={() => onFilterChange('sub', c.value)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 内部微组件
const FilterTag = ({ active, label, onClick }: { active: boolean, label: string, onClick: () => void }) => (
  <span 
    onClick={onClick}
    className={`cursor-pointer px-3 py-1 rounded transition-colors ${
      active ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-500'
    }`}
  >
    {label}
  </span>
);