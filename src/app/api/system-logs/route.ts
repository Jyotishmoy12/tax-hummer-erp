import { NextResponse } from "next/server";
import connectDB from "../../../db/mongodb";
import SystemLog from "../../../db/models/SystemLog";

export async function GET() {
  await connectDB();
  try {
    const logs = await SystemLog.find();
    return NextResponse.json({ success: true, data: logs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();
  try {
    const logEntry = new SystemLog(body);
    await logEntry.save();
    return NextResponse.json(
      { success: true, data: logEntry },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
