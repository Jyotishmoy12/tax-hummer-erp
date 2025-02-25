import { NextResponse } from "next/server";
import connectDB from "../../../db/mongodb";
import User from "../../../db/models/User";



export async function POST(request:Request){

    await connectDB();
    const body = await request.json();

    try {
      const user = new User(body);
      await user.save();
      return NextResponse.json({
            status: 'success',
            message: 'User created successfully',
            data: user
      }, {status: 201});  
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error.message
        }, {status: 500});
    }
}

