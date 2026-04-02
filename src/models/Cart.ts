import mongoose from 'mongoose'

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    slug: String,
    name: String,
    price: Number,
    salePrice: Number,
    image: String,
    size: String,
    color: String,
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    subtotal: {
      type: Number,
      required: true,
    },
  },
  { _id: true }
)

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    sessionId: String, // Cho guest users
    items: [cartItemSchema],
    total: {
      type: Number,
      default: 0,
    },
    itemCount: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000), // 30 days
      index: { expireAfterSeconds: 0 },
    },
  },
  { timestamps: true }
)

// Auto-delete old carts
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export default mongoose.models.Cart || mongoose.model('Cart', cartSchema)
