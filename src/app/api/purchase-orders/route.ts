import { NextResponse } from 'next/server';
import connectDB from '../../../db/mongodb';
import PurchaseOrder from '../../../db/models/PurchaseOrder';

export async function GET() {
  await connectDB();
  try {
    const orders = await PurchaseOrder.find({});
    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();
  try {
    const purchaseOrder = new PurchaseOrder(body);
    await purchaseOrder.save();
    return NextResponse.json({ success: true, data: purchaseOrder }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
