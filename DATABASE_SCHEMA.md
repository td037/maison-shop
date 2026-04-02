# E-Commerce Database Schema

## Database Configuration

**Database:** MongoDB (Atlas)  
**ODM:** Mongoose  
**Environment:** Node.js / Next.js

---

## Collections Overview

### 1. Users Collection
Stores customer and admin account information.

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,                    // unique
  password: String,                 // bcrypt hashed
  role: String,                     // "customer" | "admin"  [default: "customer"]
  phone: String,
  addresses: [
    {
      _id: ObjectId,
      label: String,                // "Nhà" | "Văn phòng" | "Khác"
      street: String,
      ward: String,
      district: String,
      city: String,
      province: String,
      postalCode: String,
      isDefault: Boolean             // [default: false]
    }
  ],
  avatar: String,                   // URL to avatar image
  phoneVerified: Boolean,           // [default: false]
  emailVerified: Boolean,           // [default: false]
  preferredLanguage: String,        // [default: "vi"]
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date
}
```

---

### 2. Products Collection
Manages all product information and inventory.

```javascript
{
  _id: ObjectId,
  name: String,                     // required, indexed
  slug: String,                     // unique, for URL routes
  description: String,              // HTML content for product details
  shortDescription: String,         // Product summary
  price: Number,                    // current price (required)
  salePrice: Number,                // promotional price (can be null)
  costPrice: Number,                // internal cost tracking
  category: ObjectId,               // ref: categories (required)
  subcategory: String,              // optional subcategory
  brand: String,                    // optional brand name
  sku: String,                      // unique stock keeping unit
  barcode: String,                  // optional barcode
  images: [
    {
      url: String,
      alt: String,
      displayOrder: Number
    }
  ],
  variants: [
    {
      _id: ObjectId,
      size: String,                 // S, M, L, XL, etc.
      color: String,
      sku: String,                  // variant-specific SKU
      stock: Number,                // quantity in stock
      price: Number,                // variant-specific price override
      images: [String]              // variant-specific images
    }
  ],
  totalStock: Number,               // sum of all variant stocks
  isFeatured: Boolean,              // featured on homepage [default: false]
  isNew: Boolean,                   // new arrival badge [default: false]
  isActive: Boolean,                // availability status [default: true]
  rating: {
    average: Number,                // avg rating (0-5)
    count: Number                   // number of reviews
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  tags: [String],                   // for filtering/search
  createdAt: Date,
  updatedAt: Date
}
```

---

### 3. Orders Collection
Complete order records with customer and payment information.

```javascript
{
  _id: ObjectId,
  orderNumber: String,              // unique, human-readable (ORD-2026-001234)
  userId: ObjectId,                 // ref: users (required)
  items: [
    {
      _id: ObjectId,
      productId: ObjectId,          // ref: products
      name: String,                 // snapshot at purchase time
      sku: String,
      price: Number,                // snapshot at purchase time
      salePrice: Number,
      size: String,
      color: String,
      quantity: Number,
      subtotal: Number              // price * quantity
    }
  ],
  shippingAddress: {
    name: String,                   // recipient name
    phone: String,
    email: String,
    street: String,
    ward: String,
    district: String,
    city: String,
    province: String,
    postalCode: String
  },
  paymentMethod: String,            // "COD" | "bank_transfer" | "e_wallet" | "credit_card"
  paymentStatus: String,            // "pending" | "paid" | "failed" | "refunded"
  paymentDetails: {
    transactionId: String,
    paidAt: Date,
    paymentGateway: String          // Stripe, Zalopay, etc.
  },
  orderStatus: String,              // "pending" | "confirmed" | "preparing" | "shipping" | "delivered" | "cancelled"
  orderTimeline: [
    {
      status: String,
      timestamp: Date,
      note: String
    }
  ],
  couponCode: String,               // ref: coupons (optional)
  discountAmount: Number,
  shippingCost: Number,
  taxAmount: Number,
  subtotal: Number,                 // sum of item subtotals
  totalAmount: Number,              // subtotal + shipping + tax - discount
  notes: String,                    // customer notes
  internalNotes: String,            // admin notes
  tracking: {
    carrier: String,                // delivery service (GHN, GHTK, etc.)
    trackingNumber: String,
    estimatedDeliveryDate: Date
  },
  createdAt: Date,
  updatedAt: Date,
  deliveredAt: Date
}
```

---

### 4. Coupons Collection
Promotion and discount code management.

```javascript
{
  _id: ObjectId,
  code: String,                     // unique, case-insensitive (SUMMER10)
  discountType: String,             // "percent" | "fixed"
  discountValue: Number,            // 10 (%) or 50000 (VND)
  maxDiscountAmount: Number,        // cap on discount (useful for percent)
  minOrderValue: Number,            // minimum order to apply coupon
  categories: [ObjectId],           // if empty, applicable to all categories
  excludedCategories: [ObjectId],   // categories where coupon cannot be used
  usageLimit: Number,               // total usage cap (null = unlimited)
  usedCount: Number,                // times already used [default: 0]
  usagePerCustomer: Number,         // per-customer usage limit (null = unlimited)
  startsAt: Date,
  expiresAt: Date,
  isActive: Boolean,                // [default: true]
  description: String,
  createdBy: ObjectId,              // ref: users (admin)
  createdAt: Date,
  updatedAt: Date
}
```

---

### 5. Categories Collection
Product categorization and organization.

```javascript
{
  _id: ObjectId,
  name: String,                     // "Áo thun" | "Quần" | "Phụ kiện"
  slug: String,                     // unique, URL-friendly
  description: String,              // category description
  image: String,                    // URL to category thumbnail
  icon: String,                     // optional icon (SVG/emoji)
  parentCategory: ObjectId,         // ref: categories (for subcategories)
  order: Number,                    // display order
  metaTitle: String,                // SEO meta title
  metaDescription: String,          // SEO meta description
  isActive: Boolean,                // [default: true]
  createdAt: Date,
  updatedAt: Date
}
```

---

## Entity Relationship Diagram

```
┌─────────┐
│  USERS  │
└────┬────┘
     │
     ├──────────────────────────┐
     │                          │
     ▼                          ▼
  ORDERS             (stores user purchase history)
     │
     ├──────────────────────────┐
     │                          │
     ▼                          ▼
  PRODUCTS          COUPONS
     │                          │
     │            ┌─────────────┘
     │            │
     ▼            ▼
 CATEGORIES   (applies discount to order)


Relationships:
- users (1) ──── (many) orders
- users (1) ──── (many) addresses
- products (many) ──── (1) categories
- orders (many) ──── (many) products (via items array)
- orders (many) ──── (1) coupons (optional)
```

---

## Indexes for Performance

```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ createdAt: -1 })

// Products
db.products.createIndex({ slug: 1 }, { unique: true })
db.products.createIndex({ category: 1 })
db.products.createIndex({ name: "text", description: "text" })
db.products.createIndex({ isFeatured: 1, createdAt: -1 })
db.products.createIndex({ tags: 1 })

// Orders
db.orders.createIndex({ userId: 1 })
db.orders.createIndex({ orderNumber: 1 }, { unique: true })
db.orders.createIndex({ createdAt: -1 })
db.orders.createIndex({ orderStatus: 1 })
db.orders.createIndex({ paymentStatus: 1 })

// Coupons
db.coupons.createIndex({ code: 1 }, { unique: true })
db.coupons.createIndex({ isActive: 1, expiresAt: 1 })

// Categories
db.categories.createIndex({ slug: 1 }, { unique: true })
db.categories.createIndex({ parentCategory: 1 })
```

---

## Query Examples

### Find products in a category
```javascript
db.products.find({ category: ObjectId("...") })
```

### Find active orders for a user
```javascript
db.orders.find({ userId: ObjectId("..."), orderStatus: { $ne: "cancelled" } })
```

### Apply coupon to an order
```javascript
db.orders.updateOne(
  { _id: ObjectId("...") },
  { $set: { couponCode: "SUMMER10", discountAmount: 50000 } }
)
```

### Get total revenue for a period
```javascript
db.orders.aggregate([
  { $match: { createdAt: { $gte: new Date("2026-01-01"), $lt: new Date("2026-12-31") }, paymentStatus: "paid" } },
  { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
])
```

---

## Data Validation Rules

| Field | Type | Required | Unique | Constraints |
|-------|------|----------|--------|-------------|
| users.email | String | Yes | Yes | Valid email format |
| users.password | String | Yes | No | Min 8 chars, hashed |
| products.name | String | Yes | No | Max 255 chars |
| products.price | Number | Yes | No | > 0 |
| orders.userId | ObjectId | Yes | No | Valid user reference |
| coupons.code | String | Yes | Yes | Alphanumeric, uppercase |

---

## Setup Instructions

1. **Create MongoDB Atlas Cluster**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create a new project for MAISON
   - Create a M0 (free) or higher cluster

2. **Get Connection String**
   - Copy connection string from Atlas
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`

3. **Store in Environment**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/maison-shop
   MONGODB_DB_NAME=maison-shop
   ```

4. **Initialize Collections**
   - Import Mongoose schemas
   - Run migrations if needed
   - Seed initial data (categories, etc.)
