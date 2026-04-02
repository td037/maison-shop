import mongoose from "mongoose";
import dbConnect from "./connect";
import Category from "../../models/Category";
import Product from "../../models/Product";

/**
 * Seed database with initial categories and products
 * Run this once after setting up MongoDB
 */

const categories = [
  {
    name: "Áo",
    slug: "áo",
    description: "Các loại áo thời trang cao cấp",
    icon: "👕",
    order: 1,
    isActive: true,
  },
  {
    name: "Quần",
    slug: "quần",
    description: "Quần denim, khaki, chinos chất lượng cao",
    icon: "👖",
    order: 2,
    isActive: true,
  },
  {
    name: "Phụ kiện",
    slug: "phụ-kiện",
    description: "Túi xách, thắt lưng, trang sức và các phụ kiện khác",
    icon: "👜",
    order: 3,
    isActive: true,
  },
  {
    name: "Giày dép",
    slug: "giày-dép",
    description: "Giày thể thao, giày casual, dép cao cấp",
    icon: "👟",
    order: 4,
    isActive: true,
  },
];

const sampleProducts = [
  {
    name: "Nordic Oak Lounge Chair",
    slug: "nordic-oak-lounge-chair",
    description: "Ghế lounge theo phong cách Bắc Âu, làm từ gỗ sồi cao cấp",
    shortDescription: "Ghế lounge gỗ sồi kinh điển",
    price: 450,
    salePrice: null,
    costPrice: 250,
    category: "Áo", // Will be replaced with actual ID
    sku: "FUR-NK-01",
    barcode: "1234567890123",
    images: [
      {
        url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
        alt: "Nordic Oak Lounge Chair",
        displayOrder: 1,
      },
    ],
    variants: [
      {
        size: "One Size",
        color: "Natural",
        sku: "FUR-NK-01-NS",
        stock: 42,
        price: 450,
      },
    ],
    isFeatured: true,
    isNew: true,
    isActive: true,
    tags: ["furniture", "lounge", "nordic"],
    seo: {
      metaTitle: "Nordic Oak Lounge Chair - MAISON",
      metaDescription: "Ghế lounge gỗ sồi cao cấp theo phong cách Bắc Âu",
      keywords: ["ghế", "lounge", "gỗ", "bắc âu"],
    },
  },
  {
    name: "Matte Terra Cotta Vase",
    slug: "matte-terra-cotta-vase",
    description: "Bình hoa gốm sứ màu đất thiêu hoàn toàn tay",
    shortDescription: "Bình hoa gốm thủ công",
    price: 85,
    salePrice: null,
    costPrice: 45,
    category: "Phụ kiện",
    sku: "CER-TC-08",
    barcode: "1234567890124",
    images: [
      {
        url: "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=600&q=80",
        alt: "Matte Terra Cotta Vase",
        displayOrder: 1,
      },
    ],
    variants: [
      {
        size: "M",
        color: "Terra Cotta",
        sku: "CER-TC-08-M",
        stock: 3,
        price: 85,
      },
      {
        size: "L",
        color: "Terra Cotta",
        sku: "CER-TC-08-L",
        stock: 5,
        price: 120,
      },
    ],
    isFeatured: false,
    isNew: false,
    isActive: true,
    tags: ["ceramic", "vase", "home-decor"],
    seo: {
      metaTitle: "Matte Terra Cotta Vase - MAISON",
      metaDescription: "Bình hoa gốm sứ thủ công cao cấp",
      keywords: ["bình hoa", "gốm", "trang trí"],
    },
  },
  {
    name: "Handwoven Linen Throw",
    slug: "handwoven-linen-throw",
    description: "Tấm vải lanh dệt tay từ lanh nguyên chất chất lượng cao",
    shortDescription: "Tấm lanh dệt tay tự nhiên",
    price: 120,
    salePrice: 95,
    costPrice: 60,
    category: "Phụ kiện",
    sku: "TEX-LN-22",
    barcode: "1234567890125",
    images: [
      {
        url: "https://images.unsplash.com/photo-1565182999555-2142b9c73b3d?w=600&q=80",
        alt: "Handwoven Linen Throw",
        displayOrder: 1,
      },
    ],
    variants: [
      {
        size: "Standard",
        color: "Natural",
        sku: "TEX-LN-22-STD",
        stock: 0,
        price: 120,
      },
    ],
    isFeatured: false,
    isNew: false,
    isActive: true,
    tags: ["linen", "textile", "natural"],
    seo: {
      metaTitle: "Handwoven Linen Throw - MAISON",
      metaDescription: "Tấm vải lanh dệt tay tự nhiên cao cấp",
      keywords: ["lanh", "vải", "dệt tay"],
    },
  },
];

async function seedDatabase() {
  try {
    await dbConnect();

    // Check if categories already exist
    const categoryCount = await Category.countDocuments();
    if (categoryCount > 0) {
      console.log("✅ Categories already exist, skipping seed");
      return;
    }

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create products with category references
    const productsWithCategories = sampleProducts.map((product) => ({
      ...product,
      category: createdCategories[0]._id, // Use actual category ID
    }));

    const createdProducts = await Product.insertMany(productsWithCategories);
    console.log(`✅ Created ${createdProducts.length} sample products`);

    console.log("✅ Database seeding completed successfully");
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
