import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      enum: ['Nhà', 'Văn phòng', 'Khác'],
      required: true,
    },
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
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
)

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Vui lòng nhập email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/, 'Email không hợp lệ'],
    },
    password: {
      type: String,
      required: [true, 'Vui lòng nhập mật khẩu'],
      minlength: 8,
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    phone: {
      type: String,
      sparse: true,
      validate: {
        validator: function(v: string) {
          if (!v) return true; // Optional
          return /^[0-9]{10,11}$/.test(v); // Only digits, 10-11 chars
        },
        message: 'Số điện thoại không hợp lệ (phải có 10-11 chữ số)',
      },
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    addresses: [addressSchema],
    avatar: String,
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    preferredLanguage: {
      type: String,
      default: 'vi',
      enum: ['vi', 'en'],
    },
    lastLogin: Date,
  },
  { timestamps: true }
)

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }

  try {
    const bcrypt = require('bcryptjs')
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error as any)
  }
})

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  const bcrypt = require('bcryptjs')
  return await bcrypt.compare(enteredPassword, this.password)
}

export default mongoose.models.User || mongoose.model('User', userSchema)
