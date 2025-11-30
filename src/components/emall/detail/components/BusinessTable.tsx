// src/components/emall/detail/components/BusinessTable.tsx
import React from 'react';
import { EmallItem } from '../../../../services/types';
import { getSafeArray } from '../utils/dataHelpers';

interface BusinessTableProps {
  project: EmallItem;
}

const BusinessTable: React.FC<BusinessTableProps> = ({ project }) => {
  const businessItems = getSafeArray(project.business_items);
  const businessRequirements = getSafeArray(project.business_requirements);

  const maxRows = Math.max(businessItems.length, businessRequirements.length, 1);

  if (maxRows === 0 || (businessItems.length === 0 && businessRequirements.length === 0)) {
    return <div className="no-data">暂无商务要求</div>;
  }

  return (
    <div className="table-responsive">
      <table className="business-table">
        <thead>
          <tr>
            <th>商务项目</th>
            <th>商务要求</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: maxRows }).map((_, index) => (
            <tr key={index}>
              <td className="business-item-cell">{businessItems[index] || '-'}</td>
              <td className="business-requirement-cell">
                {businessRequirements[index] || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BusinessTable;
