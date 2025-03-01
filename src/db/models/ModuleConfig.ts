import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IModuleConfig extends Document {
  accountingEnabled: boolean;
  salesSetting: string;
  inventoryEnabled: boolean;
  hrEnabled: boolean;
  purchasingEnabled: boolean;
  itEnabled: boolean;
  // You can add more fields as needed
}

const ModuleConfigSchema: Schema = new Schema(
  {
    accountingEnabled: { type: Boolean, default: true },
    salesSetting: { type: String, default: '' },
    inventoryEnabled: { type: Boolean, default: true },
    hrEnabled: { type: Boolean, default: true },
    purchasingEnabled: { type: Boolean, default: true },
    itEnabled: { type: Boolean, default: true },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const ModuleConfig: Model<IModuleConfig> =
  mongoose.models.ModuleConfig || mongoose.model<IModuleConfig>('ModuleConfig', ModuleConfigSchema);

export default ModuleConfig;
