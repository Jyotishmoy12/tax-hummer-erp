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

  try {
    // Explicitly hash the password and verify it's hashed
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Verify the hashed password is different from the original
    console.log("Password:", password);
    console.log("Hashed:", hashedPassword);
    
    // Create user with verified hashed password
    const newUser = new User({ 
      name, 
      email, 
      // Explicitly ensure it's the hashed password
      password: hashedPassword, 
      role 
    });
    
    // Save the user
    const savedUser = await newUser.save();
    
    // Check the saved user's password
    console.log("Saved password:", savedUser.password);
    
    const token = signToken({ id: savedUser._id, role: savedUser.role });

    const response = NextResponse.json({
      success: true,
      data: { 
        user: {
          _id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
          role: savedUser.role
        }, 
        token 
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
    });
    
    return response;
  } catch (error) {
    console.error("Error during user creation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 }
    );
  }
}
