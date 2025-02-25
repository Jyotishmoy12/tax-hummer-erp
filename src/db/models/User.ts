import mongoose, {Schema, Document} from "mongoose";

export interface User extends Document {
    name: string;
    email: string;
    role: 'superadmin' | 'accountant' | 'inventoryManager' | 'salesPersonal' | 'hrStaff' | 'purchasingManager'
    | 'itAdmin' | 'generalUser';
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema: Schema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    role:{type:String, enum:['superadmin', 'accountant', "inventoryManager", "salesPesonal", 'hrStaff', 'purchasingManger',
        'itAdmin', 'generalUser'], required: true},
    password: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
});



export default mongoose.models.User || mongoose.model<User>('User', userSchema);