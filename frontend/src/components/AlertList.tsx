import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  acknowledged: boolean;
  deviceId: string;
}

const AlertList: React.FC = () => {
  // Mock data
  const alerts: Alert[] = [
    {
      id: '1',
      title: 'Temperature Threshold Exceeded',
      message: 'Temperature sensor reading is above normal range',
      severity: 'high',
      timestamp: '5 minutes ago',
      acknowledged: false,
      deviceId: 'temp-001'
    },
    {
      id: '2',
      title: 'Device Offline',
      message: 'Motion sensor has been offline for more than 10 minutes',
      severity: 'medium',
      timestamp: '15 minutes ago',
      acknowledged: true,
      deviceId: 'motion-001'
    },
    {
      id: '3',
      title: 'Low Battery Warning',
      message: 'Humidity sensor battery level is below 20%',
      severity: 'low',
      timestamp: '1 hour ago',
      acknowledged: false,
      deviceId: 'hum-001'
    }
  ];

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-200 bg-red-50';
      case 'high':
        return 'border-orange-200 bg-orange-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getSeverityTextClass = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-800';
      case 'high':
        return 'text-orange-800';
      case 'medium':
        return 'text-yellow-800';
      case 'low':
        return 'text-blue-800';
      default:
        return 'text-gray-800';
    }
  };

  return (
    <div className="space-y-3">
      {alerts.map((alert, index) => (
        <motion.div
          key={alert.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`p-3 border rounded-lg ${getSeverityClass(alert.severity)} ${
            alert.acknowledged ? 'opacity-60' : ''
          }`}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {getSeverityIcon(alert.severity)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className={`text-sm font-medium ${getSeverityTextClass(alert.severity)}`}>
                  {alert.title}
                </h4>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSeverityClass(alert.severity)} ${getSeverityTextClass(alert.severity)}`}>
                  {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">{alert.timestamp}</span>
                {!alert.acknowledged && (
                  <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
      
      {alerts.length === 0 && (
        <div className="text-center py-8">
          <CheckCircle className="mx-auto h-8 w-8 text-green-400 mb-2" />
          <p className="text-sm text-gray-500">No active alerts</p>
        </div>
      )}
      
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Alerts:</span>
          <span className="font-medium">{alerts.length}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-gray-600">Unacknowledged:</span>
          <span className="font-medium text-orange-600">
            {alerts.filter(a => !a.acknowledged).length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AlertList; 