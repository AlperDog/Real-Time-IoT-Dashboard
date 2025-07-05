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