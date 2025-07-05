# Real-Time IoT Dashboard

A modern, scalable real-time dashboard for IoT data visualization and analytics built with React, Node.js, and TypeScript.

## 🚀 Features

- **Real-time Data Streaming**: Live sensor data visualization using WebSocket
- **Interactive Charts**: Multiple chart types (line, bar, gauge) using Chart.js
- **Responsive Design**: Mobile-first approach with modern UI/UX using Tailwind CSS
- **Data Analytics**: Real-time statistics and trend analysis
- **Scalable Architecture**: Microservices-ready backend with Redis caching
- **Real-time Alerts**: Configurable threshold-based notifications
- **Device Management**: IoT device configuration and monitoring
- **Docker Support**: Complete containerization with Docker Compose
- **TypeScript**: Full type safety across frontend and backend
- **Hot Reload**: Development environment with automatic reloading

## 🛠 Tech Stack

### Frontend

- **React 18** with TypeScript
- **Chart.js** for data visualization
- **Tailwind CSS** for styling
- **Socket.io Client** for real-time communication
- **React Query** for data fetching
- **Framer Motion** for animations
- **React Router** for navigation
- **@heroicons/react** for icons

### Backend

- **Node.js** with Express
- **TypeScript** for type safety
- **Socket.io** for real-time communication
- **Redis** for caching and pub/sub
- **MongoDB** for data persistence
- **JWT** for authentication (ready for implementation)
- **CORS** and rate limiting middleware
- **Nodemon** for development

### Infrastructure

- **Docker** and **Docker Compose** for containerization
- **MongoDB 6.0** for database
- **Redis 7-alpine** for caching
- **Multi-stage builds** for optimized containers

## 📊 Dashboard Components

1. **Sensor Overview**: Real-time sensor status and health monitoring
2. **Data Visualization**: Interactive charts and graphs for sensor data
3. **Analytics Panel**: Statistical analysis and trend visualization
4. **Alert System**: Real-time notifications and alert management
5. **Device Management**: IoT device configuration and status monitoring
6. **Real-time Controls**: Start/stop simulation and test data generation

## 🚀 Quick Start

### Prerequisites

- **Docker** and **Docker Compose** (recommended)
- Node.js 18+ (for local development)
- Git

### Option 1: Docker (Recommended)

1. **Clone the repository**

```bash
git clone https://github.com/AlperDog/Real-Time-IoT-Dashboard.git
cd Real-Time-IoT-Dashboard
```

2. **Start with Docker Compose**

```bash
# Start all services
docker-compose up --build

# Or use Docker Compose Watch for development
docker compose watch
```

3. **Access the application**

The application will be available at:

- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/health
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379

### Option 2: Manual Setup

1. **Clone the repository**

```bash
git clone https://github.com/AlperDog/Real-Time-IoT-Dashboard.git
cd Real-Time-IoT-Dashboard
```

2. **Install dependencies**

```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

3. **Environment Setup**

Create environment files:

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration

# Frontend
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your configuration
```

4. **Start the application**

```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm start
```

## 📁 Project Structure

```
Real-Time-IoT-Dashboard/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── LineChart.tsx
│   │   │   ├── GaugeChart.tsx
│   │   │   ├── DeviceStatus.tsx
│   │   │   └── AlertList.tsx
│   │   ├── pages/          # Page components
│   │   │   └── Dashboard.tsx
│   │   ├── hooks/          # Custom React hooks
│   │   │   └── useSocket.ts
│   │   ├── services/       # API and WebSocket services
│   │   │   └── api.ts
│   │   ├── sharedTypes.ts  # TypeScript type definitions
│   │   └── App.tsx         # Main application component
│   ├── public/             # Static assets
│   ├── Dockerfile          # Frontend container configuration
│   └── package.json        # Frontend dependencies
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── routes/         # API routes
│   │   │   ├── devices.ts
│   │   │   ├── sensors.ts
│   │   │   ├── alerts.ts
│   │   │   ├── analytics.ts
│   │   │   ├── dashboard.ts
│   │   │   └── auth.ts
│   │   ├── services/       # Business logic and mock data
│   │   │   ├── mockDataService.ts
│   │   │   └── realTimeDataService.ts
│   │   ├── middleware/     # Custom middleware
│   │   │   ├── errorHandler.ts
│   │   │   └── notFound.ts
│   │   ├── config/         # Configuration files
│   │   │   ├── database.ts
│   │   │   └── redis.ts
│   │   ├── sharedTypes.ts  # Shared TypeScript types
│   │   ├── socket.ts       # Socket.IO configuration
│   │   └── index.ts        # Main server file
│   ├── Dockerfile          # Backend container configuration
│   └── package.json        # Backend dependencies
├── docker-compose.yml      # Multi-container setup
└── README.md              # Project documentation
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**

```env
PORT=3001
MONGODB_URI=mongodb://mongodb:27017/iot-dashboard
REDIS_URL=redis://redis:6379
JWT_SECRET=your-jwt-secret-key
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env)**

```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_WS_URL=http://localhost:3001
REACT_APP_ENV=development
```

## 📈 Features in Detail

### Real-time Data Streaming

- **WebSocket Connection**: Live data updates via Socket.IO
- **Automatic Reconnection**: Handles connection drops gracefully
- **Data Buffering**: Offline scenario support
- **Mock IoT Simulation**: Realistic sensor data generation
- **Simulation Controls**: Start/stop real-time data simulation

### Interactive Charts

- **Line Charts**: Time-series data visualization
- **Gauge Charts**: Sensor readings with thresholds
- **Real-time Updates**: Live chart updates
- **Responsive Design**: Mobile-friendly charts

### Analytics & Insights

- **Real-time Statistics**: Live dashboard metrics
- **Device Status Monitoring**: Online/offline device tracking
- **Alert Management**: Configurable alert thresholds
- **Data Trends**: Historical data analysis

### Device Management

- **Device Status**: Real-time device health monitoring
- **Battery Levels**: Device battery monitoring
- **Location Tracking**: Device location information
- **Status Indicators**: Visual status representation

## 🚀 API Endpoints

### Dashboard

- `GET /api/dashboard/stats` - Dashboard statistics

### Devices

- `GET /api/devices` - Get all devices
- `GET /api/devices/:id` - Get device by ID

### Sensors

- `GET /api/sensors/data` - Get sensor data
- `GET /api/sensors/realtime` - Get real-time sensor data

### Alerts

- `GET /api/alerts` - Get all alerts
- `GET /api/alerts/:id` - Get alert by ID

### Analytics

- `GET /api/analytics` - Get analytics data

### Health Check

- `GET /health` - Application health status

## 🔌 WebSocket Events

### Client to Server

- `join-dashboard` - Join dashboard room
- `join-device` - Listen to specific device
- `leave-device` - Stop listening to device
- `request-test-data` - Request test data
- `start-simulation` - Start data simulation
- `stop-simulation` - Stop data simulation
- `ping` - Connection test

### Server to Client

- `dashboard-init` - Dashboard initialization
- `sensor_data_update` - Real-time sensor data
- `device_status_update` - Device status changes
- `alert_update` - New alert notifications
- `simulation_status` - Simulation status update
- `pong` - Connection test response

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up --build

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild containers
docker-compose build --no-cache

# Restart specific service
docker-compose restart backend

# View running containers
docker-compose ps
```

## 🧪 Development

### Available Scripts

**Backend:**

```bash
npm run dev          # Start development server with nodemon
npm run build        # Build TypeScript
npm run start        # Start production server
npm run test         # Run tests
```

**Frontend:**

```bash
npm start            # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm run eject        # Eject from Create React App
```

### Hot Reload

The development environment includes hot reload for both frontend and backend:

- **Frontend**: React development server with hot reload
- **Backend**: Nodemon with TypeScript support
- **Docker**: Volume mounts for live code updates

## 🚀 Deployment

### Production Build

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb://your-mongodb-uri
REDIS_URL=redis://your-redis-uri
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=https://your-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React** team for the amazing frontend framework
- **Node.js** community for the robust backend runtime
- **Socket.IO** for real-time communication
- **Chart.js** for data visualization
- **Tailwind CSS** for utility-first styling

## 📞 Support

If you have any questions or need help:

- Create an issue on GitHub
- Check the documentation
- Review the code examples

---

**Built with ❤️ for IoT enthusiasts and developers**
