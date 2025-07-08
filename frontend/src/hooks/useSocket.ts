import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { SensorData } from '../sharedTypes';

interface SocketMessage {
  type: string;
  data: any;
  timestamp: Date;
}

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  lastMessage: SocketMessage | null;
  connect: () => void;
  disconnect: () => void;
  joinDashboard: () => void;
  joinDevice: (deviceId: string) => void;
  leaveDevice: (deviceId: string) => void;
  requestTestData: () => void;
  startSimulation: () => void;
  stopSimulation: () => void;
}

export const useSocket = (): UseSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<SocketMessage | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    if (socket?.connected) return;

    const newSocket = io(process.env.REACT_APP_WS_URL || 'http://localhost:3001', {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('🔌 Connected to server');
      setIsConnected(true);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 Disconnected from server');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('🔌 Connection error:', error);
      setIsConnected(false);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log(`🔌 Reconnected after ${attemptNumber} attempts`);
      setIsConnected(true);
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('🔌 Reconnection error:', error);
    });

    newSocket.on('reconnect_failed', () => {
      console.error('🔌 Reconnection failed');
    });

    // Dashboard mesajları
    newSocket.on('dashboard-init', (message: SocketMessage) => {
      console.log('📊 Dashboard initialized:', message);
      setLastMessage(message);
    });

    newSocket.on('sensor-data-update', (message: SocketMessage) => {
      console.log('📊 Sensor data update:', message);
      setLastMessage(message);
    });

    newSocket.on('device-status-change', (message: SocketMessage) => {
      console.log('📊 Device status change:', message);
      setLastMessage(message);
    });

    // Test mesajları
    newSocket.on('test-sensor-data', (data: SensorData) => {
      console.log('🧪 Test sensor data:', data);
      setLastMessage({
        type: 'test_sensor_data',
        data,
        timestamp: new Date()
      });
    });

    newSocket.on('simulation-status', (status: { running: boolean }) => {
      console.log('🎮 Simulation status:', status);
      setLastMessage({
        type: 'simulation_status',
        data: status,
        timestamp: new Date()
      });
    });

    // Ping-pong
    newSocket.on('pong', (data: { timestamp: Date }) => {
      console.log('🏓 Pong received:', data);
    });

    setSocket(newSocket);
  }, [socket]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  }, [socket]);

  const joinDashboard = useCallback(() => {
    if (socket?.connected) {
      socket.emit('join-dashboard');
    }
  }, [socket]);

  const joinDevice = useCallback((deviceId: string) => {
    if (socket?.connected) {
      socket.emit('join-device', deviceId);
    }
  }, [socket]);

  const leaveDevice = useCallback((deviceId: string) => {
    if (socket?.connected) {
      socket.emit('leave-device', deviceId);
    }
  }, [socket]);

  const requestTestData = useCallback(() => {
    if (socket?.connected) {
      socket.emit('request-test-data');
    }
  }, [socket]);

  const startSimulation = useCallback(() => {
    if (socket?.connected) {
      socket.emit('start-simulation');
    }
  }, [socket]);

  const stopSimulation = useCallback(() => {
    if (socket?.connected) {
      socket.emit('stop-simulation');
    }
  }, [socket]);

  // Otomatik bağlantı
  useEffect(() => {
    connect();

    return () => {
      disconnect();
      const timeoutRef = reconnectTimeoutRef.current;
      if (timeoutRef) {
        clearTimeout(timeoutRef);
      }
    };
  }, [connect, disconnect]);

  // Bağlantı durumuna göre dashboard'a katıl
  useEffect(() => {
    if (isConnected) {
      joinDashboard();
    }
  }, [isConnected, joinDashboard]);

  return {
    socket,
    isConnected,
    lastMessage,
    connect,
    disconnect,
    joinDashboard,
    joinDevice,
    leaveDevice,
    requestTestData,
    startSimulation,
    stopSimulation,
  };
}; 