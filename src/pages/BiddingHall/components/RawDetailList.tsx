import React from 'react';
import { Image, Typography, Tag, Table, Divider, Row, Col, Badge, Empty } from 'antd';
import { ShopOutlined, EnvironmentOutlined, ShoppingCartOutlined, ThunderboltOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface Props {
  data: any[]; 
}

const RawDetailList: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) {
    return <Empty description="暂无抓取到的商品详情原数据" className="py-20" />;
  }

  return (
    <div className="space-y-10 bg-gray-100 p-4 rounded-xl">
      {data.map((record, index) => {
        const item = record.raw_data?.item || {};
        const skus = item.skus?.sku || [];
        const props = item.props || [];
        const seller = item.seller_info || {};
        const descHtml = item.desc || "";

        return (
          <div key={record.id || index} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 text-left">
            <div className="bg-blue-600 px-6 py-2 flex justify-between items-center text-white">
              <span className="font-mono text-xs">记录 ID: {record.id} | 采集时间: {new Date(record.created_at).toLocaleString()}</span>
              <Tag color="orange" className="m-0 border-none">#{index + 1} 最新回采结果</Tag>
            </div>

            <div className="p-6">
              <Row gutter={32}>
                <Col xs={24} md={10}>
                  <div className="sticky top-4">
                    <Image
                      src={item.pic_url}
                      className="w-full rounded-lg border border-gray-100 shadow-sm"
                      fallback="https://os.alipayobjects.com/rmsportal/mqaQswcyDLcXyDK.png"
                    />
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                      {(item.item_imgs || []).map((img: any, i: number) => (
                        <Image 
                          key={i} 
                          src={img.url} 
                          width={60} 
                          height={60} 
                          className="rounded border object-cover cursor-pointer hover:border-blue-500" 
                        />
                      ))}
                    </div>
                  </div>
                </Col>

                <Col xs={24} md={14}>
                  <div className="space-y-4">
                    <div className="flex gap-2 items-center">
                      {item.tmall && <Tag color="red">天猫</Tag>}
                      <Title level={4} className="m-0 leading-tight">{item.title}</Title>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                      <div className="flex items-baseline gap-2">
                        <Text type="danger" className="text-sm font-bold">价格</Text>
                        <Text className="text-3xl font-bold text-red-600 font-mono">
                          <span className="text-lg">¥</span>{item.price}
                        </Text>
                        {item.orginal_price && (
                          <Text delete type="secondary" className="text-sm ml-2">¥{item.orginal_price}</Text>
                        )}
                      </div>
                      <div className="flex gap-6 mt-2 text-xs text-gray-500 border-t border-red-100 pt-2">
                        <span>月销量 <Text strong>{item.sales || 0}+</Text></span>
                        <span>发货地 <EnvironmentOutlined /> {item.location || '未知'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                      <div className="flex items-center gap-2">
                        <Badge dot status="success"><ShopOutlined className="text-xl text-blue-500" /></Badge>
                        <div>
                          <div className="font-bold text-sm">{item.nick || seller.shop_name || '官方推荐店铺'}</div>
                          <div className="text-[10px] text-gray-400">评分: {seller.item_score || '4.9'} | 服务: {seller.delivery_score || '4.9'}</div>
                        </div>
                      </div>
                      <a href={item.detail_url} target="_blank" rel="noreferrer" className="text-xs text-blue-500">进入店铺 {'>'}</a>
                    </div>

                    {skus.length > 0 && (
                      <div className="mt-4">
                        <div className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-1">
                          <ShoppingCartOutlined /> 规格选择 (SKU)
                        </div>
                        <div className="max-h-[200px] overflow-y-auto border border-gray-100 rounded-lg">
                          <Table 
                            dataSource={skus} 
                            pagination={false} 
                            size="small" 
                            rowKey={(record) => record.sku_id || Math.random().toString()}
                            className="text-[11px]"
                          >
                            <Table.Column 
                              title="规格名称" 
                              dataIndex="properties_name" 
                              key="properties_name" 
                              render={(text) => <Text className="text-[11px]">{text?.split(':').pop()}</Text>} 
                            />
                            <Table.Column 
                              title="单价" 
                              dataIndex="price" 
                              key="price" 
                              render={(p) => <Text strong className="text-red-500">¥{p}</Text>} 
                            />
                            <Table.Column title="库存" dataIndex="quantity" key="quantity" />
                          </Table>
                        </div>
                      </div>
                    )}
                  </div>
                </Col>
              </Row>

              {/* 🛠️ 这里通过 {"left" as any} 解决了 TS 报错 */}
              <Divider orientation={"left" as any} plain><Text type="secondary" className="text-xs font-bold uppercase">Product Specs / 商品参数</Text></Divider>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-8 px-4">
                {props.map((p: any, i: number) => (
                  <div key={i} className="flex border-b border-gray-50 pb-1">
                    <span className="text-gray-400 text-xs w-24 shrink-0">{p.name}:</span>
                    <span className="text-gray-700 text-xs truncate" title={p.value}>{p.value}</span>
                  </div>
                ))}
              </div>

              <Divider orientation={"left" as any} plain><Text type="secondary" className="text-xs font-bold uppercase">Description / 图文详情</Text></Divider>

              <div className="px-4 bg-gray-50 rounded-lg p-6 flex flex-col items-center">
                <div className="max-w-[750px] w-full detail-html-container bg-white shadow-sm overflow-hidden rounded shadow-inner">
                  {descHtml ? (
                    <div 
                      dangerouslySetInnerHTML={{ __html: descHtml.replace(/src="\/\//g, 'src="https://') }} 
                      className="w-full"
                    />
                  ) : (
                    <div className="flex flex-col gap-0">
                       {(item.desc_img || []).map((img: string, i: number) => (
                         <img key={i} src={img.startsWith('//') ? `https:${img}` : img} className="w-full block" alt="详情图" />
                       ))}
                    </div>
                  )}
                </div>
                
                <div className="mt-8 flex gap-8 text-gray-400 text-xs border-t border-gray-200 pt-6 w-full justify-center">
                  <span className="flex items-center gap-1"><SafetyCertificateOutlined className="text-green-500" /> 正品保证</span>
                  <span className="flex items-center gap-1"><ThunderboltOutlined className="text-orange-500" /> 极速发货</span>
                  <span className="flex items-center gap-1"><ShoppingCartOutlined className="text-blue-500" /> 七天无理由</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
      <style>{`
        .detail-html-container img {
          max-width: 100% !important;
          height: auto !important;
          display: block;
          margin: 0 auto;
        }
        .detail-html-container div, .detail-html-container p {
          width: auto !important;
          height: auto !important;
        }
      `}</style>
    </div>
  );
};

export default RawDetailList;