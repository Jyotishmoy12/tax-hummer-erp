import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITransaction extends Document {
  date: Date;
  account: string;
  debit: number;
  credit: number;
  description: string;
}

const transactionSchema: Schema = new Schema({
  date: { type: Date, required: true },
  account: { type: String, required: true },
  debit: { type: Number, default: 0 },
  credit: { type: Number, default: 0 },
  description: { type: String, required: true },
});

// Properly type the model to avoid TypeScript errors
const TransactionModel: Model<ITransaction> = 
  mongoose.models.Transaction || 
  mongoose.model<ITransaction>('Transaction', transactionSchema);

export default TransactionModel;