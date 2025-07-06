# IoT Dashboard API Documentation

## Overview

This document provides comprehensive API documentation for the Real-Time IoT Dashboard, including REST endpoints and WebSocket events.

## Base URL

- **Development**: `http://localhost:5000`
- **Production**: `https://your-domain.com`

## Authentication

Currently, the API operates without authentication. In production, implement JWT or OAuth2 authentication.

## Response Format

All API responses follow this structure:

```json
{
  "success": boolean,
  "data": any,
  "message": string (optional),
  "error": string (optional),
  "timestamp": string
}
```

---

## REST API Endpoints

### Devices

#### Get All Devices

```http
GET /api/devices
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "device-001",
      "name": "Temperature Sensor 1",
      "type": "SENSOR",
      "location": "Building A - Floor 1",
      "status": "ONLINE",
      "batteryLevel": 85,
      "lastSeen": "2024-01-15T10:30:00.000Z"
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Get Device by ID

```http
GET /api/devices/{id}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "device-001",
    "name": "Temperature Sensor 1",
    "type": "SENSOR",
    "location": "Building A - Floor 1",
    "status": "ONLINE",
    "batteryLevel": 85,
    "lastSeen": "2024-01-15T10:30:00.000Z"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Send Command to Device

```http
POST /api/devices/{id}/command
```

**Request Body:**

```json
{
  "command": "RESTART",
  "parameters": {
    "delay": 5000,
    "force": false
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "deviceId": "device-001",
    "command": "RESTART",
    "parameters": {
      "delay": 5000,
      "force": false
    },
    "status": "SUCCESS",
    "response": "Command RESTART executed successfully",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "executionTime": 1250
  },
  "message": "Command sent successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Update Device Configuration

```http
PUT /api/devices/{id}/config
```

**Request Body:**

```json
{
  "samplingRate": 30,
  "thresholds": {
    "temperature": {
      "min": 18,
      "max": 25
    },
    "humidity": {
      "min": 40,
      "max": 60
    }
  },
  "alertSettings": {
    "enabled": true,
    "email": "admin@company.com"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "deviceId": "device-001",
    "previousConfig": {
      /* previous configuration */
    },
    "newConfig": {
      /* new configuration */
    },
    "status": "UPDATED",
    "timestamp": "2024-01-15T10:30:00.000Z"
  },
  "message": "Device configuration updated successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Get Device Firmware Info

```http
GET /api/devices/{id}/firmware
```

**Response:**

```json
{
  "success": true,
  "data": {
    "deviceId": "device-001",
    "currentVersion": "1.2.3",
    "latestVersion": "1.3.0",
    "updateAvailable": true,
    "lastUpdate": "2024-01-01T00:00:00.000Z",
    "updateSize": "2.5MB",
    "changelog": [
      "Bug fixes and performance improvements",
      "New sensor calibration features",
      "Enhanced security protocols"
    ]
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Update Device Firmware

```http
POST /api/devices/{id}/firmware/update
```

**Request Body:**

```json
{
  "version": "1.3.0"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "deviceId": "device-001",
    "targetVersion": "1.3.0",
    "status": "IN_PROGRESS",
    "progress": 0,
    "estimatedTime": 300,
    "timestamp": "2024-01-15T10:30:00.000Z"
  },
  "message": "Firmware update started",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Get Device Command History

```http
GET /api/devices/{id}/commands?limit=50
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "cmd-device-001-1",
      "deviceId": "device-001",
      "command": "RESTART",
      "parameters": {},
      "status": "SUCCESS",
      "response": "Command executed successfully",
      "timestamp": "2024-01-15T10:25:00.000Z",
      "executionTime": 1250
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Bulk Device Operations

```http
POST /api/devices/bulk/command
```

**Request Body:**

```json
{
  "deviceIds": ["device-001", "device-002", "device-003"],
  "command": "RESTART",
  "parameters": {
    "delay": 5000
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalDevices": 3,
    "successful": 2,
    "failed": 1,
    "results": [
      {
        "deviceId": "device-001",
        "command": "RESTART",
        "parameters": { "delay": 5000 },
        "status": "SUCCESS",
        "response": "Command executed successfully",
        "timestamp": "2024-01-15T10:30:00.000Z",
        "executionTime": 1250
      }
    ]
  },
  "message": "Bulk command executed",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Sensors

#### Get All Sensors

```http
GET /api/sensors
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "sensor-001",
      "deviceId": "device-001",
      "type": "TEMPERATURE",
      "value": 22.5,
      "unit": "°C",
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Get Sensor Data by Device

```http
GET /api/sensors/device/{deviceId}?limit=100
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "sensor-001",
      "deviceId": "device-001",
      "type": "TEMPERATURE",
      "value": 22.5,
      "unit": "°C",
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Alerts

#### Get All Alerts

```http
GET /api/alerts?status=ACTIVE&limit=50
```

**Query Parameters:**

- `status`: ACTIVE, RESOLVED, ACKNOWLEDGED
- `severity`: LOW, MEDIUM, HIGH, CRITICAL
- `limit`: Number of alerts to return (default: 50)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "alert-001",
      "deviceId": "device-001",
      "type": "THRESHOLD_EXCEEDED",
      "severity": "HIGH",
      "message": "Temperature exceeded threshold: 30°C",
      "status": "ACTIVE",
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Acknowledge Alert

```http
PUT /api/alerts/{id}/acknowledge
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "alert-001",
    "status": "ACKNOWLEDGED",
    "acknowledgedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Alert acknowledged successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Analytics

#### Get Dashboard Analytics

```http
GET /api/analytics/dashboard
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalDevices": 25,
    "onlineDevices": 23,
    "offlineDevices": 2,
    "totalAlerts": 5,
    "activeAlerts": 3,
    "averageTemperature": 22.5,
    "averageHumidity": 45.2,
    "systemHealth": 92
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Get Device Analytics

```http
GET /api/analytics/device/{deviceId}?period=24h
```

**Query Parameters:**

- `period`: 1h, 24h, 7d, 30d

**Response:**

```json
{
  "success": true,
  "data": {
    "deviceId": "device-001",
    "period": "24h",
    "uptime": 95.8,
    "averageTemperature": 22.5,
    "temperatureRange": { "min": 18.2, "max": 26.8 },
    "alertCount": 2,
    "dataPoints": 1440
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## WebSocket API

### Connection

Connect to the WebSocket server:

```javascript
const socket = io("http://localhost:5000");
```

### Events

#### Client to Server Events

**Join Dashboard**

```javascript
socket.emit("join-dashboard");
```

**Join Device Room**

```javascript
socket.emit("join-device", "device-001");
```

**Leave Device Room**

```javascript
socket.emit("leave-device", "device-001");
```

**Request Test Data**

```javascript
socket.emit("request-test-data");
```

**Start/Stop Simulation**

```javascript
socket.emit("start-simulation");
socket.emit("stop-simulation");
```

**Send Device Command**

```javascript
socket.emit("send-device-command", {
  deviceId: "device-001",
  command: "RESTART",
  parameters: {
    delay: 5000,
    force: false,
  },
});
```

**Update Device Configuration**

```javascript
socket.emit("update-device-config", {
  deviceId: "device-001",
  config: {
    samplingRate: 30,
    thresholds: {
      temperature: { min: 18, max: 25 },
    },
  },
});
```

**Start Firmware Update**

```javascript
socket.emit("start-firmware-update", {
  deviceId: "device-001",
  version: "1.3.0",
});
```

**Bulk Device Command**

```javascript
socket.emit("bulk-device-command", {
  deviceIds: ["device-001", "device-002", "device-003"],
  command: "RESTART",
  parameters: { delay: 5000 },
});
```

**Get Device Status**

```javascript
socket.emit("get-device-status", "device-001");
```

**Ping**

```javascript
socket.emit("ping");
```

#### Server to Client Events

**Dashboard Initialization**

```javascript
socket.on("dashboard-init", (data) => {
  console.log("Dashboard connected:", data);
});
```

**Real-time Sensor Data**

```javascript
socket.on("sensor-data", (data) => {
  console.log("New sensor data:", data);
});
```

**Device Status Update**

```javascript
socket.on("device-status-update", (data) => {
  console.log("Device status changed:", data);
});
```

**New Alert**

```javascript
socket.on("new-alert", (data) => {
  console.log("New alert:", data);
});
```

**Alert Status Update**

```javascript
socket.on("alert-update", (data) => {
  console.log("Alert updated:", data);
});
```

**Device Command Response**

```javascript
socket.on("device-command-response", (data) => {
  console.log("Command response:", data);
});
```

**Device Command Executed**

```javascript
socket.on("device-command-executed", (data) => {
  console.log("Command executed:", data);
});
```

**Device Configuration Updated**

```javascript
socket.on("device-config-updated", (data) => {
  console.log("Config updated:", data);
});
```

**Device Configuration Changed**

```javascript
socket.on("device-config-changed", (data) => {
  console.log("Config changed:", data);
});
```

**Firmware Update Started**

```javascript
socket.on("firmware-update-started", (data) => {
  console.log("Firmware update started:", data);
});
```

**Firmware Update Progress**

```javascript
socket.on("firmware-update-progress", (data) => {
  console.log("Firmware update progress:", data.progress + "%");
});
```

**Firmware Update Completed**

```javascript
socket.on("firmware-update-completed", (data) => {
  console.log("Firmware update completed:", data);
});
```

**Firmware Update Finished**

```javascript
socket.on("firmware-update-finished", (data) => {
  console.log("Firmware update finished:", data);
});
```

**Bulk Command Completed**

```javascript
socket.on("bulk-command-completed", (data) => {
  console.log("Bulk command completed:", data);
});
```

**Device Status Response**

```javascript
socket.on("device-status-response", (data) => {
  console.log("Device status:", data);
});
```

**Simulation Status**

```javascript
socket.on("simulation-status", (data) => {
  console.log("Simulation status:", data.running);
});
```

**Pong**

```javascript
socket.on("pong", (data) => {
  console.log("Pong received:", data);
});
```

**Error Events**

```javascript
socket.on("device-command-error", (data) => {
  console.error("Command error:", data);
});

socket.on("device-config-error", (data) => {
  console.error("Config error:", data);
});

socket.on("firmware-update-error", (data) => {
  console.error("Firmware update error:", data);
});

socket.on("bulk-command-error", (data) => {
  console.error("Bulk command error:", data);
});
```

---

## Data Types

### Device

```typescript
interface IoTDevice {
  id: string;
  name: string;
  type: "SENSOR" | "ACTUATOR" | "GATEWAY";
  location: string;
  status: "ONLINE" | "OFFLINE" | "MAINTENANCE";
  batteryLevel: number;
  lastSeen: string;
}
```

### Sensor Data

```typescript
interface SensorData {
  id: string;
  deviceId: string;
  type: "TEMPERATURE" | "HUMIDITY" | "PRESSURE" | "LIGHT" | "MOTION";
  value: number;
  unit: string;
  timestamp: string;
}
```

### Alert

```typescript
interface Alert {
  id: string;
  deviceId: string;
  type: "THRESHOLD_EXCEEDED" | "DEVICE_OFFLINE" | "BATTERY_LOW" | "ERROR";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  message: string;
  status: "ACTIVE" | "RESOLVED" | "ACKNOWLEDGED";
  timestamp: string;
}
```

### Command Result

```typescript
interface CommandResult {
  deviceId: string;
  command: string;
  parameters?: any;
  status: "SUCCESS" | "FAILED" | "PENDING";
  response: string;
  timestamp: string;
  executionTime: number;
}
```

### Firmware Info

```typescript
interface FirmwareInfo {
  deviceId: string;
  currentVersion: string;
  latestVersion: string;
  updateAvailable: boolean;
  lastUpdate: string;
  updateSize: string;
  changelog: string[];
}
```

---

## Error Codes

| Code | Description                      |
| ---- | -------------------------------- |
| 400  | Bad Request - Invalid parameters |
| 404  | Not Found - Resource not found   |
| 500  | Internal Server Error            |
| 503  | Service Unavailable              |

---

## Rate Limiting

- **REST API**: 100 requests per minute per IP
- **WebSocket**: No rate limiting (implement if needed)

---

## Examples

### JavaScript/TypeScript Client

```typescript
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

// Join dashboard
socket.emit("join-dashboard");

// Listen for real-time data
socket.on("sensor-data", (data) => {
  console.log("New sensor reading:", data);
});

// Send device command
socket.emit("send-device-command", {
  deviceId: "device-001",
  command: "RESTART",
});
```

### Python Client

```python
import requests
import json

# Get all devices
response = requests.get('http://localhost:5000/api/devices')
devices = response.json()['data']

# Send command to device
command_data = {
    'command': 'RESTART',
    'parameters': {'delay': 5000}
}
response = requests.post(
    'http://localhost:5000/api/devices/device-001/command',
    json=command_data
)
result = response.json()['data']
```

### cURL Examples

```bash
# Get all devices
curl -X GET http://localhost:5000/api/devices

# Send command to device
curl -X POST http://localhost:5000/api/devices/device-001/command \
  -H "Content-Type: application/json" \
  -d '{"command": "RESTART", "parameters": {"delay": 5000}}'

# Get device firmware info
curl -X GET http://localhost:5000/api/devices/device-001/firmware

# Bulk command
curl -X POST http://localhost:5000/api/devices/bulk/command \
  -H "Content-Type: application/json" \
  -d '{"deviceIds": ["device-001", "device-002"], "command": "RESTART"}'
```
