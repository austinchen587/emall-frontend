// src/pages/SupplierManagement/components/SupplierTable.tsx
import React, { useState } from 'react';
import { Supplier } from '../../../services/api_supplier';
import { supplierAPI } from '../../../services/api_supplier';
import './SupplierTable.css';

interface SupplierTableProps {
  suppliers: Supplier[];
  projectId: number;
  loading: boolean;
  onEditSupplier: (supplier: Supplier) => void;
  onRefresh: () => void;
}

const SupplierTable: React.FC<SupplierTableProps> = ({
  suppliers,
  projectId,
  loading,
  onEditSupplier,
  onRefresh
}) => {
  const [expandedSupplier, setExpandedSupplier] = useState<number | null>(null);

  const handleToggleSelection = async (supplierId: number, isSelected: boolean) => {
    try {
      await supplierAPI.toggleSupplierSelection(projectId, supplierId, !isSelected);
      onRefresh();
    } catch (error) {
      console.error('切换选择状态失败:', error);
      alert('操作失败，请重试');
    }
  };

  const getSourceStyle = (source: string | null) => {
    if (source === '手动添加') {
      return { background: '#dbeafe', color: '#1e40af' }; 
    }
    if (source && source.includes('AI推荐')) {
      return { background: '#ede9fe', color: '#6d28d9' }; 
    }
    return { background: '#f0fdf4', color: '#166534' }; 
  };

  const handleDeleteSupplier = async (supplierId: number) => {
    if (!confirm('确定要删除这个供应商吗？')) return;
    try {
      await supplierAPI.deleteSupplier(projectId, supplierId);
      onRefresh();
    } catch (error) {
      console.error('删除供应商失败:', error);
      alert('删除失败，请重试');
    }
  };

  const toggleSupplierDetails = (supplierId: number) => {
    setExpandedSupplier(expandedSupplier === supplierId ? null : supplierId);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '未知';
    try {
      return new Date(dateString).toLocaleString('zh-CN');
    } catch (error) {
      return '日期格式错误';
    }
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  if (loading) {
    return <div className="loading"><div>加载供应商数据...</div></div>;
  }

  if (suppliers.length === 0) {
    return <div className="no-suppliers">暂无供应商数据</div>;
  }

  return (
    <div className="supplier-table">
      <table>
        <thead>
          <tr>
            <th style={{ width: '40px' }}></th>
            <th style={{ width: '50px' }}>选择</th>
            <th style={{ width: '180px' }}>供应商名称</th>
            <th style={{ width: '250px' }}>供应商品详情</th> {/* 新增列 */}
            <th>来源</th>
            <th>店铺名称</th>
            <th>总报价</th>
            <th>创建人</th>
            <th style={{ width: '140px' }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map(supplier => (
            <React.Fragment key={supplier.id}>
              <tr className={supplier.is_selected ? 'selected' : ''}>
                <td>
                  <button 
                    className="expand-btn"
                    onClick={() => toggleSupplierDetails(supplier.id)}
                    title={expandedSupplier === supplier.id ? '收起详情' : '展开详情'}
                  >
                    {expandedSupplier === supplier.id ? '−' : '+'}
                  </button>
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={supplier.is_selected}
                    onChange={() => handleToggleSelection(supplier.id, supplier.is_selected)}
                    title={supplier.is_selected ? '取消选择' : '选择供应商'}
                  />
                </td>
                <td style={{ fontWeight: '600', color: '#1f2937' }}>{supplier.name}</td>
                
                {/* [新增] 显示具体的商品信息 */}
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {supplier.commodities && supplier.commodities.length > 0 ? (
                      supplier.commodities.map((item, idx) => (
                        <div key={idx} style={{ fontSize: '12px', color: '#4b5563', borderBottom: '1px dashed #e5e7eb', paddingBottom: '2px' }}>
                          <span style={{ fontWeight: 500 }}>{item.name}</span>
                          <span style={{ marginLeft: '8px', color: '#dc2626' }}>¥{item.price}</span>
                          <span style={{ marginLeft: '8px', color: '#6b7280' }}>x{item.quantity}</span>
                        </div>
                      ))
                    ) : (
                      <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>无商品信息</span>
                    )}
                  </div>
                </td>

                <td>
                  <span style={{
                    ...getSourceStyle(supplier.source),
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {supplier.source || '-'}
                  </span>
                </td>
                <td>{supplier.store_name || '-'}</td>
                <td style={{ fontWeight: '600', color: '#dc2626' }}>
                  ¥{supplier.total_quote.toLocaleString()}
                </td>
                <td>
                  <div className="creator-cell">
                    <div className="creator-avatar" title={supplier.purchaser_created_by || '未知'}>
                      {getInitials(supplier.purchaser_created_by || '未知')}
                    </div>
                    <span>{supplier.purchaser_created_by || '未知'}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button 
                      className="btn-edit"
                      onClick={() => onEditSupplier(supplier)}
                      title="编辑"
                    >
                      编辑
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDeleteSupplier(supplier.id)}
                      title="删除"
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
              
              {/* 审计信息 */}
              {expandedSupplier === supplier.id && (
                <tr className="audit-info-row">
                  <td colSpan={9}>
                    <div className="audit-info">
                      <h4>审计信息</h4>
                      <div className="audit-details">
                        <div className="audit-section">
                          <strong>供应商信息:</strong>
                          <div>创建人: {supplier.purchaser_created_by || '未知'}</div>
                          <div>创建时间: {formatDate(supplier.purchaser_created_at)}</div>
                        </div>
                        <div className="audit-section">
                          <strong>联系方式:</strong>
                          <div>{supplier.contact || '暂无'}</div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierTable;