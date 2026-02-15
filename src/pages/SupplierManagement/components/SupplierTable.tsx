// src/pages/SupplierManagement/components/SupplierTable.tsx
import React, { useMemo } from 'react';
import { Supplier, supplierAPI } from '../../../services/api_supplier';
import './SupplierTable.css';

interface SupplierTableProps {
  suppliers: Supplier[];
  projectId: number;
  loading: boolean;
  onEditSupplier: (supplier: Supplier) => void;
  onRefresh: () => void;
  requirements?: Record<string, any>; // 从后端传来的需求清单 (Key 是 Brand ID)
}

// 辅助函数：把供应商列表 -> 转换为 -> 商品列表 (Key 是商品名)
const groupDataByProduct = (suppliers: Supplier[]) => {
  const productMap: Record<string, any[]> = {};
  
  if (!suppliers) return {};

  suppliers.forEach(supplier => {
    if (supplier.commodities) {
      supplier.commodities.forEach(comm => {
        const productName = (comm.name || '未命名商品').trim();
        if (!productMap[productName]) {
          productMap[productName] = [];
        }
        productMap[productName].push({
          ...comm,
          _supplierName: supplier.name,
          _supplierId: supplier.id,
          _supplierSource: supplier.source,
          _supplierSelected: supplier.is_selected,
          _supplierObj: supplier
        });
      });
    }
  });
  
  return productMap;
};

const SupplierTable: React.FC<SupplierTableProps> = ({
  suppliers,
  projectId,
  loading,
  onEditSupplier,
  onRefresh,
  requirements = {}
}) => {
  
  // 1. 先把现有的供应商数据按商品名分组
  const productGroups = useMemo(() => groupDataByProduct(suppliers), [suppliers]);

  // 2. [核心修复] 获取所有需要展示的“卡片”
  // 以需求清单(Requirements)为主，确保 5 个需求显示 5 个卡片
  const displayItems = useMemo(() => {
    const reqEntries = Object.entries(requirements); // [[id, info], ...]
    
    // 如果没有需求清单，才回退到显示所有供应商商品
    if (reqEntries.length === 0) {
        return Object.keys(productGroups).map(name => ({
            type: 'supply_only',
            id: name, // 用名字做临时ID
            name: name,
            reqInfo: {}
        }));
    }

    // 正常模式：遍历需求清单
    const list = reqEntries.map(([id, info]) => ({
        type: 'requirement',
        id: id,
        name: info.name,
        reqInfo: info
    }));

    // (可选) 检查是否有供应商提供了“需求清单之外”的商品
    // 这里为了界面整洁，暂时只显示匹配需求的商品，或者追加在后面
    const reqNames = new Set(reqEntries.map(e => e[1].name));
    Object.keys(productGroups).forEach(name => {
        if (!reqNames.has(name)) {
            list.push({
                type: 'extra',
                id: `extra-${name}`,
                name: name,
                reqInfo: { required_qty: 0, unit: '额外' }
            });
        }
    });

    return list;
  }, [requirements, productGroups]);

  const handleToggleSelection = async (supplierId: number, isSelected: boolean) => {
    try {
      await supplierAPI.toggleSupplierSelection(projectId, supplierId, !isSelected);
      onRefresh();
    } catch (error) {
      alert('操作失败');
    }
  };

  const handleDeleteSupplier = async (supplierId: number) => {
    if (!window.confirm('确定删除该供应商吗？')) return;
    try {
      await supplierAPI.deleteSupplier(projectId, supplierId);
      onRefresh();
    } catch (error) {
      alert('删除失败');
    }
  };

  if (loading) return <div className="table-loading">数据加载中...</div>;
  if (displayItems.length === 0) return <div className="empty-placeholder">暂无数据</div>;

  return (
    <div className="supplier-product-view">
      {displayItems.map((entry) => {
        const { id, name, reqInfo } = entry;
        const reqQty = reqInfo?.required_qty || 0;
        
        // 通过商品名 (name) 去查找供应商报价
        const items = productGroups[name] || [];

        return (
          <div key={id} className="product-card">
            {/* 头部：商品名称 + 需求概览 */}
            <div className="product-card-header">
              <div className="pc-title">
                <span className="icon">📦</span>
                <span className="name">{name}</span>
                {/* 如果是严格的 Brand ID 模式，这里可能显示规格区分同名商品 */}
                {reqInfo?.spec && <span className="spec-tag" title={reqInfo.spec}>{reqInfo.spec}</span>}
                {items.length === 0 && <span className="missing-tag">暂无报价</span>}
                {entry.type === 'extra' && <span className="extra-tag">额外商品</span>}
              </div>
              <div className="pc-meta">
                <span className="label">计划采购:</span>
                <span className="value-highlight">{reqQty > 0 ? reqQty : '-'}</span>
                <span className="unit">{reqInfo?.unit || ''}</span>
              </div>
            </div>

            {/* 表格：各供应商报价 */}
            <div className="table-wrapper">
              {items.length > 0 ? (
                <table className="simple-table">
                  <thead>
                    <tr>
                      <th style={{ width: '50px' }}>采纳</th>
                      <th style={{ width: '200px' }}>供应商 / 店铺</th>
                      <th style={{ width: '120px' }}>单价</th>
                      <th style={{ width: '100px' }}>数量</th>
                      <th style={{ width: '120px' }}>总价</th>
                      <th>链接/备注</th>
                      <th style={{ width: '80px' }}>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => {
                      // 数量检查
                      const isQtyWrong = reqQty > 0 && item.quantity !== reqQty;

                      return (
                        <tr key={`${item._supplierId}-${idx}`} className={item._supplierSelected ? 'tr-selected' : ''}>
                          <td className="text-center">
                            <input
                              type="checkbox"
                              className="big-checkbox"
                              checked={item._supplierSelected || false}
                              onChange={() => handleToggleSelection(item._supplierId, item._supplierSelected)}
                            />
                          </td>
                          <td>
                            <div className="supp-name">{item._supplierName}</div>
                            <div className="supp-tag">{item._supplierSource || '未知来源'}</div>
                          </td>
                          <td className="price-cell">
                            ¥{item.price}
                          </td>
                          <td>
                            <div className={isQtyWrong ? 'qty-mismatch' : 'qty-match'}>
                              {item.quantity}
                            </div>
                            {isQtyWrong && <div className="qty-alert">需 {reqQty}</div>}
                          </td>
                          <td className="total-cell">
                            ¥{(item.total_price || 0).toLocaleString()}
                          </td>
                          <td>
                            {item.product_url ? (
                              <a href={item.product_url} target="_blank" rel="noreferrer" className="link-text">
                                商品链接 ↗
                              </a>
                            ) : <span className="text-gray">-</span>}
                          </td>
                          <td>
                             <div className="action-row">
                               <button className="icon-btn edit" onClick={() => onEditSupplier(item._supplierObj)}>✎</button>
                               <button className="icon-btn del" onClick={() => handleDeleteSupplier(item._supplierId)}>🗑</button>
                             </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="no-supply-placeholder">
                  ⚠️ 该商品在清单中，但目前尚未录入任何供应商报价。
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SupplierTable;