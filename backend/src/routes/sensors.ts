import { Router, Request, Response } from 'express';
import { SensorData, SensorType } from '../sharedTypes';
import { ApiResponse } from '../sharedTypes';

const router = Router();

// Get all sensor data
router.get('/', async (req: Request, res: Response) => {
  try {
    // For now, return mock data
    const mockSensorData: SensorData[] = [
      {
        id: '1',
        deviceId: 'device-1',
        timestamp: new Date(),
        value: 25.5,
        unit: '°C',
        type: SensorType.TEMPERATURE,
        quality: 'excellent',
        metadata: {
          battery: 85,
          signal: 90
        }
      },
      {
        id: '2',
        deviceId: 'device-1',
        timestamp: new Date(),
        value: 60.2,
        unit: '%',
        type: SensorType.HUMIDITY,
        quality: 'good',
        metadata: {
          battery: 85,
          signal: 90
        }
      },
      {
        id: '3',
        deviceId: 'device-2',
        timestamp: new Date(),
        value: 500,
        unit: 'lux',
        type: SensorType.LIGHT,
        quality: 'fair',
        metadata: {
          battery: 75,
          signal: 85
        }
      }
    ];

    const response: ApiResponse<SensorData[]> = {
      success: true,
      data: mockSensorData,
      message: 'Sensor data retrieved successfully',
      timestamp: new Date().toISOString()
    };

    res.json(response);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get sensor data by device ID
router.get('/device/:deviceId', async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    
    // Mock data for specific device
    const mockSensorData: SensorData[] = [
      {
        id: '1',
        deviceId: deviceId,
        timestamp: new Date(),
        value: 25.5,
        unit: '°C',
        type: SensorType.TEMPERATURE,
        quality: 'excellent',
        metadata: {
          battery: 85,
          signal: 90
        }
      },
      {
        id: '2',
        deviceId: deviceId,
        timestamp: new Date(),
        value: 60.2,
        unit: '%',
        type: SensorType.HUMIDITY,
        quality: 'good',
        metadata: {
          battery: 85,
          signal: 90
        }
      }
    ];

    const response: ApiResponse<SensorData[]> = {
      success: true,
      data: mockSensorData,
      message: `Sensor data for device ${deviceId} retrieved successfully`,
      timestamp: new Date().toISOString()
    };

    res.json(response);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get sensor data by type
router.get('/type/:type', async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    
    // Mock data for specific sensor type
    const mockSensorData: SensorData[] = [
      {
        id: '1',
        deviceId: 'device-1',
        timestamp: new Date(),
        value: 25.5,
        unit: type === SensorType.TEMPERATURE ? '°C' : type === SensorType.HUMIDITY ? '%' : 'lux',
        type: type as SensorType,
        quality: 'excellent',
        metadata: {
          battery: 85,
          signal: 90
        }
      }
    ];

    const response: ApiResponse<SensorData[]> = {
      success: true,
      data: mockSensorData,
      message: `Sensor data for type ${type} retrieved successfully`,
      timestamp: new Date().toISOString()
    };

    res.json(response);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router; 