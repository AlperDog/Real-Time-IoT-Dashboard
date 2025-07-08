import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Trash2 } from 'lucide-react';
import { fetchDevices, addDevice, deleteDevice, updateDevice, fetchDeviceById } from '../services/api';
import { IoTDevice, DeviceStatus } from '../sharedTypes';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';

interface DeviceFormData {
  id: string;
  name: string;
  type: string;
  location: string;
  status: DeviceStatus;
}

const deviceSchema = yup.object().shape({
  id: yup.string().required('ID is required'),
  name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters'),
  type: yup.string().required('Type is required'),
  location: yup.string().required('Location is required'),
  status: yup.string().oneOf(Object.values(DeviceStatus)).required('Status is required'),
});

const Devices: React.FC = () => {
  const [devices, setDevices] = useState<IoTDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newDevice, setNewDevice] = useState<DeviceFormData>({
    id: '',
    name: '',
    type: '',
    location: '',
    status: DeviceStatus.ONLINE,
  });
  const [editDevice, setEditDevice] = useState<IoTDevice | null>(null);
  const [showDetails, setShowDetails] = useState<IoTDevice | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline'>('all');

  const loadDevices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDevices();
      setDevices(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<DeviceFormData>({
    resolver: yupResolver(deviceSchema),
    defaultValues: newDevice,
  });
  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, formState: { errors: errorsEdit } } = useForm<DeviceFormData>({
    resolver: yupResolver(deviceSchema),
    defaultValues: editDevice || newDevice,
  });

  const handleAddDevice = async (data: DeviceFormData) => {
    try {
      await addDevice(data as IoTDevice);
      setShowAdd(false);
      setNewDevice({ id: '', name: '', type: '', location: '', status: DeviceStatus.ONLINE });
      reset();
      loadDevices();
      toast.success('Device added successfully!');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleEditDevice = (device: IoTDevice) => {
    setEditDevice(device);
    setShowAdd(false);
  };

  const handleUpdateDevice = async (data: DeviceFormData) => {
    if (!editDevice) return;
    try {
      await updateDevice(editDevice.id, data);
      setEditDevice(null);
      resetEdit();
      loadDevices();
      toast.success('Device updated successfully!');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleShowDetails = async (id: string) => {
    try {
      const device = await fetchDeviceById(id);
      setShowDetails(device);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this device?')) return;
    try {
      await deleteDevice(id);
      loadDevices();
      toast.success('Device deleted successfully!');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const filteredDevices = devices.filter(device => {
    const matchesSearch =
      device.name.toLowerCase().includes(search.toLowerCase()) ||
      device.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'online' && device.status === DeviceStatus.ONLINE) ||
      (statusFilter === 'offline' && device.status === DeviceStatus.OFFLINE);
    return matchesSearch && matchesStatus;
  });

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Devices</h1>
          <p className="text-gray-600">Manage your IoT devices</p>
        </div>
        <button className="btn-primary flex items-center space-x-2" onClick={() => setShowAdd(true)} aria-label="Add Device">
          <Plus className="w-4 h-4" />
          <span>Add Device</span>
        </button>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      {showAdd && (
        <form className="card p-4 mb-4" onSubmit={handleSubmit(handleAddDevice)} aria-label="Add Device Form" role="form">
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-2">
            <input
              type="text"
              placeholder="ID"
              {...register('id')}
              className="input"
            />
            {errors.id && <span className="text-red-500 text-xs">{errors.id.message as string}</span>}
            <input
              type="text"
              placeholder="Name"
              {...register('name')}
              className="input"
            />
            {errors.name && <span className="text-red-500 text-xs">{errors.name.message as string}</span>}
            <input
              type="text"
              placeholder="Type"
              {...register('type')}
              className="input"
            />
            {errors.type && <span className="text-red-500 text-xs">{errors.type.message as string}</span>}
            <input
              type="text"
              placeholder="Location"
              {...register('location')}
              className="input"
            />
            {errors.location && <span className="text-red-500 text-xs">{errors.location.message as string}</span>}
            <select
              {...register('status')}
              className="input"
            >
              <option value={DeviceStatus.ONLINE}>Online</option>
              <option value={DeviceStatus.OFFLINE}>Offline</option>
              <option value={DeviceStatus.ERROR}>Error</option>
              <option value={DeviceStatus.MAINTENANCE}>Maintenance</option>
            </select>
            {errors.status && <span className="text-red-500 text-xs">{errors.status.message as string}</span>}
          </div>
          <button className="btn-primary mr-2" type="submit">Add</button>
          <button className="btn-secondary" type="button" onClick={() => setShowAdd(false)}>Cancel</button>
        </form>
      )}

      {editDevice && (
        <form className="card p-4 mb-4" onSubmit={handleSubmitEdit(handleUpdateDevice)} aria-label="Edit Device Form" role="form">
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-2">
            <input
              type="text"
              placeholder="ID"
              value={editDevice.id}
              disabled
              className="input bg-gray-100"
            />
            <input
              type="text"
              placeholder="Name"
              {...registerEdit('name')}
              className="input"
            />
            {errorsEdit.name && <span className="text-red-500 text-xs">{errorsEdit.name.message as string}</span>}
            <input
              type="text"
              placeholder="Type"
              {...registerEdit('type')}
              className="input"
            />
            {errorsEdit.type && <span className="text-red-500 text-xs">{errorsEdit.type.message as string}</span>}
            <input
              type="text"
              placeholder="Location"
              {...registerEdit('location')}
              className="input"
            />
            {errorsEdit.location && <span className="text-red-500 text-xs">{errorsEdit.location.message as string}</span>}
            <select
              {...registerEdit('status')}
              className="input"
            >
              <option value={DeviceStatus.ONLINE}>Online</option>
              <option value={DeviceStatus.OFFLINE}>Offline</option>
              <option value={DeviceStatus.ERROR}>Error</option>
              <option value={DeviceStatus.MAINTENANCE}>Maintenance</option>
            </select>
            {errorsEdit.status && <span className="text-red-500 text-xs">{errorsEdit.status.message as string}</span>}
          </div>
          <button className="btn-primary mr-2" type="submit">Update</button>
          <button className="btn-secondary" type="button" onClick={() => setEditDevice(null)}>Cancel</button>
        </form>
      )}

      <div className="card overflow-x-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search devices..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <button
                className={`btn-secondary flex items-center space-x-2 ${statusFilter === 'all' ? 'bg-blue-100 text-blue-700' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                <Filter className="w-4 h-4" />
                <span>All</span>
              </button>
              <button
                className={`btn-secondary flex items-center space-x-2 ${statusFilter === 'online' ? 'bg-green-100 text-green-700' : ''}`}
                onClick={() => setStatusFilter('online')}
              >
                <span>Online</span>
              </button>
              <button
                className={`btn-secondary flex items-center space-x-2 ${statusFilter === 'offline' ? 'bg-gray-200 text-gray-700' : ''}`}
                onClick={() => setStatusFilter('offline')}
              >
                <span>Offline</span>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading devices...</div>
        ) : filteredDevices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No devices found</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first IoT device</p>
            <button className="btn-primary" onClick={() => setShowAdd(true)}>Add Device</button>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200" role="table">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2"></th>
                <th className="px-4 py-2"></th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filteredDevices.map(device => (
                <tr key={device.id} className="hover:bg-gray-50" tabIndex={0} aria-label={`Device ${device.name}`}>
                  <td className="px-4 py-2 font-mono">{device.id}</td>
                  <td className="px-4 py-2">{device.name}</td>
                  <td className="px-4 py-2">{device.type}</td>
                  <td className="px-4 py-2">{device.location}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      device.status === DeviceStatus.ONLINE ? 'bg-green-100 text-green-800' :
                      device.status === DeviceStatus.OFFLINE ? 'bg-gray-200 text-gray-600' :
                      device.status === DeviceStatus.ERROR ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {device.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button className="text-blue-500 hover:text-blue-700 mr-2" onClick={() => handleEditDevice(device)}>
                      Edit
                    </button>
                    <button className="text-green-500 hover:text-green-700 mr-2" onClick={() => handleShowDetails(device.id)}>
                      Details
                    </button>
                    <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(device.id)}>
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {showDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowDetails(null)}>
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Device Details</h2>
            <div className="space-y-2">
              <div><b>ID:</b> {showDetails.id}</div>
              <div><b>Name:</b> {showDetails.name}</div>
              <div><b>Type:</b> {showDetails.type}</div>
              <div><b>Location:</b> {showDetails.location}</div>
              <div><b>Status:</b> {showDetails.status}</div>
              {showDetails.lastSeen && <div><b>Last Seen:</b> {new Date(showDetails.lastSeen).toLocaleString()}</div>}
              {showDetails.batteryLevel !== undefined && <div><b>Battery Level:</b> {showDetails.batteryLevel}%</div>}
              {showDetails.signalStrength !== undefined && <div><b>Signal Strength:</b> {showDetails.signalStrength}</div>}
              {showDetails.firmwareVersion && <div><b>Firmware Version:</b> {showDetails.firmwareVersion}</div>}
              {showDetails.metadata && (
                <div><b>Metadata:</b> <pre className="bg-gray-100 rounded p-2 text-xs">{JSON.stringify(showDetails.metadata, null, 2)}</pre></div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Devices; 