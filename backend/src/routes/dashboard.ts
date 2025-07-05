import { Router } from 'express';
import { ApiResponse, DashboardStats } from '../sharedTypes';

const router = Router();

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    // TODO: Implement dashboard service
    const stats: DashboardStats = {
      totalDevices: 10,
      onlineDevices: 8,
      offlineDevices: 2,
      activeSensors: 25,
      totalAlerts: 5,
      activeAlerts: 2,
      averageTemperature: 22.5,
      averageHumidity: 45.2,
      dataPointsToday: 1440,
      systemUptime: 99.8
    };
    
    const response: ApiResponse = {
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard stats',
      timestamp: new Date().toISOString()
    });
  }
});

export default router; 