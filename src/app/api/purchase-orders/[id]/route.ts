import { NextResponse } from 'next/server';
import connectDB from '../../../../db/mongodb';
import PurchaseOrder from '../../../../db/models/PurchaseOrder';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;
  const body = await request.json();
  try {
    const updatedOrder = await PurchaseOrder.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;
  try {
    await PurchaseOrder.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Purchase order deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
