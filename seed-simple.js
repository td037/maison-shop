const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

const categorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  image: String,
  icon: String,
  order: Number,
  isActive: Boolean,
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  shortDescription: String,
  price: Number,
  salePrice: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  sku: String,
  images: [{ url: String, alt: String, displayOrder: Number }],
  variants: [{ size: String, color: String, sku: String, stock: Number, price: Number }],
  totalStock: Number,
  isFeatured: Boolean,
  isNew: Boolean,
  isActive: Boolean,
  tags: [String],
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if data exists
    const catCount = await Category.countDocuments();
    if (catCount > 0) {
      console.log('✅ Data already exists');
      process.exit(0);
    }

    // Create categories
    const categories = await Category.insertMany([
      { name: 'Áo', slug: 'ao', description: 'Áo thời trang', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80', icon: '👕', order: 1, isActive: true },
      { name: 'Quần', slug: 'quan', description: 'Quần thời trang', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80', icon: '👖', order: 2, isActive: true },
      { name: 'Giày', slug: 'giay', description: 'Giày dép', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', icon: '👟', order: 3, isActive: true },
      { name: 'Phụ kiện', slug: 'phu-kien', description: 'Phụ kiện thời trang', image: 'https://images.unsplash.com/photo-1611923134239-b9be5b4e9ff1?w=600&q=80', icon: '👜', order: 4, isActive: true },
    ]);
    console.log(`✅ Created ${categories.length} categories`);

    // Create products
    const products = await Product.insertMany([
      {
        name: 'Áo Blazer Oversize Cao Cấp',
        slug: 'ao-blazer-oversize',
        description: 'Áo blazer oversize phong cách Hàn Quốc, chất liệu vải cao cấp, form dáng rộng thoải mái',
        shortDescription: 'Áo blazer oversize cao cấp',
        price: 1890000,
        salePrice: 1290000,
        category: categories[0]._id,
        sku: 'AO-BLZ-001',
        images: [{ url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80', alt: 'Áo Blazer', displayOrder: 1 }],
        variants: [
          { size: 'S', color: 'Đen', sku: 'AO-BLZ-001-S-BLK', stock: 10, price: 1290000 },
          { size: 'M', color: 'Đen', sku: 'AO-BLZ-001-M-BLK', stock: 15, price: 1290000 },
          { size: 'L', color: 'Đen', sku: 'AO-BLZ-001-L-BLK', stock: 12, price: 1290000 },
        ],
        totalStock: 37,
        isFeatured: true,
        isNew: true,
        isActive: true,
        tags: ['blazer', 'oversize', 'cao-cap'],
      },
      {
        name: 'Quần Wide Leg Linen',
        slug: 'quan-wide-leg-linen',
        description: 'Quần ống rộng chất liệu linen thoáng mát, phù hợp mùa hè',
        shortDescription: 'Quần wide leg linen',
        price: 1190000,
        salePrice: 890000,
        category: categories[1]._id,
        sku: 'QU-WL-002',
        images: [{ url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80', alt: 'Quần Wide Leg', displayOrder: 1 }],
        variants: [
          { size: 'S', color: 'Be', sku: 'QU-WL-002-S-BE', stock: 8, price: 890000 },
          { size: 'M', color: 'Be', sku: 'QU-WL-002-M-BE', stock: 12, price: 890000 },
          { size: 'L', color: 'Be', sku: 'QU-WL-002-L-BE', stock: 10, price: 890000 },
        ],
        totalStock: 30,
        isFeatured: true,
        isNew: true,
        isActive: true,
        tags: ['quan', 'wide-leg', 'linen'],
      },
      {
        name: 'Giày Loafer Da Bê',
        slug: 'giay-loafer-da-be',
        description: 'Giày loafer da bê thật 100%, thiết kế sang trọng, phù hợp đi làm và dự tiệc',
        shortDescription: 'Giày loafer da bê cao cấp',
        price: 2190000,
        salePrice: null,
        category: categories[2]._id,
        sku: 'GI-LF-003',
        images: [{ url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80', alt: 'Giày Loafer', displayOrder: 1 }],
        variants: [
          { size: '39', color: 'Đen', sku: 'GI-LF-003-39-BLK', stock: 5, price: 2190000 },
          { size: '40', color: 'Đen', sku: 'GI-LF-003-40-BLK', stock: 8, price: 2190000 },
          { size: '41', color: 'Đen', sku: 'GI-LF-003-41-BLK', stock: 6, price: 2190000 },
        ],
        totalStock: 19,
        isFeatured: true,
        isNew: false,
        isActive: true,
        tags: ['giay', 'loafer', 'da-be'],
      },
      {
        name: 'Túi Tote Canvas Thêu',
        slug: 'tui-tote-canvas-theu',
        description: 'Túi tote canvas với họa tiết thêu tay tinh xảo, thiết kế đơn giản nhưng sang trọng',
        shortDescription: 'Túi tote canvas thêu tay',
        price: 890000,
        salePrice: 690000,
        category: categories[3]._id,
        sku: 'TU-TT-004',
        images: [{ url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80', alt: 'Túi Tote', displayOrder: 1 }],
        variants: [
          { size: 'One Size', color: 'Trắng', sku: 'TU-TT-004-OS-WHT', stock: 20, price: 690000 },
          { size: 'One Size', color: 'Đen', sku: 'TU-TT-004-OS-BLK', stock: 15, price: 690000 },
        ],
        totalStock: 35,
        isFeatured: false,
        isNew: true,
        isActive: true,
        tags: ['tui', 'tote', 'canvas'],
      },
    ]);
    console.log(`✅ Created ${products.length} products`);

    console.log('🎉 Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
