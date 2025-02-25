import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVendorOrder extends Document {
  vendor: string;
  orderDate: Date;
  items: { product: string; quantity: number; price: number }[];
  totalInvoiceAmount: number;
  status: string;
}

const VendorOrderSchema: Schema = new Schema({
  vendor: { type: String, required: true },
  orderDate: { type: Date, required: true },
  items: [
    {
      product: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalInvoiceAmount: { type: Number, required: true },
  status: { type: String, default: "pending" },
});

const VendorOrderModel: Model<IVendorOrder> =
  mongoose.models.VendorOrder ||
  mongoose.model<IVendorOrder>("VendorOrder", VendorOrderSchema);
export default VendorOrderModel;
