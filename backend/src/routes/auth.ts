import { Router, Request, Response, NextFunction } from 'express';
const { body, validationResult } = require('express-validator');
import authService from '../services/authService';
import { authenticate, requireRole, AuthenticatedRequest } from '../middleware/auth';
import { UserRole } from '../sharedTypes';
import { ApiResponse } from '../sharedTypes';

const router = Router();

// Validation middleware
const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
];

const validateRegister = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 2, max: 50 }),
  body('role').optional().isIn(Object.values(UserRole))
];

const validateChangePassword = [
  body('currentPassword').isLength({ min: 6 }),
  body('newPassword').isLength({ min: 6 })
];

const validateForgotPassword = [
  body('email').isEmail().normalizeEmail()
];

const validateResetPassword = [
  body('token').isLength({ min: 32 }),
  body('newPassword').isLength({ min: 6 })
];

// Helper function to handle validation errors
const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array(),
      timestamp: new Date().toISOString()
    });
    return;
  }
  next();
};

// Register new user
router.post('/register', validateRegister, handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;
    
    const result = await authService.register({
      email,
      password,
      name,
      role
    });

    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'User registered successfully',
      timestamp: new Date().toISOString()
    };

    res.status(201).json(response);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Login
router.post('/login', validateLogin, handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const result = await authService.login({ email, password });

    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'Login successful',
      timestamp: new Date().toISOString()
    };

    res.json(response);
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Refresh token
router.post('/refresh', async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      res.status(400).json({
        success: false,
        error: 'Refresh token required',
        timestamp: new Date().toISOString()
      });
      return;
    }

    const result = await authService.refreshToken(refreshToken);

    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'Token refreshed successfully',
      timestamp: new Date().toISOString()
    };

    res.json(response);
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get current user profile
router.get('/profile', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
        timestamp: new Date().toISOString()
      });
      return;
    }
    
    const response: ApiResponse = {
      success: true,
      data: req.user,
      message: 'Profile retrieved successfully',
      timestamp: new Date().toISOString()
    };

    res.json(response);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to get profile',
      timestamp: new Date().toISOString()
    });
  }
});

// Change password
router.post('/change-password', authenticate, validateChangePassword, handleValidationErrors, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
        timestamp: new Date().toISOString()
      });
      return;
    }
    
    await authService.changePassword(req.user.userId, currentPassword, newPassword);

    const response: ApiResponse = {
      success: true,
      message: 'Password changed successfully',
      timestamp: new Date().toISOString()
    };

    res.json(response);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Forgot password
router.post('/forgot-password', validateForgotPassword, handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    await authService.forgotPassword(email);

    const response: ApiResponse = {
      success: true,
      message: 'Password reset email sent (check console for token)',
      timestamp: new Date().toISOString()
    };

    res.json(response);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to process forgot password request',
      timestamp: new Date().toISOString()
    });
  }
});

// Reset password
router.post('/reset-password', validateResetPassword, handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    
    await authService.resetPassword(token, newPassword);

    const response: ApiResponse = {
      success: true,
      message: 'Password reset successfully',
      timestamp: new Date().toISOString()
    };

    res.json(response);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Logout (client-side token removal)
router.post('/logout', authenticate, async (req: Request, res: Response) => {
  try {
    const response: ApiResponse = {
      success: true,
      message: 'Logout successful',
      timestamp: new Date().toISOString()
    };

    res.json(response);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Logout failed',
      timestamp: new Date().toISOString()
    });
  }
});

// Admin only: Get all users
router.get('/users', authenticate, requireRole([UserRole.ADMIN]), async (req: Request, res: Response) => {
  try {
    // TODO: Implement user listing service
    const response: ApiResponse = {
      success: true,
      data: [],
      message: 'Users retrieved successfully',
      timestamp: new Date().toISOString()
    };

    res.json(response);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to get users',
      timestamp: new Date().toISOString()
    });
  }
});

export default router; 