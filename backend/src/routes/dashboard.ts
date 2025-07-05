import { Router } from 'express';
import { ApiResponse } from '../../shared/types';

const router = Router();

// Get dashboard widgets
router.get('/widgets', async (req, res) => {
  try {
    const widgets = [];
    
    const response: ApiResponse = {
      success: true,
      data: widgets,
      timestamp: new Date()
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard widgets',
      timestamp: new Date()
    });
  }
});

export default router; 