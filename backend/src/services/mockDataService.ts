import { IoTDevice, SensorData, Alert, DeviceStatus, SensorType, AlertType, AlertSeverity } from '../../shared/types';

// Mock IoT Devices
export const mockDevices: IoTDevice[] = [
  {
    id: 'temp-001',
    name: 'Temperature Sensor 1',
    type: 'temperature_sensor' as any,
    location: {
      latitude: 41.0082,
      longitude: 28.9784,
      address: 'Istanbul, Turkey',
      room: 'Room 101',
      building: 'Main Building'
    },
    status: DeviceStatus.ONLINE,
    lastSeen: new Date(),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    metadata: {
      manufacturer: 'Sensirion',
      model: 'SHT30',
      firmware: 'v2.1.0'
    }
  },
  {
    id: 'hum-001',
    name: 'Humidity Sensor 1',
    type: 'humidity_sensor' as any,
    location: {
      latitude: 41.0082,
      longitude: 28.9784,
      address: 'Istanbul, Turkey',
      room: 'Room 101',
      building: 'Main Building'
    },
    status: DeviceStatus.ONLINE,
    lastSeen: new Date(),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    metadata: {
      manufacturer: 'Sensirion',
      model: 'SHT30',
      firmware: 'v2.1.0'
    }
  },
  {
    id: 'motion-001',
    name: 'Motion Sensor 1',
    type: 'motion_sensor' as any,
    location: {
      latitude: 41.0082,
      longitude: 28.9784,
      address: 'Istanbul, Turkey',
      room: 'Room 102',
      building: 'Main Building'
    },
    status: DeviceStatus.OFFLINE,
    lastSeen: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    metadata: {
      manufacturer: 'PIR Sensor',
      model: 'HC-SR501',
      firmware: 'v1.0.0'
    }
  },
  {
    id: 'light-001',
    name: 'Light Sensor 1',
    type: 'light_sensor' as any,
    location: {
      latitude: 41.0082,
      longitude: 28.9784,
      address: 'Istanbul, Turkey',
      room: 'Room 103',
      building: 'Main Building'
    },
    status: DeviceStatus.ERROR,
    lastSeen: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    metadata: {
      manufacturer: 'BH1750',
      model: 'FVI',
      firmware: 'v1.2.0'
    }
  }
];

// Generate mock sensor data
export function generateMockSensorData(deviceId: string, count: number = 24): SensorData[] {
  const data: SensorData[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - (count - i) * 60 * 60 * 1000); // Hourly data
    
    let value: number;
    let type: SensorType;
    let unit: string;
    
    if (deviceId.includes('temp')) {
      type = SensorType.TEMPERATURE;
      unit = '°C';
      value = 20 + Math.random() * 10; // 20-30°C
    } else if (deviceId.includes('hum')) {
      type = SensorType.HUMIDITY;
      unit = '%';
      value = 40 + Math.random() * 30; // 40-70%
    } else if (deviceId.includes('motion')) {
      type = SensorType.MOTION;
      unit = 'detected';
      value = Math.random() > 0.7 ? 1 : 0; // Binary motion detection
    } else {
      type = SensorType.LIGHT;
      unit = 'lux';
      value = 100 + Math.random() * 900; // 100-1000 lux
    }
    
    data.push({
      id: `${deviceId}-${i}`,
      deviceId,
      timestamp,
      value: Math.round(value * 100) / 100,
      unit,
      type,
      quality: 'excellent' as any,
      metadata: {
        battery: 85 + Math.random() * 15,
        signal: 90 + Math.random() * 10
      }
    });
  }
  
  return data;
}

// Generate mock alerts
export function generateMockAlerts(): Alert[] {
  return [
    {
      id: '1',
      deviceId: 'temp-001',
      type: AlertType.THRESHOLD_EXCEEDED,
      severity: AlertSeverity.HIGH,
      message: 'Temperature sensor reading is above normal range (28.5°C)',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      acknowledged: false,
      resolved: false
    },
    {
      id: '2',
      deviceId: 'motion-001',
      type: AlertType.DEVICE_OFFLINE,
      severity: AlertSeverity.MEDIUM,
      message: 'Motion sensor has been offline for more than 10 minutes',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      acknowledged: true,
      acknowledgedBy: 'admin',
      acknowledgedAt: new Date(Date.now() - 10 * 60 * 1000),
      resolved: false
    },
    {
      id: '3',
      deviceId: 'hum-001',
      type: AlertType.THRESHOLD_EXCEEDED,
      severity: AlertSeverity.LOW,
      message: 'Humidity sensor battery level is below 20%',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      acknowledged: false,
      resolved: false
    }
  ];
}

// Get real-time sensor data
export function getRealTimeSensorData(): SensorData[] {
  const now = new Date();
  return mockDevices.map(device => {
    let value: number;
    let type: SensorType;
    let unit: string;
    
    if (device.type === 'temperature_sensor') {
      type = SensorType.TEMPERATURE;
      unit = '°C';
      value = 22 + Math.random() * 6; // 22-28°C
    } else if (device.type === 'humidity_sensor') {
      type = SensorType.HUMIDITY;
      unit = '%';
      value = 45 + Math.random() * 20; // 45-65%
    } else if (device.type === 'motion_sensor') {
      type = SensorType.MOTION;
      unit = 'detected';
      value = Math.random() > 0.8 ? 1 : 0;
    } else {
      type = SensorType.LIGHT;
      unit = 'lux';
      value = 200 + Math.random() * 800; // 200-1000 lux
    }
    
    return {
      id: `${device.id}-rt`,
      deviceId: device.id,
      timestamp: now,
      value: Math.round(value * 100) / 100,
      unit,
      type,
      quality: 'excellent' as any,
      metadata: {
        battery: 85 + Math.random() * 15,
        signal: 90 + Math.random() * 10
      }
    };
  });
} 