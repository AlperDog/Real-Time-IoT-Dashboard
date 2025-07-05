import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Cpu, AlertTriangle, TrendingUp } from 'lucide-react';
import StatCard from '../components/StatCard';
import LineChart from '../components/charts/LineChart';
import GaugeChart from '../components/charts/GaugeChart';
import DeviceStatus from '../components/DeviceStatus';
import AlertList from '../components/AlertList';

const Dashboard: React.FC = () => {
  // Mock data for demonstration
  const stats = [
    {
      title: 'Total Devices',
      value: '24',
      change: '+2',
      changeType: 'positive' as const,
      icon: Cpu,
      color: 'blue' as const
    },
    {
      title: 'Online Devices',
      value: '22',
      change: '+1',
      changeType: 'positive' as const,
      icon: Activity,
      color: 'green' as const
    },
    {
      title: 'Active Alerts',
      value: '3',
      change: '-1',
      changeType: 'negative' as const,
      icon: AlertTriangle,
      color: 'red' as const
    },
    {
      title: 'Data Points',
      value: '1.2M',
      change: '+12%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'purple' as const
    }
  ];

  const chartData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: [22, 23, 25, 28, 26, 24],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      },
      {
        label: 'Humidity (%)',
        data: [45, 48, 52, 55, 50, 47],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Monitor your IoT devices in real-time</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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

      {/* Charts and Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sensor Data Overview</h3>
          <LineChart data={chartData} />
        </motion.div>

        {/* Gauge Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
          <GaugeChart value={85} max={100} label="Uptime %" />
        </motion.div>
      </div>

      {/* Device Status and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Status</h3>
          <DeviceStatus />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
          <AlertList />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 