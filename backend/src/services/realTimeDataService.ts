import { Server } from 'socket.io';
import { SensorData, IoTDevice, DeviceStatus, SensorType } from '../sharedTypes';
import { mockDevices } from './mockDataService';

class RealTimeDataService {
  private io: Server;
  private interval: NodeJS.Timeout | null = null;
  private isRunning = false;

  constructor(io: Server) {
    this.io = io;
  }

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🚀 Starting real-time data simulation...');
    
    // Her 5 saniyede bir sensör verisi gönder
    this.interval = setInterval(() => {
      this.generateAndEmitSensorData();
    }, 5000);

    // Her 30 saniyede bir cihaz durumu güncelle
    setInterval(() => {
      this.updateDeviceStatus();
    }, 30000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
    console.log('⏹️ Stopped real-time data simulation');
  }

  private generateAndEmitSensorData() {
    const now = new Date();
    
    mockDevices.forEach(device => {
      if (device.status === DeviceStatus.ONLINE) {
        const sensorData = this.generateSensorData(device.id, now);
        
        // WebSocket ile veriyi gönder
        this.io.to(`device-${device.id}`).emit('sensor-data-update', {
          type: 'sensor_data_update',
          data: sensorData,
          timestamp: now
        });

        // Dashboard'a da gönder
        this.io.to('dashboard').emit('sensor-data-update', {
          type: 'sensor_data_update',
          data: sensorData,
          timestamp: now
        });
      }
    });
  }

  private generateSensorData(deviceId: string, timestamp: Date): SensorData {
    let value: number;
    let type: SensorType;
    let unit: string;
    
    // Gerçekçi veri üretimi
    if (deviceId.includes('temp')) {
      type = SensorType.TEMPERATURE;
      unit = '°C';
      // Gün içinde sıcaklık değişimi simülasyonu
      const hour = timestamp.getHours();
      const baseTemp = 20;
      const variation = Math.sin((hour - 6) * Math.PI / 12) * 8; // 6-18 arası sıcak, gece soğuk
      value = baseTemp + variation + (Math.random() - 0.5) * 2; // ±1°C rastgele
    } else if (deviceId.includes('hum')) {
      type = SensorType.HUMIDITY;
      unit = '%';
      // Nem sıcaklıkla ters orantılı
      const hour = timestamp.getHours();
      const baseHumidity = 50;
      const variation = Math.sin((hour - 6) * Math.PI / 12) * -15; // Sıcakta nem düşük
      value = baseHumidity + variation + (Math.random() - 0.5) * 10;
    } else if (deviceId.includes('motion')) {
      type = SensorType.MOTION;
      unit = 'detected';
      // Gün içinde hareket simülasyonu
      const hour = timestamp.getHours();
      const isActiveTime = (hour >= 7 && hour <= 22); // 7-22 arası aktif
      value = isActiveTime && Math.random() > 0.7 ? 1 : 0;
    } else {
      type = SensorType.LIGHT;
      unit = 'lux';
      // Gün ışığı simülasyonu
      const hour = timestamp.getHours();
      let lightLevel = 0;
      if (hour >= 6 && hour <= 18) {
        lightLevel = 500 + Math.sin((hour - 6) * Math.PI / 12) * 400; // Gündüz
      } else if (hour >= 19 && hour <= 23) {
        lightLevel = 50 + Math.random() * 100; // Akşam
      } else {
        lightLevel = Math.random() * 20; // Gece
      }
      value = lightLevel + (Math.random() - 0.5) * 50;
    }
    
    return {
      id: `${deviceId}-${timestamp.getTime()}`,
      deviceId,
      timestamp,
      value: Math.round(value * 100) / 100,
      unit,
      type,
      quality: 'excellent' as any,
      metadata: {
        battery: 85 + Math.random() * 15,
        signal: 90 + Math.random() * 10,
        temperature: deviceId.includes('temp') ? value : undefined
      }
    };
  }

  private updateDeviceStatus() {
    mockDevices.forEach(device => {
      // %5 ihtimalle cihaz durumu değişsin
      if (Math.random() < 0.05) {
        const statuses = [DeviceStatus.ONLINE, DeviceStatus.OFFLINE, DeviceStatus.ERROR];
        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        if (device.status !== newStatus) {
          device.status = newStatus;
          device.lastSeen = new Date();
          
          // WebSocket ile durum güncellemesi gönder
          this.io.to('dashboard').emit('device-status-change', {
            type: 'device_status_change',
            data: {
              deviceId: device.id,
              status: newStatus,
              lastSeen: device.lastSeen
            },
            timestamp: new Date()
          });
        }
      }
    });
  }

  // Manuel veri gönderme (test için)
  emitTestData() {
    const testData = this.generateSensorData('temp-001', new Date());
    this.io.emit('test-sensor-data', testData);
  }
}

export default RealTimeDataService; 