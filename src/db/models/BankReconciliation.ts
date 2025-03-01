import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBankReconciliation extends Document {
  bankStatement: mongoose.Types.ObjectId;
  transaction?: mongoose.Types.ObjectId;
  status: 'reconciled' | 'unreconciled';
  fraudAlert: boolean;
}

const bankReconciliationSchema: Schema = new Schema({
  bankStatement: { type: Schema.Types.ObjectId, ref: 'BankStatement', required: true },
  transaction: { type: Schema.Types.ObjectId, ref: 'Transaction' },
  status: { type: String, enum: ['reconciled', 'unreconciled'], required: true },
  fraudAlert: { type: Boolean, default: false },
}, { timestamps: true });

const BankReconciliation: Model<IBankReconciliation> =
  mongoose.models.BankReconciliation ||
  mongoose.model<IBankReconciliation>('BankReconciliation', bankReconciliationSchema);

export default BankReconciliation;
