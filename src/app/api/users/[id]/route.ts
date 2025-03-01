import { NextResponse } from 'next/server';
import connectDB from '../../../../db/mongodb';
import User from '../../../../db/models/User';

// Update user (PUT)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;
  const body = await request.json();
  
  try {
    const updatedUser = await User.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
    }, { status: 500 });
  }
}

// Delete user (DELETE)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;
  
  try {
    await User.findByIdAndDelete(id);
    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
    }, { status: 500 });
  }
}
