import { NextResponse } from "next/server";
import connectDB from "../../../db/mongodb";
import ModuleConfig from "../../../db/models/ModuleConfig";

// GET: Fetch current module configuration
export async function GET(request: Request) {
  await connectDB();
  try {
    // Assumes a single configuration document that holds all module settings.
    const config = await ModuleConfig.findOne({});
    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT: Update module configuration
export async function PUT(request: Request) {
  await connectDB();
  const body = await request.json();
  try {
    // Update the configuration, or create one if it doesn't exist
    const updatedConfig = await ModuleConfig.findOneAndUpdate({}, body, { new: true, upsert: true });
    return NextResponse.json({ success: true, config: updatedConfig });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
