import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../index';
import Device from '../models/Device';
import { DeviceStatus } from '../sharedTypes';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Device.deleteMany({});
});

describe('Device API', () => {
  const mockDevice = {
    name: 'Test Device',
    type: 'temperature_sensor',
    location: 'Test Location',
    metadata: {
      manufacturer: 'Test Manufacturer',
      model: 'Test Model'
    }
  };

  describe('GET /api/devices', () => {
    it('should return empty array when no devices exist', async () => {
      const response = await request(app)
        .get('/api/devices')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it('should return all devices', async () => {
      const device = new Device(mockDevice);
      await device.save();

      const response = await request(app)
        .get('/api/devices')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe(mockDevice.name);
    });
  });

  describe('GET /api/devices/:id', () => {
    it('should return 404 for non-existent device', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/devices/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Device not found');
    });

    it('should return device by id', async () => {
      const device = new Device(mockDevice);
      await device.save();

      const response = await request(app)
        .get(`/api/devices/${device._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(mockDevice.name);
    });
  });

  describe('POST /api/devices', () => {
    it('should create new device', async () => {
      const response = await request(app)
        .post('/api/devices')
        .send(mockDevice)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(mockDevice.name);
      expect(response.body.data.status).toBe(DeviceStatus.OFFLINE);
    });

    it('should return 400 for invalid device data', async () => {
      const invalidDevice = { name: 'Test' }; // Missing required fields

      const response = await request(app)
        .post('/api/devices')
        .send(invalidDevice)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/devices/:id', () => {
    it('should update device', async () => {
      const device = new Device(mockDevice);
      await device.save();

      const updateData = { name: 'Updated Device Name' };

      const response = await request(app)
        .put(`/api/devices/${device._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
    });

    it('should return 404 for non-existent device', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const updateData = { name: 'Updated Name' };

      const response = await request(app)
        .put(`/api/devices/${fakeId}`)
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/devices/:id', () => {
    it('should delete device', async () => {
      const device = new Device(mockDevice);
      await device.save();

      const response = await request(app)
        .delete(`/api/devices/${device._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(mockDevice.name);

      // Verify device is marked as inactive
      const deletedDevice = await Device.findById(device._id);
      expect(deletedDevice?.isActive).toBe(false);
    });
  });

  describe('POST /api/devices/:id/command', () => {
    it('should send command to device', async () => {
      const device = new Device(mockDevice);
      await device.save();

      const command = {
        command: 'RESTART',
        parameters: { delay: 5000 }
      };

      const response = await request(app)
        .post(`/api/devices/${device._id}/command`)
        .send(command)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.command).toBe(command.command);
      expect(response.body.data.deviceId).toBe(device._id.toString());
    });
  });
}); 