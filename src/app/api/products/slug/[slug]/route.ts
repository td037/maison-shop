import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Product from "@/models/Product";

/**
 * GET /api/products/slug/[slug]
 * Get a product by slug
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();

    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }

    // Find product by slug
    const product = await Product.findOne({ slug: slug.toLowerCase(), isActive: true })
      .populate("category", "name slug")
      .lean();

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    console.error("Get product by slug error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get product" },
      { status: 500 }
    );
  }
}