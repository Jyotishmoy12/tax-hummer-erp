import mongoose, {Schema, Document} from "mongoose";


export interface Transaction extends Document {
    date: Date;
    account: string;
    debit: number;
    credit: number;
    description: string;
}


const transactionSchema: Schema = new Schema({
    date: {type: Date, required: true},
    account: {type: String, required: true},
    debit: {type: Number, default:0},
    credit: {type: Number, default:0},
    description: {type: String, required: true},
});



export default mongoose.models.Transaction || mongoose.model<Transaction>('Transaction', transactionSchema);