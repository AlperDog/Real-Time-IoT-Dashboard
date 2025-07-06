# 🔐 Authentication System Documentation

## Overview

The IoT Dashboard implements a comprehensive authentication system with JWT tokens, role-based access control (RBAC), and secure password management.

## Features

### ✅ **Implemented Features**

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Admin, Operator, and Viewer roles
- **Permission System**: Granular permissions for different actions
- **Password Security**: bcrypt hashing with salt
- **Token Refresh**: Automatic token refresh mechanism
- **Protected Routes**: Frontend route protection
- **User Management**: User registration and profile management
- **Password Reset**: Forgot password functionality
- **Session Management**: Persistent login sessions

### 🔄 **Authentication Flow**

```
1. User Login → 2. Server Validates → 3. JWT Token Generated → 4. Token Stored → 5. Protected Routes Access
```

## Backend Implementation

### Models

#### User Model (`backend/src/models/User.ts`)

```typescript
interface IUser {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  permissions: Permission[];
  isActive: boolean;
  lastLogin?: Date;
  // ... other fields
}
```

### Services

#### Auth Service (`backend/src/services/authService.ts`)

Key methods:

- `register()` - User registration
- `login()` - User authentication
- `refreshToken()` - Token refresh
- `verifyToken()` - Token validation
- `changePassword()` - Password change
- `forgotPassword()` - Password reset request
- `resetPassword()` - Password reset

### Middleware

#### Authentication Middleware (`backend/src/middleware/auth.ts`)

- `authenticate` - Verify JWT tokens
- `requireRole` - Check user roles
- `requirePermission` - Check specific permissions
- `optionalAuth` - Optional authentication

### Routes

#### Auth Routes (`backend/src/routes/auth.ts`)

```http
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
POST /api/auth/refresh      # Token refresh
GET  /api/auth/profile      # Get user profile
POST /api/auth/change-password    # Change password
POST /api/auth/forgot-password    # Request password reset
POST /api/auth/reset-password     # Reset password
POST /api/auth/logout       # Logout (client-side)
GET  /api/auth/users        # List users (admin only)
```

## Frontend Implementation

### Context

#### Auth Context (`frontend/src/contexts/AuthContext.tsx`)

Provides authentication state and methods:

- `user` - Current user data
- `token` - JWT token
- `isAuthenticated` - Authentication status
- `login()` - Login function
- `register()` - Registration function
- `logout()` - Logout function
- `refreshAuth()` - Token refresh

### Components

#### Login Form (`frontend/src/components/LoginForm.tsx`)

- Email/password validation
- Error handling
- Loading states
- Demo credentials display

#### Register Form (`frontend/src/components/RegisterForm.tsx`)

- User registration with role selection
- Password confirmation
- Form validation

#### Protected Route (`frontend/src/components/ProtectedRoute.tsx`)

- Route protection
- Permission checking
- Loading states
- Access denied handling

### API Integration

#### API Service (`frontend/src/services/api.ts`)

- Automatic token inclusion in requests
- 401 handling with redirect
- Error handling

## User Roles & Permissions

### Roles

1. **Admin** (`admin`)

   - Full system access
   - User management
   - System configuration

2. **Operator** (`operator`)

   - Device control
   - Alert management
   - Data read/write

3. **Viewer** (`viewer`)
   - Read-only access
   - View data and alerts
   - No device control

### Permissions

```typescript
enum Permission {
  READ_DEVICES = "read_devices",
  WRITE_DEVICES = "write_devices",
  READ_DATA = "read_data",
  WRITE_DATA = "write_data",
  READ_ALERTS = "read_alerts",
  MANAGE_ALERTS = "manage_alerts",
  MANAGE_USERS = "manage_users",
  MANAGE_SYSTEM = "manage_system",
}
```

## Security Features

### Password Security

- bcrypt hashing with salt rounds (12)
- Minimum 6 character requirement
- Password confirmation on registration

### Token Security

- JWT with expiration (24h default)
- Refresh tokens (7 days)
- Secure token storage in localStorage

### Input Validation

- Email format validation
- Password strength requirements
- Role and permission validation

### Rate Limiting

- API rate limiting implemented
- Brute force protection

## Demo Users

### Default Credentials

```bash
# Admin User
Email: admin@iot.com
Password: admin123
Role: Administrator
Permissions: All permissions

# Operator User
Email: operator@iot.com
Password: operator123
Role: Operator
Permissions: Device control, alert management

# Viewer User
Email: viewer@iot.com
Password: viewer123
Role: Viewer
Permissions: Read-only access
```

### Creating Demo Users

```bash
# Navigate to backend directory
cd backend

# Run seed script
npm run seed
```

## Environment Variables

### Backend (.env)

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
MONGODB_URI=mongodb://localhost:27017/iot-dashboard
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:3001
```

## Usage Examples

### Backend - Protecting Routes

```typescript
// Require authentication
router.get("/devices", authenticate, async (req, res) => {
  // Route logic
});

// Require specific role
router.post(
  "/users",
  authenticate,
  requireRole(["admin"]),
  async (req, res) => {
    // Admin only logic
  }
);

// Require specific permission
router.put(
  "/devices/:id",
  authenticate,
  requirePermission([Permission.WRITE_DEVICES]),
  async (req, res) => {
    // Device write permission required
  }
);
```

### Frontend - Using Auth Context

```typescript
import { useAuth } from "../contexts/AuthContext";

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

### Frontend - Protected Routes

```typescript
import ProtectedRoute from '../components/ProtectedRoute';

// Basic protection
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// With permission requirements
<ProtectedRoute requiredPermissions={['read_devices']}>
  <Devices />
</ProtectedRoute>
```

## API Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "name": "User Name",
      "role": "admin",
      "permissions": ["read_devices", "write_devices"]
    },
    "token": "jwt-token",
    "refreshToken": "refresh-token"
  },
  "message": "Login successful",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Invalid email or password",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Security Best Practices

### ✅ Implemented

- JWT token expiration
- Password hashing with bcrypt
- Input validation and sanitization
- Role-based access control
- Secure token storage
- Rate limiting
- CORS configuration

### 🔄 Recommended for Production

- HTTPS enforcement
- Token blacklisting
- Session management
- Audit logging
- Two-factor authentication
- Password complexity requirements
- Account lockout policies

## Troubleshooting

### Common Issues

1. **Token Expired**

   - Automatic refresh should handle this
   - Check refresh token validity

2. **Permission Denied**

   - Verify user role and permissions
   - Check route protection configuration

3. **Login Failed**

   - Verify email/password
   - Check user account status
   - Ensure database connection

4. **CORS Issues**
   - Verify CORS configuration
   - Check frontend URL settings

### Debug Commands

```bash
# Check user in database
docker-compose exec mongodb mongosh
use iot-dashboard
db.users.find()

# Check backend logs
docker-compose logs backend

# Reset demo users
cd backend && npm run seed
```

## Future Enhancements

- [ ] Two-factor authentication (2FA)
- [ ] OAuth integration (Google, GitHub)
- [ ] Session management
- [ ] Audit logging
- [ ] Account lockout policies
- [ ] Password complexity requirements
- [ ] Email verification
- [ ] Multi-tenancy support

---

**Last Updated**: January 2024  
**Version**: 1.0.0
