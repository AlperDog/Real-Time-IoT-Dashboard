import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import RealTimeDataService from './services/realTimeDataService';

export function setupSocketIO(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*', // test için tamamen açık
      methods: ['GET', 'POST'],
      credentials: true
    },
    allowEIO3: true // eski clientlar için
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
      // ... (implementasyon eksik veya kaldırıldı)
    });

  });

  return io;
}