// src/pages/Dashboard/components/StatsCards.tsx
import React from 'react';
import { DashboardStats } from '../../../services/types/dashboard';
import { STATS_CARDS } from '../constants';
import { formatNumber } from '../utils';
import './StatsCards.css';

interface StatsCardsProps {
  stats: DashboardStats;
  loading?: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, loading = false }) => {
  if (loading) {
    return (
      <div className="stats-cards">
        {STATS_CARDS.map(card => (
          <div key={card.key} className="stats-card loading">
            <div className="stats-icon">{card.icon}</div>
            <div className="stats-content">
              <div className="stats-value skeleton"></div>
              <div className="stats-label skeleton"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="stats-cards">
      {STATS_CARDS.map(card => (
        <div key={card.key} className={`stats-card ${card.color}`}>
          <div className="stats-icon">{card.icon}</div>
          <div className="stats-content">
            <div className="stats-value">{formatNumber(stats[card.key])}</div>
            <div className="stats-label">{card.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
