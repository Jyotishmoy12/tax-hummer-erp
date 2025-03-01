import { NextResponse } from "next/server";
import connectDB from "../../../db/mongodb";
import User from "../../../db/models/User";

export async function POST(request: Request) {
    try {
      await connectDB();
      const body = await request.json();
      const user = new User(body);
      await user.save();
      return NextResponse.json(
        {
          success: true,
          message: 'User created successfully',
          user,
        },
        { status: 201 }
      );
    } catch (error: any) {
      console.error('Error in POST /api/users:', error);
      return NextResponse.json(
        {
          success: false,
          message: error.message || 'Internal Server Error',
        },
        { status: 500 }
      );
    }
  }
export async function GET(request: Request) {
  await connectDB();
  try {
    const users = await User.find({});
    return NextResponse.json({
      success: true,
      message: 'Users fetched successfully',
      data: users,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
