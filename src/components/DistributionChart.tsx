import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DistributionChartProps {
  missCount: number;
  hitCount: number;
}

export const DistributionChart: React.FC<DistributionChartProps> = ({ missCount, hitCount }) => {
  const options = {
    indexAxis: 'y' as const,
    elements: {
      bar: {
        borderWidth: 0,
        borderRadius: 4,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: '#f1f5f9',
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
          },
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            weight: 600,
          },
          color: '#475569',
        },
      },
    },
  };

  const data = {
    labels: ['OTIF Miss', 'OTIF Hit'],
    datasets: [
      {
        label: 'Orders',
        data: [missCount, hitCount],
        backgroundColor: [
          '#ef4444', // Red for Miss
          '#10b981', // Green for Hit
        ],
        barThickness: 40,
      },
    ],
  };

  return (
    <div className="card">
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 className="section-title" style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>OTIF Distribution</h3>
        <p className="section-subtitle" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>Order volume by OTIF prediction</p>
      </div>
      <div className="chart-container">
        <Bar options={options} data={data} />
      </div>
    </div>
  );
};
