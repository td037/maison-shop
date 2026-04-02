# 🔄 VNPay Environments - Môi trường VNPay

## 📋 Các môi trường có sẵn

### 1. Demo (Mặc định)
```
TMN_CODE: DEMOSHOP
HASH_SECRET: DEMOSECRETKEY
URL: https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
```
- Dùng để demo nhanh
- Không cần đăng ký
- Giới hạn tính năng

### 2. Test (Public)
```
TMN_CODE: 2QXUI4B4
HASH_SECRET: RAOEXHYVSDDIIENYWSLDIIZTANXUXZFJ
URL: https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
```
- Credentials test công khai
- Đầy đủ tính năng hơn
- Có thể test webhook

### 3. Production
```
TMN_CODE: <your_code>
HASH_SECRET: <your_secret>
URL: https://vnpayment.vn/paymentv2/vpcpay.html
```
- Cần đăng ký tài khoản thật
- Giao dịch thật
- Có phí giao dịch

---

## 🚀 Cách chuyển đổi môi trường

### Cách 1: Dùng script (Khuyên dùng)

```bash
# Chuyển sang demo
node switch-vnpay-env.js demo

# Chuyển sang test
node switch-vnpay-env.js test

# Chuyển sang production
node switch-vnpay-env.js production
```

### Cách 2: Sửa thủ công .env.local

Mở file `.env.local` và uncomment môi trường bạn muốn dùng:

```env
# Demo (current)
VNPAY_TMN_CODE=DEMOSHOP
VNPAY_HASH_SECRET=DEMOSECRETKEY

# Test (uncomment to use)
# VNPAY_TMN_CODE=2QXUI4B4
# VNPAY_HASH_SECRET=RAOEXHYVSDDIIENYWSLDIIZTANXUXZFJ
```

---

## 🧪 Thẻ test cho tất cả môi trường

### Thẻ ATM
```
Ngân hàng: NCB
Số thẻ: 9704198526191432198
Tên: NGUYEN VAN A
Ngày phát hành: 07/15
OTP: 123456
```

### Thẻ Visa/Mastercard
```
Số thẻ: 4111111111111111
Tên: TEST USER
Hết hạn: 12/25
CVV: 123
```

---

## 📊 So sánh môi trường

| Tính năng | Demo | Test | Production |
|-----------|------|------|------------|
| Đăng ký | ❌ Không cần | ⚠️ Tùy chọn | ✅ Bắt buộc |
| Dashboard | ❌ | ✅ | ✅ |
| Webhook/IPN | ⚠️ Giới hạn | ✅ | ✅ |
| Giao dịch thật | ❌ | ❌ | ✅ |
| Phí | Miễn phí | Miễn phí | 1.5-3% |
| Giới hạn | Có | Ít | Không |

---

## 🎯 Khuyến nghị

### Đang phát triển
→ Dùng **Demo** hoặc **Test**

### Chuẩn bị launch
→ Dùng **Test** để test kỹ

### Đã launch
→ Dùng **Production**

---

## ⚠️ Lưu ý quan trọng

1. **Không commit credentials vào git**
   - Thêm `.env.local` vào `.gitignore`
   - Dùng `.env.local.example` để chia sẻ template

2. **Restart server sau khi đổi môi trường**
   ```bash
   npm run dev
   ```

3. **Cập nhật RETURN_URL và IPN_URL**
   - Phải dùng ngrok URL khi test local
   - Phải dùng domain thật khi production

4. **Test kỹ trước khi lên production**
   - Test thanh toán thành công
   - Test thanh toán thất bại
   - Test webhook/callback
   - Test các trường hợp edge case

---

## 🔗 Tài liệu tham khảo

- [VNPay Sandbox](https://sandbox.vnpayment.vn/)
- [VNPay Documentation](https://sandbox.vnpayment.vn/apis/)
- [Đăng ký tài khoản test](https://sandbox.vnpayment.vn/devreg/)

---

## 💡 Tips

- Dùng **Demo** cho demo nhanh với khách hàng
- Dùng **Test** cho development và staging
- Dùng **Production** chỉ khi đã test kỹ
- Backup credentials production ở nơi an toàn
- Rotate secret key định kỳ (6 tháng/lần)
