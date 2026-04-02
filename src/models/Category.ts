import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Vui lòng nhập tên danh mục"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    description: String,
    image: String,
    icon: String, // SVG or emoji
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
    metaTitle: String,
    metaDescription: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Index for performance
categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ parentCategory: 1 });
categorySchema.index({ order: 1 });

// Method to get subcategories
categorySchema.methods.getSubcategories = function () {
  return mongoose.models.Category.find({ parentCategory: this._id });
};

// Method to get parent category
categorySchema.methods.getParent = function () {
  if (!this.parentCategory) return null;
  return mongoose.models.Category.findById(this.parentCategory);
};

export default mongoose.models.Category ||
  mongoose.model("Category", categorySchema);
