import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document { 
    name: string; email: 
    string; position: string; 
    salary: number; 
    department: string; 
    dateJoined: Date; }

const EmployeeSchema: Schema = new Schema(
    { name: { type: String, required: true }, 
    email: { type: String, required: true, unique: true }, 
    position: { type: String, required: true }, 
    salary: { type: Number, required: true }, department: { type: String, required: true }, 
    dateJoined: { type: Date, default: Date.now }, 
});

export default mongoose.models.Employee || mongoose.model<IEmployee>('Employee', EmployeeSchema);