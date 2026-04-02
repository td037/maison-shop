# ⚡ Checklist nhanh - VNPay đã hoạt động chưa?

## ✅ Code đã được push lên GitHub!

Vercel đang tự động deploy... Đợi 1-2 phút.

---

## 🔍 Kiểm tra từng bước:

### ☑️ Bước 1: Code đã push lên GitHub
✅ **HOÀN THÀNH** - Code đã được push lên GitHub

### ☑️ Bước 2: Vercel đang deploy
1. Vào: https://vercel.com/dashboard
2. Click vào project **maison-shop-deploy**
3. Click tab **Deployments**
4. Xem deployment mới nhất (dòng đầu tiên)
5. Đợi status = **Ready** (màu xanh)

### ☑️ Bước 3: Thêm Environment Variables
**QUAN TRỌNG:** Phải thêm 4 biến này vào Vercel!

1. Vào: https://vercel.com/dashboard
2. Click project **maison-shop-deploy**
3. Click tab **Settings**
4. Click **Environment Variables**
5. Thêm 4 biến sau:

```
VNPAY_TMN_CODE = T9TOMWLD
VNPAY_HASH_SECRET = 9TQWKBH6TV2YQRXD9FZM0YZFY36GCW1F
VNPAY_URL = https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL = https://maison-shop-deploy.vercel.app/api/payments/vnpay/return
```

### ☑️ Bước 4: Redeploy (sau khi thêm env vars)
1. Click tab **Deployments**
2. Click deployment mới nhất
3. Click **⋯** (3 chấm)
4. Click **Redeploy**

### ☑️ Bước 5: Test
1. Truy cập: https://maison-shop-deploy.vercel.app
2. Đăng nhập
3. Thêm sản phẩm vào giỏ
4. Click **Checkout**
5. **Kiểm tra:** Có thấy option **"VNPay (ATM / Visa / Mastercard)"** không?

---

## 🐛 Nếu KHÔNG thấy VNPay option:

### Nguyên nhân 1: Deployment chưa xong
→ Đợi thêm 1-2 phút
→ Refresh trang

### Nguyên nhân 2: Cache browser
→ Hard refresh: `Ctrl + Shift + R` (Windows) hoặc `Cmd + Shift + R` (Mac)
→ Hoặc mở Incognito/Private window

### Nguyên nhân 3: Deployment failed
→ Vào Vercel → Deployments → Xem logs
→ Tìm lỗi màu đỏ

---

## 📸 Screenshot để kiểm tra

Khi vào trang Checkout, bạn phải thấy:

```
Phương thức thanh toán
┌─────────────────────────────────────┐
│ 🏠 Thanh toán khi nhận hàng (COD)  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ 💳 VNPay (ATM / Visa / Mastercard) │ ← PHẢI CÓ CÁI NÀY!
└─────────────────────────────────────┘
```

---

## 🔗 Links quan trọng

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Website:** https://maison-shop-deploy.vercel.app
- **Checkout page:** https://maison-shop-deploy.vercel.app/checkout

---

## 📞 Nếu vẫn không thấy:

1. Check Vercel deployment status
2. Check browser console (F12) có lỗi không
3. Thử hard refresh hoặc incognito
4. Cho tôi biết bạn thấy gì trên trang checkout

---

**Deployment đang chạy! Đợi 1-2 phút rồi test nhé! 🚀**
