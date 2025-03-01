import { NextResponse } from "next/server";
import connectDB from "../../../db/mongodb";
import Supplier from "../../../db/models/Supplier";

export async function GET() {
  await connectDB();
  try {
    const suppliers = await Supplier.find({});
    return NextResponse.json({ success: true, data: suppliers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();
  try {
    const supplier = new Supplier(body);
    await supplier.save();
    return NextResponse.json({ success: true, data: supplier }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
