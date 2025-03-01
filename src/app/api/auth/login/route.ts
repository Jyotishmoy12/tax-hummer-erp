import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from "../../../../db/mongodb";
import User from "../../../../db/models/User";
import { signToken } from "../../../../lib/auth";

export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ success: false, error: 'Missing email or password' }, { status: 400 });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
  }

  const token = signToken({ id: user._id, role: user.role });
  const response = NextResponse.json({ success: true, data: { user, token } });
  response.cookies.set('token', token, { httpOnly: true, path: '/' });
  return response;
}
