# 🚀 Hướng dẫn Deploy lên Vercel - Từng bước chi tiết

## 📋 Chuẩn bị trước khi deploy

### Bước 1: Tạo tài khoản Vercel (nếu chưa có)
1. Truy cập: https://vercel.com/signup
2. Click **Continue with GitHub**
3. Đăng nhập GitHub và cho phép Vercel truy cập

---

## 🔧 Bước 2: Push code lên GitHub

### Nếu chưa có Git repository:

```bash
# Di chuyển vào thư mục project
cd cdptpp-master

# Khởi tạo git (nếu chưa có)
git init

# Thêm tất cả files
git add .

# Commit
git commit -m "Initial commit for Vercel deployment"
```

### Tạo repository trên GitHub:
1. Vào: https://github.com/new
2. Tên repository: `maison-shop` (hoặc tên bạn thích)
3. Chọn **Private** hoặc **Public**
4. Không tick vào "Add README" (vì đã có code)
5. Click **Create repository**

### Link với GitHub và push:
```bash
# Thay YOUR_USERNAME bằng username GitHub của bạn
git remote add origin https://github.com/YOUR_USERNAME/maison-shop.git

# Push code
git branch -M main
git push -u origin main
```

---

## 🌐 Bước 3: Deploy lên Vercel

### 3.1. Import project
1. Vào: https://vercel.com/new
2. Click **Import Git Repository**
3. Tìm và chọn repository `maison-shop`
4. Click **Import**

### 3.2. Cấu hình project
- **Framework Preset:** Next.js (tự động detect)
- **Root Directory:** `./` (giữ nguyên)
- **Build Command:** `npm run build` (mặc định)
- **Output Directory:** `.next` (mặc định)

### 3.3. Thêm Environment Variables

Click **Environment Variables** và thêm từng biến sau:

```env
MONGODB_URI=mongodb+srv://maison_admin:Admin123456@cluster0.1rgooxl.mongodb.net/maison-shop?retryWrites=true&w=majority

MONGODB_DB_NAME=maison-shop

JWT_SECRET=your_super_secret_key_change_this_in_production

MOMO_PARTNER_CODE=MOMOMSQ20220101

MOMO_ACCESS_KEY=F8BF47B21026DF7C

MOMO_SECRET_KEY=K951B6PE1wsDPo13hMEhKHUFsM3fYBZH

VNPAY_TMN_CODE=DEMOSHOP

VNPAY_HASH_SECRET=DEMOSECRETKEY

VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
```

**Lưu ý:** Chưa điền các URL callback - sẽ điền sau khi có domain Vercel

### 3.4. Deploy
1. Click **Deploy**
2. Đợi 2-3 phút để Vercel build và deploy
3. Xem progress trong màn hình

---

## 🎯 Bước 4: Lấy domain Vercel

Sau khi deploy thành công, bạn sẽ thấy:
```
✅ Deployment ready!
🌐 https://maison-shop-xyz123.vercel.app
```

**Copy domain này!** Ví dụ: `https://maison-shop-abc123.vercel.app`

---

## 🔄 Bước 5: Cập nhật Environment Variables với domain

### 5.1. Vào Settings
1. Trong Vercel dashboard, click vào project `maison-shop`
2. Click tab **Settings**
3. Click **Environment Variables** ở sidebar

### 5.2. Thêm các biến còn lại

Thay `YOUR_DOMAIN.vercel.app` bằng domain thực tế của bạn:

```env
VNPAY_RETURN_URL=https://YOUR_DOMAIN.vercel.app/api/payments/vnpay/return

VNPAY_IPN_URL=https://YOUR_DOMAIN.vercel.app/api/payments/vnpay/ipn

MOMO_REDIRECT_URL=https://YOUR_DOMAIN.vercel.app/payment/success

MOMO_IPN_URL=https://YOUR_DOMAIN.vercel.app/webhooks/momo

NEXT_PUBLIC_API_URL=https://YOUR_DOMAIN.vercel.app
```

### 5.3. Redeploy
1. Click tab **Deployments**
2. Click vào deployment mới nhất
3. Click nút **⋯** (3 chấm)
4. Click **Redeploy**
5. Confirm **Redeploy**

---

## ✅ Bước 6: Cấu hình MongoDB Atlas

Vercel sử dụng nhiều IP khác nhau, cần whitelist tất cả:

1. Vào MongoDB Atlas: https://cloud.mongodb.com
2. Click **Network Access** (sidebar trái)
3. Click **Add IP Address**
4. Chọn **Allow Access from Anywhere**
5. IP: `0.0.0.0/0`
6. Click **Confirm**

---

## 🧪 Bước 7: Test thanh toán VNPay

### 7.1. Truy cập website
```
https://YOUR_DOMAIN.vercel.app
```

### 7.2. Test flow thanh toán
1. Thêm sản phẩm vào giỏ hàng
2. Click **Checkout**
3. Điền thông tin giao hàng
4. Chọn **VNPay** làm phương thức thanh toán
5. Click **Thanh toán**

### 7.3. Thanh toán với thẻ test
```
Số thẻ: 9704198526191432198
Tên chủ thẻ: NGUYEN VAN A
Ngày phát hành: 07/15
OTP: 123456
```

### 7.4. Kiểm tra kết quả
- ✅ Redirect về trang success
- ✅ Order status = "paid"
- ✅ Không có lỗi trong Vercel logs

---

## 📊 Bước 8: Xem logs (nếu có lỗi)

1. Vào Vercel dashboard
2. Click vào project
3. Click tab **Logs**
4. Xem real-time logs khi test thanh toán

---

## 🔄 Auto Deploy (Bonus)

Từ giờ, mỗi khi bạn update code:

```bash
# Sửa code
# ...

# Commit và push
git add .
git commit -m "Update features"
git push
```

Vercel sẽ tự động deploy! 🎉

---

## 🎁 Custom Domain (Tùy chọn)

Nếu có domain riêng (ví dụ: `maisonshop.com`):

1. Vào **Settings** → **Domains**
2. Click **Add Domain**
3. Nhập: `maisonshop.com`
4. Cấu hình DNS theo hướng dẫn
5. Đợi 5-10 phút
6. Update lại Environment Variables với domain mới

---

## 🐛 Troubleshooting

### Build failed
```bash
# Kiểm tra build local trước
cd cdptpp-master
npm run build
```
→ Fix lỗi local trước khi deploy

### Environment variables không hoạt động
→ Phải **Redeploy** sau khi thêm/sửa env vars
→ Kiểm tra tên biến có đúng không (case-sensitive)

### MongoDB connection failed
→ Kiểm tra IP whitelist: `0.0.0.0/0`
→ Kiểm tra MONGODB_URI đúng chưa

### VNPay callback không hoạt động
→ Kiểm tra VNPAY_RETURN_URL đúng domain chưa
→ Xem logs trong Vercel để debug

---

## ✅ Checklist hoàn thành

- [ ] Tạo tài khoản Vercel
- [ ] Push code lên GitHub
- [ ] Import project vào Vercel
- [ ] Thêm Environment Variables (lần 1)
- [ ] Deploy lần đầu
- [ ] Copy domain Vercel
- [ ] Thêm Environment Variables với domain (lần 2)
- [ ] Redeploy
- [ ] Cấu hình MongoDB whitelist
- [ ] Test thanh toán VNPay thành công!

---

## 📞 Domain của bạn sẽ là:

```
https://maison-shop-[random-id].vercel.app
```

Hoặc nếu đổi tên project khi import:
```
https://[your-project-name].vercel.app
```

---

**Chúc bạn deploy thành công! 🚀**

Nếu gặp vấn đề, check logs trong Vercel dashboard hoặc hỏi tôi nhé!
