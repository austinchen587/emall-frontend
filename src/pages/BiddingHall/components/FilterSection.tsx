import React from 'react';
import { Radio, Input } from 'antd'; // 引入 Input
import { IFilterParams } from '@/services/types/bidding';

const { Search } = Input;

interface Props {
  filters: IFilterParams;
  onFilterChange: (key: keyof IFilterParams, val: string) => void;
}

export const FilterSection: React.FC<Props> = ({ filters, onFilterChange }) => {
  const GOODS_CATS = [
    { label: '行政办公', value: 'office' }, { label: '清洁日化', value: 'cleaning' },
    { label: '数码家电', value: 'digital' }, { label: '体育器材', value: 'sports' },
    { label: '工业设备', value: 'industrial' }, { label: '食品饮品', value: 'food' },
    { label: '其他服务', value: 'service_other' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6 space-y-4">
      {/* [新增] 顶部搜索栏 */}
      <div className="flex items-center border-b border-gray-100 pb-4 mb-2">
        <span className="w-20 font-bold text-gray-500">项目搜索:</span>
        <Search
          placeholder="输入项目关键词，例如：电脑、空调..."
          allowClear
          enterButton="搜索"
          size="middle"
          style={{ maxWidth: 400 }}
          onSearch={(value) => onFilterChange('search', value)}
        />
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