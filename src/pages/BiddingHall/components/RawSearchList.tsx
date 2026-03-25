import React from 'react';
import { Card, Image, Typography, List, Empty, Space, Tag } from 'antd'; // 👈 加回了 Tag
import { ShopOutlined, ExportOutlined } from '@ant-design/icons'; 

const { Text, Paragraph, Link } = Typography;

interface RawSearchItem {
  id?: number;
  title?: string;
  item_title?: string;
  name?: string;
  price?: number | string;
  view_price?: number | string;
  orginal_price?: number | string;
  promotion_price?: number | string;
  pic_url?: string;
  img_url?: string;
  pic_path?: string;
  detail_url?: string;
  item_url?: string;
  url?: string;
  num_iid?: string | number;
  item_id?: string | number;
  nick?: string;
  shop_name?: string;
  seller_nick?: string;
  vendor?: string;
  shop_title?: string;
  [key: string]: any;
}

interface Props {
  data: RawSearchItem[];
  platform?: string;
}

const RawSearchList: React.FC<Props> = ({ data, platform }) => {
  if (!data || data.length === 0) {
    return <Empty description="数据库中暂无该记录的回采搜索数据" className="py-10" />;
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <List
        grid={{ gutter: 16, column: 3, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }}
        dataSource={data}
        renderItem={(rawItem) => {
          const item = {
            title: rawItem.title || rawItem.item_title || rawItem.name || "无标题商品",
            price: rawItem.promotion_price || rawItem.price || rawItem.view_price || 0,
            originalPrice: rawItem.orginal_price || rawItem.price || 0,
            picUrl: rawItem.pic_url || rawItem.img_url || rawItem.pic_path,
            detailUrl: rawItem.detail_url || rawItem.item_url || rawItem.url,
            shopName: rawItem.shop_name || rawItem.nick || rawItem.seller_nick || rawItem.vendor || rawItem.shop_title || "点击详情查看商家",
            numIid: rawItem.num_iid || rawItem.item_id || rawItem.id
          };

          const renderPrice = (val: any) => {
            const num = parseFloat(String(val || 0));
            return num.toFixed(2);
          };

          return (
            <List.Item>
              <Card
                hoverable
                className="rounded-lg overflow-hidden border-gray-200 shadow-sm"
                cover={
                  <div className="aspect-square flex items-center justify-center bg-white relative overflow-hidden">
                    <Image
                      alt={item.title}
                      src={item.picUrl}
                      preview={true}
                      className="object-contain w-full h-full transition-transform duration-300 hover:scale-110"
                      fallback="https://os.alipayobjects.com/rmsportal/mqaQswcyDLcXyDK.png"
                    />
                    {item.numIid && (
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/40 text-white text-[10px] rounded">
                        ID: {item.numIid}
                      </div>
                    )}
                  </div>
                }
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-2">
                    <Text className="text-xl font-bold text-red-600 font-mono">
                      <span className="text-sm">¥</span>{renderPrice(item.price)}
                    </Text>
                    {(item.originalPrice !== item.price) && (
                      <Text delete type="secondary" className="text-xs">
                        ¥{renderPrice(item.originalPrice)}
                      </Text>
                    )}
                  </div>

                  <Paragraph 
                    ellipsis={{ rows: 2 }} 
                    className="text-sm font-medium h-10 mb-1 leading-tight text-gray-800"
                    title={item.title}
                  >
                    {item.title}
                  </Paragraph>

                  <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-left">
                    <Space size={4} className="max-w-[65%]">
                      {/* 🌟 修复：用回了 platform 变量，展示一个小小的蓝色来源标签 */}
                      <Tag color="blue" className="m-0 text-[10px] px-1 leading-tight border-transparent">
                        {platform || '来源'}
                      </Tag>
                      <Text type="secondary" className="text-[11px] truncate" title={item.shopName}>
                        <ShopOutlined className="mr-1" />{item.shopName}
                      </Text>
                    </Space>
                    
                    <Link 
                      href={item.detailUrl} 
                      target="_blank" 
                      className="text-[11px] flex items-center gap-0.5 text-blue-500 whitespace-nowrap"
                    >
                      详情 <ExportOutlined /> 
                    </Link>
                  </div>
                </div>
              </Card>
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default RawSearchList;