// File: db/models/User.ts
import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for the user document
export interface IUser extends Document {
  name: string;
  email: string;
  role: 'superadmin' | 'accountant' | 'inventoryManager' | 'salesPersonal' | 'hrStaff' | 'purchasingManager'
    | 'itAdmin' | 'generalUser';
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the user schema
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ['superadmin', 'accountant', 'inventoryManager', 'salesPersonal', 'hrStaff', 'purchasingManager',
      'itAdmin', 'generalUser'],
    required: true
  },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create a model type that knows about IUser methods
interface UserModel extends Model<IUser> {}

// Check if the model exists already to prevent overwrite during hot reloading
const User: UserModel = (mongoose.models.User || mongoose.model<IUser, UserModel>('User', userSchema)) as UserModel;

export default User;