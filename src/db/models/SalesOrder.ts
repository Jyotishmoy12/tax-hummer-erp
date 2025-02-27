// File: db/models/SalesOrder.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ISalesOrder extends Document {
  customer: string;
  orderDate: Date;
  items: {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: string;
}

const salesOrderSchema = new Schema({
  customer: { type: String, required: true },
  orderDate: { type: Date, required: true },
  items: [
    {
      productId: { type: Schema.Types.ObjectId, ref: 'Inventory', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'pending' },
});

// Check if the model already exists to prevent overwriting
const SalesOrder = mongoose.models.SalesOrder || mongoose.model<ISalesOrder>("SalesOrder", salesOrderSchema);

export default SalesOrder;