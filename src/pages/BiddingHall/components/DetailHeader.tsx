import React from 'react';
import { Button, Tag, Dropdown, MenuProps, Tooltip } from 'antd';
import { 
  ArrowLeftOutlined, ShoppingCartOutlined, UserOutlined, 
  CheckCircleOutlined, DownOutlined, LoadingOutlined,
  FileTextOutlined, InfoCircleOutlined 
} from '@ant-design/icons';
import { ExtendedProjectDetail } from '../types';
import { STATUS_OPTIONS, getStatusConfig } from '../constants';

interface DetailHeaderProps {
  data: ExtendedProjectDetail;
  transferring: boolean;
  statusUpdating: boolean;
  latestRemark?: any; // 最新备注数据
  onBack: () => void;
  onToggleSelect: () => void;
  onStatusChange: MenuProps['onClick'];
  onAddRemark: () => void;
}

const DetailHeader: React.FC<DetailHeaderProps> = ({
  data, transferring, statusUpdating, latestRemark,
  onBack, onToggleSelect, onStatusChange, onAddRemark
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
        
        {/* 左侧信息区域 */}
        <div className="flex flex-col">
          {/* 1. 标题行 */}
          <h1 className="text-xl font-bold text-gray-800 m-0 truncate max-w-2xl">{data.title}</h1>
          
          {/* 2. 基础信息行 (编号、归属人、状态) */}
          <div className="text-gray-500 text-xs mt-2 flex gap-4 items-center">
            <span>编号: {data.requirements?.project_code}</span>
            
            <div className="flex items-center gap-2 ml-2 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
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

          {/* 3. [新增/修改] 最新备注行 (显示在下方) */}
          {latestRemark && (
            <div className="mt-2 flex items-center gap-2 text-xs bg-orange-50 px-3 py-1.5 rounded border border-orange-100 max-w-3xl animate-fadeIn">
              <InfoCircleOutlined className="text-orange-500 flex-shrink-0" />
              <span className="font-bold text-orange-700 flex-shrink-0">最新备注:</span>
              
              {/* 备注内容 */}
              <span className="text-gray-700 truncate max-w-lg font-medium" title={latestRemark.remark_content}>
                {latestRemark.remark_content}
              </span>
              
              {/* 分割线 */}
              <span className="w-px h-3 bg-orange-200 mx-1"></span>
              
              {/* 添加人与时间 */}
              <span className="text-gray-500 flex-shrink-0">
                <span className="text-blue-600 mr-1">{latestRemark.created_by}</span>
                <span className="text-gray-400">({latestRemark.created_at_display || latestRemark.created_at})</span>
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* 右侧按钮区域 */}
      <div className="flex items-center gap-4">
        <div className="text-right hidden md:block">
          <div className="text-xs text-gray-400">控制总价</div>
          <div className="text-2xl font-bold text-red-600 font-mono">{data.price_display}</div>
        </div>

        <Tooltip title="添加项目备注信息">
          <Button 
            icon={<FileTextOutlined />} 
            onClick={onAddRemark}
            className="border-gray-300 text-gray-600 hover:text-blue-600 hover:border-blue-600"
          >
            备注
          </Button>
        </Tooltip>

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