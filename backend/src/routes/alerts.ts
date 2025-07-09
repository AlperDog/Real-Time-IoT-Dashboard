import { Router } from 'express';
import { ApiResponse } from '../sharedTypes';
import { generateMockAlerts } from '../services/mockDataService';

const router = Router();

// Get all alerts
router.get('/', async (req, res) => {
  try {
    const alerts = generateMockAlerts();
    const response: ApiResponse = {
      success: true,
      data: alerts,
      timestamp: new Date().toISOString()
    };
    return res.json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch alerts',
      timestamp: new Date().toISOString()
    });
  }
});

// Get alert by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const alerts = generateMockAlerts();
    const alert = alerts.find(a => a.id === id);
    if (!alert) {
      return res.status(404).json({
        success: false,
        error: 'Alert not found',
        timestamp: new Date().toISOString()
      });
    }
    const response: ApiResponse = {
      success: true,
      data: alert,
      timestamp: new Date().toISOString()
    };
    return res.json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch alert',
      timestamp: new Date().toISOString()
    });
  }
});

// Acknowledge alert
router.post('/:id/acknowledge', async (req, res) => {
  try {
    const { id } = req.params;
    
    const response: ApiResponse = {
      success: true,
      message: 'Alert acknowledged successfully',
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to acknowledge alert',
      timestamp: new Date().toISOString()
    });
  }
});

// Resolve alert
router.post('/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;
    
    const response: ApiResponse = {
      success: true,
      message: 'Alert resolved successfully',
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to resolve alert',
      timestamp: new Date().toISOString()
    });
  }
});

export default router; 