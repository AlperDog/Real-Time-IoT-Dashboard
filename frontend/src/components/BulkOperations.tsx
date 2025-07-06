import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PlayIcon, 
  StopIcon, 
  CogIcon, 
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { IoTDevice, DeviceStatus } from '../sharedTypes';

interface BulkOperationsProps {
  devices: IoTDevice[];
  onBulkCommand?: (deviceIds: string[], command: string) => void;
}

interface BulkCommand {
  id: string;
  command: string;
  deviceIds: string[];
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  results: Array<{
    deviceId: string;
    status: 'SUCCESS' | 'FAILED';
    response: string;
    executionTime: number;
  }>;
  timestamp: string;
}

const BulkOperations: React.FC<BulkOperationsProps> = ({ devices, onBulkCommand }) => {
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [selectedCommand, setSelectedCommand] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [bulkCommands, setBulkCommands] = useState<BulkCommand[]>([]);

  const availableCommands = [
    { id: 'RESTART', name: 'Restart', icon: ArrowPathIcon, color: 'blue' },
    { id: 'CALIBRATE', name: 'Calibrate', icon: CogIcon, color: 'green' },
    { id: 'GET_STATUS', name: 'Get Status', icon: CheckCircleIcon, color: 'gray' },
    { id: 'EMERGENCY_STOP', name: 'Emergency Stop', icon: StopIcon, color: 'red' }
  ];

  const handleDeviceToggle = (deviceId: string) => {
    setSelectedDevices(prev => 
      prev.includes(deviceId) 
        ? prev.filter(id => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const handleSelectAll = () => {
    setSelectedDevices(devices.map(d => d.id));
  };

  const handleDeselectAll = () => {
    setSelectedDevices([]);
  };

  const handleBulkCommand = async () => {
    if (selectedDevices.length === 0 || !selectedCommand) return;

    setIsExecuting(true);
    onBulkCommand?.(selectedDevices, selectedCommand);

    const command: BulkCommand = {
      id: `bulk-${Date.now()}`,
      command: selectedCommand,
      deviceIds: selectedDevices,
      status: 'IN_PROGRESS',
      results: [],
      timestamp: new Date().toISOString()
    };

    setBulkCommands(prev => [command, ...prev.slice(0, 4)]); // Keep last 5 commands

    // Simulate bulk command execution
    const results = await Promise.all(
      selectedDevices.map(async (deviceId) => {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));
        
        return {
          deviceId,
          status: Math.random() > 0.1 ? 'SUCCESS' as const : 'FAILED' as const,
          response: Math.random() > 0.1 ? 'Command executed successfully' : 'Device not responding',
          executionTime: Math.random() * 1000 + 100
        };
      })
    );

    const updatedCommand: BulkCommand = {
      ...command,
      status: 'COMPLETED',
      results
    };

    setBulkCommands(prev => 
      prev.map(cmd => cmd.id === command.id ? updatedCommand : cmd)
    );

    setIsExecuting(false);
    setSelectedDevices([]);
    setSelectedCommand('');
  };

  const getCommandIcon = (commandId: string) => {
    const command = availableCommands.find(cmd => cmd.id === commandId);
    return command ? React.createElement(command.icon, { className: "w-4 h-4" }) : null;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'text-green-600 bg-green-100';
      case 'FAILED':
        return 'text-red-600 bg-red-100';
      case 'IN_PROGRESS':
        return 'text-blue-600 bg-blue-100';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getBulkStatusColor = (status: string) => {
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

  const onlineDevices = devices.filter(d => d.status === DeviceStatus.ONLINE);
  const selectedOnlineDevices = selectedDevices.filter(id => 
    devices.find(d => d.id === id)?.status === DeviceStatus.ONLINE
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Bulk Operations</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {selectedDevices.length} of {devices.length} devices selected
          </span>
        </div>
      </div>

      {/* Device Selection */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-900">Select Devices</h4>
          <div className="flex space-x-2">
            <button
              onClick={handleSelectAll}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              Select All
            </button>
            <button
              onClick={handleDeselectAll}
              className="text-xs text-gray-600 hover:text-gray-700"
            >
              Deselect All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
          {devices.map(device => (
            <label
              key={device.id}
              className="flex items-center space-x-2 p-2 rounded border cursor-pointer hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selectedDevices.includes(device.id)}
                onChange={() => handleDeviceToggle(device.id)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  device.status === DeviceStatus.ONLINE ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-sm text-gray-700">{device.name}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Command Selection */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Select Command</h4>
        <div className="grid grid-cols-2 gap-3">
          {availableCommands.map(command => (
            <button
              key={command.id}
              onClick={() => setSelectedCommand(command.id)}
              disabled={selectedDevices.length === 0 || isExecuting}
              className={`flex items-center justify-center space-x-2 p-3 rounded-lg border transition-colors ${
                selectedCommand === command.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <command.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{command.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Warning for offline devices */}
      {selectedDevices.length > selectedOnlineDevices.length && (
        <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
          <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
          <span className="text-sm text-yellow-800">
            {selectedDevices.length - selectedOnlineDevices.length} selected devices are offline
          </span>
        </div>
      )}

      {/* Execute Button */}
      <button
        onClick={handleBulkCommand}
        disabled={selectedDevices.length === 0 || !selectedCommand || isExecuting}
        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isExecuting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Executing...</span>
          </>
        ) : (
          <>
            <PlayIcon className="w-5 h-5" />
            <span>Execute {selectedCommand} on {selectedDevices.length} devices</span>
          </>
        )}
      </button>

      {/* Bulk Command History */}
      {bulkCommands.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Bulk Operations</h4>
          <div className="space-y-3">
            {bulkCommands.map(command => (
              <motion.div
                key={command.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getCommandIcon(command.command)}
                    <span className="text-sm font-medium text-gray-900">
                      {command.command} on {command.deviceIds.length} devices
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBulkStatusColor(command.status)}`}>
                    {command.status}
                  </span>
                </div>

                {command.status === 'COMPLETED' && (
                  <div className="text-xs text-gray-500">
                    {command.results.filter(r => r.status === 'SUCCESS').length} successful,{' '}
                    {command.results.filter(r => r.status === 'FAILED').length} failed
                  </div>
                )}

                <div className="text-xs text-gray-400 mt-1">
                  {new Date(command.timestamp).toLocaleTimeString()}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkOperations; 