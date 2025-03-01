import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPurchaseOrder extends Document {
  vendor: string;
  orderDate: Date;
  items: {
    product: string;
    quantity: number;
    cost: number;
  }[];
  totalAmount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: Date;
  updatedAt: Date;
}

const purchaseOrderSchema: Schema = new Schema(
  {
    vendor: { type: String, required: true },
    orderDate: { type: Date, required: true, default: Date.now },
    items: [
      {
        product: { type: String, required: true },
        quantity: { type: Number, required: true },
        cost: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

const PurchaseOrder: Model<IPurchaseOrder> =
  mongoose.models.PurchaseOrder ||
  mongoose.model<IPurchaseOrder>('PurchaseOrder', purchaseOrderSchema);

export default PurchaseOrder;
