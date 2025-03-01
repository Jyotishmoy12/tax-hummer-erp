import { NextResponse } from 'next/server';
import connectDB from '../../../db/mongodb';
import Backup from '../../../db/models/Backup';

// GET: List all backups (sorted by most recent)
export async function GET(request: Request) {
  await connectDB();
  try {
    const backups = await Backup.find({}).sort({ backupDate: -1 });
    return NextResponse.json({ success: true, data: backups });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST: Schedule a new backup
// POST: Schedule a new backup
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  const { id } = params;
  
  // If you need search params, extract them from the request URL
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  
  // Your restore logic here...
  try {
    // For example, simulate a restore operation:
    // (In production, you'd trigger the actual restore process here.)
    return NextResponse.json({ success: true, message: `Backup ${id} restored successfully` });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
