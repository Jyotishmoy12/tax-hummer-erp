import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBankStatement extends Document {
  statementDate: Date;
  description: string;
  amount: number;
  transactionType: 'debit' | 'credit';
  bankAccount: string;
}

const bankStatementSchema: Schema = new Schema({
  statementDate: { type: Date, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  transactionType: { type: String, enum: ['debit', 'credit'], required: true },
  bankAccount: { type: String, required: true },
}, { timestamps: true });

const BankStatement: Model<IBankStatement> =
  mongoose.models.BankStatement ||
  mongoose.model<IBankStatement>('BankStatement', bankStatementSchema);

export default BankStatement;
