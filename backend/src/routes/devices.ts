import { Router } from 'express';
import { ApiResponse } from '../sharedTypes';
import { mockDevices } from '../services/mockDataService';

const router = Router();

// Get all devices
router.get('/', async (req, res) => {
  try {
    const devices = mockDevices;
    
    const response: ApiResponse = {
      success: true,
      data: devices,
      timestamp: new Date().toISOString()
    };
    
    return res.json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch devices',
      timestamp: new Date().toISOString()
    });
  }
});

// Get device by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const device = mockDevices.find(d => d.id === id);
    
    if (!device) {
      return res.status(404).json({
        success: false,
        error: 'Device not found',
        timestamp: new Date().toISOString()
      });
    }
    
    const response: ApiResponse = {
      success: true,
      data: device,
      timestamp: new Date().toISOString()
    };
    
    return res.json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch device',
      timestamp: new Date().toISOString()
    });
  }
});

export default router; 