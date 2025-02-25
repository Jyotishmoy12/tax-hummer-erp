import { NextResponse } from "next/server";
import connectDB from "../../../db/mongodb";
import Transaction from "../../../db/models/Transaction";

export async function GET() {
  await connectDB();
  try {
    const transactions = await Transaction.find({});
    return NextResponse.json({ success: true, data: transactions });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
}

export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();
  
  try {
    const transaction = new Transaction(body);
    await transaction.save();
    return NextResponse.json(
      { success: true, data: transaction },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}