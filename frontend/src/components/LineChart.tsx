import React from 'react';
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface SensorDataPoint {
  timestamp: string | Date;
  value: number;
}

interface LineChartProps {
  data: SensorDataPoint[];
  height?: number;
}

const LineChart: React.FC<LineChartProps> = ({ data, height = 300 }) => {
  // Zamanı okunabilir formata çevir
  const chartData = data.map(d => ({
    ...d,
    time: typeof d.timestamp === 'string' ? new Date(d.timestamp).toLocaleTimeString() : d.timestamp.toLocaleTimeString()
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReLineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} domain={['auto', 'auto']} />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
      </ReLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart; 