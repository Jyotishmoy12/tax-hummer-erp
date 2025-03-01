import { NextResponse } from "next/server";
import connectDB from "../../../..//db/mongodb"
import TransactionModel from "../../../../db/models/Transaction";


export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;
  try {
    
    await TransactionModel.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Transaction deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
