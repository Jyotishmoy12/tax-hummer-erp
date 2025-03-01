import { NextResponse } from "next/server";
import connectDB from "../../../../db/mongodb";
import Supplier from "../../../../db/models/Supplier";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;
  const body = await request.json();
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json({ success: true, data: updatedSupplier });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;
  try {
    await Supplier.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Supplier deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
