# 🔑 VNPay Test Credentials - Thông tin Merchant Test

## 📋 Có 2 môi trường test bạn có thể dùng

---

## 1️⃣ Môi trường Demo (Đơn giản nhất)

### Merchant Info:
```
TMN_CODE: DEMOSHOP
HASH_SECRET: DEMOSECRETKEY
URL: https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
```

### Đặc điểm:
- ✅ Không cần đăng ký
- ✅ Dùng ngay lập tức
- ✅ Phù hợp cho demo nhanh
- ⚠️ Giới hạn tính năng
- ⚠️ Không có dashboard để xem giao dịch

### Khi nào dùng:
- Demo cho khách hàng
- Test nhanh chức năng
- Không cần xem chi tiết giao dịch

---

## 2️⃣ Môi trường Test (Khuyên dùng)

### Merchant Info:
```
TMN_CODE: 2QXUI4B4
HASH_SECRET: RAOEXHYVSDDIIENYWSLDIIZTANXUXZFJ
URL: https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
```

### Đặc điểm:
- ✅ Credentials test công khai
- ✅ Đầy đủ tính năng
- ✅ Có thể test webhook/IPN
- ✅ Có dashboard (nếu đăng ký tài khoản)
- ✅ Phù hợp cho development

### Khi nào dùng:
- Development và staging
- Cần test đầy đủ tính năng
- Cần xem logs giao dịch
- Chuẩn bị lên production

---

## 🧪 Thẻ test (dùng cho cả 2 môi trường)

### Thẻ ATM nội địa:
```
Ngân hàng: NCB (Ngân hàng Quốc Dân)
Số thẻ: 9704198526191432198
Tên chủ thẻ: NGUYEN VAN A
Ngày phát hành: 07/15
Mật khẩu OTP: 123456
```

### Thẻ Visa/Mastercard quốc tế:
```
Số thẻ: 4111111111111111
Tên: TEST USER
Hết hạn: 12/25
CVV: 123
```

### Thẻ JCB:
```
Số thẻ: 3566111111111113
Tên: TEST USER
Hết hạn: 12/25
CVV: 123
```

---

## 🔧 Cấu hình cho Vercel

### Environment Variables cần thêm:

#### Option 1: Demo (Đơn giản)
```env
VNPAY_TMN_CODE=DEMOSHOP
VNPAY_HASH_SECRET=DEMOSECRETKEY
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=https://maison-shop-deploy.vercel.app/api/payments/vnpay/return
```

#### Option 2: Test (Khuyên dùng)
```env
VNPAY_TMN_CODE=2QXUI4B4
VNPAY_HASH_SECRET=RAOEXHYVSDDIIENYWSLDIIZTANXUXZFJ
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=https://maison-shop-deploy.vercel.app/api/payments/vnpay/return
```

**Lưu ý:** Thay `maison-shop-deploy.vercel.app` bằng domain thực tế của bạn!

---

## 🎯 Đăng ký tài khoản VNPay Sandbox (Tùy chọn)

Nếu muốn có merchant riêng và dashboard:

### Bước 1: Đăng ký
1. Truy cập: https://sandbox.vnpayment.vn/devreg/
2. Điền form đăng ký:
   - Email
   - Tên công ty/cá nhân
   - Số điện thoại
   - Website (có thể dùng domain Vercel)

### Bước 2: Nhận thông tin
Sau khi đăng ký, bạn sẽ nhận được email với:
- TMN_CODE riêng của bạn
- HASH_SECRET riêng của bạn
- Link đăng nhập dashboard

### Bước 3: Cập nhật
Thay thế credentials trong Vercel Environment Variables

### Ưu điểm khi có tài khoản riêng:
- ✅ Dashboard để xem tất cả giao dịch
- ✅ Xem logs chi tiết
- ✅ Test webhook/IPN
- ✅ Quản lý giao dịch
- ✅ Giống production hơn

---

## 📊 So sánh các option

| Tính năng | Demo | Test Public | Test Riêng |
|-----------|------|-------------|------------|
| Đăng ký | ❌ Không cần | ❌ Không cần | ✅ Cần |
| Dashboard | ❌ | ⚠️ Giới hạn | ✅ Đầy đủ |
| Webhook/IPN | ⚠️ Giới hạn | ✅ | ✅ |
| Xem logs | ❌ | ⚠️ Giới hạn | ✅ |
| Thời gian setup | 1 phút | 1 phút | 10 phút |

---

## 🚀 Khuyến nghị

### Đang phát triển:
→ Dùng **Test Public (2QXUI4B4)** - Đủ tính năng, không cần đăng ký

### Chuẩn bị launch:
→ Đăng ký **Test Riêng** - Có dashboard để test kỹ

### Đã launch:
→ Đăng ký **Production** - Giao dịch thật

---

## 📞 Liên hệ VNPay

### Sandbox Support:
- Website: https://sandbox.vnpayment.vn/
- Email: support@vnpay.vn
- Hotline: 1900 55 55 77

### Production:
- Website: https://vnpay.vn/
- Email: hotro@vnpay.vn
- Hotline: 1900 55 55 77

---

## ⚠️ Lưu ý quan trọng

1. **Không commit credentials vào Git**
   - Dùng environment variables
   - Thêm `.env.local` vào `.gitignore`

2. **Test kỹ trước khi lên production**
   - Test thanh toán thành công
   - Test thanh toán thất bại
   - Test hủy giao dịch
   - Test timeout

3. **Bảo mật HASH_SECRET**
   - Không share public
   - Rotate định kỳ (6 tháng/lần)
   - Lưu ở nơi an toàn

4. **Production khác Test**
   - URL khác: `https://vnpayment.vn/paymentv2/vpcpay.html`
   - Credentials khác
   - Có phí giao dịch thật

---

**Bạn đã có đầy đủ thông tin để bắt đầu! 🎉**

Xem hướng dẫn cấu hình chi tiết: [VNPAY_VERCEL_SETUP.md](./VNPAY_VERCEL_SETUP.md)
