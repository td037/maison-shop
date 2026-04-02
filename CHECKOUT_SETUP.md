# 🎯 Setup Hướng Dẫn Momo Payment Integration

## 📋 Các bước đã implement:

### 1. **Database Models** ✅
- **Cart Model** (`src/models/Cart.ts`) - Lưu giỏ hàng
- **Order Model** (có sẵn) - Lưu đơn hàng
- Cấu trúc chi tiết với items, totals, tracking

### 2. **API Endpoints** ✅

#### Cart Management
```
POST   /api/cart               - Thêm sản phẩm vào giỏ
GET    /api/cart              - Lấy giỏ hàng
PATCH  /api/cart              - Cập nhật số lượng
DELETE /api/cart              - Xóa sản phẩm
```

#### Orders
```
POST   /api/orders            - Tạo đơn hàng từ giỏ
GET    /api/orders            - Lấy danh sách đơn hàng
```

#### Momo Payment
```
POST   /api/payments/momo     - Tạo yêu cầu thanh toán
PUT    /api/payments/momo     - Callback từ Momo
```

---

## 🔧 Environment Setup

**Thêm vào `.env.local`:**
```env
# Momo Payment
MOMO_PARTNER_CODE=MOMOMSQ20220101
MOMO_ACCESS_KEY=F8BF47B21026DF7C
MOMO_SECRET_KEY=K951B6PE1wsDPo13hMEhKHUFsM3fYBZH
MOMO_REDIRECT_URL=http://localhost:3000/payment/success
MOMO_IPN_URL=http://localhost:3001/webhooks/momo
```

**Note:** Đây là test credentials. Lấy real credentials từ [Momo Developer](https://developers.momo.vn/)

---

## 🛒 Frontend Integration

### 1. **Add to Cart**
```typescript
// Example: Add product to cart
const addToCart = async (productId, quantity, size, color) => {
  const response = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: sessionStorage.getItem('sessionId'), // or userId
      productId,
      quantity,
      size,
      color,
    })
  })
  const data = await response.json()
  // Update cart state
}
```

### 2. **Checkout Flow**
```
Step 1: Review Cart (/cart page)
   ↓
Step 2: Shipping Address (collect thông tin)
   ↓
Step 3: Delivery Method (standard/express)
   ↓
Step 4: Payment Method (select Momo/COD/etc)
   ↓
Step 5: Create Order (/api/orders)
   ↓
Step 6: Payment (if Momo)
   - Call /api/payments/momo
   - Redirect to Momo payment page
   - Momo callback to /api/payments/momo (PUT)
   - Redirect to /payment/success
```

### 3. **Payment Handler**
```typescript
const handleMomoPayment = async (orderNumber, amount) => {
  const response = await fetch('/api/payments/momo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderNumber,
      amount,
    })
  })
  const data = await response.json()
  
  if (data.success) {
    window.location.href = data.data.payUrl // Redirect to Momo
  }
}
```

---

## 📝 Frontend Pages Cần Update

### 1. `/app/cart/page.tsx`
- Fetch cart từ `/api/cart`
- Display items, total
- Button "Proceeds to Checkout"

### 2. `/app/checkout/page.tsx`
- Form collect shipping address
- Select delivery method
- Select payment method
- Submit order

### 3. `/app/payment/success/page.tsx` (CREATE NEW)
- Show order confirmed
- Order details
- Download receipt

### 4. `/app/payment/failed/page.tsx` (CREATE NEW)
- Show error message
- Allow retry

---

## 🔐 Security Notes

1. **Never expose secret key** - Keep in backend only
2. **Verify signatures** - Always verify Momo callbacks
3. **Validate amounts** - Check order total before payment
4. **Store transaction IDs** - For tracking & disputes

---

## 📱 Test Flow

1. Add product to cart via "Thêm vào giỏ hàng"
2. Go to /cart
3. Click "Thanh toán"
4. Fill shipping address
5. Select "Ví MoMo"
6. Click "Hoàn tất thanh toán"
7. Will redirect to Momo test page
8. Test payment

---

## 📊 Database Structure

**Cart:**
```
{
  _id: ObjectId,
  userId: ObjectId,
  sessionId: String,
  items: [
    {
      productId: ObjectId,
      name: String,
      price: Number,
      quantity: Number,
      size: String,
      color: String,
      subtotal: Number
    }
  ],
  total: Number,
  itemCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**Order:**
```
{
  _id: ObjectId,
  orderNumber: String,
  userId: ObjectId,
  items: Array,
  shippingAddress: {
    name: String,
    phone: String,
    email: String,
    street: String,
    city: String,
    ...
  },
  paymentMethod: String (cod/momo/zalopay/etc),
  paymentStatus: String (unpaid/paid/failed),
  status: String (pending/processing/shipped/delivered),
  total: Number,
  paymentDetails: {
    transactionId: String,
    paidAt: Date,
    paymentGateway: String
  },
  createdAt: Date
}
```

---

## ⚡ Next Steps

1. ✅ Create Cart page (`/app/cart/page.tsx`)
2. ✅ Update checkout page to use APIs
3. ✅ Create payment success/failed pages
4. Add product "Add to Cart" button functionality
5. Add cart icon to navbar with count
6. Setup webhook handler for production

---

## 🐛 Troubleshooting

**Momo payment not working:**
- Check MOMO credentials in .env.local
- Verify endpoint (test vs production)
- Check signature generation
- Test with correct amount (in VND)

**Cart not syncing:**
- Check sessionId consistency
- Verify database connection
- Check API response format

---

**Status:** Ready to implement 🚀
