import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PlayIcon, 
  StopIcon, 
  CogIcon, 
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { IoTDevice, DeviceStatus } from '../sharedTypes';

interface DeviceControlProps {
  device: IoTDevice;
  onCommandSent?: (command: string, deviceId: string) => void;
}

const DeviceControl: React.FC<DeviceControlProps> = ({ device, onCommandSent }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [commandHistory, setCommandHistory] = useState<any[]>([]);

  const handleCommand = async (command: string, parameters?: any) => {
    setIsLoading(true);
    setLastCommand(command);

    try {
      // Simulate command execution
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const commandResult = {
        id: `cmd-${Date.now()}`,
        deviceId: device.id,
        command,
        parameters,
        status: Math.random() > 0.1 ? 'SUCCESS' : 'FAILED',
        response: Math.random() > 0.1 ? 'Command executed successfully' : 'Device not responding',
        timestamp: new Date().toISOString(),
        executionTime: Math.random() * 1000 + 100
      };

      setCommandHistory(prev => [commandResult, ...prev.slice(0, 9)]); // Keep last 10 commands
      onCommandSent?.(command, device.id);

    } catch (error) {
      console.error('Command execution failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCommandIcon = (command: string) => {
    switch (command) {
      case 'RESTART':
        return <ArrowPathIcon className="w-4 h-4" />;
      case 'CALIBRATE':
        return <CogIcon className="w-4 h-4" />;
      case 'GET_STATUS':
        return <CheckCircleIcon className="w-4 h-4" />;
      default:
        return <PlayIcon className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'text-green-600 bg-green-100';
      case 'FAILED':
        return 'text-red-600 bg-red-100';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Device Control</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            device.status === DeviceStatus.ONLINE ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <span className="text-sm text-gray-600">{device.name}</span>
        </div>
      </div>

      {/* Quick Commands */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => handleCommand('RESTART')}
          disabled={isLoading || device.status !== DeviceStatus.ONLINE}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowPathIcon className="w-4 h-4" />
          <span>Restart</span>
        </button>

        <button
          onClick={() => handleCommand('CALIBRATE')}
          disabled={isLoading || device.status !== DeviceStatus.ONLINE}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <CogIcon className="w-4 h-4" />
          <span>Calibrate</span>
        </button>

        <button
          onClick={() => handleCommand('GET_STATUS')}
          disabled={isLoading}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <CheckCircleIcon className="w-4 h-4" />
          <span>Status</span>
        </button>

        <button
          onClick={() => handleCommand('EMERGENCY_STOP')}
          disabled={isLoading}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <StopIcon className="w-4 h-4" />
          <span>Emergency Stop</span>
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center space-x-2 py-4 text-blue-600"
        >
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span>Executing command: {lastCommand}</span>
        </motion.div>
      )}

      {/* Command History */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Commands</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {commandHistory.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <ClockIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No commands executed yet</p>
            </div>
          ) : (
            commandHistory.map((cmd) => (
              <motion.div
                key={cmd.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getCommandIcon(cmd.command)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{cmd.command}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(cmd.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(cmd.status)}`}>
                    {cmd.status}
                  </span>
                  {cmd.status === 'SUCCESS' ? (
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  ) : cmd.status === 'FAILED' ? (
                    <XCircleIcon className="w-4 h-4 text-red-500" />
                  ) : (
                    <ClockIcon className="w-4 h-4 text-yellow-500" />
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Device Info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Device Information</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Type</p>
            <p className="font-medium">{device.type}</p>
          </div>
          <div>
            <p className="text-gray-500">Location</p>
            <p className="font-medium">{device.location}</p>
          </div>
          <div>
            <p className="text-gray-500">Battery</p>
            <p className="font-medium">{device.batteryLevel}%</p>
          </div>
          <div>
            <p className="text-gray-500">Status</p>
            <p className="font-medium">{device.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceControl; 