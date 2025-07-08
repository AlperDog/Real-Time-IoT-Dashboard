import { DashboardStats, IoTDevice, SensorData, Alert, ApiResponse } from '../sharedTypes';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// API istekleri için yardımcı fonksiyon
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers,
    ...options,
  });

  // Handle 401 Unauthorized - redirect to auth
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = '/auth';
    throw new Error('Authentication required');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API request failed: ${response.statusText}`);
  }

  const result: ApiResponse<T> = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'API request failed');
  }

  return result.data as T;
}

// Dashboard API functions
export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  return apiRequest<DashboardStats>('/api/dashboard/stats');
};

export const fetchDevices = async (): Promise<IoTDevice[]> => {
  return apiRequest<IoTDevice[]>('/api/devices');
};

export const fetchDeviceById = async (id: string): Promise<IoTDevice> => {
  return apiRequest<IoTDevice>(`/api/devices/${id}`);
};

export const fetchSensorData = async (): Promise<SensorData[]> => {
  return apiRequest<SensorData[]>('/api/sensors');
};

export const fetchAlerts = async (): Promise<Alert[]> => {
  return apiRequest<Alert[]>('/api/alerts');
};

export const fetchAnalytics = async (period: string = '24h') => {
  return apiRequest(`/api/analytics?period=${period}`);
};

// Device control API functions
export const sendDeviceCommand = async (deviceId: string, command: string, parameters?: any) => {
  return apiRequest(`/api/devices/${deviceId}/command`, {
    method: 'POST',
    body: JSON.stringify({ command, parameters }),
  });
};

export const updateDeviceConfig = async (deviceId: string, config: any) => {
  return apiRequest(`/api/devices/${deviceId}/config`, {
    method: 'PUT',
    body: JSON.stringify(config),
  });
};

export const getDeviceFirmware = async (deviceId: string) => {
  return apiRequest(`/api/devices/${deviceId}/firmware`);
};

export const updateDeviceFirmware = async (deviceId: string, version: string) => {
  return apiRequest(`/api/devices/${deviceId}/firmware/update`, {
    method: 'POST',
    body: JSON.stringify({ version }),
  });
};

export const getDeviceCommands = async (deviceId: string) => {
  return apiRequest(`/api/devices/${deviceId}/commands`);
};

export const bulkDeviceCommand = async (deviceIds: string[], command: string, parameters?: any) => {
  return apiRequest('/api/devices/bulk/command', {
    method: 'POST',
    body: JSON.stringify({ deviceIds, command, parameters }),
  });
};

// Alert API functions
export const acknowledgeAlert = async (alertId: string) => {
  return apiRequest(`/api/alerts/${alertId}/acknowledge`, {
    method: 'POST',
  });
};

export const resolveAlert = async (alertId: string) => {
  return apiRequest(`/api/alerts/${alertId}/resolve`, {
    method: 'POST',
  });
};

// User profile API functions
export const getUserProfile = async () => {
  return apiRequest('/api/auth/profile');
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  return apiRequest('/api/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
};

export const forgotPassword = async (email: string) => {
  return apiRequest('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

export const resetPassword = async (token: string, newPassword: string) => {
  return apiRequest('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  });
};

// Health check
export const checkHealth = async () => {
  return apiRequest('/health');
}; 

export const addDevice = async (device: IoTDevice) => {
  return apiRequest<IoTDevice>('/api/devices', {
    method: 'POST',
    body: JSON.stringify(device),
  });
};

export const updateDevice = async (id: string, device: Partial<IoTDevice>) => {
  return apiRequest<IoTDevice>(`/api/devices/${id}`, {
    method: 'PUT',
    body: JSON.stringify(device),
  });
};

export const deleteDevice = async (id: string) => {
  return apiRequest<IoTDevice>(`/api/devices/${id}`, {
    method: 'DELETE',
  });
}; 