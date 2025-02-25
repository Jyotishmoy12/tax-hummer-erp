import mongoose, { Schema, Document } from 'mongoose';

export interface ISystemLog extends Document { 
    message: string; level: 'info' | 'warning' | 'error'; 
    timestamp: Date; }

const SystemLogSchema: Schema = new Schema(
    { message: { type: String, required: true }, 
    level: { type: String, enum: ['info', 'warning', 'error'], 
    default: 'info' }, timestamp: { type: Date, default: Date.now }, 
});

export default mongoose.models.SystemLog || mongoose.model<ISystemLog>('SystemLog', SystemLogSchema);