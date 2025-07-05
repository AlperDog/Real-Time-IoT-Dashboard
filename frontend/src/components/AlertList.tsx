import React from 'react';
import { motion } from 'framer-motion';
import { Alert, AlertSeverity } from '../sharedTypes';
import { 
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface AlertListProps {
  alerts: Alert[];
}

const AlertList: React.FC<AlertListProps> = ({ alerts }) => {
  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case AlertSeverity.LOW:
        return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
      case AlertSeverity.MEDIUM:
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case AlertSeverity.HIGH:
        return <ExclamationCircleIcon className="w-5 h-5 text-orange-500" />;
      case AlertSeverity.CRITICAL:
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case AlertSeverity.LOW:
        return 'text-blue-600 bg-blue-100';
      case AlertSeverity.MEDIUM:
        return 'text-yellow-600 bg-yellow-100';
      case AlertSeverity.HIGH:
        return 'text-orange-600 bg-orange-100';
      case AlertSeverity.CRITICAL:
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityText = (severity: AlertSeverity) => {
    switch (severity) {
      case AlertSeverity.LOW:
        return 'Düşük';
      case AlertSeverity.MEDIUM:
        return 'Orta';
      case AlertSeverity.HIGH:
        return 'Yüksek';
      case AlertSeverity.CRITICAL:
        return 'Kritik';
      default:
        return 'Bilinmiyor';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Az önce';
    if (minutes < 60) return `${minutes} dakika önce`;
    if (hours < 24) return `${hours} saat önce`;
    return `${days} gün önce`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Uyarılar</h3>
      
      <div className="space-y-3">
        {alerts.slice(0, 5).map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-start space-x-3">
              {getSeverityIcon(alert.severity)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 truncate">{alert.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                    {getSeverityText(alert.severity)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">Cihaz: {alert.deviceId}</span>
                  <span className="text-xs text-gray-500">{formatTime(alert.timestamp)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {alerts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Aktif uyarı bulunmuyor</p>
        </div>
      )}

      {alerts.length > 5 && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium">
            Tüm uyarıları görüntüle ({alerts.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default AlertList; 