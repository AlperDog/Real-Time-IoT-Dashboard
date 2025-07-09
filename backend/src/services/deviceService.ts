import Device, { IDevice } from '../models/Device';
import { IoTDevice, DeviceStatus } from '../sharedTypes';

export interface CreateDeviceData {
  name: string;
  type: string;
  location: string;
  owner?: string;
  metadata?: Record<string, any>;
}

export interface UpdateDeviceData {
  name?: string;
  type?: string;
  location?: string;
  status?: DeviceStatus;
  batteryLevel?: number;
  signalStrength?: number;
  firmwareVersion?: string;
  metadata?: Record<string, any>;
}

class DeviceService {
  async getAllDevices(): Promise<IDevice[]> {
    return Device.find({ isActive: true }).populate('owner', 'name email');
  }

  async getDeviceById(id: string): Promise<IDevice | null> {
    return Device.findById(id).populate('owner', 'name email');
  }

  async createDevice(data: CreateDeviceData): Promise<IDevice> {
    const device = new Device({
      ...data,
      status: DeviceStatus.OFFLINE,
      lastSeen: new Date()
    });

    return device.save();
  }

  async updateDevice(id: string, data: UpdateDeviceData): Promise<IDevice | null> {
    return Device.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('owner', 'name email');
  }

  async deleteDevice(id: string): Promise<boolean> {
    const result = await Device.findByIdAndUpdate(id, { isActive: false });
    return !!result;
  }

  async updateDeviceStatus(id: string, status: DeviceStatus): Promise<IDevice | null> {
    return Device.findByIdAndUpdate(
      id,
      { 
        status, 
        lastSeen: new Date(),
        updatedAt: new Date()
      },
      { new: true }
    );
  }

  async getDevicesByStatus(status: DeviceStatus): Promise<IDevice[]> {
    return Device.find({ status, isActive: true }).populate('owner', 'name email');
  }

  async getDevicesByType(type: string): Promise<IDevice[]> {
    return Device.find({ type, isActive: true }).populate('owner', 'name email');
  }

  async getDevicesByLocation(location: string): Promise<IDevice[]> {
    return Device.find({ 
      location: { $regex: location, $options: 'i' }, 
      isActive: true 
    }).populate('owner', 'name email');
  }

  async getOfflineDevices(thresholdMinutes: number = 10): Promise<IDevice[]> {
    const threshold = new Date(Date.now() - thresholdMinutes * 60 * 1000);
    return Device.find({
      lastSeen: { $lt: threshold },
      isActive: true
    }).populate('owner', 'name email');
  }

  async getDeviceStats(): Promise<{
    total: number;
    online: number;
    offline: number;
    error: number;
    maintenance: number;
  }> {
    const stats = await Device.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      total: 0,
      online: 0,
      offline: 0,
      error: 0,
      maintenance: 0
    };

    stats.forEach(stat => {
      result.total += stat.count;
      result[stat._id as keyof typeof result] = stat.count;
    });

    return result;
  }

  async bulkUpdateDevices(deviceIds: string[], updates: UpdateDeviceData): Promise<number> {
    const result = await Device.updateMany(
      { _id: { $in: deviceIds }, isActive: true },
      { ...updates, updatedAt: new Date() }
    );
    return result.modifiedCount;
  }

  async searchDevices(query: string): Promise<IDevice[]> {
    return Device.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { type: { $regex: query, $options: 'i' } },
            { location: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    }).populate('owner', 'name email');
  }
}

export default new DeviceService(); 