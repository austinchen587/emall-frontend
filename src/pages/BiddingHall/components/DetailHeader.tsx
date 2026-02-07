import React from 'react';
import { Button, Tag, Dropdown, MenuProps } from 'antd';
import { 
  ArrowLeftOutlined, ShoppingCartOutlined, UserOutlined, 
  CheckCircleOutlined, DownOutlined, LoadingOutlined 
} from '@ant-design/icons';
import { ExtendedProjectDetail } from '../types';
import { STATUS_OPTIONS, getStatusConfig } from '../constants';

interface DetailHeaderProps {
  data: ExtendedProjectDetail;
  transferring: boolean;
  statusUpdating: boolean;
  onBack: () => void;
  onToggleSelect: () => void;
  onStatusChange: MenuProps['onClick'];
}

const DetailHeader: React.FC<DetailHeaderProps> = ({
  data, transferring, statusUpdating, onBack, onToggleSelect, onStatusChange
}) => {
  const currentStatusConfig = getStatusConfig(data.bidding_status);

  const menuProps: MenuProps = {
    items: STATUS_OPTIONS.map(opt => ({
      key: opt.key,
      label: (
        <span>
          <Tag color={opt.color} className="mr-2">{opt.label}</Tag>
          {data?.bidding_status === opt.key && <CheckCircleOutlined className="text-blue-500" />}
        </span>
      )
    })),
    onClick: onStatusChange,
  };

  return (
    <div className="max-w-[1600px] mx-auto mb-4 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center gap-4">
        <Button icon={<ArrowLeftOutlined />} onClick={onBack}>返回</Button>
        <div>
          <h1 className="text-xl font-bold text-gray-800 m-0 truncate max-w-2xl">{data.title}</h1>
          <div className="text-gray-500 text-xs mt-1 flex gap-4 items-center">
            <span>编号: {data.requirements?.project_code}</span>
            <div className="flex items-center gap-2 ml-4 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
              <UserOutlined className="text-blue-500" />
              <span className="text-gray-600">归属人: <span className="font-medium text-gray-900">{data.project_owner}</span></span>
            </div>
            <Dropdown menu={menuProps} trigger={['click']} disabled={!data.is_selected}>
              <Tag 
                color={currentStatusConfig.color} 
                className={`cursor-pointer select-none transition-all hover:opacity-80 flex items-center gap-1 px-3 py-1 text-sm ${!data.is_selected ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {statusUpdating ? <LoadingOutlined /> : null}
                {data.bidding_status_display}
                <DownOutlined className="text-xs ml-1 opacity-60" />
              </Tag>
            </Dropdown>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right hidden md:block">
          <div className="text-xs text-gray-400">控制总价</div>
          <div className="text-2xl font-bold text-red-600 font-mono">{data.price_display}</div>
        </div>
        <Button 
          type={data.is_selected ? "default" : "primary"}
          size="large" 
          icon={data.is_selected ? <CheckCircleOutlined /> : <ShoppingCartOutlined />}
          loading={transferring}
          onClick={onToggleSelect}
          className={data.is_selected 
            ? "bg-green-50 text-green-600 border-green-200 hover:text-green-700 hover:border-green-300" 
            : "bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-200"
          }
        >
          {data.is_selected ? "已选择 (点击取消)" : "选择项目"}
        </Button>
      </div>
    </div>
  );
};

export default DetailHeader;