# ⚡ Vercel Deploy - Checklist nhanh

## 🎯 Các bước chính

### 1️⃣ Chuẩn bị (5 phút)
```bash
cd cdptpp-master
git init
git add .
git commit -m "Initial commit"
```

### 2️⃣ GitHub (2 phút)
- Tạo repo: https://github.com/new
- Tên: `maison-shop`
```bash
git remote add origin https://github.com/YOUR_USERNAME/maison-shop.git
git push -u origin main
```

### 3️⃣ Vercel Deploy (3 phút)
- Vào: https://vercel.com/new
- Import repository `maison-shop`
- Thêm env vars (không có URL callback)
- Click **Deploy**

### 4️⃣ Lấy domain (1 phút)
- Copy domain: `https://maison-shop-xyz.vercel.app`

### 5️⃣ Update env vars (2 phút)
- Settings → Environment Variables
- Thêm các URL callback với domain vừa lấy
- Redeploy

### 6️⃣ MongoDB whitelist (1 phút)
- MongoDB Atlas → Network Access
- Add IP: `0.0.0.0/0`

### 7️⃣ Test (2 phút)
- Truy cập domain
- Test thanh toán VNPay
- Thẻ test: `9704198526191432198`

---

## 📝 Environment Variables cần thêm

### Lần 1 (khi deploy):
```
MONGODB_URI
MONGODB_DB_NAME
JWT_SECRET
MOMO_PARTNER_CODE
MOMO_ACCESS_KEY
MOMO_SECRET_KEY
VNPAY_TMN_CODE
VNPAY_HASH_SECRET
VNPAY_URL
```

### Lần 2 (sau khi có domain):
```
VNPAY_RETURN_URL=https://YOUR_DOMAIN/api/payments/vnpay/return
VNPAY_IPN_URL=https://YOUR_DOMAIN/api/payments/vnpay/ipn
MOMO_REDIRECT_URL=https://YOUR_DOMAIN/payment/success
MOMO_IPN_URL=https://YOUR_DOMAIN/webhooks/momo
NEXT_PUBLIC_API_URL=https://YOUR_DOMAIN
```

---

## ⏱️ Tổng thời gian: ~15 phút

✅ Done! Website của bạn đã live với domain cố định!

---

📖 Xem hướng dẫn chi tiết: [DEPLOY_STEP_BY_STEP.md](./DEPLOY_STEP_BY_STEP.md)
