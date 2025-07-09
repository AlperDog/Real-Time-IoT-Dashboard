import mongoose, { Document, Schema } from 'mongoose';
import { SensorData, SensorType } from '../sharedTypes';

export interface ISensor extends Document, Omit<SensorData, 'id'> {
  createdAt: Date;
  updatedAt: Date;
}

const sensorSchema = new Schema<ISensor>({
  deviceId: {
    type: Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  value: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: Object.values(SensorType),
    required: true
  },
  quality: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor'],
    default: 'good'
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for better query performance
sensorSchema.index({ deviceId: 1, timestamp: -1 });
sensorSchema.index({ type: 1, timestamp: -1 });
sensorSchema.index({ timestamp: -1 });
sensorSchema.index({ 'metadata.battery': 1 });

// TTL index to automatically delete old data (keep 30 days)
sensorSchema.index({ timestamp: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

// Method to get latest reading for a device
sensorSchema.statics.getLatestReading = function(deviceId: string, type?: SensorType) {
  const query: any = { deviceId };
  if (type) query.type = type;
  
  return this.findOne(query).sort({ timestamp: -1 });
};

// Method to get readings in time range
sensorSchema.statics.getReadingsInRange = function(
  deviceId: string, 
  startTime: Date, 
  endTime: Date,
  type?: SensorType
) {
  const query: any = {
    deviceId,
    timestamp: { $gte: startTime, $lte: endTime }
  };
  if (type) query.type = type;
  
  return this.find(query).sort({ timestamp: 1 });
};

export default mongoose.model<ISensor>('Sensor', sensorSchema); 