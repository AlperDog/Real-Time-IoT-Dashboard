import { Router } from 'express';
import { ApiResponse } from '../../shared/types';

const router = Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // TODO: Implement authentication service
    const token = 'dummy-token';
    
    const response: ApiResponse = {
      success: true,
      data: { token },
      message: 'Login successful',
      timestamp: new Date()
    };
    
    res.json(response);
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid credentials',
      timestamp: new Date()
    });
  }
});

export default router; 