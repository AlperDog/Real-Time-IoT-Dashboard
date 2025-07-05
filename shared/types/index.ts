// IoT Device Types
export interface IoTDevice {
  id: string;
  name: string;
  type: DeviceType;
  location: Location;
  status: DeviceStatus;
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

export enum DeviceType {
  TEMPERATURE_SENSOR = 'temperature_sensor',
  HUMIDITY_SENSOR = 'humidity_sensor',
  PRESSURE_SENSOR = 'pressure_sensor',
  MOTION_SENSOR = 'motion_sensor',
  LIGHT_SENSOR = 'light_sensor',
  CAMERA = 'camera',
  ACTUATOR = 'actuator'
}

export enum DeviceStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  ERROR = 'error',
  MAINTENANCE = 'maintenance'
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  room?: string;
  building?: string;
}

// Sensor Data Types
export interface SensorData {
  id: string;
  deviceId: string;
  timestamp: Date;
  value: number;
  unit: string;
  type: SensorType;
  quality: DataQuality;
  metadata?: Record<string, any>;
}

export enum SensorType {
  TEMPERATURE = 'temperature',
  HUMIDITY = 'humidity',
  PRESSURE = 'pressure',
  MOTION = 'motion',
  LIGHT = 'light',
  VOLTAGE = 'voltage',
  CURRENT = 'current',
  POWER = 'power'
}

export enum DataQuality {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  INVALID = 'invalid'
}

// Alert Types
export interface Alert {
  id: string;
  deviceId: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolved: boolean;
  resolvedAt?: Date;
  metadata?: Record<string, any>;
}

export enum AlertType {
  THRESHOLD_EXCEEDED = 'threshold_exceeded',
  DEVICE_OFFLINE = 'device_offline',
  DATA_QUALITY = 'data_quality',
  SYSTEM_ERROR = 'system_error',
  MAINTENANCE_DUE = 'maintenance_due'
}

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Dashboard Types
export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  position: WidgetPosition;
  size: WidgetSize;
  config: WidgetConfig;
  data?: any;
}

export enum WidgetType {
  LINE_CHART = 'line_chart',
  BAR_CHART = 'bar_chart',
  GAUGE = 'gauge',
  HEATMAP = 'heatmap',
  STAT_CARD = 'stat_card',
  ALERT_LIST = 'alert_list',
  DEVICE_STATUS = 'device_status'
}

export interface WidgetPosition {
  x: number;
  y: number;
}

export interface WidgetSize {
  width: number;
  height: number;
}

export interface WidgetConfig {
  deviceIds?: string[];
  timeRange?: TimeRange;
  refreshInterval?: number;
  thresholds?: ThresholdConfig;
  chartOptions?: ChartOptions;
}

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface ThresholdConfig {
  min?: number;
  max?: number;
  warning?: number;
  critical?: number;
}

export interface ChartOptions {
  showLegend?: boolean;
  showGrid?: boolean;
  animate?: boolean;
  colors?: string[];
}

// Analytics Types
export interface AnalyticsData {
  deviceId: string;
  period: TimePeriod;
  metrics: MetricData[];
  trends: TrendData[];
  summary: SummaryData;
}

export enum TimePeriod {
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year'
}

export interface MetricData {
  name: string;
  value: number;
  unit: string;
  change?: number;
  changePercent?: number;
}

export interface TrendData {
  timestamp: Date;
  value: number;
  predicted?: number;
}

export interface SummaryData {
  totalDevices: number;
  onlineDevices: number;
  totalAlerts: number;
  activeAlerts: number;
  dataPoints: number;
  uptime: number;
}

// WebSocket Event Types
export interface WebSocketEvent {
  type: EventType;
  data: any;
  timestamp: Date;
}

export enum EventType {
  SENSOR_DATA_UPDATE = 'sensor_data_update',
  DEVICE_STATUS_CHANGE = 'device_status_change',
  ALERT_CREATED = 'alert_created',
  ALERT_UPDATED = 'alert_updated',
  WIDGET_UPDATE = 'widget_update',
  SYSTEM_STATUS = 'system_status'
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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