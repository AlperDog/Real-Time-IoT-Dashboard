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

// ===== DEVICE CONTROL ENDPOINTS =====

// Send command to device
router.post('/:id/command', async (req, res) => {
  try {
    const { id } = req.params;
    const { command, parameters } = req.body;
    
    const device = mockDevices.find(d => d.id === id);
    
    if (!device) {
      return res.status(404).json({
        success: false,
        error: 'Device not found',
        timestamp: new Date().toISOString()
      });
    }
    
    // Simulate command execution
    const commandResult = {
      deviceId: id,
      command,
      parameters,
      status: 'SUCCESS',
      response: `Command ${command} executed successfully`,
      timestamp: new Date().toISOString(),
      executionTime: Math.random() * 1000 + 100 // 100-1100ms
    };
    
    const response: ApiResponse = {
      success: true,
      data: commandResult,
      message: 'Command sent successfully',
      timestamp: new Date().toISOString()
    };
    
    return res.json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to send command',
      timestamp: new Date().toISOString()
    });
  }
});

// Update device configuration
router.put('/:id/config', async (req, res) => {
  try {
    const { id } = req.params;
    const config = req.body;
    
    const device = mockDevices.find(d => d.id === id);
    
    if (!device) {
      return res.status(404).json({
        success: false,
        error: 'Device not found',
        timestamp: new Date().toISOString()
      });
    }
    
    // Simulate configuration update
    const updatedConfig = {
      deviceId: id,
      previousConfig: { ...device },
      newConfig: config,
      status: 'UPDATED',
      timestamp: new Date().toISOString()
    };
    
    const response: ApiResponse = {
      success: true,
      data: updatedConfig,
      message: 'Device configuration updated successfully',
      timestamp: new Date().toISOString()
    };
    
    return res.json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to update device configuration',
      timestamp: new Date().toISOString()
    });
  }
});

// Get device firmware info
router.get('/:id/firmware', async (req, res) => {
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
    
    // Mock firmware info
    const firmwareInfo = {
      deviceId: id,
      currentVersion: '1.2.3',
      latestVersion: '1.3.0',
      updateAvailable: true,
      lastUpdate: '2024-01-01T00:00:00.000Z',
      updateSize: '2.5MB',
      changelog: [
        'Bug fixes and performance improvements',
        'New sensor calibration features',
        'Enhanced security protocols'
      ]
    };
    
    const response: ApiResponse = {
      success: true,
      data: firmwareInfo,
      timestamp: new Date().toISOString()
    };
    
    return res.json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch firmware info',
      timestamp: new Date().toISOString()
    });
  }
});

// Update device firmware
router.post('/:id/firmware/update', async (req, res) => {
  try {
    const { id } = req.params;
    const { version } = req.body;
    
    const device = mockDevices.find(d => d.id === id);
    
    if (!device) {
      return res.status(404).json({
        success: false,
        error: 'Device not found',
        timestamp: new Date().toISOString()
      });
    }
    
    // Simulate firmware update
    const updateResult = {
      deviceId: id,
      targetVersion: version,
      status: 'IN_PROGRESS',
      progress: 0,
      estimatedTime: 300, // seconds
      timestamp: new Date().toISOString()
    };
    
    const response: ApiResponse = {
      success: true,
      data: updateResult,
      message: 'Firmware update started',
      timestamp: new Date().toISOString()
    };
    
    return res.json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to start firmware update',
      timestamp: new Date().toISOString()
    });
  }
});

// Get device command history
router.get('/:id/commands', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 50 } = req.query;
    
    const device = mockDevices.find(d => d.id === id);
    
    if (!device) {
      return res.status(404).json({
        success: false,
        error: 'Device not found',
        timestamp: new Date().toISOString()
      });
    }
    
    // Mock command history
    const commandHistory = Array.from({ length: Math.min(Number(limit), 50) }, (_, i) => ({
      id: `cmd-${id}-${i}`,
      deviceId: id,
      command: ['RESTART', 'CALIBRATE', 'UPDATE_CONFIG', 'GET_STATUS'][Math.floor(Math.random() * 4)],
      parameters: {},
      status: ['SUCCESS', 'FAILED', 'PENDING'][Math.floor(Math.random() * 3)],
      response: 'Command executed successfully',
      timestamp: new Date(Date.now() - i * 60000).toISOString(), // Each command 1 minute apart
      executionTime: Math.random() * 1000 + 100
    }));
    
    const response: ApiResponse = {
      success: true,
      data: commandHistory,
      timestamp: new Date().toISOString()
    };
    
    return res.json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch command history',
      timestamp: new Date().toISOString()
    });
  }
});

// Bulk device operations
router.post('/bulk/command', async (req, res) => {
  try {
    const { deviceIds, command, parameters } = req.body;
    
    if (!deviceIds || !Array.isArray(deviceIds) || deviceIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Device IDs array is required',
        timestamp: new Date().toISOString()
      });
    }
    
    // Simulate bulk command execution
    const results = deviceIds.map(deviceId => ({
      deviceId,
      command,
      parameters,
      status: Math.random() > 0.1 ? 'SUCCESS' : 'FAILED', // 90% success rate
      response: Math.random() > 0.1 ? 'Command executed successfully' : 'Device not responding',
      timestamp: new Date().toISOString(),
      executionTime: Math.random() * 1000 + 100
    }));
    
    const response: ApiResponse = {
      success: true,
      data: {
        totalDevices: deviceIds.length,
        successful: results.filter(r => r.status === 'SUCCESS').length,
        failed: results.filter(r => r.status === 'FAILED').length,
        results
      },
      message: 'Bulk command executed',
      timestamp: new Date().toISOString()
    };
    
    return res.json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to execute bulk command',
      timestamp: new Date().toISOString()
    });
  }
});

export default router; 