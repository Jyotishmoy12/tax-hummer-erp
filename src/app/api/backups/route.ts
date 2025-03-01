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
export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();
  try {
    // Simulate scheduling a backup.
    // In a real-world scenario, you might trigger a backup process and then record its metadata.
    const backup = new Backup({
      fileName: body.fileName || `backup-${Date.now()}.zip`,
      status: 'completed', // For simulation, mark as completed.
      description: body.description || '',
    });
    await backup.save();
    return NextResponse.json({ success: true, data: backup }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
