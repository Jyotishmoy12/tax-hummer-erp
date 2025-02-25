import mongoose, { Schema, Document} from "mongoose";

export interface ISalesOrder extends Document {
    customer:string;
    orderDate:Date;
    items:{product:string, quantity:number, price:number}[];
    totalAmount:number;
    status:string;
}

const SalesOrderSchema: Schema = new Schema({ 
    customer: { type: String, required: true }, 
    orderDate: { type: Date, required: true }, 
    items: [ { productId: { type: Schema.Types.ObjectId, ref: 'Inventory', required: true }, 
    quantity: { type: Number, required: true }, 
    price: { type: Number, required: true }, }, ], 
    totalAmount: { type: Number, required: true }, 
    status: { type: String, default: 'pending' }, });

export default mongoose.model<ISalesOrder>("SalesOrder", SalesOrderSchema);