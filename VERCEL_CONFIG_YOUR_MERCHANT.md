# 🔧 Cấu hình VNPay Merchant của bạn trên Vercel

## ✅ Thông tin Merchant Test của bạn

```
Terminal ID / Mã Website: T9TOMWLD
Secret Key: 9TQWKBH6TV2YQRXD9FZM0YZFY36GCW1F
URL: https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
```

Dashboard: https://sandbox.vnpayment.vn/merchantv2/
Tên đăng nhập: 1721030874@dntu.edu.vn

---

## 🚀 Bước 1: Thêm Environment Variables vào Vercel

### 1.1. Truy cập Vercel Settings
1. Vào: https://vercel.com/dashboard
2. Click vào project: **maison-shop-deploy**
3. Click tab **Settings**
4. Click **Environment Variables** ở sidebar bên trái

### 1.2. Thêm các biến môi trường

Click **Add New** và thêm từng biến sau:

#### Biến 1:
```
Name: VNPAY_TMN_CODE
Value: T9TOMWLD
```

#### Biến 2:
```
Name: VNPAY_HASH_SECRET
Value: 9TQWKBH6TV2YQRXD9FZM0YZFY36GCW1F
```

#### Biến 3:
```
Name: VNPAY_URL
Value: https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
```

#### Biến 4:
```
Name: VNPAY_RETURN_URL
Value: https://maison-shop-deploy.vercel.app/api/payments/vnpay/return
```

**Lưu ý:** Nếu domain Vercel của bạn khác, thay `maison-shop-deploy.vercel.app` bằng domain thực tế!

---

## 🔄 Bước 2: Redeploy

Sau khi thêm xong 4 biến:

1. Click tab **Deployments**
2. Click vào deployment mới nhất (dòng đầu tiên)
3. Click nút **⋯** (3 chấm) ở góc phải
4. Click **Redeploy**
5. Confirm bằng cách click **Redeploy** lần nữa

Đợi 1-2 phút để Vercel build và deploy lại.

---

## 🧪 Bước 3: Test thanh toán

### 3.1. Truy cập website
```
https://maison-shop-deploy.vercel.app
```

### 3.2. Thực hiện thanh toán
1. **Đăng nhập** (hoặc đăng ký tài khoản mới)
2. **Thêm sản phẩm** vào giỏ hàng
3. Click **Checkout**
4. Điền đầy đủ thông tin giao hàng
5. Chọn **VNPay (ATM / Visa / Mastercard)**
6. Click **Đặt hàng ngay 🎉**

### 3.3. Thanh toán với thẻ test

Bạn sẽ được redirect sang trang VNPay sandbox. Dùng thẻ test:

```
Ngân hàng: NCB (Ngân hàng Quốc Dân)
Số thẻ: 9704198526191432198
Tên chủ thẻ: NGUYEN VAN A
Ngày phát hành: 07/15
Mật khẩu OTP: 123456
```

### 3.4. Kiểm tra kết quả
- ✅ Sau khi thanh toán thành công → Redirect về `/payment/success`
- ✅ Order status được cập nhật thành "paid"
- ✅ Xem giao dịch trong VNPay dashboard: https://sandbox.vnpayment.vn/merchantv2/

---

## 📊 Xem giao dịch trong VNPay Dashboard

### Đăng nhập:
1. Truy cập: https://sandbox.vnpayment.vn/merchantv2/
2. Tên đăng nhập: `1721030874@dntu.edu.vn`
3. Mật khẩu: (mật khẩu bạn đã đặt khi đăng ký)

### Xem giao dịch:
- Menu → **Quản lý giao dịch**
- Xem tất cả giao dịch test
- Kiểm tra trạng thái, số tiền, mã đơn hàng

---

## 🔍 Debug (nếu có lỗi)

### Xem logs trong Vercel:
1. Vào Vercel dashboard
2. Click vào project **maison-shop-deploy**
3. Click tab **Logs**
4. Xem real-time logs khi test thanh toán

### Logs quan trọng:
```
✅ VNPay payment URL created - Payment URL tạo thành công
📥 VNPay return params - Nhận callback từ VNPay
🔍 Transaction info - Thông tin giao dịch
✅ Verification - Xác thực chữ ký
✅ Order updated to paid - Cập nhật order thành công
```

### Lỗi thường gặp:

#### 1. "VNPay configuration is incomplete"
→ Kiểm tra đã thêm đủ 4 biến môi trường chưa
→ Phải **Redeploy** sau khi thêm env vars

#### 2. "Chữ ký không hợp lệ"
→ Kiểm tra `VNPAY_HASH_SECRET` có đúng không
→ Copy chính xác: `9TQWKBH6TV2YQRXD9FZM0YZFY36GCW1F`
→ Không có khoảng trắng thừa

#### 3. Redirect về failed ngay
→ Kiểm tra `VNPAY_RETURN_URL` đúng domain chưa
→ Phải dùng HTTPS (Vercel tự động có)

#### 4. Order không được cập nhật
→ Kiểm tra MongoDB connection
→ Xem logs trong Vercel để biết lỗi cụ thể

---

## 📝 Checklist hoàn thành

- [ ] Thêm `VNPAY_TMN_CODE=T9TOMWLD`
- [ ] Thêm `VNPAY_HASH_SECRET=9TQWKBH6TV2YQRXD9FZM0YZFY36GCW1F`
- [ ] Thêm `VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html`
- [ ] Thêm `VNPAY_RETURN_URL=https://maison-shop-deploy.vercel.app/api/payments/vnpay/return`
- [ ] Redeploy project
- [ ] Test thanh toán với thẻ `9704198526191432198`
- [ ] Kiểm tra redirect về success page
- [ ] Kiểm tra order status = "paid"
- [ ] Xem giao dịch trong VNPay dashboard

---

## 🎯 Thông tin quan trọng

### Merchant của bạn:
- **TMN_CODE:** T9TOMWLD
- **Dashboard:** https://sandbox.vnpayment.vn/merchantv2/
- **Login:** 1721030874@dntu.edu.vn

### Domain Vercel:
- **Website:** https://maison-shop-deploy.vercel.app
- **Return URL:** https://maison-shop-deploy.vercel.app/api/payments/vnpay/return

### Thẻ test:
- **Số thẻ:** 9704198526191432198
- **Ngân hàng:** NCB
- **OTP:** 123456

---

**Chúc bạn test thành công! 🎉**

Sau khi test xong, bạn có thể xem tất cả giao dịch trong VNPay dashboard!
