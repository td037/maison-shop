import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    sku: String,
    price: {
      type: Number,
      required: true,
    },
    salePrice: Number,
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

const shippingAddressSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: String,
    street: {
      type: String,
      required: true,
    },
    ward: String,
    district: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    postalCode: String,
  },
  { _id: false }
)

const paymentDetailsSchema = new mongoose.Schema(
  {
    transactionId: String,
    paidAt: Date,
    paymentGateway: String, // Stripe, Zalopay, etc.
  },
  { _id: false }
)

const orderTimelineSchema = new mongoose.Schema(
  {
    status: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
    note: String,
  },
  { _id: false }
)

const trackingSchema = new mongoose.Schema(
  {
    carrier: String, // GHN, GHTK, etc.
    trackingNumber: String,
    estimatedDeliveryDate: Date,
  },
  { _id: false }
)

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    guestInfo: {
      sessionId: String,
      fullName: String,
      email: String,
      phone: String,
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: function (items: any[]) {
          return items && items.length > 0
        },
        message: 'Đơn hàng phải có ít nhất một sản phẩm',
      },
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'bank_transfer', 'momo', 'zalopay', 'card', 'vnpay'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    paymentDetails: paymentDetailsSchema,
    // VNPay specific fields
    vnpayTransactionNo: String,
    vnpayBankCode: String,
    vnpayPayDate: String,
    vnpayResponseCode: String,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'shipping', 'delivered', 'cancelled', 'paid'],
      default: 'pending',
      index: true,
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'shipping', 'delivered', 'cancelled'],
      default: 'pending',
      index: true,
    },
    orderTimeline: [orderTimelineSchema],
    couponCode: String,
    discountAmount: {
      type: Number,
      default: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    subtotal: Number,
    totalAmount: {
      type: Number,
      required: true,
    },
    note: String,
    notes: String,
    internalNotes: String,
    tracking: trackingSchema,
    deliveredAt: Date,
  },
  { timestamps: true }
)

// Auto-update timeline
orderSchema.pre('save', function (next) {
  if (this.isModified('orderStatus')) {
    if (!this.orderTimeline) {
      this.orderTimeline = [] as any
    }
    this.orderTimeline.push({
      status: this.orderStatus,
      timestamp: new Date(),
    } as any)
  }
  next()
})

export default mongoose.models.Order || mongoose.model('Order', orderSchema)
