import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpTrayIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { IoTDevice, DeviceStatus } from '../sharedTypes';

interface FirmwareInfo {
  deviceId: string;
  currentVersion: string;
  latestVersion: string;
  updateAvailable: boolean;
  lastUpdate: string;
  updateSize: string;
  changelog: string[];
}

interface FirmwareUpdate {
  deviceId: string;
  targetVersion: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  progress: number;
  estimatedTime: number;
  timestamp: string;
}

interface FirmwareManagerProps {
  device: IoTDevice;
  onUpdateStarted?: (deviceId: string, version: string) => void;
}

const FirmwareManager: React.FC<FirmwareManagerProps> = ({ device, onUpdateStarted }) => {
  const [firmwareInfo, setFirmwareInfo] = useState<FirmwareInfo | null>(null);
  const [currentUpdate, setCurrentUpdate] = useState<FirmwareUpdate | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock firmware info
  useEffect(() => {
    const mockFirmwareInfo: FirmwareInfo = {
      deviceId: device.id,
      currentVersion: '1.2.3',
      latestVersion: '1.3.0',
      updateAvailable: true,
      lastUpdate: '2024-01-01T00:00:00.000Z',
      updateSize: '2.5MB',
      changelog: [
        'Bug fixes and performance improvements',
        'New sensor calibration features',
        'Enhanced security protocols',
        'Improved battery optimization',
        'Better error handling'
      ]
    };
    setFirmwareInfo(mockFirmwareInfo);
  }, [device.id]);

  const handleFirmwareUpdate = async () => {
    if (!firmwareInfo) return;

    setIsLoading(true);
    onUpdateStarted?.(device.id, firmwareInfo.latestVersion);

    // Simulate firmware update
    const update: FirmwareUpdate = {
      deviceId: device.id,
      targetVersion: firmwareInfo.latestVersion,
      status: 'IN_PROGRESS',
      progress: 0,
      estimatedTime: 300,
      timestamp: new Date().toISOString()
    };

    setCurrentUpdate(update);

    // Simulate progress updates
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 10 + 5; // 5-15% progress
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
        
        setCurrentUpdate(prev => prev ? {
          ...prev,
          status: 'COMPLETED',
          progress: 100
        } : null);
        
        // Update firmware info
        setFirmwareInfo(prev => prev ? {
          ...prev,
          currentVersion: firmwareInfo.latestVersion,
          updateAvailable: false,
          lastUpdate: new Date().toISOString()
        } : null);
      } else {
        setCurrentUpdate(prev => prev ? {
          ...prev,
          progress: Math.round(progress)
        } : null);
      }
    }, 2000); // Update every 2 seconds

    setIsLoading(false);
  };

  const getUpdateStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600 bg-green-100';
      case 'IN_PROGRESS':
        return 'text-blue-600 bg-blue-100';
      case 'FAILED':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getUpdateStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'IN_PROGRESS':
        return <ClockIcon className="w-4 h-4 text-blue-500" />;
      case 'FAILED':
        return <XCircleIcon className="w-4 h-4 text-red-500" />;
      default:
        return <InformationCircleIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  if (!firmwareInfo) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Firmware Management</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            device.status === DeviceStatus.ONLINE ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <span className="text-sm text-gray-600">{device.name}</span>
        </div>
      </div>

      {/* Current Firmware Info */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Current Version</p>
            <p className="font-medium text-gray-900">{firmwareInfo.currentVersion}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Latest Version</p>
            <p className="font-medium text-gray-900">{firmwareInfo.latestVersion}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Update Size</p>
            <p className="font-medium text-gray-900">{firmwareInfo.updateSize}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Update</p>
            <p className="font-medium text-gray-900">
              {new Date(firmwareInfo.lastUpdate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {firmwareInfo.updateAvailable && (
          <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <ExclamationTriangleIcon className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-blue-800">
              New firmware version available
            </span>
          </div>
        )}
      </div>

      {/* Update Progress */}
      {currentUpdate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">
              Updating to {currentUpdate.targetVersion}
            </span>
            <div className="flex items-center space-x-2">
              {getUpdateStatusIcon(currentUpdate.status)}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUpdateStatusColor(currentUpdate.status)}`}>
                {currentUpdate.status}
              </span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${currentUpdate.progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>{currentUpdate.progress}% complete</span>
            <span>~{Math.max(0, Math.round((currentUpdate.estimatedTime * (100 - currentUpdate.progress)) / 100))}s remaining</span>
          </div>
        </motion.div>
      )}

      {/* Update Button */}
      {firmwareInfo.updateAvailable && !currentUpdate && (
        <button
          onClick={handleFirmwareUpdate}
          disabled={isLoading || device.status !== DeviceStatus.ONLINE}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowUpTrayIcon className="w-5 h-5" />
          <span>Update to {firmwareInfo.latestVersion}</span>
        </button>
      )}

      {/* Changelog */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">What's New in {firmwareInfo.latestVersion}</h4>
        <div className="space-y-2">
          {firmwareInfo.changelog.map((change, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-2"
            >
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-sm text-gray-600">{change}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Update History */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Update History</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div>
              <p className="text-sm font-medium text-gray-900">v1.2.3</p>
              <p className="text-xs text-gray-500">
                {new Date(firmwareInfo.lastUpdate).toLocaleDateString()}
              </p>
            </div>
            <CheckCircleIcon className="w-4 h-4 text-green-500" />
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div>
              <p className="text-sm font-medium text-gray-900">v1.2.0</p>
              <p className="text-xs text-gray-500">2023-12-15</p>
            </div>
            <CheckCircleIcon className="w-4 h-4 text-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirmwareManager; 