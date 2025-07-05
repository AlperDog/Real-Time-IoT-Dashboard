# Docker Guide - IoT Dashboard

## Overview

This guide covers how to use Docker with the IoT Dashboard project. The project is fully containerized using Docker Compose for easy development and deployment.

## Prerequisites

- **Docker Desktop** installed and running
- **Docker Compose** (included with Docker Desktop)
- At least **4GB RAM** available for Docker
- **Git** for cloning the repository

## Quick Start

### 1. Clone and Start

```bash
# Clone the repository
git clone https://github.com/AlperDog/Real-Time-IoT-Dashboard.git
cd Real-Time-IoT-Dashboard

# Start all services
docker-compose up --build
```

### 2. Access the Application

Once all containers are running, access the application at:

- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## Container Architecture

The project consists of 4 main containers:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    MongoDB      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (Database)    │
│   Port: 3000    │    │   Port: 3001    │    │   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │     Redis       │
                       │   (Cache)       │
                       │   Port: 6379    │
                       └─────────────────┘
```

## Docker Compose Services

### Frontend Service

```yaml
frontend:
  build: ./frontend
  ports:
    - "3000:3000"
  environment:
    - REACT_APP_API_URL=http://localhost:3001
    - REACT_APP_WS_URL=http://localhost:3001
  volumes:
    - ./frontend:/app
    - /app/node_modules
  depends_on:
    - backend
```

**Features:**

- Hot reload enabled
- Volume mounting for development
- Environment variables for API configuration

### Backend Service

```yaml
backend:
  build: ./backend
  ports:
    - "3001:3001"
  environment:
    - PORT=3001
    - MONGODB_URI=mongodb://mongodb:27017/iot-dashboard
    - REDIS_URL=redis://redis:6379
    - NODE_ENV=development
  volumes:
    - ./backend:/app
    - /app/node_modules
  depends_on:
    - mongodb
    - redis
```

**Features:**

- TypeScript compilation
- Nodemon for development
- Database and Redis connections
- Volume mounting for hot reload

### MongoDB Service

```yaml
mongodb:
  image: mongo:6.0
  ports:
    - "27017:27017"
  volumes:
    - mongodb_data:/data/db
  environment:
    - MONGO_INITDB_DATABASE=iot-dashboard
```

**Features:**

- Persistent data storage
- MongoDB 6.0 with latest features
- Exposed port for external access

### Redis Service

```yaml
redis:
  image: redis:7-alpine
  ports:
    - "6379:6379"
  volumes:
    - redis_data:/data
```

**Features:**

- Lightweight Alpine Linux image
- Persistent cache storage
- Pub/Sub for real-time features

## Development Commands

### Basic Commands

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs backend
docker-compose logs frontend

# Follow logs in real-time
docker-compose logs -f
```

### Development with Hot Reload

```bash
# Use Docker Compose Watch (recommended for development)
docker compose watch

# This will automatically restart containers when files change
```

### Container Management

```bash
# List running containers
docker-compose ps

# Restart specific service
docker-compose restart backend
docker-compose restart frontend

# Rebuild specific service
docker-compose build backend
docker-compose build frontend

# Rebuild all services
docker-compose build --no-cache
```

### Database Operations

```bash
# Access MongoDB shell
docker-compose exec mongodb mongosh

# Backup database
docker-compose exec mongodb mongodump --out /data/backup

# Restore database
docker-compose exec mongodb mongorestore /data/backup
```

### Redis Operations

```bash
# Access Redis CLI
docker-compose exec redis redis-cli

# Monitor Redis commands
docker-compose exec redis redis-cli monitor

# Clear Redis cache
docker-compose exec redis redis-cli flushall
```

## Environment Configuration

### Frontend Environment Variables

Create `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_WS_URL=http://localhost:3001
REACT_APP_ENV=development
```

### Backend Environment Variables

Create `backend/.env`:

```env
PORT=3001
MONGODB_URI=mongodb://mongodb:27017/iot-dashboard
REDIS_URL=redis://redis:6379
JWT_SECRET=your-secret-key
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

```bash
# Check what's using the port
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Kill the process or change ports in docker-compose.yml
```

#### 2. Container Won't Start

```bash
# Check container logs
docker-compose logs [service-name]

# Rebuild containers
docker-compose build --no-cache

# Remove all containers and volumes
docker-compose down -v
docker system prune -a
```

#### 3. Database Connection Issues

```bash
# Check if MongoDB is running
docker-compose ps mongodb

# Check MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

#### 4. Memory Issues

```bash
# Check Docker resource usage
docker stats

# Increase Docker memory limit in Docker Desktop settings
```

### Performance Optimization

#### 1. Development Mode

```bash
# Use Docker Compose Watch for faster development
docker compose watch

# This provides hot reload without rebuilding containers
```

#### 2. Production Mode

```bash
# Build optimized production images
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d
```

#### 3. Resource Limits

Add resource limits to `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: "0.5"
        reservations:
          memory: 256M
          cpus: "0.25"
```

## Production Deployment

### 1. Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: "3.8"

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/iot-dashboard
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongodb
      - redis

  mongodb:
    image: mongo:6.0
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=iot-dashboard

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  mongodb_data:
  redis_data:
```

### 2. Production Build

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 3. SSL/HTTPS Setup

For production, add a reverse proxy (nginx) with SSL:

```yaml
nginx:
  image: nginx:alpine
  ports:
    - "443:443"
    - "80:80"
  volumes:
    - ./nginx.conf:/etc/nginx/nginx.conf
    - ./ssl:/etc/nginx/ssl
  depends_on:
    - frontend
    - backend
```

## Monitoring and Logging

### 1. Container Monitoring

```bash
# Monitor resource usage
docker stats

# Monitor specific container
docker stats backend frontend mongodb redis
```

### 2. Log Management

```bash
# View all logs
docker-compose logs

# View logs with timestamps
docker-compose logs -t

# View logs for last 100 lines
docker-compose logs --tail=100

# Follow logs in real-time
docker-compose logs -f
```

### 3. Health Checks

```bash
# Check application health
curl http://localhost:3001/health

# Check if containers are healthy
docker-compose ps
```

## Backup and Recovery

### 1. Database Backup

```bash
# Create backup
docker-compose exec mongodb mongodump --out /data/backup/$(date +%Y%m%d_%H%M%S)

# Copy backup to host
docker cp $(docker-compose ps -q mongodb):/data/backup ./backups
```

### 2. Volume Backup

```bash
# Backup volumes
docker run --rm -v iot-dashboard_mongodb_data:/data -v $(pwd):/backup alpine tar czf /backup/mongodb_backup.tar.gz -C /data .

# Restore volumes
docker run --rm -v iot-dashboard_mongodb_data:/data -v $(pwd):/backup alpine tar xzf /backup/mongodb_backup.tar.gz -C /data
```

## Security Considerations

### 1. Environment Variables

- Never commit `.env` files to version control
- Use Docker secrets for sensitive data in production
- Rotate secrets regularly

### 2. Network Security

```yaml
# Use internal networks
networks:
  internal:
    internal: true
  external:
    driver: bridge
```

### 3. Container Security

```yaml
# Run containers as non-root user
services:
  backend:
    user: "1000:1000"
    security_opt:
      - no-new-privileges:true
```

## Support

For Docker-related issues:

1. Check the troubleshooting section above
2. Review Docker and Docker Compose logs
3. Verify environment variables
4. Check resource limits
5. Create an issue on GitHub

---

**Docker Version**: 20.10+  
**Docker Compose Version**: 2.0+  
**Last Updated**: January 2024
