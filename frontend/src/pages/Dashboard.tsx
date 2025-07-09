import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  DeviceTabletIcon, 
  ExclamationTriangleIcon,
  PlayIcon,
  StopIcon,
  WifiIcon,
  NoSymbolIcon
} from '@heroicons/react/24/outline';
import { useSocket } from '../hooks/useSocket';
import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats, fetchDevices, fetchSensorData, fetchAlerts } from '../services/api';
import { SensorData, DashboardStats, Alert, IoTDevice } from '../sharedTypes';
import StatCard from '../components/StatCard';
import LineChart from '../components/charts/LineChart';
import GaugeChart from '../components/charts/GaugeChart';
import BarChart from '../components/charts/BarChart';
import DeviceStatus from '../components/DeviceStatus';
import AlertList from '../components/AlertList';
import { SensorType } from '../sharedTypes';

const Dashboard: React.FC = () => {
  const { 
    isConnected, 
    lastMessage, 
    requestTestData, 
    startSimulation, 
    stopSimulation 
  } = useSocket();
  
  const [realTimeData, setRealTimeData] = useState<SensorData[]>([]);
  const [isSimulationRunning, setIsSimulationRunning] = useState(true);

  // API verilerini çek
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
    refetchInterval: 30000, // 30 saniyede bir güncelle
  });

  const { data: devices } = useQuery<IoTDevice[]>({
    queryKey: ['devices'],
    queryFn: fetchDevices,
    refetchInterval: 60000, // 1 dakikada bir güncelle
  });

  const { data: sensorData } = useQuery<SensorData[]>({
    queryKey: ['sensor-data'],
    queryFn: fetchSensorData,
    refetchInterval: 10000, // 10 saniyede bir güncelle
  });

  const { data: alerts } = useQuery<Alert[]>({
    queryKey: ['alerts'],
    queryFn: fetchAlerts,
    refetchInterval: 15000, // 15 saniyede bir güncelle
  });

  // Gerçek zamanlı veri güncellemelerini dinle
  useEffect(() => {
    if (lastMessage?.type === 'sensor_data_update') {
      const newSensorData = lastMessage.data as SensorData;
      setRealTimeData(prev => {
        const filtered = prev.filter(data => data.deviceId !== newSensorData.deviceId);
        return [...filtered, newSensorData].slice(-50); // Son 50 veriyi tut
      });
    }
  }, [lastMessage]);

  // Simülasyon durumu güncellemesi
  useEffect(() => {
    if (lastMessage?.type === 'simulation_status') {
      setIsSimulationRunning(lastMessage.data.running);
    }
  }, [lastMessage]);

  const handleSimulationToggle = () => {
    if (isSimulationRunning) {
      stopSimulation();
    } else {
      startSimulation();
    }
  };

  const handleTestData = () => {
    requestTestData();
  };

  // Gerçek zamanlı veri ile statik veriyi birleştir
  const combinedSensorData = [...(sensorData || []), ...realTimeData];
  
  // Güvenlik kontrolü - devices ve alerts array olmalı
  const safeDevices = Array.isArray(devices) ? devices : [];
  const safeAlerts = Array.isArray(alerts) ? alerts : [];

  // Dashboard istatistikleri
  const dashboardStats = [
    {
      title: 'Toplam Cihaz',
      value: String(stats?.totalDevices || 0),
      change: '+2.5%',
      changeType: 'positive' as const,
      icon: DeviceTabletIcon,
      color: 'blue' as const,
    },
    {
      title: 'Aktif Sensörler',
      value: String(stats?.activeSensors || 0),
      change: '+1.2%',
      changeType: 'positive' as const,
      icon: ChartBarIcon,
      color: 'green' as const,
    },
    {
      title: 'Aktif Uyarılar',
      value: String(safeAlerts.length || 0),
      change: '-0.8%',
      changeType: 'negative' as const,
      icon: ExclamationTriangleIcon,
      color: 'red' as const,
    },
    {
      title: 'Bağlantı Durumu',
      value: isConnected ? 'Bağlı' : 'Bağlantı Yok',
      change: isConnected ? 'Aktif' : 'Kesik',
      changeType: isConnected ? 'positive' as const : 'negative' as const,
      icon: isConnected ? WifiIcon : NoSymbolIcon,
      color: isConnected ? 'green' as const : 'red' as const,
    },
  ];

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
      {/* Bağlantı Durumu ve Kontroller */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
            isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-sm font-medium">
              {isConnected ? 'Gerçek Zamanlı Bağlantı Aktif' : 'Bağlantı Kesik'}
            </span>
          </div>
          
          {isConnected && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Simülasyon:</span>
              <button
                onClick={handleSimulationToggle}
                className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  isSimulationRunning 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {isSimulationRunning ? (
                  <>
                    <StopIcon className="w-4 h-4" />
                    <span>Durdur</span>
                  </>
                ) : (
                  <>
                    <PlayIcon className="w-4 h-4" />
                    <span>Başlat</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleTestData}
          disabled={!isConnected}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Test Verisi Gönder
        </button>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Grafikler ve Cihaz Durumu */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sıcaklık Grafiği */}
        <motion.div
          className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Sıcaklık Trendi
            </h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200">
                1 Saat
              </button>
              <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                6 Saat
              </button>
              <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                24 Saat
              </button>
            </div>
          </div>
          <LineChart
            data={combinedSensorData}
            type={SensorType.TEMPERATURE}
            height={300}
            timeRange="24h"
          />
        </motion.div>

        {/* Nem ve Diğer Gauge'lar */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sensör Durumları
          </h3>
          <div className="space-y-6">
            {/* Nem Gauge */}
            <GaugeChart
              value={stats?.averageHumidity || 0}
              min={0}
              max={100}
              label="Ortalama Nem"
              unit="%"
              color="#3B82F6"
              showTrend={true}
              trendValue={stats?.averageHumidity ? stats.averageHumidity + 2.5 : 0}
              trendDirection="up"
              quality="good"
            />
            
            {/* Sıcaklık Gauge */}
            <GaugeChart
              value={stats?.averageTemperature || 0}
              min={-10}
              max={50}
              label="Ortalama Sıcaklık"
              unit="°C"
              color="#EF4444"
              showTrend={true}
              trendValue={stats?.averageTemperature ? stats.averageTemperature - 1.2 : 0}
              trendDirection="down"
              quality="excellent"
            />
          </div>
        </motion.div>
      </div>

      {/* Cihaz Durumu ve Uyarılar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <DeviceStatus devices={safeDevices} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <AlertList alerts={safeAlerts} />
        </motion.div>
      </div>

      {/* Ek Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Cihaz Durumu Dağılımı */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Cihaz Durumu Dağılımı
          </h3>
          <BarChart
            data={{
              labels: ['Online', 'Offline', 'Hata', 'Bakım'],
              datasets: [
                {
                  label: 'Cihaz Sayısı',
                  data: [
                    stats?.onlineDevices || 0,
                    stats?.offlineDevices || 0,
                    0, // Error devices
                    0  // Maintenance devices
                  ],
                  backgroundColor: [
                    '#10B981', // Green for online
                    '#6B7280', // Gray for offline
                    '#EF4444', // Red for error
                    '#F59E0B'  // Yellow for maintenance
                  ]
                }
              ]
            }}
            height={250}
          />
        </motion.div>

        {/* Sensör Veri Kalitesi */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sensör Veri Kalitesi
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <GaugeChart
              value={85}
              max={100}
              label="Sıcaklık Sensörleri"
              unit="%"
              color="#10B981"
              quality="excellent"
              size={100}
            />
            <GaugeChart
              value={72}
              max={100}
              label="Nem Sensörleri"
              unit="%"
              color="#3B82F6"
              quality="good"
              size={100}
            />
            <GaugeChart
              value={95}
              max={100}
              label="Basınç Sensörleri"
              unit="%"
              color="#8B5CF6"
              quality="excellent"
              size={100}
            />
            <GaugeChart
              value={68}
              max={100}
              label="Işık Sensörleri"
              unit="%"
              color="#F59E0B"
              quality="fair"
              size={100}
            />
          </div>
        </motion.div>
      </div>

      {/* Gerçek Zamanlı Veri Göstergesi */}
      {isConnected && realTimeData.length > 0 && (
        <motion.div
          className="mt-6 bg-white rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Son Gerçek Zamanlı Veriler
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {realTimeData.slice(-4).map((data) => (
              <div
                key={data.id}
                className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500"
              >
                <div className="text-sm text-gray-600">{data.deviceId}</div>
                <div className="text-lg font-semibold text-gray-900">
                  {data.value} {data.unit}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(data.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </main>
  );
};

export default Dashboard; 