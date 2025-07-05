import React from 'react';
import { motion } from 'framer-motion';
import { IoTDevice, DeviceStatus as DeviceStatusEnum } from '../sharedTypes';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

interface DeviceStatusProps {
  devices: IoTDevice[];
}

const DeviceStatus: React.FC<DeviceStatusProps> = ({ devices }) => {
  const getStatusIcon = (status: DeviceStatusEnum) => {
    switch (status) {
      case DeviceStatusEnum.ONLINE:
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case DeviceStatusEnum.OFFLINE:
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case DeviceStatusEnum.ERROR:
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case DeviceStatusEnum.MAINTENANCE:
        return <WrenchScrewdriverIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <XCircleIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: DeviceStatusEnum) => {
    switch (status) {
      case DeviceStatusEnum.ONLINE:
        return 'text-green-600 bg-green-100';
      case DeviceStatusEnum.OFFLINE:
        return 'text-red-600 bg-red-100';
      case DeviceStatusEnum.ERROR:
        return 'text-yellow-600 bg-yellow-100';
      case DeviceStatusEnum.MAINTENANCE:
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: DeviceStatusEnum) => {
    switch (status) {
      case DeviceStatusEnum.ONLINE:
        return 'Çevrimiçi';
      case DeviceStatusEnum.OFFLINE:
        return 'Çevrimdışı';
      case DeviceStatusEnum.ERROR:
        return 'Hata';
      case DeviceStatusEnum.MAINTENANCE:
        return 'Bakım';
      default:
        return 'Bilinmiyor';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Cihaz Durumu</h3>
      
      <div className="space-y-3">
        {devices.map((device, index) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              {getStatusIcon(device.status)}
              <div>
                <h4 className="font-medium text-gray-900">{device.name}</h4>
                <p className="text-sm text-gray-500">{device.location}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(device.status)}`}>
                {getStatusText(device.status)}
              </span>
              
              {device.batteryLevel !== undefined && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-300">
                    <div 
                      className="w-2 h-2 rounded-full bg-green-500 transition-all duration-300"
                      style={{ 
                        height: `${device.batteryLevel}%`,
                        opacity: device.batteryLevel > 20 ? 1 : 0.5
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{device.batteryLevel}%</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {devices.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Henüz cihaz bulunmuyor</p>
        </div>
      )}
    </div>
  );
};

export default DeviceStatus; 