import { DashboardStats, IoTDevice, SensorData, Alert } from '../sharedTypes';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// API response tipi
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp?: string;
}

// API istekleri için yardımcı fonksiyon
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const result: ApiResponse<T> = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'API request failed');
  }

  return result.data as T;
}

// Dashboard istatistikleri
export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  return apiRequest<DashboardStats>('/api/dashboard/stats');
};

// Cihaz listesi
export const fetchDevices = async (): Promise<IoTDevice[]> => {
  return apiRequest<IoTDevice[]>('/api/devices');
};

// Sensör verileri
export const fetchSensorData = async (): Promise<SensorData[]> => {
  return apiRequest<SensorData[]>('/api/sensors/data');
};

// Uyarılar
export const fetchAlerts = async (): Promise<Alert[]> => {
  return apiRequest<Alert[]>('/api/alerts');
};

// Belirli bir cihazın verileri
export const fetchDeviceData = async (deviceId: string): Promise<SensorData[]> => {
  return apiRequest<SensorData[]>(`/api/devices/${deviceId}/data`);
};

// Cihaz durumu güncelleme
export const updateDeviceStatus = async (deviceId: string, status: string): Promise<IoTDevice> => {
  return apiRequest<IoTDevice>(`/api/devices/${deviceId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

// Uyarı oluşturma
export const createAlert = async (alert: Omit<Alert, 'id' | 'timestamp'>): Promise<Alert> => {
  return apiRequest<Alert>('/api/alerts', {
    method: 'POST',
    body: JSON.stringify(alert),
  });
};

// Uyarı güncelleme
export const updateAlert = async (alertId: string, updates: Partial<Alert>): Promise<Alert> => {
  return apiRequest<Alert>(`/api/alerts/${alertId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
};

// Uyarı silme
export const deleteAlert = async (alertId: string): Promise<void> => {
  return apiRequest<void>(`/api/alerts/${alertId}`, {
    method: 'DELETE',
  });
}; 