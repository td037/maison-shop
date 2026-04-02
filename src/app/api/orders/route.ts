import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";
import Coupon from "@/models/Coupon";

/**
 * POST /api/orders
 * Create a new order
 */
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { 
      userId, 
      sessionId,
      items, 
      shippingAddress, 
      paymentMethod,
      deliveryMethod,
      customerInfo,
      couponCode,
      note
    } = body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "items must be a non-empty array" },
        { status: 400 },
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: "paymentMethod is required" },
        { status: 400 },
      );
    }

    // For guest checkout, validate sessionId and customerInfo
    if (!userId && !sessionId) {
      return NextResponse.json(
        { error: "userId or sessionId required" },
        { status: 400 },
      );
    }

    if (!userId && !customerInfo) {
      return NextResponse.json(
        { error: "customerInfo required for guest checkout" },
        { status: 400 },
      );
    }

    // Verify user exists if userId provided
    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
    }

    // Verify products exist and validate items
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      // Skip if item doesn't have productId
      if (!item.productId) {
        console.warn("Item missing productId:", item);
        continue;
      }

      let product;
      try {
        product = await Product.findById(item.productId);
      } catch (err) {
        console.error(`Invalid product ID: ${item.productId}`, err);
        return NextResponse.json(
          { error: `Invalid product ID: ${item.productId}` },
          { status: 400 },
        );
      }

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 404 },
        );
      }

      const itemPrice = item.salePrice || product.salePrice || product.price;
      const itemQuantity = item.quantity || 1;
      const itemSubtotal = itemPrice * itemQuantity;

      validatedItems.push({
        productId: product._id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        salePrice: product.salePrice,
        size: item.size || 'M',
        color: item.color || '#1a1a2e',
        quantity: itemQuantity,
        subtotal: itemSubtotal,
      });

      subtotal += itemSubtotal;
    }

    if (validatedItems.length === 0) {
      return NextResponse.json(
        { error: "No valid items in cart" },
        { status: 400 },
      );
    }

    // Validate coupon if provided
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        expiresAt: { $gt: new Date() },
      });

      if (!coupon) {
        return NextResponse.json(
          { error: "Invalid or expired coupon" },
          { status: 400 },
        );
      }

      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return NextResponse.json(
          { error: "Coupon usage limit reached" },
          { status: 400 },
        );
      }

      if (subtotal < coupon.minOrderValue) {
        return NextResponse.json(
          { error: `Minimum order value ₫${coupon.minOrderValue} required` },
          { status: 400 },
        );
      }

      // Calculate discount
      if (coupon.discountType === "percent") {
        discountAmount = (subtotal * coupon.discountValue) / 100;
        if (coupon.maxDiscountAmount) {
          discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
        }
      } else {
        discountAmount = coupon.discountValue;
      }

      // Increment coupon usage
      await Coupon.findByIdAndUpdate(coupon._id, {
        usedCount: coupon.usedCount + 1,
      });
    }

    // Generate order number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const ordersToday = await Order.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    });
    const orderNumber = `ORD-${dateStr}-${String(ordersToday + 1).padStart(4, "0")}`;

    // Calculate final amount
    const shippingCost = deliveryMethod === 'express' ? 50000 : 0;
    const taxAmount = 0;
    const totalAmount = subtotal + shippingCost + taxAmount - discountAmount;

    // Create order data
    const orderData: any = {
      orderNumber,
      items: validatedItems,
      shippingAddress: customerInfo?.address || shippingAddress || 'Not provided',
      paymentMethod,
      couponCode: couponCode?.toUpperCase(),
      discountAmount,
      shippingCost,
      taxAmount,
      subtotal,
      totalAmount,
      paymentStatus: "pending",
      orderStatus: "pending",
      note: note || '',
      orderTimeline: [
        {
          status: "pending",
          timestamp: new Date(),
          note: "Order created",
        },
      ],
    };

    // Add userId if provided, otherwise add guest info
    if (userId) {
      orderData.userId = userId;
    } else {
      orderData.guestInfo = {
        sessionId,
        fullName: customerInfo?.fullName || 'Guest',
        email: customerInfo?.email || '',
        phone: customerInfo?.phone || '',
      };
    }

    // Create order in database
    const order = await Order.create(orderData);

    if (userId) {
      await order.populate("userId", "name email phone");
    }

    return NextResponse.json(
      { 
        message: "Order created successfully",
        data: order
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Create order error:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { 
        error: error.message || "Failed to create order",
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/orders?userId=...
 * Get orders for a user
 */
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const orders = await Order.find({ userId })
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 });

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get orders" },
      { status: 500 },
    );
  }
}
