export enum DeviceStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  ERROR = 'error',
  MAINTENANCE = 'maintenance'
}

export enum SensorType {
  TEMPERATURE = 'TEMPERATURE',
  HUMIDITY = 'HUMIDITY',
  PRESSURE = 'PRESSURE',
  LIGHT = 'LIGHT',
  MOTION = 'MOTION',
  SOUND = 'SOUND',
  VIBRATION = 'VIBRATION',
  GAS = 'GAS'
}

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum AlertStatus {
  ACTIVE = 'active',
  ACKNOWLEDGED = 'acknowledged',
  RESOLVED = 'resolved'
}

export interface IoTDevice {
  id: string;
  name: string;
  type: string;
  location: string;
  status: DeviceStatus;
  lastSeen: Date;
  batteryLevel?: number;
  signalStrength?: number;
  firmwareVersion?: string;
  metadata?: Record<string, any>;
}

export interface SensorData {
  id: string;
  deviceId: string;
  timestamp: Date;
  value: number;
  unit: string;
  type: SensorType;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  metadata?: {
    battery?: number;
    signal?: number;
    temperature?: number;
    [key: string]: any;
  };
}

export interface Alert {
  id: string;
  deviceId: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  status: AlertStatus;
  timestamp: Date;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  metadata?: Record<string, any>;
}

export interface DashboardStats {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  activeSensors: number;
  totalAlerts: number;
  activeAlerts: number;
  averageTemperature: number;
  averageHumidity: number;
  dataPointsToday: number;
  systemUptime: number;
}

export interface AnalyticsData {
  period: string;
  temperature: {
    min: number;
    max: number;
    average: number;
    data: Array<{ timestamp: Date; value: number }>;
  };
  humidity: {
    min: number;
    max: number;
    average: number;
    data: Array<{ timestamp: Date; value: number }>;
  };
  alerts: {
    total: number;
    bySeverity: Record<AlertSeverity, number>;
    byDevice: Record<string, number>;
  };
  devices: {
    total: number;
    byStatus: Record<DeviceStatus, number>;
    byType: Record<string, number>;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp?: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: Permission[];
  createdAt: Date;
  lastLogin?: Date;
  isActive?: boolean;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  emailVerified?: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  OPERATOR = 'operator',
  VIEWER = 'viewer'
}

export enum Permission {
  READ_DEVICES = 'read_devices',
  WRITE_DEVICES = 'write_devices',
  READ_DATA = 'read_data',
  WRITE_DATA = 'write_data',
  READ_ALERTS = 'read_alerts',
  MANAGE_ALERTS = 'manage_alerts',
  MANAGE_USERS = 'manage_users',
  MANAGE_SYSTEM = 'manage_system'
} 