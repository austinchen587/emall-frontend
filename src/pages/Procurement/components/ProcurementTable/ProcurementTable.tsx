// src/pages/Procurement/components/ProcurementTable/ProcurementTable.tsx
import React from 'react';
import FinalQuoteInput from '../FinalQuoteInput';
import { formatCurrency } from '../../utils/formatters';
import { calculateProfit, getProfitClass, formatProfit } from '../../utils/calculations';
import './ProcurementTable.css';

interface ProcurementTableProps {
  stats: any[];
  sortConfig: any;
  finalQuotes: Record<string, number>;
  savingQuotes: Record<string, boolean>;
  isProcurementStaff: boolean;
  isSupervisor: boolean;
  canEditFinalQuote: boolean;
  onSort: (key: string) => void;
  onFinalQuoteChange: (projectName: string, value: string) => void;
}

const ProcurementTable: React.FC<ProcurementTableProps> = ({
  stats,
  sortConfig,
  finalQuotes,
  savingQuotes,
  isProcurementStaff,
  isSupervisor,
  canEditFinalQuote,
 onSort,
  onFinalQuoteChange
}) => {
  const handleSort = (key: string) => {
    onSort(key);
  };

  const hideFinancialColumns = isProcurementStaff || isSupervisor;

  return (
    <div className="procurement-table-container">
      <table className="procurement-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('project_name')}>
              项目名称 {sortConfig?.key === 'project_name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('project_owner')}>
              负责人 {sortConfig?.key === 'project_owner' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('total_price_control')}>
              控制价 {sortConfig?.key === 'total_price_control' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('supplier_name')}>
              供应商 {sortConfig?.key === 'supplier_name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            {!hideFinancialColumns && (
              <th onClick={() => handleSort('total_quote')}>
                采购成本 {sortConfig?.key === 'total_quote' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
            )}
            <th>最终报价</th>
            {!hideFinancialColumns && (
              <th onClick={() => handleSort('profit')}>
                利润 {sortConfig?.key === 'profit' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
            )}
            <th>最新备注</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat, index) => (
            <tr key={index} className="table-row">
              <td className="project-name">{stat.project_name}</td>
              <td className="project-owner">{stat.project_owner}</td>
              <td className="price-control">{formatCurrency(stat.total_price_control)}</td>
              <td>{stat.supplier_name}</td>
              {!hideFinancialColumns && (
                <td className="total-quote">{formatCurrency(stat.total_quote)}</td>
              )}
              <td>
                <FinalQuoteInput
                  projectName={stat.project_name}
                  value={finalQuotes[stat.project_name] || ''}
                  saving={savingQuotes[stat.project_name]}
                  canEdit={canEditFinalQuote}
                  onChange={onFinalQuoteChange}
                />
              </td>
              {!hideFinancialColumns && (
                <td className={`profit ${getProfitClass(calculateProfit(stat, finalQuotes))}`}>
                  {formatProfit(calculateProfit(stat, finalQuotes))}
                </td>
              )}
              <td className="latest-remark">{stat.latest_remark || '无备注'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {stats.length === 0 && (
        <div className="no-data">
          <p>暂无数据</p>
        </div>
      )}
    </div>
  );
};

export default ProcurementTable;
