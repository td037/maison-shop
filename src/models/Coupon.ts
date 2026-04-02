import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
      trim: true,
      match: [/^[A-Z0-9]+$/, "Mã coupon phải là chữ cái hoặc số"],
    },
    discountType: {
      type: String,
      enum: ["percent", "fixed"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: [true, "Vui lòng nhập giá trị chiết khấu"],
      validate: {
        validator: function (this: any) {
          if (this.discountType === "percent") {
            return this.discountValue > 0 && this.discountValue <= 100;
          }
          return this.discountValue > 0;
        },
        message: "Giá trị chiết khấu không hợp lệ",
      },
    },
    maxDiscountAmount: Number, // cap on discount
    minOrderValue: {
      type: Number,
      default: 0,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    excludedCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    usageLimit: Number, // null = unlimited
    usedCount: {
      type: Number,
      default: 0,
    },
    usagePerCustomer: Number, // null = unlimited
    startsAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
      validate: {
        validator: function (this: any) {
          return this.expiresAt > this.startsAt;
        },
        message: "Ngày hết hạn phải sau ngày bắt đầu",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    description: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

// Index for finding active coupons
couponSchema.index({ isActive: 1, expiresAt: 1 });
couponSchema.index({ code: 1 }, { unique: true });

// Check if coupon is expired
couponSchema.methods.isExpired = function () {
  return new Date() > new Date(this.expiresAt);
};

// Check if coupon usage limit reached
couponSchema.methods.isUsageLimitReached = function () {
  if (!this.usageLimit) return false;
  return this.usedCount >= this.usageLimit;
};

export default mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
