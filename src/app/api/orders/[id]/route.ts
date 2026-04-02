import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Order from "@/models/Order";

/**
 * GET /api/orders/[id]
 * Get order details by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Order ID required" },
        { status: 400 }
      );
    }

    const order = await Order.findById(id).populate("items.productId");

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: order,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get order error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get order" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/orders/[id]
 * Update order fields for admin
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    const body = await req.json();
    const update: Record<string, any> = {}

    if (body.orderStatus) update.orderStatus = body.orderStatus
    if (body.paymentStatus) update.paymentStatus = body.paymentStatus
    if (typeof body.note === 'string') update.note = body.note
    if (typeof body.internalNotes === 'string') update.internalNotes = body.internalNotes
    if (body.tracking) update.tracking = body.tracking

    const order = await Order.findByIdAndUpdate(id, update, { new: true, runValidators: true }).populate('items.productId')

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Order updated successfully', data: order })
  } catch (error: any) {
    console.error('Update order error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update order' }, { status: 500 });
  }
}

/**
 * DELETE /api/orders/[id]
 * Delete order
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Order deleted successfully' })
  } catch (error: any) {
    console.error('Delete order error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete order' }, { status: 500 });
  }
}
