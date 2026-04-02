# 🚀 VNPay Test - Bắt đầu từ đây!

## ✅ Bạn đã deploy: https://maison-shop-deploy.vercel.app/

---

## ⚡ Quick Start (3 bước - 5 phút)

### Bước 1: Thêm Environment Variables vào Vercel

Vào: https://vercel.com/dashboard → Project → Settings → Environment Variables

Thêm 4 biến sau:

```
VNPAY_TMN_CODE=2QXUI4B4
VNPAY_HASH_SECRET=RAOEXHYVSDDIIENYWSLDIIZTANXUXZFJ
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=https://maison-shop-deploy.vercel.app/api/payments/vnpay/return
```

### Bước 2: Redeploy

Deployments → Click deployment mới nhất → **⋯** → **Redeploy**

### Bước 3: Test

1. Truy cập: https://maison-shop-deploy.vercel.app
2. Thêm sản phẩm → Checkout → Chọn **VNPay**
3. Thanh toán với thẻ test:
   ```
   Số thẻ: 9704198526191432198
   Ngân hàng: NCB
   OTP: 123456
   ```

---

## 📚 Tài liệu chi tiết

1. **[VNPAY_VERCEL_SETUP.md](./VNPAY_VERCEL_SETUP.md)** ← Đọc file này trước!
   - Hướng dẫn setup từng bước
   - Troubleshooting
   - Debug logs

2. **[VNPAY_TEST_CREDENTIALS.md](./VNPAY_TEST_CREDENTIALS.md)**
   - Thông tin Merchant test
   - Thẻ test
   - So sánh môi trường

3. **[VNPAY_IMPLEMENTATION_SUMMARY.md](./VNPAY_IMPLEMENTATION_SUMMARY.md)**
   - Tổng quan implementation
   - Payment flow
   - Test cases

---

## 🔑 Merchant Test Info

### Môi trường Test (Khuyên dùng):
```
TMN_CODE: 2QXUI4B4
HASH_SECRET: RAOEXHYVSDDIIENYWSLDIIZTANXUXZFJ
```

### Hoặc Demo (Đơn giản hơn):
```
TMN_CODE: DEMOSHOP
HASH_SECRET: DEMOSECRETKEY
```

---

## 🧪 Thẻ test

```
Số thẻ: 9704198526191432198
Ngân hàng: NCB
Tên: NGUYEN VAN A
Ngày phát hành: 07/15
OTP: 123456
```

---

## ❓ Cần đăng ký Merchant không?

### Không cần! 🎉

Bạn có thể dùng ngay credentials test công khai:
- `2QXUI4B4` (Test - Khuyên dùng)
- `DEMOSHOP` (Demo - Đơn giản)

### Khi nào cần đăng ký?

Chỉ khi bạn muốn:
- Dashboard riêng để xem giao dịch
- Merchant code riêng
- Lên production (giao dịch thật)

Đăng ký tại: https://sandbox.vnpayment.vn/devreg/

---

## 🐛 Gặp lỗi?

1. Check logs: Vercel Dashboard → Logs
2. Đọc: [VNPAY_VERCEL_SETUP.md](./VNPAY_VERCEL_SETUP.md) → Troubleshooting
3. Kiểm tra đã Redeploy sau khi thêm env vars chưa

---

## ✅ Checklist

- [ ] Thêm 4 env vars vào Vercel
- [ ] Redeploy project
- [ ] Test thanh toán thành công
- [ ] Test hủy thanh toán

---

**Done! Bắt đầu test ngay! 🎉**
