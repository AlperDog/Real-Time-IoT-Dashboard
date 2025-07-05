import { Server } from 'socket.io';
import { EventType, WebSocketEvent } from '../../shared/types';

export function setupSocketIO(io: Server): void {
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Join device-specific rooms
    socket.on('join-device', (deviceId: string) => {
      socket.join(`device-${deviceId}`);
      console.log(`Client ${socket.id} joined device room: ${deviceId}`);
    });

    // Leave device-specific rooms
    socket.on('leave-device', (deviceId: string) => {
      socket.leave(`device-${deviceId}`);
      console.log(`Client ${socket.id} left device room: ${deviceId}`);
    });

    // Join dashboard room
    socket.on('join-dashboard', () => {
      socket.join('dashboard');
      console.log(`Client ${socket.id} joined dashboard room`);
    });

    // Handle sensor data updates
    socket.on('sensor-data', (data) => {
      // Broadcast to all clients in the device room
      socket.to(`device-${data.deviceId}`).emit('sensor-data-update', {
        type: EventType.SENSOR_DATA_UPDATE,
        data,
        timestamp: new Date()
      } as WebSocketEvent);
    });

    // Handle device status changes
    socket.on('device-status', (data) => {
      // Broadcast to dashboard room
      socket.to('dashboard').emit('device-status-change', {
        type: EventType.DEVICE_STATUS_CHANGE,
        data,
        timestamp: new Date()
      } as WebSocketEvent);
    });

    // Handle alerts
    socket.on('alert', (data) => {
      // Broadcast to dashboard room
      socket.to('dashboard').emit('alert-update', {
        type: EventType.ALERT_CREATED,
        data,
        timestamp: new Date()
      } as WebSocketEvent);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  // Emit system status every 30 seconds
  setInterval(() => {
    const systemStatus = {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date()
    };

    io.to('dashboard').emit('system-status', {
      type: EventType.SYSTEM_STATUS,
      data: systemStatus,
      timestamp: new Date()
    } as WebSocketEvent);
  }, 30000);
}

// Utility function to emit events to specific rooms
export function emitToRoom(io: Server, room: string, event: string, data: any): void {
  io.to(room).emit(event, {
    type: event,
    data,
    timestamp: new Date()
  } as WebSocketEvent);
}

// Utility function to emit events to all connected clients
export function emitToAll(io: Server, event: string, data: any): void {
  io.emit(event, {
    type: event,
    data,
    timestamp: new Date()
  } as WebSocketEvent);
} 