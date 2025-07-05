import { Router } from 'express';
import { ApiResponse } from '../sharedTypes';

const router = Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // TODO: Implement authentication service
    const user = { id: '1', email, name: 'Admin User' };
    const token = 'mock-jwt-token';
    
    const response: ApiResponse = {
      success: true,
      data: { user, token },
      message: 'Login successful',
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Login failed',
      timestamp: new Date().toISOString()
    });
  }
});

export default router; 