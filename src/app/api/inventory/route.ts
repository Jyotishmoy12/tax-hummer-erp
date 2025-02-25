import { NextResponse } from "next/server";
import connectDB from "../../../db/mongodb";
import Inventory from "../../../db/models/Inventory";

export async function GET() {
  await connectDB();
  try {
    const inventoryItems = await Inventory.find({});
    return NextResponse.json({ success: true, data: inventoryItems });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();
  try {
    const newItem = new Inventory(body);
    await newItem.save();
    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}



