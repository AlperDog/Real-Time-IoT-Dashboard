# 🚀 Real-Time IoT Dashboard

A modern, full-stack IoT dashboard built with React, Node.js, and TypeScript. Features real-time device monitoring, sensor data visualization, alert management, and **advanced device control capabilities**.

![IoT Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-18-green)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)

## ✨ Features

### 📊 **Real-Time Monitoring**

- Live sensor data visualization with Chart.js
- Real-time device status updates via WebSocket
- Interactive dashboards with Framer Motion animations
- Responsive design for all devices

### 🎮 **Advanced Device Control** 🆕

- **Remote Device Commands**: Restart, calibrate, emergency stop
- **Live Configuration Management**: Real-time parameter updates
- **Firmware Management**: OTA updates with progress tracking
- **Bulk Operations**: Multi-device command execution
- **Command History**: Track all device interactions
- **Real-time Response**: Instant feedback on command execution

### 📈 **Analytics & Insights**

- Comprehensive analytics dashboard
- Historical data trends
- Performance metrics
- System health monitoring

### 🚨 **Alert Management**

- Real-time alert notifications
- Severity-based alert categorization
- Alert acknowledgment system
- Automated alert resolution

### 🔧 **System Management**

- Device registration and management
- Sensor configuration
- User authentication (ready for implementation)
- System configuration

## 🛠 Tech Stack

### Frontend

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Query** for data fetching
- **Chart.js** for data visualization
- **Framer Motion** for animations
- **Socket.IO Client** for real-time communication

### Backend

- **Node.js** with TypeScript
- **Express.js** framework
- **Socket.IO** for WebSocket communication
- **MongoDB** for data persistence
- **Redis** for caching and sessions
- **JWT** for authentication (ready)

### DevOps

- **Docker** containerization
- **Docker Compose** for orchestration
- **TypeScript** for type safety
- **ESLint** for code quality

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for development)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/iot-dashboard.git
cd iot-dashboard
```

### 2. Start with Docker

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: See `API.md`

### 4. Development Setup (Optional)

```bash
# Install dependencies
npm install

# Start development servers
npm run dev:backend  # Backend on port 5000
npm run dev:frontend # Frontend on port 3000
```

## 📁 Project Structure

```
iot-dashboard/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── DeviceControl.tsx    # 🆕 Device control interface
│   │   │   ├── FirmwareManager.tsx  # 🆕 Firmware management
│   │   │   ├── BulkOperations.tsx   # 🆕 Bulk device operations
│   │   │   └── ...
│   │   ├── services/         # API services
│   │   ├── hooks/           # Custom React hooks
│   │   └── sharedTypes.ts   # Shared TypeScript types
│   └── package.json
├── backend/                  # Node.js backend application
│   ├── src/
│   │   ├── routes/          # API routes
│   │   │   └── devices.ts   # 🆕 Enhanced with device control
│   │   ├── services/        # Business logic
│   │   ├── socket.ts        # 🆕 WebSocket with device control
│   │   └── app.ts           # Express app setup
│   └── package.json
├── shared/                   # Shared TypeScript types
├── docker-compose.yml        # Docker orchestration
├── Dockerfile.frontend       # Frontend Dockerfile
├── Dockerfile.backend        # Backend Dockerfile
└── README.md
```

## 🔌 API Endpoints

### Device Control Endpoints 🆕

```http
POST /api/devices/{id}/command          # Send command to device
PUT  /api/devices/{id}/config           # Update device configuration
GET  /api/devices/{id}/firmware         # Get firmware info
POST /api/devices/{id}/firmware/update  # Start firmware update
GET  /api/devices/{id}/commands         # Get command history
POST /api/devices/bulk/command          # Bulk device operations
```

### Standard Endpoints

```http
GET  /api/devices                        # Get all devices
GET  /api/devices/{id}                   # Get device by ID
GET  /api/sensors                        # Get sensor data
GET  /api/alerts                         # Get alerts
GET  /api/analytics/dashboard            # Get dashboard analytics
```

## 🔄 WebSocket Events

### Device Control Events 🆕

```javascript
// Send device command
socket.emit("send-device-command", {
  deviceId: "device-001",
  command: "RESTART",
  parameters: { delay: 5000 },
});

// Update device configuration
socket.emit("update-device-config", {
  deviceId: "device-001",
  config: { samplingRate: 30 },
});

// Start firmware update
socket.emit("start-firmware-update", {
  deviceId: "device-001",
  version: "1.3.0",
});

// Bulk device command
socket.emit("bulk-device-command", {
  deviceIds: ["device-001", "device-002"],
  command: "RESTART",
});
```

### Real-time Events

```javascript
// Listen for real-time updates
socket.on("sensor-data", (data) => {
  /* Handle sensor data */
});
socket.on("device-status-update", (data) => {
  /* Handle status changes */
});
socket.on("new-alert", (data) => {
  /* Handle new alerts */
});
socket.on("device-command-response", (data) => {
  /* Handle command responses */
});
```

## 🎮 Device Control Features

### 1. **Remote Commands**

- **Restart**: Safely restart devices
- **Calibrate**: Recalibrate sensors
- **Emergency Stop**: Immediate device shutdown
- **Status Check**: Get device health status

### 2. **Configuration Management**

- **Real-time Updates**: Change device parameters instantly
- **Threshold Settings**: Configure alert thresholds
- **Sampling Rates**: Adjust data collection frequency
- **Alert Rules**: Set up notification preferences

### 3. **Firmware Management**

- **Version Control**: Track firmware versions
- **OTA Updates**: Over-the-air firmware updates
- **Progress Tracking**: Real-time update progress
- **Rollback Support**: Revert to previous versions

### 4. **Bulk Operations**

- **Multi-device Commands**: Execute commands on multiple devices
- **Batch Processing**: Efficient bulk operations
- **Status Tracking**: Monitor bulk operation progress
- **Error Handling**: Graceful failure management

## 🐳 Docker Commands

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# View logs
docker compose logs -f [service-name]

# Rebuild and restart
docker compose up -d --build

# Access container shell
docker compose exec [service-name] sh
```

## 🔧 Development

### Environment Variables

Create `.env` files in frontend and backend directories:

**Backend (.env)**

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/iot-dashboard
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env)**

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_WS_URL=http://localhost:5000
```

### Available Scripts

```bash
# Development
npm run dev:backend    # Start backend in development mode
npm run dev:frontend   # Start frontend in development mode
npm run dev           # Start both frontend and backend

# Building
npm run build:backend  # Build backend
npm run build:frontend # Build frontend
npm run build         # Build both

# Testing
npm run test          # Run tests
npm run test:watch    # Run tests in watch mode

# Linting
npm run lint          # Run ESLint
npm run lint:fix      # Fix linting issues
```

## 📊 Monitoring & Analytics

### Real-time Metrics

- Device online/offline status
- Sensor data trends
- Alert frequency and severity
- System performance metrics

### Historical Data

- 24-hour, 7-day, and 30-day views
- Data export capabilities
- Trend analysis
- Performance reports

## 🔒 Security Features

- **Input Validation**: All inputs are validated
- **Rate Limiting**: API rate limiting implemented
- **CORS Configuration**: Secure cross-origin requests
- **Error Handling**: Comprehensive error management
- **Authentication Ready**: JWT implementation prepared

## 🚀 Deployment

### Production Deployment

```bash
# Build production images
docker compose -f docker-compose.prod.yml up -d

# With environment variables
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

### Environment Configuration

- Set production environment variables
- Configure database connections
- Set up SSL certificates
- Configure monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [API.md](API.md) for detailed API documentation
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

## 🔮 Roadmap

- [ ] **Authentication System**: User management and role-based access
- [ ] **Advanced Analytics**: Machine learning insights
- [ ] **Mobile App**: React Native mobile application
- [ ] **Cloud Integration**: AWS/Azure cloud deployment
- [ ] **Edge Computing**: Local processing capabilities
- [ ] **API Gateway**: Enhanced API management
- [ ] **Multi-tenancy**: Support for multiple organizations

---

**Built with ❤️ for the IoT community**
