import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../db/mongodb';
import Backup from '../../../db/models/Backup';

// GET: List all backups (sorted by most recent)
export async function GET(request: NextRequest) {
  await connectDB();
  try {
    const backups = await Backup.find({}).sort({ backupDate: -1 });
    return NextResponse.json({ success: true, data: backups });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST: Restore a backup using the dynamic route parameter
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await params; // Await the promise to extract the dynamic parameter

  try {
    return NextResponse.json({ success: true, message: `Backup ${id} restored successfully` });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
