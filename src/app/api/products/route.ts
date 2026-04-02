import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Product from "@/models/Product";
import Category from "@/models/Category";
import mongoose from "mongoose";

/**
 * GET /api/products
 * Get all products with pagination and filtering
 * Query params:
 *   - page: page number (default: 1)
 *   - limit: items per page (default: 12)
 *   - category: filter by category ID (e.g., '69c66dbe35a190f20c3618fb')
 *   - featured: only featured products (true/false)
 *   - new: only new products (true/false)
 *   - search: search by name or description
 *   - sort: order by (newest, oldest, priceLow, priceHigh, popular)
 *   - topDiscount: get top N products by discount percentage (e.g., ?topDiscount=4)
 *   - minPrice, maxPrice: filter by price range
 */
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured") === "true";
    const isNew = searchParams.get("new") === "true";
    const search = searchParams.get("search");
    const topDiscount = searchParams.get("topDiscount");
    const sort = searchParams.get("sort");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    // Build filter query
    const filter: any = { isActive: true };

    if (featured) filter.isFeatured = true;
    if (isNew) filter.isNew = true;

    // Filter by category ID - convert string to ObjectId
    if (category) {
      try {
        filter.category = new mongoose.Types.ObjectId(category);
        console.log('🔍 Category filter (ObjectId):', filter.category);
      } catch (e) {
        console.error('❌ Invalid category ID format:', category);
      }
    }

    console.log('📋 Filter:', JSON.stringify(filter, null, 2));

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    // Text search
    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { name: { $regex: escapedSearch, $options: 'i' } },
        { description: { $regex: escapedSearch, $options: 'i' } },
        { sku: { $regex: escapedSearch, $options: 'i' } },
        { brand: { $regex: escapedSearch, $options: 'i' } },
        { shortDescription: { $regex: escapedSearch, $options: 'i' } },
      ];
    }

    // If topDiscount is requested, get top products by discount percentage
    if (topDiscount) {
      const topCount = parseInt(topDiscount);
      const products = await Product.find(filter)
        .populate("category", "name slug");

      // Calculate discount percentage and sort
      const productsWithDiscount = products
        .map((p: any) => ({
          ...p.toObject ? p.toObject() : p,
          discountPercent: p.salePrice && p.price 
            ? Math.round(((p.price - p.salePrice) / p.price) * 100)
            : 0
        }))
        .filter((p: any) => p.discountPercent > 0)
        .sort((a: any, b: any) => b.discountPercent - a.discountPercent)
        .slice(0, topCount);

      return NextResponse.json({
        success: true,
        data: productsWithDiscount,
      });
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    console.log('📊 Total products matched:', total);

    // Determine sort order
    let sortOrder: any = { createdAt: -1 }; // default: newest first
    if (sort === "oldest") {
      sortOrder = { createdAt: 1 };
    } else if (sort === "priceLow") {
      sortOrder = { price: 1 };
    } else if (sort === "priceHigh") {
      sortOrder = { price: -1 };
    } else if (sort === "popular") {
      sortOrder = { "rating.average": -1 };
    }

    // Fetch products
    let products = await Product.find(filter)
      .populate("category", "name slug")
      .limit(limit)
      .skip(skip)
      .sort(sortOrder);

    // If sort is by date, manually sort because createdAt might be string
    if (sort === "newest" || sort === "oldest") {
      products = products.sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sort === "newest" ? dateB - dateA : dateA - dateB;
      });
    }

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error: any) {
    console.error("Get products error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get products" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/products
 * Create new product (admin only)
 */
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();

    // Validate required fields
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Create product
    const product = await Product.create(body);
    await product.populate("category", "name slug");

    return NextResponse.json(
      { message: "Product created successfully", product },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create product" },
      { status: 500 },
    );
  }
}
