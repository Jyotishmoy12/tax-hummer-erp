import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "../../../../db/mongodb";
import User from "../../../../db/models/User";
import { signToken } from "../../../../lib/auth";

export async function POST(request: Request) {
  await connectDB();

  const body = await request.json();
  const { name, email, password, role } = body;

  if (!name || !email || !password || !role) {
    return NextResponse.json(
      { success: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return NextResponse.json(
      { success: false, error: "User already exists" },
      { status: 400 }
    );
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();

  const token = signToken({ id: newUser._id, role: newUser.role });

  const response = NextResponse.json({
    success: true,
    data: { user: newUser, token },
  });

  response.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
  });
}
