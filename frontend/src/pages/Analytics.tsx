import React, { useEffect, useState } from 'react';
import { fetchSensorData } from '../services/api';
import LineChart from '../components/charts/LineChart';
import { SensorData, SensorType } from '../sharedTypes';

const periods = [
  { label: 'Son 24 Saat', value: '24h' },
  { label: 'Son 7 Gün', value: '7d' },
  { label: 'Son 30 Gün', value: '30d' },
];

const sensorTypes = [
  { label: 'Sıcaklık', value: SensorType.TEMPERATURE },
  { label: 'Nem', value: SensorType.HUMIDITY },
  { label: 'Işık', value: SensorType.LIGHT },
];

const Analytics: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('24h');
  const [sensorType, setSensorType] = useState<SensorType>(SensorType.TEMPERATURE);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchSensorData();
        setSensorData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [period]);

  const filteredData = sensorData.filter(d => d.type === sensorType);
  const chartData = {
    labels: filteredData.map(d => new Date(d.timestamp).toLocaleString()),
    datasets: [
      {
        label:
          sensorType === SensorType.TEMPERATURE
            ? 'Sıcaklık (°C)'
            : sensorType === SensorType.HUMIDITY
            ? 'Nem (%)'
            : 'Işık (lux)',
        data: filteredData.map(d => d.value),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
      },
    ],
  };

  // Temel istatistikler
  const values = filteredData.map(d => d.value);
  const min = values.length ? Math.min(...values) : null;
  const max = values.length ? Math.max(...values) : null;
  const avg = values.length ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2) : null;

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Deep insights into your IoT data</p>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex space-x-2">
            {periods.map(p => (
              <button
                key={p.value}
                className={`btn-secondary ${period === p.value ? 'bg-blue-100 text-blue-700' : ''}`}
                onClick={() => setPeriod(p.value)}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex space-x-2">
            {sensorTypes.map(s => (
              <button
                key={s.value}
                className={`btn-secondary ${sensorType === s.value ? 'bg-green-100 text-green-700' : ''}`}
                onClick={() => setSensorType(s.value)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading analytics...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No data found for selected sensor type.</div>
        ) : (
          <>
            <LineChart data={chartData} height={350} />
            <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-4 mt-6">
              <div className="bg-gray-100 rounded p-4 text-center">
                <div className="text-xs text-gray-500">Min</div>
                <div className="text-lg font-bold">{min !== null ? min : '-'}</div>
              </div>
              <div className="bg-gray-100 rounded p-4 text-center">
                <div className="text-xs text-gray-500">Max</div>
                <div className="text-lg font-bold">{max !== null ? max : '-'}</div>
              </div>
              <div className="bg-gray-100 rounded p-4 text-center">
                <div className="text-xs text-gray-500">Ortalama</div>
                <div className="text-lg font-bold">{avg !== null ? avg : '-'}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Analytics; 