import { NextResponse } from "next/server";
import connectDB from "../../../../../db/mongodb";
import Inventory from "../../../../../db/models/Inventory";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const { id } = params;
  try {
    // Find the inventory item by its ID
    const item = await Inventory.findById(id);
    if (!item) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 }
      );
    }

    // Define a fixed reorder amount (you could also retrieve this from the request)
    const reorderAmount = 100;

    // Update the item's quantity and updatedAt field
    item.quantity += reorderAmount;
    item.updatedAt = new Date();

    await item.save();

    return NextResponse.json(
      { success: true, data: item, message: "Reorder placed successfully" }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
