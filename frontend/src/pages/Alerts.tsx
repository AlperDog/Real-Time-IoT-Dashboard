import React from 'react';
import { Bell, CheckCircle, XCircle } from 'lucide-react';

const Alerts: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Alerts</h1>
        <p className="text-gray-600">Monitor and manage system alerts</p>
      </div>

      <div className="card">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Bell className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Alert Management</h3>
          <p className="text-gray-500 mb-4">Real-time alert monitoring and management</p>
          <div className="flex justify-center space-x-4">
            <button className="btn-primary flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Acknowledge All</span>
            </button>
            <button className="btn-secondary flex items-center space-x-2">
              <XCircle className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts; 