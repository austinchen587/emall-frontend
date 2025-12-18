// src/pages/profit/components/ProjectProfitTable.tsx
import React from 'react';
import { ProjectProfitStats } from '../../../services/types/profit';
import { formatCurrency, formatPercentage, getProfitColor, formatCycleDays } from '../utils';
import './ProjectProfitTable.css';

interface ProjectProfitTableProps {
  data: ProjectProfitStats[];
}

export const ProjectProfitTable: React.FC<ProjectProfitTableProps> = ({ data }) => {
  if (data.length === 0) {
    return <div className="no-data">该月份暂无项目数据</div>;
  }

  return (
    <div className="project-profit-table">
      <h3>项目利润明细</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>项目名称</th>
              <th>负责人</th>
              <th>预期总价</th>
              <th>响应总额</th>
              <th>结算金额</th>
              <th>采购金额</th>
              <th>项目利润</th>
              <th>利润率</th>
              <th>竞标周期</th>
              <th>结算周期</th>
            </tr>
          </thead>
          <tbody>
            {data.map((project, index) => (
              <tr key={index}>
                <td className="project-name" title={project.project_name}>
                  {project.project_name}
                </td>
                <td>{project.project_owner}</td>
                <td>{formatCurrency(project.expected_total_price)}</td>
                <td>{formatCurrency(project.response_total)}</td>
                <td>{formatCurrency(project.settlement_amount)}</td>
                <td>{formatCurrency(project.purchase_payment_amount)}</td>
                <td style={{ color: getProfitColor(project.project_profit), fontWeight: '600' }}>
                  {formatCurrency(project.project_profit)}
                </td>
                <td style={{ color: getProfitColor(project.project_profit_margin), fontWeight: '600' }}>
                  {formatPercentage(project.project_profit_margin)}
                </td>
                <td>{formatCycleDays(project.bid_cycle_days || 0)}</td>
                <td>{formatCycleDays(project.settlement_cycle_days || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
