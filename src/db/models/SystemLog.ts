import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISystemLog extends Document {
  timestamp: Date;
  level: 'info' | 'warning' | 'error';
  message: string;
  meta?: Record<string, any>;
}

const SystemLogSchema: Schema = new Schema(
  {
    timestamp: { type: Date, default: Date.now },
    level: { type: String, enum: ['info', 'warning', 'error'], default: 'info' },
    message: { type: String, required: true },
    meta: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

const SystemLog: Model<ISystemLog> =
  mongoose.models.SystemLog || mongoose.model<ISystemLog>('SystemLog', SystemLogSchema);

export default SystemLog;
