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

## 🛠 Tech Stack

### Frontend

- **React 18** with TypeScript
- **Chart.js** for data visualization
- **Tailwind CSS** for styling
- **Socket.io Client** for real-time communication
- **React Query** for data fetching
- **Framer Motion** for animations
- **React Router** for navigation

### Backend

- **Node.js** with Express
- **TypeScript** for type safety
- **Socket.io** for real-time communication
- **Redis** for caching and pub/sub
- **MongoDB** for data persistence
- **JWT** for authentication
- **CORS** and rate limiting middleware

## 📊 Dashboard Components

1. **Sensor Overview**: Real-time sensor status and health monitoring
2. **Data Visualization**: Interactive charts and graphs for sensor data
3. **Analytics Panel**: Statistical analysis and trend visualization
4. **Alert System**: Real-time notifications and alert management
5. **Device Management**: IoT device configuration and status monitoring

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker and Docker Compose (recommended)
- MongoDB
- Redis

### Option 1: Docker (Recommended)

1. **Clone the repository**

```bash
git clone https://github.com/AlperDog/Real-Time-IoT-Dashboard.git
cd Real-Time-IoT-Dashboard
```

2. **Start with Docker Compose**

```bash
docker-compose up --build
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- MongoDB: localhost:27017
- Redis: localhost:6379

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

```bash
# Backend
cp backend/env.example backend/.env
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
npm run dev
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
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API and WebSocket services
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   ├── Dockerfile          # Frontend container configuration
│   └── package.json        # Frontend dependencies
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic and mock data
│   │   ├── middleware/     # Custom middleware
│   │   └── utils/          # Utility functions
│   ├── Dockerfile          # Backend container configuration
│   └── package.json        # Backend dependencies
├── shared/                 # Shared types and utilities
│   └── types/              # Common TypeScript types
├── docker-compose.yml      # Multi-container setup
├── start.sh               # Linux/Mac startup script
├── start-project.bat      # Windows startup script
└── README.md              # Project documentation
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/iot-dashboard
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env)**

```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_WS_URL=ws://localhost:3001
REACT_APP_ENV=development
```

## 📈 Features in Detail

### Real-time Data Streaming

- WebSocket connection for live data updates
- Automatic reconnection handling
- Data buffering for offline scenarios
- Mock IoT device simulation

### Interactive Charts

- Line charts for time-series data
- Bar charts for categorical data
- Gauge charts for sensor readings
- Real-time data updates

### Analytics & Insights

- Real-time statistical calculations
- Trend analysis and predictions
- Data export functionality
- Custom date range filtering

### Alert System

- Configurable threshold-based alerts
- Real-time notifications
- Alert history and management
- Device status monitoring

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# Run test script
node test-project.js
```

## 🚀 Deployment

### Docker Deployment (Recommended)

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in background
docker-compose up -d --build

# Stop services
docker-compose down
```

### Manual Deployment

```bash
# Build frontend
cd frontend && npm run build

# Start backend in production
cd backend && npm start
```

## 🔄 Development Workflow

### Using Docker Compose Watch (Hot Reload)

```bash
# Start with file watching for development
docker-compose watch
```

### Manual Development

```bash
# Backend development
cd backend && npm run dev

# Frontend development
cd frontend && npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Chart.js for excellent charting library
- Socket.io for real-time communication
- Tailwind CSS for utility-first styling
- React Query for server state management
- Framer Motion for smooth animations

## 📞 Support

For support and questions, please open an issue on GitHub or contact the maintainers.

---

**Built with ❤️ for VIZIO AI FullStack Developer Interview**
