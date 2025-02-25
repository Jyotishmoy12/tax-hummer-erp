import { NextResponse } from "next/server";
import connectDB from "../../../db/mongodb";
import VendorOrder from "../../../db/models/VendorOrder";

export async function GET() {
  await connectDB();
  try {
    const orders = await VendorOrder.find();
    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();
  try {
    const vendorOrder = new VendorOrder(body);
    await vendorOrder.save();
    return NextResponse.json(
      { success: true, data: vendorOrder },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
