import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Order from "@/models/Order";
import crypto from "crypto";
import mongoose from "mongoose";

// Momo configuration
const MOMO_CONFIG = {
  partnerCode: process.env.MOMO_PARTNER_CODE || "MOMOMSQ20220101",
  accessKey: process.env.MOMO_ACCESS_KEY || "F8BF47B21026DF7C",
  secretKey: process.env.MOMO_SECRET_KEY || "K951B6PE1wsDPo13hMEhKHUFsM3fYBZH",
  redirectUrl: process.env.MOMO_REDIRECT_URL || "http://localhost:3000/payment/success",
  ipnUrl: process.env.MOMO_IPN_URL || "http://localhost:3001/webhooks/momo",
  endpoint: "https://test-payment.momo.vn/v3/web/initiate", // Dev endpoint
};

/**
 * POST /api/payments/momo
 * Create Momo payment request
 */
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { orderNumber, amount } = body;

    if (!orderNumber || !amount) {
      return NextResponse.json(
        { error: "orderNumber and amount required" },
        { status: 400 }
      );
    }

    // Find order
    const order = await Order.findOne({ orderNumber });
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Generate requestId
    const requestId = `${orderNumber}-${Date.now()}`;
    const orderId = `${orderNumber}`;

    // Build request data
    const requestData = {
      partnerCode: MOMO_CONFIG.partnerCode,
      partnerName: "MAISON",
      partnerTransactionId: orderId,
      requestId: requestId,
      amount: Math.round(amount),
      orderId: orderId,
      orderInfo: `Thanh toán đơn hàng ${orderNumber}`,
      redirectUrl: MOMO_CONFIG.redirectUrl,
      ipnUrl: MOMO_CONFIG.ipnUrl,
      requestType: "captureWallet",
      autoCapture: true,
      lang: "vi",
      userInfo: {
        name: order.shippingAddress?.name || "Customer",
        phoneNumber: order.shippingAddress?.phone || "",
        email: order.shippingAddress?.email || "",
      },
    };

    // Generate signature
    const signature = generateSignature(requestData, MOMO_CONFIG.secretKey);

    // Create payment request
    const paymentRequest = {
      ...requestData,
      signature: signature,
    };

    // Update order with payment info
    await Order.findByIdAndUpdate(order._id, {
      paymentDetails: {
        transactionId: requestId,
        paymentGateway: "momo",
      },
    });

    // Call Momo API
    const response = await fetch(MOMO_CONFIG.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentRequest),
    });

    const momoResponse = await response.json();

    if (momoResponse.resultCode !== 0) {
      return NextResponse.json(
        { error: momoResponse.message || "Payment request failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        payUrl: momoResponse.payUrl,
        requestId: requestId,
        orderId: orderId,
      },
    });
  } catch (error: any) {
    console.error("Momo payment error:", error);
    return NextResponse.json(
      { error: error.message || "Payment request failed" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/payments/momo/callback
 * Momo IPN callback
 */
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { orderId, requestId, resultCode, message, transId } = body;

    // Verify signature
    const signature = body.signature;
    const bodyWithoutSignature = { ...body };
    delete bodyWithoutSignature.signature;

    const calculatedSignature = generateSignature(
      bodyWithoutSignature,
      MOMO_CONFIG.secretKey
    );

    if (signature !== calculatedSignature) {
      console.warn("Invalid signature from Momo");
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 400 }
      );
    }

    // Find and update order
    const order = await Order.findOne({ orderNumber: orderId });
    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    if (resultCode === 0 || resultCode === "0") {
      // Payment successful
      await Order.findByIdAndUpdate(order._id, {
        paymentStatus: "paid",
        status: "processing",
        "paymentDetails.paidAt": new Date(),
        "paymentDetails.transactionId": transId,
      });

      return NextResponse.json({
        message: "Success",
        resultCode: 0,
      });
    } else {
      // Payment failed
      await Order.findByIdAndUpdate(order._id, {
        paymentStatus: "failed",
        status: "cancelled",
      });

      return NextResponse.json({
        message: "Transaction failed",
        resultCode: resultCode,
      });
    }
  } catch (error: any) {
    console.error("Momo callback error:", error);
    return NextResponse.json(
      { message: error.message || "Callback processing failed" },
      { status: 500 }
    );
  }
}

/**
 * Helper: Generate Momo signature
 */
function generateSignature(data: any, secretKey: string): string {
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(JSON.stringify(data))
    .digest("hex");
  return signature;
}
