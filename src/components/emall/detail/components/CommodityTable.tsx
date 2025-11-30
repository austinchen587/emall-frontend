// src/components/emall/detail/components/CommodityTable.tsx
import React from 'react';
import { EmallItem } from '../../../../services/types';
import { getSafeArray } from '../utils/dataHelpers';
import { formatCurrency } from '../utils/formatters';

interface CommodityTableProps {
  project: EmallItem;
}

const CommodityTable: React.FC<CommodityTableProps> = ({ project }) => {
  const commodityNames = getSafeArray(project.commodity_names);
  const parameterRequirements = getSafeArray(project.parameter_requirements);
  const purchaseQuantities = getSafeArray(project.purchase_quantities);
  const controlAmounts = getSafeArray(project.control_amounts);
  const suggestedBrands = getSafeArray(project.suggested_brands);

  const maxRows = Math.max(
    commodityNames.length,
    parameterRequirements.length,
    purchaseQuantities.length,
    controlAmounts.length,
    suggestedBrands.length,
    1
  );

  if (maxRows === 0 || (commodityNames.length === 0 && parameterRequirements.length === 0)) {
    return <div className="no-data">暂无商品信息</div>;
  }

  return (
    <div className="table-responsive">
      <table className="commodity-table">
        <thead>
          <tr>
            <th>商品名称</th>
            <th>参数要求</th>
            <th>购买数量</th>
            <th>控制金额</th>
            <th>建议品牌</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: maxRows }).map((_, index) => (
            <tr key={index}>
              <td>{commodityNames[index] || '-'}</td>
              <td className="parameter-cell">
                {parameterRequirements[index] || '-'}
              </td>
              <td>{purchaseQuantities[index] || '-'}</td>
              <td>
                {controlAmounts[index] ? 
                  (typeof controlAmounts[index] === 'number' ? 
                    formatCurrency(controlAmounts[index]) : 
                    `¥${controlAmounts[index]}`) 
                  : '-'}
              </td>
              <td>{suggestedBrands[index] || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommodityTable;
