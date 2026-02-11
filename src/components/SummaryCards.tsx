import React from 'react';
import { Package, XCircle, CheckCircle, TrendingDown } from 'lucide-react';

interface SummaryCardsProps {
  totalOrders: number;
  missCount: number;
  hitCount: number;
  missRate: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ totalOrders, missCount, hitCount, missRate }) => {
  return (
    <div className="grid-container">
      {/* Total Orders */}
      <div className="card summary-card blue">
        <div className="card-header">
          <div>
            <p className="metric-label">Total Orders</p>
            <h3 className="metric-value">{totalOrders.toLocaleString()}</h3>
            <p className="metric-sub">Orders evaluated</p>
          </div>
          <div className="icon-box blue">
            <Package size={24} />
          </div>
        </div>
      </div>

      {/* OTIF Miss */}
      <div className="card summary-card red">
        <div className="card-header">
          <div>
            <p className="metric-label">OTIF Miss</p>
            <h3 className="metric-value">{missCount.toLocaleString()}</h3>
            <p className="metric-sub">Predicted to miss delivery</p>
          </div>
          <div className="icon-box red">
            <XCircle size={24} />
          </div>
        </div>
      </div>

      {/* OTIF Hit */}
      <div className="card summary-card green">
        <div className="card-header">
          <div>
            <p className="metric-label">OTIF Hit</p>
            <h3 className="metric-value">{hitCount.toLocaleString()}</h3>
            <p className="metric-sub">Predicted on-time delivery</p>
          </div>
          <div className="icon-box green">
            <CheckCircle size={24} />
          </div>
        </div>
      </div>

      {/* Miss Rate */}
      <div className="card summary-card gray">
        <div className="card-header">
          <div>
            <p className="metric-label">Miss Rate</p>
            <h3 className="metric-value">{missRate.toFixed(1)}%</h3>
            <p className="metric-sub">Orders predicted to miss</p>
          </div>
          <div className="icon-box gray">
            <TrendingDown size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};
