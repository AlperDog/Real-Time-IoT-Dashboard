import mongoose, { Document, Schema } from 'mongoose';
import { IoTDevice, DeviceStatus } from '../sharedTypes';

export interface IDevice extends Document, Omit<IoTDevice, 'id'> {
  createdAt: Date;
  updatedAt: Date;
}

const deviceSchema = new Schema<IDevice>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Device name cannot be more than 100 characters']
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: Object.values(DeviceStatus),
    default: DeviceStatus.OFFLINE
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  batteryLevel: {
    type: Number,
    min: 0,
    max: 100
  },
  signalStrength: {
    type: Number,
    min: 0,
    max: 100
  },
  firmwareVersion: {
    type: String,
    trim: true
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  },
  isActive: {
    type: Boolean,
    default: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
deviceSchema.index({ status: 1 });
deviceSchema.index({ type: 1 });
deviceSchema.index({ location: 1 });
deviceSchema.index({ lastSeen: 1 });
deviceSchema.index({ isActive: 1 });

// Virtual for device age
deviceSchema.virtual('age').get(function() {
  return Date.now() - this.createdAt.getTime();
});

// Method to update last seen
deviceSchema.methods.updateLastSeen = function() {
  this.lastSeen = new Date();
  return this.save();
};

// Method to update status
deviceSchema.methods.updateStatus = function(status: DeviceStatus) {
  this.status = status;
  this.lastSeen = new Date();
  return this.save();
};

export default mongoose.model<IDevice>('Device', deviceSchema); 