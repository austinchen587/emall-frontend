// src/pages/Procurement/components/ProcurementTable/ProcurementTable.tsx
import React from 'react';
import FinalQuoteInput from '../FinalQuoteInput';
import { formatCurrency } from '../../utils/formatters';
import { calculateProfit, getProfitClass, formatProfit } from '../../utils/calculations';
import styles from './ProcurementTable.module.css';

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

  const renderSupplierCell = (stat: any) => {
    if (stat.supplier_name === '询价中') {
      return stat.supplier_name;
    }
    
    return (
      <div className={styles.supplierInfo}>
        <div className={styles.supplierName} title={stat.supplier_name}>
          {stat.supplier_name}
        </div>
        <div className={styles.supplierMeta}>
          <span title={stat.supplier_created_by || '未知'}>
            创建人: {stat.supplier_created_by || '未知'}
          </span>
          <span title={stat.supplier_updated_by || '未知'}>
            更新人: {stat.supplier_updated_by || '未知'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.procurementTableContainer}>
      <table className={styles.procurementTable}>
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
            <tr key={index} className={styles.tableRow}>
              <td className={styles.projectName} title={stat.project_name}>
                {stat.project_name}
              </td>
              <td className={styles.projectOwner} title={stat.project_owner}>
                {stat.project_owner}
              </td>
              <td className={styles.priceControl}>{formatCurrency(stat.total_price_control)}</td>
              <td>{renderSupplierCell(stat)}</td>
              {!hideFinancialColumns && (
                <td className={styles.totalQuote}>{formatCurrency(stat.total_quote)}</td>
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
                <td className={`${styles.profit} ${styles[getProfitClass(calculateProfit(stat, finalQuotes))]}`}>
                  {formatProfit(calculateProfit(stat, finalQuotes))}
                </td>
              )}
              <td className={styles.latestRemark} title={stat.latest_remark || '无备注'}>
                {stat.latest_remark || '无备注'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {stats.length === 0 && (
        <div className={styles.noData}>
          <p>暂无数据</p>
        </div>
      )}
    </div>
  );
};

export default ProcurementTable;
