import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchAnalytics, fetchSensorData } from '../services/api';
import { SensorData, SensorType, AnalyticsData } from '../sharedTypes';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';
import GaugeChart from '../components/charts/GaugeChart';

const Analytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'1h' | '6h' | '24h' | '7d'>('24h');
  const [selectedSensorType, setSelectedSensorType] = useState<SensorType>(SensorType.TEMPERATURE);

  const { data: analytics } = useQuery<AnalyticsData>({
    queryKey: ['analytics', selectedPeriod],
    queryFn: () => fetchAnalytics(selectedPeriod),
    refetchInterval: 30000,
    initialData: {
      period: selectedPeriod,
      temperature: {
        min: 18,
        max: 28,
        average: 23.5,
        data: []
      },
      humidity: {
        min: 40,
        max: 70,
        average: 55.2,
        data: []
      },
      alerts: {
        total: 5,
        bySeverity: {
          low: 2,
          medium: 2,
          high: 1,
          critical: 0
        },
        byDevice: {}
      },
      devices: {
        total: 10,
        byStatus: {
          online: 8,
          offline: 2,
          error: 0,
          maintenance: 0
        },
        byType: {}
      }
    }
  });

  const { data: sensorData } = useQuery<SensorData[]>({
    queryKey: ['sensor-data'],
    queryFn: fetchSensorData,
    refetchInterval: 10000,
  });

  const periods = [
    { value: '1h', label: '1 Saat' },
    { value: '6h', label: '6 Saat' },
    { value: '24h', label: '24 Saat' },
    { value: '7d', label: '7 Gün' },
  ];

  const sensorTypes = [
    { value: SensorType.TEMPERATURE, label: 'Sıcaklık' },
    { value: SensorType.HUMIDITY, label: 'Nem' },
    { value: SensorType.PRESSURE, label: 'Basınç' },
    { value: SensorType.LIGHT, label: 'Işık' },
  ];

  return (
    <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
      {/* Başlık ve Filtreler */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Analitik Dashboard</h1>
        
        <div className="flex flex-wrap gap-4">
          {/* Zaman Aralığı Filtresi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zaman Aralığı
            </label>
            <div className="flex space-x-2">
              {periods.map((period) => (
                <button
                  key={period.value}
                  onClick={() => setSelectedPeriod(period.value as any)}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    selectedPeriod === period.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sensör Tipi Filtresi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sensör Tipi
            </label>
            <div className="flex space-x-2">
              {sensorTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedSensorType(type.value)}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    selectedSensorType === type.value
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ana Grafik */}
      <motion.div
        className="bg-white rounded-xl shadow-sm p-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {sensorTypes.find(t => t.value === selectedSensorType)?.label} Trendi
        </h2>
        <LineChart
          data={sensorData || []}
          type={selectedSensorType}
          height={400}
          timeRange={selectedPeriod}
        />
      </motion.div>

      {/* İstatistikler Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-sm font-medium text-gray-500 mb-2">Ortalama Değer</h3>
          <div className="text-2xl font-bold text-gray-900">
            {analytics?.temperature?.average?.toFixed(1) || '0'}°C
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-sm font-medium text-gray-500 mb-2">Maksimum Değer</h3>
          <div className="text-2xl font-bold text-red-600">
            {analytics?.temperature?.max?.toFixed(1) || '0'}°C
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-medium text-gray-500 mb-2">Minimum Değer</h3>
          <div className="text-2xl font-bold text-blue-600">
            {analytics?.temperature?.min?.toFixed(1) || '0'}°C
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-sm font-medium text-gray-500 mb-2">Veri Noktası</h3>
          <div className="text-2xl font-bold text-gray-900">
            {analytics?.temperature?.data?.length || 0}
          </div>
        </motion.div>
      </div>

      {/* Alt Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Uyarı Dağılımı */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Uyarı Dağılımı (Son {selectedPeriod})
          </h3>
          <BarChart
            data={{
              labels: ['Düşük', 'Orta', 'Yüksek', 'Kritik'],
              datasets: [
                {
                  label: 'Uyarı Sayısı',
                  data: [
                    analytics?.alerts?.bySeverity?.low || 0,
                    analytics?.alerts?.bySeverity?.medium || 0,
                    analytics?.alerts?.bySeverity?.high || 0,
                    analytics?.alerts?.bySeverity?.critical || 0,
                  ],
                  backgroundColor: [
                    '#10B981', // Green
                    '#F59E0B', // Yellow
                    '#F97316', // Orange
                    '#EF4444', // Red
                  ]
                }
              ]
            }}
            height={250}
          />
        </motion.div>

        {/* Cihaz Performansı */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Cihaz Performansı
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <GaugeChart
              value={analytics?.devices?.total ? (analytics.devices.byStatus?.online || 0) / analytics.devices.total * 100 : 0}
              max={100}
              label="Online Oranı"
              unit="%"
              color="#10B981"
              quality="excellent"
              size={100}
            />
            <GaugeChart
              value={analytics?.devices?.total ? (analytics.devices.byStatus?.offline || 0) / analytics.devices.total * 100 : 0}
              max={100}
              label="Offline Oranı"
              unit="%"
              color="#6B7280"
              quality="poor"
              size={100}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics; 