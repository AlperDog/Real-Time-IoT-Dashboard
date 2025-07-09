import mongoose, { Document, Schema } from 'mongoose';
import { Alert as AlertType, AlertSeverity, AlertStatus } from '../sharedTypes';

export interface IAlert extends Document, Omit<AlertType, 'id'> {
  createdAt: Date;
  updatedAt: Date;
}

const alertSchema = new Schema<IAlert>({
  deviceId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, 'Alert title cannot be more than 200 characters']
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: [1000, 'Alert message cannot be more than 1000 characters']
  },
  severity: {
    type: String,
    enum: Object.values(AlertSeverity),
    required: true,
    default: AlertSeverity.MEDIUM
  },
  status: {
    type: String,
    enum: Object.values(AlertStatus),
    required: true,
    default: AlertStatus.ACTIVE
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  acknowledgedAt: {
    type: Date
  },
  resolvedAt: {
    type: Date
  },
  acknowledgedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
alertSchema.index({ deviceId: 1, timestamp: -1 });
alertSchema.index({ status: 1, timestamp: -1 });
alertSchema.index({ severity: 1, timestamp: -1 });
alertSchema.index({ isActive: 1 });
alertSchema.index({ timestamp: -1 });

// Method to acknowledge alert
alertSchema.methods.acknowledge = function(userId: string) {
  this.status = AlertStatus.ACKNOWLEDGED;
  this.acknowledgedAt = new Date();
  this.acknowledgedBy = userId;
  return this.save();
};

// Method to resolve alert
alertSchema.methods.resolve = function(userId: string) {
  this.status = AlertStatus.RESOLVED;
  this.resolvedAt = new Date();
  this.resolvedBy = userId;
  return this.save();
};

// Static method to get active alerts
alertSchema.statics.getActiveAlerts = function() {
  return this.find({ 
    status: AlertStatus.ACTIVE, 
    isActive: true 
  }).sort({ timestamp: -1 });
};

// Static method to get alerts by device
alertSchema.statics.getAlertsByDevice = function(deviceId: string) {
  return this.find({ deviceId }).sort({ timestamp: -1 });
};

export default mongoose.model<IAlert>('Alert', alertSchema); 