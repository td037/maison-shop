# Database Setup Quick Start Guide

## 📚 Files Created

```
src/
├── models/
│   ├── User.ts           # User schema with password hashing
│   ├── Product.ts        # Product schema with variants
│   ├── Order.ts          # Order schema with timeline
│   ├── Coupon.ts         # Coupon/discount schema
│   └── Category.ts       # Category schema
├── lib/db/
│   ├── connect.ts        # MongoDB connection setup
│   └── seed.ts           # Database seeding script
└── app/api/
    ├── auth/route.ts     # Register & Login endpoints
    ├── products/route.ts # Product listing & creation
    └── orders/route.ts   # Order management

DATABASE_SCHEMA.md      # Complete schema documentation
.env.local.example      # Environment variables template
```

---

## 🚀 Quick Start (5 Steps)

### Step 1: Install Dependencies

```bash
npm install mongoose bcryptjs

# Or with yarn
yarn add mongoose bcryptjs
```

If using TypeScript, install types:

```bash
npm install --save-dev @types/node
```

### Step 2: Create .env.local File

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your MongoDB credentials:

```env
MONGODB_URI=mongodb+srv://maison_user:your_password@your_cluster.mongodb.net/maison-shop?retryWrites=true&w=majority
MONGODB_DB_NAME=maison-shop
JWT_SECRET=your_super_secret_key_here
```

### Step 3: Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a new cluster (M0 free tier is fine)
3. Create a database user
4. Whitelist your IP address
5. Get connection string and paste into `.env.local`

See `.env.local.example` for detailed instructions.

### Step 4: Seed Database (Optional)

Add npm script to `package.json`:

```json
{
  "scripts": {
    "seed": "ts-node src/lib/db/seed.ts"
  }
}
```

Then run:

```bash
npm run seed
```

This will create:

- 4 sample product categories
- 3 sample products

### Step 5: Start Your Server

```bash
npm run dev
```

Visit:

- http://localhost:3000/api/products (GET all products)
- http://localhost:3000/api/auth (POST to register/login)

---

## 📡 API Endpoints

### Authentication

```bash
# Register User
POST /api/auth
Content-Type: application/json

{
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "password": "securePassword123",
  "phone": "09xxxxxxxx"
}

# Response
{
  "message": "User registered successfully",
  "user": {
    "_id": "...",
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "role": "customer"
  }
}
```

### Products

```bash
# Get All Products
GET /api/products?page=1&limit=12&featured=true

# Get Products by Category
GET /api/products?category=top-wear

# Search Products
GET /api/products?search=shirt

# Response
{
  "products": [
    {
      "_id": "...",
      "name": "Nordic Oak Lounge Chair",
      "price": 450,
      "salePrice": null,
      "category": { "name": "Áo", "slug": "áo" },
      "stock": 42,
      "isFeatured": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 3,
    "totalPages": 1
  }
}
```

### Orders

```bash
# Create Order
POST /api/orders
Content-Type: application/json

{
  "userId": "user_id_here",
  "items": [
    {
      "productId": "product_id",
      "size": "M",
      "color": "Black",
      "quantity": 2,
      "salePrice": 100
    }
  ],
  "shippingAddress": {
    "name": "Nguyễn Văn A",
    "phone": "09xxxxxxxx",
    "street": "123 Đường A",
    "district": "Quận 1",
    "city": "Hồ Chí Minh",
    "province": "TP.HCM"
  },
  "paymentMethod": "COD",
  "couponCode": "SUMMER10"
}

# Get User Orders
GET /api/orders?userId=user_id_here
```

---

## 🔍 MongoDB Queries

### Find Products

```javascript
// All active products
db.products.find({ isActive: true });

// Featured products
db.products.find({ isFeatured: true });

// Products by category
db.products.find({ category: ObjectId("...") });

// Low stock products
db.products.find({ totalStock: { $lt: 10 } });

// Search by name
db.products.find({ $text: { $search: "shirt" } });
```

### Find Orders

```javascript
// User's orders
db.orders.find({ userId: ObjectId("...") });

// Orders by status
db.orders.find({ orderStatus: "pending" });

// Recent orders (last 7 days)
db.orders.find({
  createdAt: {
    $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
});

// Total revenue
db.orders.aggregate([
  { $match: { paymentStatus: "paid" } },
  { $group: { _id: null, total: { $sum: "$totalAmount" } } },
]);
```

---

## 📋 Data Validation

All models include validation:

| Field             | Rules                                |
| ----------------- | ------------------------------------ |
| User.email        | Unique, valid email format           |
| User.password     | Min 8 chars, auto-hashed with bcrypt |
| Product.name      | Required, max 255 chars              |
| Product.price     | Required, must be > 0                |
| Order.totalAmount | Auto-calculated                      |
| Coupon.code       | Unique, uppercase, alphanumeric      |

---

## 🔐 Security Features

✅ Passwords hashed with bcryptjs  
✅ Email/Phone validation  
✅ Coupon usage limits enforced  
✅ Stock inventory management  
✅ Order total auto-calculated (prevent tampering)  
✅ Unique indexes for email, slug, code

---

## 🐛 Troubleshooting

### "MongoServerError: authentication failed"

- Check MONGODB_URI in .env.local
- Verify username & password
- Check IP whitelist in MongoDB Atlas

### "TypeError: Cannot read property 'genSalt' of undefined"

- Make sure bcryptjs is installed: `npm install bcryptjs`
- Restart dev server after installation

### "Duplicate key error"

- Email/slug/code already exists
- Clear database and reseed: `db.dropDatabase()`

### Products not showing

- Check categories exist in database
- Verify `isActive: true` on products
- Check category reference is correct

---

## 📚 Next Steps

1. **Implement JWT authentication** - Add token generation to login
2. **Add image uploads** - Use Cloudinary or similar
3. **Payment integration** - Add Stripe/Zalopay support
4. **Email notifications** - Set up order confirmation emails
5. **Admin dashboard** - Build management interface
6. **Analytics** - Track orders, revenue, user behavior

---

## 📖 Documentation Files

- **DATABASE_SCHEMA.md** - Complete schema specifications
- **.env.local.example** - Environment variables setup
- **MongoDB Atlas Guide** - In .env.local.example
- **API Documentation** - In each api/\*/route.ts file
