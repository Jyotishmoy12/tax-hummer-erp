import { NextResponse } from 'next/server';
import connectDB from '../../../db/mongodb';
import SystemLog from '../../../db/models/SystemLog';

// GET: Fetch system logs (sorted by most recent)
export async function GET(request: Request) {
  await connectDB();
  try {
    const logs = await SystemLog.find({}).sort({ timestamp: -1 });
    return NextResponse.json({ success: true, data: logs });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Clear all system logs
export async function DELETE(request: Request) {
  await connectDB();
  try {
    await SystemLog.deleteMany({});
    return NextResponse.json({ success: true, message: 'All logs deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
