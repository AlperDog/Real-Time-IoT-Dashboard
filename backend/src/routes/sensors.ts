import { Router } from 'express';
import { ApiResponse } from '../sharedTypes';
import { generateMockSensorData } from '../services/mockDataService';

const router = Router();

// Get sensor data
router.get('/data', async (req, res) => {
  try {
    const { deviceId, limit = 24 } = req.query;
    
    // TODO: Implement sensor service
    const sensorData = generateMockSensorData(deviceId as string, Number(limit));
    
    const response: ApiResponse = {
      success: true,
      data: sensorData,
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sensor data',
      timestamp: new Date().toISOString()
    });
  }
});

// Get real-time sensor data
router.get('/realtime', async (req, res) => {
  try {
    const { deviceId } = req.query;
    
    // TODO: Implement real-time sensor service
    const realtimeData: any[] = [];
    
    const response: ApiResponse = {
      success: true,
      data: realtimeData,
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch real-time sensor data',
      timestamp: new Date().toISOString()
    });
  }
});

// Get sensor data by device
router.get('/device/:deviceId', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { limit = 24 } = req.query;
    
    // TODO: Implement sensor service
    const sensorData = generateMockSensorData(deviceId, Number(limit));
    
    const response: ApiResponse = {
      success: true,
      data: sensorData,
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sensor data for device',
      timestamp: new Date().toISOString()
    });
  }
});

export default router; 