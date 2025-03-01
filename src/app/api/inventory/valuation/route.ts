import { NextResponse } from "next/server";
import connectDB from "../../../../db/mongodb";
import Inventory from "../../../../db/models/Inventory";

export async function GET(request: Request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const sku = searchParams.get("sku");
  const method = (searchParams.get("method") || "FIFO").toUpperCase();
  const saleQuantityParam = searchParams.get("saleQuantity");
  const saleQuantity = saleQuantityParam ? parseInt(saleQuantityParam) : 0;

  // Validate inputs
  if (!sku) {
    return NextResponse.json(
      { success: false, error: "SKU is required" },
      { status: 400 }
    );
  }
  if (saleQuantity <= 0) {
    return NextResponse.json(
      { success: false, error: "Sale quantity must be greater than 0" },
      { status: 400 }
    );
  }
  if (!["FIFO", "LIFO", "WEIGHTED"].includes(method)) {
    return NextResponse.json(
      { success: false, error: "Invalid valuation method" },
      { status: 400 }
    );
  }

  try {
    // Fetch all inventory batches for the given SKU
    // We assume each Inventory document represents a batch with fields: quantity, costPrice, createdAt.
    let batches = await Inventory.find({ sku });

    if (!batches || batches.length === 0) {
      return NextResponse.json(
        { success: false, error: "No inventory found for the given SKU" },
        { status: 404 }
      );
    }

    let costOfGoodsSold = 0;
    let remainingQuantity = saleQuantity;

    if (method === "FIFO" || method === "LIFO") {
      // Sort batches by createdAt: ascending for FIFO, descending for LIFO.
      batches = batches.sort((a, b) => {
        return a.createdAt.getTime() - b.createdAt.getTime();
      });
      if (method === "LIFO") {
        batches = batches.reverse();
      }

      for (const batch of batches) {
        if (remainingQuantity <= 0) break;
        // Skip batches with zero quantity
        if (batch.quantity <= 0) continue;
        // Determine how much of this batch will be used
        const quantityTaken = Math.min(batch.quantity, remainingQuantity);
        costOfGoodsSold += quantityTaken * batch.costPrice;
        remainingQuantity -= quantityTaken;
      }

      if (remainingQuantity > 0) {
        return NextResponse.json(
          { success: false, error: "Insufficient stock for sale quantity" },
          { status: 400 }
        );
      }
    } else if (method === "WEIGHTED") {
      // Calculate the weighted average cost
      let totalQuantity = 0;
      let totalCost = 0;
      batches.forEach((batch) => {
        totalQuantity += batch.quantity;
        totalCost += batch.quantity * batch.costPrice;
      });
      if (saleQuantity > totalQuantity) {
        return NextResponse.json(
          { success: false, error: "Insufficient stock for sale quantity" },
          { status: 400 }
        );
      }
      const weightedAverageCost = totalCost / totalQuantity;
      costOfGoodsSold = saleQuantity * weightedAverageCost;
    }

    return NextResponse.json({
      success: true,
      data: {
        sku,
        method,
        saleQuantity,
        costOfGoodsSold,
      },
    });
  } catch (error: any) {
    console.error("Error in stock valuation endpoint:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
