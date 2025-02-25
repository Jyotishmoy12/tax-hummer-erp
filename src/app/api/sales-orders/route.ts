import { NextResponse } from "next/server";
import connectDB from "../../../db/mongodb";
import SalesOrder from "../../../db/models/SalesOrder";

export async function GET() {
  await connectDB();

  try {
    const orders = await SalesOrder.find();
    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}

export async function POST(request: Request){
    await connectDB();
    const body = await request.json();

    try {
        const order = new SalesOrder(body);
        await order.save();
        return NextResponse.json({
            success: true,
            data: order
        })
    } catch (error) {
      return NextResponse.json({
        success: false,
        message: error.message
      })  
    }

}