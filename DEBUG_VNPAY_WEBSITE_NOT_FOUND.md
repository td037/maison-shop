# 🔴 Lỗi VNPay: "Không tìm thấy website"

## Lỗi hiện tại
```
Thông báo: Không tìm thấy website
Mã tra cứu: lpwXtidSoB
Thời gian giao dịch: 03/04/2026 12:52:49 SA
```

## Nguyên nhân

Lỗi này xảy ra khi:
1. **VNPAY_RETURN_URL không được đăng ký với VNPay**
2. **Merchant chưa được kích hoạt đúng**
3. **Domain không khớp với cấu hình VNPay**

## Giải pháp

### ✅ Bước 1: Kiểm tra VNPAY_RETURN_URL trên Vercel

Vào Vercel Dashboard → maison-shop1 → Settings → Environment Variables

Kiểm tra biến `VNPAY_RETURN_URL` phải là:
```
https://maison-shop1.vercel.app/api/payments/vnpay/return
```

**QUAN TRỌNG:** URL này phải được đăng ký với VNPay!

### ✅ Bước 2: Đăng ký Return URL với VNPay

Bạn cần liên hệ VNPay để đăng ký Return URL:

**Email:** hotrovnpay@vnpay.vn
**Hotline:** 1900 55 55 77

**Nội dung yêu cầu:**
```
Kính gửi VNPay,

Tôi đang sử dụng merchant test: T9TOMWLD
Tôi cần đăng ký Return URL cho website:

Return URL: https://maison-shop1.vercel.app/api/payments/vnpay/return
IPN URL: https://maison-shop1.vercel.app/api/payments/vnpay/ipn

Xin VNPay hỗ trợ kích hoạt.

Trân trọng.
```

### ✅ Bước 3: Sử dụng Merchant Demo (Giải pháp tạm thời)

Trong khi chờ VNPay kích hoạt merchant T9TOMWLD, bạn có thể dùng merchant demo:

**Cập nhật trên Vercel Environment Variables:**

```
VNPAY_TMN_CODE=DEMOV210
VNPAY_HASH_SECRET=RAOEXHYVSDDIIENYWSLDIIZTANXUXZFJ
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=https://maison-shop1.vercel.app/api/payments/vnpay/return
```

**Lưu ý:** Merchant DEMOV210 có thể không cần đăng ký Return URL trước.

### ✅ Bước 4: Test với localhost (Để debug)

Nếu muốn test trên local:

1. Cập nhật `.env.local`:
```env
VNPAY_RETURN_URL=http://localhost:3001/api/payments/vnpay/return
```

2. Chạy local:
```bash
npm run dev
```

3. Test tại: http://localhost:3001

**Lưu ý:** Localhost có thể không hoạt động với VNPay vì họ không thể callback về máy local của bạn.

## Cách kiểm tra Return URL đã đăng ký chưa

### Kiểm tra với VNPay:
1. Đăng nhập vào VNPay Merchant Portal
2. Vào phần "Cấu hình website"
3. Kiểm tra danh sách Return URL đã đăng ký

### Hoặc liên hệ VNPay:
- Email: hotrovnpay@vnpay.vn
- Hỏi: "Return URL nào đã được đăng ký cho merchant T9TOMWLD?"

## Giải pháp nhanh nhất

**Dùng merchant DEMOV210:**

1. Vào Vercel → Environment Variables
2. Sửa:
   - `VNPAY_TMN_CODE` = `DEMOV210`
   - `VNPAY_HASH_SECRET` = `RAOEXHYVSDDIIENYWSLDIIZTANXUXZFJ`
3. Redeploy
4. Test lại

Merchant DEMOV210 là merchant demo công khai, thường không cần đăng ký Return URL.

## Thẻ test cho DEMOV210

```
Ngân hàng: NCB
Số thẻ: 9704198526191432198
Tên: NGUYEN VAN A
Ngày phát hành: 07/15
Mật khẩu OTP: 123456
```

## Tóm tắt

Lỗi "Không tìm thấy website" = Return URL chưa được đăng ký với VNPay.

**Giải pháp:**
1. Đăng ký Return URL với VNPay (cho merchant T9TOMWLD)
2. Hoặc dùng merchant DEMOV210 (không cần đăng ký)
