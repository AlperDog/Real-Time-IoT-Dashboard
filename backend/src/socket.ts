import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import RealTimeDataService from './services/realTimeDataService';

export function setupSocketIO(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Gerçek zamanlı veri servisini başlat
  const realTimeDataService = new RealTimeDataService(io);

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Dashboard room'una katıl
    socket.on('join-dashboard', () => {
      socket.join('dashboard');
      console.log(`📊 Client ${socket.id} joined dashboard room`);
      
      // İlk bağlantıda mevcut verileri gönder
      socket.emit('dashboard-init', {
        type: 'dashboard_init',
        data: {
          message: 'Dashboard connected successfully',
          timestamp: new Date()
        }
      });
    });

    // Belirli bir cihazı dinle
    socket.on('join-device', (deviceId: string) => {
      socket.join(`device-${deviceId}`);
      console.log(`📱 Client ${socket.id} joined device room: ${deviceId}`);
    });

    // Cihaz dinlemeyi bırak
    socket.on('leave-device', (deviceId: string) => {
      socket.leave(`device-${deviceId}`);
      console.log(`📱 Client ${socket.id} left device room: ${deviceId}`);
    });

    // Test verisi isteği
    socket.on('request-test-data', () => {
      console.log(`🧪 Test data requested by ${socket.id}`);
      realTimeDataService.emitTestData();
    });

    // Gerçek zamanlı veri simülasyonunu başlat/durdur
    socket.on('start-simulation', () => {
      console.log(`▶️ Starting simulation requested by ${socket.id}`);
      realTimeDataService.start();
      socket.emit('simulation-status', { running: true });
    });

    socket.on('stop-simulation', () => {
      console.log(`⏹️ Stopping simulation requested by ${socket.id}`);
      realTimeDataService.stop();
      socket.emit('simulation-status', { running: false });
    });

    // ===== DEVICE CONTROL EVENTS =====

    // Cihaza komut gönder
    socket.on('send-device-command', async (data: {
      deviceId: string;
      command: string;
      parameters?: any;
    }) => {
      console.log(`🎮 Device command sent by ${socket.id}:`, data);
      
      try {
        // Simulate command execution
        const commandResult = {
          deviceId: data.deviceId,
          command: data.command,
          parameters: data.parameters || {},
          status: 'SUCCESS',
          response: `Command ${data.command} executed successfully`,
          timestamp: new Date().toISOString(),
          executionTime: Math.random() * 1000 + 100
        };

        // Emit to device room
        io.to(`device-${data.deviceId}`).emit('device-command-response', commandResult);
        
        // Emit to dashboard room
        io.to('dashboard').emit('device-command-executed', {
          ...commandResult,
          executedBy: socket.id
        });

        // Simulate device status update
        setTimeout(() => {
          io.to(`device-${data.deviceId}`).emit('device-status-update', {
            deviceId: data.deviceId,
            status: 'ONLINE',
            lastCommand: data.command,
            timestamp: new Date().toISOString()
          });
        }, 1000);

      } catch (error) {
        socket.emit('device-command-error', {
          deviceId: data.deviceId,
          command: data.command,
          error: 'Failed to execute command',
          timestamp: new Date().toISOString()
        });
      }
    });

    // Cihaz konfigürasyonunu güncelle
    socket.on('update-device-config', async (data: {
      deviceId: string;
      config: any;
    }) => {
      console.log(`⚙️ Device config update by ${socket.id}:`, data);
      
      try {
        const configResult = {
          deviceId: data.deviceId,
          config: data.config,
          status: 'UPDATED',
          timestamp: new Date().toISOString()
        };

        // Emit to device room
        io.to(`device-${data.deviceId}`).emit('device-config-updated', configResult);
        
        // Emit to dashboard room
        io.to('dashboard').emit('device-config-changed', {
          ...configResult,
          updatedBy: socket.id
        });

      } catch (error) {
        socket.emit('device-config-error', {
          deviceId: data.deviceId,
          error: 'Failed to update configuration',
          timestamp: new Date().toISOString()
        });
      }
    });

    // Firmware güncellemesi başlat
    socket.on('start-firmware-update', async (data: {
      deviceId: string;
      version: string;
    }) => {
      console.log(`📱 Firmware update started by ${socket.id}:`, data);
      
      try {
        const updateInfo = {
          deviceId: data.deviceId,
          targetVersion: data.version,
          status: 'IN_PROGRESS',
          progress: 0,
          estimatedTime: 300,
          timestamp: new Date().toISOString()
        };

        // Emit to device room
        io.to(`device-${data.deviceId}`).emit('firmware-update-started', updateInfo);
        
        // Emit to dashboard room
        io.to('dashboard').emit('firmware-update-initiated', {
          ...updateInfo,
          initiatedBy: socket.id
        });

        // Simulate firmware update progress
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += Math.random() * 10 + 5; // 5-15% progress
          
          if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            // Update completed
            const completedUpdate = {
              deviceId: data.deviceId,
              targetVersion: data.version,
              status: 'COMPLETED',
              progress: 100,
              timestamp: new Date().toISOString()
            };

            io.to(`device-${data.deviceId}`).emit('firmware-update-completed', completedUpdate);
            io.to('dashboard').emit('firmware-update-finished', {
              ...completedUpdate,
              completedBy: socket.id
            });
          } else {
            // Update progress
            const progressUpdate = {
              deviceId: data.deviceId,
              targetVersion: data.version,
              status: 'IN_PROGRESS',
              progress: Math.round(progress),
              timestamp: new Date().toISOString()
            };

            io.to(`device-${data.deviceId}`).emit('firmware-update-progress', progressUpdate);
          }
        }, 2000); // Update every 2 seconds

      } catch (error) {
        socket.emit('firmware-update-error', {
          deviceId: data.deviceId,
          error: 'Failed to start firmware update',
          timestamp: new Date().toISOString()
        });
      }
    });

    // Toplu cihaz operasyonları
    socket.on('bulk-device-command', async (data: {
      deviceIds: string[];
      command: string;
      parameters?: any;
    }) => {
      console.log(`📦 Bulk device command by ${socket.id}:`, data);
      
      try {
        const results = data.deviceIds.map(deviceId => ({
          deviceId,
          command: data.command,
          parameters: data.parameters || {},
          status: Math.random() > 0.1 ? 'SUCCESS' : 'FAILED',
          response: Math.random() > 0.1 ? 'Command executed successfully' : 'Device not responding',
          timestamp: new Date().toISOString(),
          executionTime: Math.random() * 1000 + 100
        }));

        const bulkResult = {
          totalDevices: data.deviceIds.length,
          successful: results.filter(r => r.status === 'SUCCESS').length,
          failed: results.filter(r => r.status === 'FAILED').length,
          results,
          timestamp: new Date().toISOString()
        };

        // Emit to dashboard room
        io.to('dashboard').emit('bulk-command-completed', {
          ...bulkResult,
          executedBy: socket.id
        });

        // Emit individual results to device rooms
        results.forEach(result => {
          io.to(`device-${result.deviceId}`).emit('device-command-response', result);
        });

      } catch (error) {
        socket.emit('bulk-command-error', {
          error: 'Failed to execute bulk command',
          timestamp: new Date().toISOString()
        });
      }
    });

    // Cihaz durumu sorgula
    socket.on('get-device-status', (deviceId: string) => {
      console.log(`📊 Device status requested by ${socket.id} for device: ${deviceId}`);
      
      // Simulate device status response
      const deviceStatus = {
        deviceId,
        status: Math.random() > 0.2 ? 'ONLINE' : 'OFFLINE',
        batteryLevel: Math.floor(Math.random() * 100),
        lastSeen: new Date().toISOString(),
        uptime: Math.floor(Math.random() * 86400), // 0-24 hours in seconds
        timestamp: new Date().toISOString()
      };

      socket.emit('device-status-response', deviceStatus);
    });

    // Ping-pong (bağlantı kontrolü)
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: new Date() });
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  // Server başladığında simülasyonu otomatik başlat
  setTimeout(() => {
    console.log('🚀 Auto-starting real-time data simulation...');
    realTimeDataService.start();
  }, 2000);

  return io;
} 