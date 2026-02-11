import React, { useState, useMemo } from 'react';
import { RefreshCcw } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { FileUpload } from './FileUpload';
import { SummaryCards } from './SummaryCards';
import { DistributionChart } from './DistributionChart';
import { OrderTable } from './OrderTable';
import type { OTIFData } from '../utils/csvParser';

export const Dashboard: React.FC = () => {
  const [orders, setOrders] = useState<OTIFData[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleString());

  const handleDataLoaded = (data: OTIFData[]) => {
    setOrders(data);
    setLastUpdated(new Date().toLocaleString());
  };

  const calculateMetrics = useMemo(() => {
    const totalOrders = orders.length;
    const missCount = orders.filter(o => o.OTIFStatus === 'Miss').length;
    const hitCount = orders.filter(o => o.OTIFStatus === 'Hit').length;
    const missRate = totalOrders > 0 ? (missCount / totalOrders) * 100 : 0;

    return { totalOrders, missCount, hitCount, missRate };
  }, [orders]);

  return (
    <div className="app-container">
      <Sidebar />
      
      <main className="main-content">
        <div className="dashboard-content">
          {/* Header */}
          <div className="dashboard-header">
            <div className="page-title">
              <h1>OTIF Risk Dashboard</h1>
              <p>Supply Chain Delivery Risk Intelligence</p>
            </div>
            <div className="header-actions">
              <span className="last-updated">Last updated: {lastUpdated}</span>
              <button 
                className="btn btn-outline"
                onClick={() => window.location.reload()}
              >
                <RefreshCcw size={16} />
                Refresh
              </button>
            </div>
          </div>

          {/* Main Content */}
          {orders.length === 0 ? (
            <div style={{ maxWidth: '600px', margin: '4rem auto' }}>
              <FileUpload onDataLoaded={handleDataLoaded} />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <SummaryCards 
                totalOrders={calculateMetrics.totalOrders}
                missCount={calculateMetrics.missCount}
                hitCount={calculateMetrics.hitCount}
                missRate={calculateMetrics.missRate}
              />
              
              <DistributionChart 
                missCount={calculateMetrics.missCount} 
                hitCount={calculateMetrics.hitCount} 
              />
              
              <OrderTable data={orders} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
