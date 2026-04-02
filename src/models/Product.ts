import mongoose from 'mongoose'

const variantSchema = new mongoose.Schema(
  {
    size: String,
    color: String,
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    price: Number, // variant-specific price
    images: [String],
  },
  { _id: true }
)

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    alt: String,
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
)

const ratingSchema = new mongoose.Schema(
  {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
)

const seoSchema = new mongoose.Schema(
  {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
  },
  { _id: false }
)

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên sản phẩm'],
      index: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: String,
    shortDescription: String,
    price: {
      type: Number,
      required: [true, 'Vui lòng nhập giá'],
      min: [0, 'Giá không được âm'],
    },
    salePrice: {
      type: Number,
      validate: {
        validator: function (this: any) {
          return !this.salePrice || this.salePrice < this.price
        },
        message: 'Giá khuyến mãi phải nhỏ hơn giá gốc',
      },
    },
    costPrice: Number,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    subcategory: String,
    brand: String,
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    barcode: String,
    images: [imageSchema],
    variants: [variantSchema],
    totalStock: {
      type: Number,
      default: 0,
      min: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    rating: ratingSchema,
    seo: seoSchema,
    tags: [String],
  },
  { timestamps: true }
)

// Text index for search
productSchema.index({ name: 'text', description: 'text' })
productSchema.index({ isFeatured: 1, createdAt: -1 })
productSchema.index({ tags: 1 })

// Calculate total stock from variants
productSchema.pre('save', function (next) {
  if (this.variants && this.variants.length > 0) {
    this.totalStock = this.variants.reduce((sum: number, variant: any) => sum + (variant.stock || 0), 0)
  }
  next()
})

export default mongoose.models.Product || mongoose.model('Product', productSchema)
