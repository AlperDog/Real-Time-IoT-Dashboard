import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, AlertTriangle, Settings } from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline' | 'error' | 'maintenance';
  lastSeen: string;
  location: string;
}

const DeviceStatus: React.FC = () => {
  // Mock data
  const devices: Device[] = [
    {
      id: 'temp-001',
      name: 'Temperature Sensor 1',
      type: 'Temperature Sensor',
      status: 'online',
      lastSeen: '2 minutes ago',
      location: 'Room 101'
    },
    {
      id: 'hum-001',
      name: 'Humidity Sensor 1',
      type: 'Humidity Sensor',
      status: 'online',
      lastSeen: '1 minute ago',
      location: 'Room 101'
    },
    {
      id: 'motion-001',
      name: 'Motion Sensor 1',
      type: 'Motion Sensor',
      status: 'offline',
      lastSeen: '15 minutes ago',
      location: 'Room 102'
    },
    {
      id: 'light-001',
      name: 'Light Sensor 1',
      type: 'Light Sensor',
      status: 'error',
      lastSeen: '5 minutes ago',
      location: 'Room 103'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <Wifi className="w-4 h-4 text-green-600" />;
      case 'offline':
        return <WifiOff className="w-4 h-4 text-gray-400" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'maintenance':
        return <Settings className="w-4 h-4 text-yellow-600" />;
      default:
        return <WifiOff className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'online':
        return 'status-online';
      case 'offline':
        return 'status-offline';
      case 'error':
        return 'status-error';
      case 'maintenance':
        return 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs font-medium';
      default:
        return 'status-offline';
    }
  };

  return (
    <div className="space-y-3">
      {devices.map((device, index) => (
        <motion.div
          key={device.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {getStatusIcon(device.status)}
              <div>
                <h4 className="text-sm font-medium text-gray-900">{device.name}</h4>
                <p className="text-xs text-gray-500">{device.type}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-xs text-gray-500">{device.location}</p>
              <p className="text-xs text-gray-400">{device.lastSeen}</p>
            </div>
            <span className={getStatusClass(device.status)}>
              {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
            </span>
          </div>
        </motion.div>
      ))}
      
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Devices:</span>
          <span className="font-medium">{devices.length}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-gray-600">Online:</span>
          <span className="font-medium text-green-600">
            {devices.filter(d => d.status === 'online').length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DeviceStatus; 