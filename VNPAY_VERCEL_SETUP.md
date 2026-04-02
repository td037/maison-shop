# 🚀 Cấu hình VNPay cho Vercel

## ✅ Bạn đã deploy: https://maison-shop-deploy.vercel.app/

Bây giờ cần cấu hình VNPay để thanh toán hoạt động!

---

## 📋 Bước 1: Thêm Environment Variables vào Vercel

### 1.1. Vào Vercel Dashboard
1. Truy cập: https://vercel.com/dashboard
2. Click vào project **maison-shop-deploy**
3. Click tab **Settings**
4. Click **Environment Variables** ở sidebar

### 1.2. Thêm các biến môi trường VNPay

Thêm từng biến sau (click **Add** sau mỗi biến):

#### Môi trường Test (Khuyên dùng):
```
VNPAY_TMN_CODE=2QXUI4B4
VNPAY_HASH_SECRET=RAOEXHYVSDDIIENYWSLDIIZTANXUXZFJ
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=https://maison-shop-deploy.vercel.app/api/payments/vnpay/return
```

#### Hoặc môi trường Demo (Đơn giản hơn):
```
VNPAY_TMN_CODE=DEMOSHOP
VNPAY_HASH_SECRET=DEMOSECRETKEY
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=https://maison-shop-deploy.vercel.app/api/payments/vnpay/return
```

**Lưu ý:** Thay `maison-shop-deploy.vercel.app` bằng domain thực tế của bạn nếu khác!

---

## 🔄 Bước 2: Redeploy

Sau khi thêm environment variables:

1. Click tab **Deployments**
2. Click vào deployment mới nhất
3. Click nút **⋯** (3 chấm)
4. Click **Redeploy**
5. Confirm **Redeploy**

Đợi 1-2 phút để Vercel redeploy.

---

## 🧪 Bước 3: Test thanh toán VNPay

### 3.1. Truy cập website
```
https://maison-shop-deploy.vercel.app
```

### 3.2. Thực hiện thanh toán
1. Đăng nhập (hoặc đăng ký tài khoản mới)
2. Thêm sản phẩm vào giỏ hàng
3. Click **Checkout**
4. Điền thông tin giao hàng
5. Chọn **VNPay (ATM / Visa / Mastercard)**
6. Click **Đặt hàng ngay**

### 3.3. Thanh toán với thẻ test

Bạn sẽ được redirect sang trang VNPay sandbox. Dùng thông tin sau:

#### Thẻ ATM test:
```
Ngân hàng: NCB
Số thẻ: 9704198526191432198
Tên chủ thẻ: NGUYEN VAN A
Ngày phát hành: 07/15
Mật khẩu OTP: 123456
```

#### Thẻ Visa/Mastercard test:
```
Số thẻ: 4111111111111111
Tên: TEST USER
Hết hạn: 12/25
CVV: 123
```

### 3.4. Kiểm tra kết quả
- ✅ Sau khi thanh toán thành công, bạn sẽ được redirect về `/payment/success`
- ✅ Order status sẽ được cập nhật thành "paid"
- ❌ Nếu hủy thanh toán, sẽ redirect về `/payment/failed`

---

## 📊 So sánh môi trường VNPay

### Demo (DEMOSHOP)
- ✅ Không cần đăng ký
- ✅ Dùng ngay lập tức
- ⚠️ Giới hạn tính năng
- ⚠️ Không có dashboard

### Test (2QXUI4B4)
- ✅ Credentials công khai
- ✅ Đầy đủ tính năng
- ✅ Có dashboard (nếu đăng ký)
- ✅ Test webhook/IPN

### Production (Cần đăng ký)
- 💼 Cần đăng ký tài khoản doanh nghiệp
- 💼 Giao dịch thật
- 💰 Có phí giao dịch (1.5-3%)

**Khuyến nghị:** Dùng **Test (2QXUI4B4)** cho development và staging

---

## 🔍 Debug (nếu có lỗi)

### Xem logs trong Vercel
1. Vào Vercel dashboard
2. Click vào project
3. Click tab **Logs**
4. Xem real-time logs khi test thanh toán

### Lỗi thường gặp:

#### 1. "VNPay configuration is incomplete"
→ Kiểm tra đã thêm đủ 4 biến môi trường chưa
→ Phải **Redeploy** sau khi thêm env vars

#### 2. "Chữ ký không hợp lệ"
→ Kiểm tra `VNPAY_HASH_SECRET` đúng chưa
→ Không có khoảng trắng thừa trong env vars

#### 3. Redirect về failed ngay
→ Kiểm tra `VNPAY_RETURN_URL` đúng domain chưa
→ Phải dùng HTTPS (Vercel tự động có)

#### 4. Order không được cập nhật
→ Kiểm tra MongoDB connection
→ Xem logs trong Vercel

---

## 🎯 Đăng ký tài khoản VNPay Test (Tùy chọn)

Nếu muốn có dashboard để xem giao dịch:

1. Truy cập: https://sandbox.vnpayment.vn/devreg/
2. Đăng ký tài khoản developer
3. Lấy TMN_CODE và HASH_SECRET riêng
4. Cập nhật vào Vercel Environment Variables
5. Redeploy

---

## 📞 Thông tin hỗ trợ

### VNPay Sandbox
- URL: https://sandbox.vnpayment.vn/
- Docs: https://sandbox.vnpayment.vn/apis/

### Vercel
- Dashboard: https://vercel.com/dashboard
- Docs: https://vercel.com/docs

---

## ✅ Checklist hoàn thành

- [ ] Thêm 4 environment variables vào Vercel
- [ ] Redeploy project
- [ ] Truy cập website
- [ ] Thêm sản phẩm vào giỏ
- [ ] Checkout với VNPay
- [ ] Thanh toán với thẻ test
- [ ] Kiểm tra redirect về success page
- [ ] Kiểm tra order status = "paid"

---

**Chúc bạn cấu hình thành công! 🎉**

Nếu gặp vấn đề, check logs trong Vercel hoặc hỏi tôi nhé!
