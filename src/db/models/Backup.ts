import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBackup extends Document {
  backupDate: Date;
  fileName: string;
  status: 'completed' | 'scheduled' | 'failed';
  description?: string;
}

const BackupSchema: Schema = new Schema(
  {
    backupDate: { type: Date, default: Date.now },
    fileName: { type: String, required: true },
    status: { type: String, enum: ['completed', 'scheduled', 'failed'], default: 'scheduled' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

const Backup: Model<IBackup> =
  mongoose.models.Backup || mongoose.model<IBackup>('Backup', BackupSchema);

export default Backup;
