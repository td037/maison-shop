# 🏦 Hướng dẫn đăng ký tài khoản VNPay Test

## 📝 Đăng ký tài khoản test

### Bước 1: Truy cập trang đăng ký
```
https://sandbox.vnpayment.vn/devreg/
```

### Bước 2: Điền thông tin đăng ký
- Email: email@example.com
- Tên doanh nghiệp: Tên shop của bạn
- Số điện thoại: 0901234567
- Website: https://yourshop.com (hoặc ngrok URL)

### Bước 3: Xác nhận email
- Kiểm tra email để lấy thông tin đăng nhập
- VNPay sẽ gửi:
  - TMN Code (Mã merchant)
  - Hash Secret (Khóa bí mật)
  - Tài liệu API

### Bước 4: Cập nhật .env.local
```env
# VNPay Payment (Test Account)
VNPAY_TMN_CODE=<your_tmn_code_here>
VNPAY_HASH_SECRET=<your_hash_secret_here>
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=https://your-ngrok-url.ngrok-free.dev/api/payments/vnpay/return
VNPAY_IPN_URL=https://your-ngrok-url.ngrok-free.dev/api/payments/vnpay/ipn
```

---

## 🎯 Thông tin test sau khi đăng ký

### Thẻ ATM Test
```
Ngân hàng: NCB
Số thẻ: 9704198526191432198
Tên chủ thẻ: NGUYEN VAN A
Ngày phát hành: 07/15
Mật khẩu OTP: 123456
```

### Thẻ Quốc tế Test
```
Số thẻ: 4111111111111111 (Visa)
Tên: TEST USER
Ngày hết hạn: 12/25
CVV: 123
```

---

## ⚡ Lợi ích của tài khoản test riêng

✅ Có dashboard riêng để xem giao dịch  
✅ Có thể test webhook/IPN  
✅ Giống môi trường production hơn  
✅ Có thể test nhiều tính năng nâng cao  
✅ Không bị giới hạn số lượng giao dịch  

---

## 📞 Liên hệ hỗ trợ

- Hotline: 1900 55 55 77
- Email: support@vnpay.vn
- Website: https://vnpay.vn

---

## 🔄 Sau khi có tài khoản test

1. Cập nhật TMN_CODE và HASH_SECRET trong .env.local
2. Restart server: `npm run dev`
3. Test lại flow thanh toán
4. Kiểm tra dashboard VNPay để xem giao dịch

**Lưu ý:** Giữ bí mật HASH_SECRET, không commit vào git!
