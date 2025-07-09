import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { SensorData, SensorType } from '../../sharedTypes';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface LineChartProps {
  data: SensorData[];
  type: SensorType;
  height?: number;
  title?: string;
  timeRange?: '1h' | '6h' | '24h' | '7d';
}

const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  type, 
  height = 300, 
  title,
  timeRange = '24h'
}) => {
  // Veriyi işle ve formatla
  const processData = () => {
    if (!data || data.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    // Belirtilen sensör tipine göre filtrele
    const filteredData = data.filter(item => item.type === type);
    
    // Zaman aralığına göre filtrele
    const now = new Date();
    const timeRangeMs = {
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000
    };
    
    const filteredByTime = filteredData.filter(item => 
      new Date(item.timestamp).getTime() > now.getTime() - timeRangeMs[timeRange]
    );

    // Zaman sırasına göre sırala
    const sortedData = filteredByTime.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Cihazlara göre grupla
    const deviceGroups = sortedData.reduce((acc, item) => {
      if (!acc[item.deviceId]) {
        acc[item.deviceId] = [];
      }
      acc[item.deviceId].push(item);
      return acc;
    }, {} as Record<string, SensorData[]>);

    // Chart.js formatına dönüştür
    const labels = sortedData.map(item => {
      const date = new Date(item.timestamp);
      if (timeRange === '1h' || timeRange === '6h') {
        return date.toLocaleTimeString('tr-TR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      } else if (timeRange === '24h') {
        return date.toLocaleTimeString('tr-TR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      } else {
        return date.toLocaleDateString('tr-TR', { 
          day: '2-digit', 
          month: '2-digit' 
        });
      }
    });

    const colors = [
      '#3B82F6', // Blue
      '#10B981', // Green
      '#F59E0B', // Yellow
      '#EF4444', // Red
      '#8B5CF6', // Purple
      '#06B6D4', // Cyan
    ];

    const datasets = Object.entries(deviceGroups).map(([deviceId, deviceData], index) => ({
      label: `Cihaz ${deviceId}`,
      data: deviceData.map(item => item.value),
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length] + '20',
      tension: 0.4,
      fill: false,
      pointRadius: 3,
      pointHoverRadius: 6,
    }));

    return {
      labels: Array.from(new Set(labels)), // Duplicate'ları kaldır
      datasets
    };
  };

  const chartData = processData();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            const unit = data.find(d => d.type === type)?.unit || '';
            return `${label}: ${value} ${unit}`;
          }
        }
      },
      title: title ? {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold' as const
        }
      } : {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
          },
          maxTicksLimit: 10
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
          },
          callback: function(value: any) {
            const unit = data.find(d => d.type === type)?.unit || '';
            return `${value} ${unit}`;
          }
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    }
  };

  return (
    <div style={{ height }}>
      {chartData.datasets.length > 0 ? (
        <Line data={chartData} options={options} />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <div className="text-lg font-medium">Veri Yok</div>
            <div className="text-sm">Bu zaman aralığında {type.toLowerCase()} verisi bulunamadı</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LineChart; 