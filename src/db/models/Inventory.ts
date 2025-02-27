// File: db/models/Inventory.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IInventory extends Document {
  productName: string;
  sku: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

const inventorySchema = new Schema({
  productName: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  quantity: { type: Number, required: true },
  costPrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  location: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Check if the model already exists to prevent overwriting
const Inventory = mongoose.models.Inventory || mongoose.model<IInventory>("Inventory", inventorySchema);

export default Inventory;