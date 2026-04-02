import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import mongoose from "mongoose";

/**
 * GET /api/cart
 * Get cart for logged-in user - REQUIRES LOGIN
 */
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const userId = req.nextUrl.searchParams.get("userId");

    // Require login - userId is mandatory
    if (!userId) {
      return NextResponse.json(
        { error: "User must be logged in to access cart" },
        { status: 401 }
      );
    }

    const filter = {
      userId: new mongoose.Types.ObjectId(userId)
    };

    const cart = await Cart.findOne(filter).populate("items.productId");

    if (!cart) {
      return NextResponse.json({
        success: true,
        data: { items: [], total: 0, itemCount: 0 },
      });
    }

    return NextResponse.json({
      success: true,
      data: cart,
    });
  } catch (error: any) {
    console.error("Get cart error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get cart" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cart
 * Add item to cart - REQUIRES LOGIN
 */
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { userId, productId, quantity, size, color } = body;

    // Require login - userId is mandatory
    if (!userId) {
      return NextResponse.json(
        { error: "User must be logged in to add items to cart" },
        { status: 401 }
      );
    }

    if (!productId || !quantity) {
      return NextResponse.json(
        { error: "productId and quantity required" },
        { status: 400 }
      );
    }

    // Fetch product
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const filter = {
      userId: new mongoose.Types.ObjectId(userId)
    };

    // Find or create cart
    let cart = await Cart.findOne(filter);
    if (!cart) {
      cart = new Cart(filter);
    }

    // Check if item exists
    const existingItem = cart.items.find(
      (item: any) =>
        item.productId.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.subtotal = existingItem.quantity * (existingItem.salePrice || existingItem.price);
    } else {
      cart.items.push({
        productId,
        slug: product.slug,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        image: product.images?.[0]?.url,
        size,
        color,
        quantity,
        subtotal: quantity * (product.salePrice || product.price),
      });
    }

    // Update totals
    cart.itemCount = cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    cart.total = cart.items.reduce((sum: number, item: any) => sum + item.subtotal, 0);

    await cart.save();

    return NextResponse.json(
      { success: true, data: cart },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Add to cart error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to add to cart" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/cart
 * Update cart item quantity - REQUIRES LOGIN
 */
export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { userId, itemId, quantity } = body;

    // Require login - userId is mandatory
    if (!userId) {
      return NextResponse.json(
        { error: "User must be logged in to update cart" },
        { status: 401 }
      );
    }

    if (!itemId) {
      return NextResponse.json(
        { error: "itemId required" },
        { status: 400 }
      );
    }

    const filter = {
      userId: new mongoose.Types.ObjectId(userId)
    };

    const cart = await Cart.findOne(filter);
    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return NextResponse.json(
        { error: "Item not found in cart" },
        { status: 404 }
      );
    }

    if (quantity <= 0) {
      item.deleteOne();
    } else {
      item.quantity = quantity;
      item.subtotal = quantity * (item.salePrice || item.price);
    }

    // Update totals
    cart.itemCount = cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    cart.total = cart.items.reduce((sum: number, item: any) => sum + item.subtotal, 0);

    await cart.save();

    return NextResponse.json({
      success: true,
      data: cart,
    });
  } catch (error: any) {
    console.error("Update cart error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update cart" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cart
 * Remove item from cart or clear entire cart - REQUIRES LOGIN
 * If itemId provided: remove specific item
 * If no itemId: clear entire cart
 */
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    const userId = req.nextUrl.searchParams.get("userId");
    const itemId = req.nextUrl.searchParams.get("itemId");

    // Require login - userId is mandatory
    if (!userId) {
      return NextResponse.json(
        { error: "User must be logged in to update cart" },
        { status: 401 }
      );
    }

    const filter = {
      userId: new mongoose.Types.ObjectId(userId)
    };

    const cart = await Cart.findOne(filter);
    if (!cart) {
      return NextResponse.json(
        { success: true, data: { items: [], total: 0, itemCount: 0 } },
        { status: 200 }
      );
    }

    // If itemId provided, remove specific item
    if (itemId) {
      cart.items.id(itemId)?.deleteOne();
    } else {
      // Clear entire cart
      cart.items = [];
    }

    // Update totals
    cart.itemCount = cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    cart.total = cart.items.reduce((sum: number, item: any) => sum + item.subtotal, 0);

    await cart.save();

    return NextResponse.json({
      success: true,
      data: cart,
    });
  } catch (error: any) {
    console.error("Delete cart error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete cart" },
      { status: 500 }
    );
  }
}
