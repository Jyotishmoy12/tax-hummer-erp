import { NextResponse } from "next/server";
import connectDB from "../../../db/mongodb";
import Employee from "../../../db/models/Employee";

export async function GET() {
  await connectDB();
  try {
    const employees = await Employee.find({});
    return NextResponse.json({
      success: true,
      data: employees,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}

export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();
  try {
    const employee = new Employee(body);
    await employee.save();
    return NextResponse.json(
      { success: true, data: employee },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
