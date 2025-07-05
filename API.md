# IoT Dashboard API Documentation

## Overview

The IoT Dashboard API provides RESTful endpoints for managing IoT devices, sensor data, alerts, and analytics. The API is built with Node.js, Express, and TypeScript, providing real-time data through WebSocket connections.

## Base URL

```
http://localhost:3001
```

## Authentication

Currently, the API uses mock authentication. JWT authentication is prepared for future implementation.

## Response Format

All API responses follow this standard format:

```json
{
  "success": true,
  "data": {...},
  "message": "Optional message",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Error Response Format

```json
{
  "success": false,
  "error": "Error description",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Endpoints

### Health Check

#### GET /health

Check the application health status.

**Response:**

```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

### Dashboard

#### GET /api/dashboard/stats

Get dashboard statistics and overview data.

**Response:**

```json
{
  "success": true,
  "data": {
    "totalDevices": 10,
    "onlineDevices": 8,
    "offlineDevices": 2,
    "activeSensors": 25,
    "totalAlerts": 5,
    "activeAlerts": 2,
    "averageTemperature": 22.5,
    "averageHumidity": 45.2,
    "dataPointsToday": 1440,
    "systemUptime": 99.8
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Devices

#### GET /api/devices

Get all IoT devices.

**Query Parameters:**

- `status` (optional): Filter by device status (online, offline, error, maintenance)
- `type` (optional): Filter by device type

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "device-001",
      "name": "Temperature Sensor 1",
      "type": "TEMPERATURE",
      "location": "Room A",
      "status": "ONLINE",
      "batteryLevel": 85,
      "lastSeen": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### GET /api/devices/:id

Get a specific device by ID.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "device-001",
    "name": "Temperature Sensor 1",
    "type": "TEMPERATURE",
    "location": "Room A",
    "status": "ONLINE",
    "batteryLevel": 85,
    "lastSeen": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Sensors

#### GET /api/sensors/data

Get sensor data with optional filtering.

**Query Parameters:**

- `deviceId` (optional): Filter by device ID
- `type` (optional): Filter by sensor type (TEMPERATURE, HUMIDITY, PRESSURE, etc.)
- `limit` (optional): Number of data points to return (default: 24)
- `startDate` (optional): Start date for data range
- `endDate` (optional): End date for data range

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "sensor-data-001",
      "deviceId": "device-001",
      "type": "TEMPERATURE",
      "value": 22.5,
      "unit": "°C",
      "timestamp": "2024-01-01T00:00:00.000Z",
      "location": "Room A"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### GET /api/sensors/realtime

Get real-time sensor data (WebSocket recommended for real-time updates).

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "sensor-data-001",
      "deviceId": "device-001",
      "type": "TEMPERATURE",
      "value": 22.5,
      "unit": "°C",
      "timestamp": "2024-01-01T00:00:00.000Z",
      "location": "Room A"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Alerts

#### GET /api/alerts

Get all alerts with optional filtering.

**Query Parameters:**

- `severity` (optional): Filter by severity (low, medium, high, critical)
- `status` (optional): Filter by status (active, resolved)
- `deviceId` (optional): Filter by device ID
- `limit` (optional): Number of alerts to return (default: 50)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "alert-001",
      "deviceId": "device-001",
      "type": "TEMPERATURE_HIGH",
      "severity": "HIGH",
      "message": "Temperature exceeded threshold: 30°C",
      "value": 30.5,
      "threshold": 30,
      "status": "ACTIVE",
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### GET /api/alerts/:id

Get a specific alert by ID.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "alert-001",
    "deviceId": "device-001",
    "type": "TEMPERATURE_HIGH",
    "severity": "HIGH",
    "message": "Temperature exceeded threshold: 30°C",
    "value": 30.5,
    "threshold": 30,
    "status": "ACTIVE",
    "timestamp": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Analytics

#### GET /api/analytics

Get analytics data for the specified period.

**Query Parameters:**

- `period` (optional): Time period for analytics (24h, 7d, 30d, default: 24h)
- `deviceId` (optional): Filter by device ID
- `type` (optional): Filter by sensor type

**Response:**

```json
{
  "success": true,
  "data": {
    "period": "24h",
    "temperature": {
      "min": 18.5,
      "max": 26.8,
      "average": 22.3,
      "data": [...]
    },
    "humidity": {
      "min": 35.2,
      "max": 68.9,
      "average": 45.7,
      "data": [...]
    },
    "alerts": {
      "total": 5,
      "bySeverity": {
        "low": 2,
        "medium": 2,
        "high": 1,
        "critical": 0
      },
      "byDevice": {
        "device-001": 2,
        "device-002": 1,
        "device-003": 2
      }
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## WebSocket API

### Connection

Connect to WebSocket server:

```javascript
const socket = io("http://localhost:3001");
```

### Events

#### Client to Server Events

**join-dashboard**
Join the dashboard room to receive general updates.

```javascript
socket.emit("join-dashboard");
```

**join-device**
Listen to updates from a specific device.

```javascript
socket.emit("join-device", "device-001");
```

**leave-device**
Stop listening to a specific device.

```javascript
socket.emit("leave-device", "device-001");
```

**request-test-data**
Request test data from the server.

```javascript
socket.emit("request-test-data");
```

**start-simulation**
Start the real-time data simulation.

```javascript
socket.emit("start-simulation");
```

**stop-simulation**
Stop the real-time data simulation.

```javascript
socket.emit("stop-simulation");
```

**ping**
Test connection with the server.

```javascript
socket.emit("ping");
```

#### Server to Client Events

**dashboard-init**
Dashboard initialization data.

```javascript
socket.on("dashboard-init", (data) => {
  console.log("Dashboard initialized:", data);
});
```

**sensor_data_update**
Real-time sensor data updates.

```javascript
socket.on("sensor_data_update", (data) => {
  console.log("New sensor data:", data);
});
```

**device_status_update**
Device status changes.

```javascript
socket.on("device_status_update", (data) => {
  console.log("Device status changed:", data);
});
```

**alert_update**
New alert notifications.

```javascript
socket.on("alert_update", (data) => {
  console.log("New alert:", data);
});
```

**simulation_status**
Simulation status updates.

```javascript
socket.on("simulation_status", (data) => {
  console.log("Simulation status:", data);
});
```

**pong**
Response to ping event.

```javascript
socket.on("pong", (data) => {
  console.log("Pong received:", data);
});
```

## Data Types

### Device Status Enum

```typescript
enum DeviceStatus {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
  ERROR = "ERROR",
  MAINTENANCE = "MAINTENANCE",
}
```

### Sensor Type Enum

```typescript
enum SensorType {
  TEMPERATURE = "TEMPERATURE",
  HUMIDITY = "HUMIDITY",
  PRESSURE = "PRESSURE",
  MOTION = "MOTION",
  LIGHT = "LIGHT",
}
```

### Alert Severity Enum

```typescript
enum AlertSeverity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: Rate limit information is included in response headers

## Error Codes

| Status Code | Description           |
| ----------- | --------------------- |
| 200         | Success               |
| 201         | Created               |
| 400         | Bad Request           |
| 401         | Unauthorized          |
| 403         | Forbidden             |
| 404         | Not Found             |
| 429         | Too Many Requests     |
| 500         | Internal Server Error |

## Examples

### JavaScript/TypeScript

```javascript
// Fetch devices
const response = await fetch("http://localhost:3001/api/devices");
const data = await response.json();

// WebSocket connection
const socket = io("http://localhost:3001");

socket.emit("join-dashboard");
socket.on("sensor_data_update", (data) => {
  console.log("New sensor data:", data);
});
```

### cURL

```bash
# Get all devices
curl -X GET http://localhost:3001/api/devices

# Get dashboard stats
curl -X GET http://localhost:3001/api/dashboard/stats

# Get sensor data for specific device
curl -X GET "http://localhost:3001/api/sensors/data?deviceId=device-001&limit=10"
```

## Support

For API support and questions:

1. Check the health endpoint: `GET /health`
2. Review the WebSocket connection
3. Check the server logs
4. Create an issue on GitHub

---

**API Version**: 1.0.0  
**Last Updated**: January 2024
