const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

const productSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const categorySchema = new mongoose.Schema({}, { strict: false, timestamps: true });

const Product = mongoose.model('Product', productSchema);
const Category = mongoose.model('Category', categorySchema);

async function checkProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Count products
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const inactiveProducts = await Product.countDocuments({ isActive: false });

    console.log('📊 PRODUCTS SUMMARY:');
    console.log(`   Total: ${totalProducts}`);
    console.log(`   Active: ${activeProducts}`);
    console.log(`   Inactive: ${inactiveProducts}\n`);

    // Count categories
    const totalCategories = await Category.countDocuments();
    const activeCategories = await Category.countDocuments({ isActive: true });

    console.log('📊 CATEGORIES SUMMARY:');
    console.log(`   Total: ${totalCategories}`);
    console.log(`   Active: ${activeCategories}\n`);

    // Show sample products
    const sampleProducts = await Product.find({ isActive: true })
      .limit(5)
      .select('name price salePrice category isActive isFeatured isNew images');

    console.log('📦 SAMPLE PRODUCTS (first 5):');
    sampleProducts.forEach((p, i) => {
      console.log(`\n${i + 1}. ${p.name}`);
      console.log(`   Price: ${p.price?.toLocaleString('vi-VN')}đ`);
      if (p.salePrice) console.log(`   Sale: ${p.salePrice?.toLocaleString('vi-VN')}đ`);
      console.log(`   Category ID: ${p.category}`);
      console.log(`   Images: ${p.images?.length || 0}`);
      console.log(`   Active: ${p.isActive}, Featured: ${p.isFeatured}, New: ${p.isNew}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkProducts();
