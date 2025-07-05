import React from 'react';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';

const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Deep insights into your IoT data</p>
      </div>

      <div className="card">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <BarChart3 className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
          <p className="text-gray-500 mb-4">Advanced analytics and insights coming soon</p>
          <div className="flex justify-center space-x-4">
            <button className="btn-primary flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>View Trends</span>
            </button>
            <button className="btn-secondary flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Export Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 