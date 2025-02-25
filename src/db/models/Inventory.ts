import mongoose, {Schema, Document} from "mongoose";

export interface IInventory extends Document {
    productName:string;
    sku:string;
    quantity: number;
    costPrice:number;
    sellingPrice:number;
    location:string;
    createdAt: Date;
    updatedAt: Date;
}

const inventorySchema: Schema = new Schema({
    productName: {type: String, required: true},
    sku: {type: String, required: true, unique:true},
    quantity: {type: Number, required: true},
    costPrice: {type: Number, required: true},
    sellingPrice: {type: Number, required: true},
    location: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
});

export default mongoose.model<IInventory>("Inventory", inventorySchema);
