import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle, XCircle } from 'lucide-react';
import { fetchAlerts, acknowledgeAlert, resolveAlert } from '../services/api';
import { Alert, AlertSeverity, AlertStatus } from '../sharedTypes';
import { toast } from 'react-toastify';

const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Alert | null>(null);

  const loadAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAlerts();
      setAlerts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleAcknowledge = async (id: string) => {
    try {
      await acknowledgeAlert(id);
      loadAlerts();
      toast.success('Alert acknowledged!');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleResolve = async (id: string) => {
    try {
      await resolveAlert(id);
      loadAlerts();
      toast.success('Alert resolved!');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Alerts</h1>
        <p className="text-gray-600">Monitor and manage system alerts</p>
      </div>

      <div className="card">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading alerts...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No alerts found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {alerts.map(alert => (
                <tr key={alert.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 cursor-pointer text-blue-600" onClick={() => setSelected(alert)}>{alert.title}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      alert.severity === AlertSeverity.HIGH ? 'bg-red-100 text-red-800' :
                      alert.severity === AlertSeverity.MEDIUM ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      alert.status === AlertStatus.ACTIVE ? 'bg-blue-100 text-blue-800' :
                      alert.status === AlertStatus.ACKNOWLEDGED ? 'bg-gray-100 text-gray-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {alert.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{new Date(alert.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-2 text-right space-x-2">
                    {alert.status === AlertStatus.ACTIVE && (
                      <button className="btn-secondary text-xs" onClick={() => handleAcknowledge(alert.id)}>
                        Acknowledge
                      </button>
                    )}
                    {alert.status !== AlertStatus.RESOLVED && (
                      <button className="btn-primary text-xs" onClick={() => handleResolve(alert.id)}>
                        Resolve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setSelected(null)}>
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Alert Details</h2>
            <div className="space-y-2">
              <div><b>Title:</b> {selected.title}</div>
              <div><b>Message:</b> {selected.message}</div>
              <div><b>Severity:</b> {selected.severity}</div>
              <div><b>Status:</b> {selected.status}</div>
              <div><b>Time:</b> {new Date(selected.timestamp).toLocaleString()}</div>
              {selected.metadata && (
                <div><b>Metadata:</b> <pre className="bg-gray-100 rounded p-2 text-xs">{JSON.stringify(selected.metadata, null, 2)}</pre></div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Alerts; 