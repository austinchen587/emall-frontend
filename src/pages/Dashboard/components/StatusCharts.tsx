// src/pages/Dashboard/components/StatusCharts.tsx
import React from 'react';
import { StatusStats } from '../../../services/types/dashboard';
import { STATUS_COLORS } from '../constants';
import { formatNumber } from '../utils';
import './StatusCharts.css';

interface StatusChartsProps {
  statusStats: StatusStats[];
  title: string;
  loading?: boolean;
}

export const StatusCharts: React.FC<StatusChartsProps> = ({ 
  statusStats, 
  title, 
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="status-charts">
        <h3 className="charts-title">{title}</h3>
        <div className="charts-loading">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="status-item loading">
              <div className="status-bar skeleton"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const total = statusStats.reduce((sum, stat) => sum + stat.total, 0);

  return (
    <div className="status-charts">
      <h3 className="charts-title">{title}</h3>
      <div className="charts-content">
        {statusStats.map(stat => {
          const percentage = total > 0 ? (stat.total / total) * 100 : 0;
          
          return (
            <div key={stat.status} className="status-item">
              <div className="status-header">
                <span className="status-name">{stat.status_display}</span>
                <span className="status-count">{formatNumber(stat.total)}</span>
              </div>
              <div className="status-bar-container">
                <div 
                  className="status-bar"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: STATUS_COLORS[stat.status as keyof typeof STATUS_COLORS] || '#6B7280'
                  }}
                ></div>
              </div>
              <div className="status-details">
                <span>今日: {stat.today}</span>
                <span>本周: {stat.week}</span>
                <span>本月: {stat.month}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
