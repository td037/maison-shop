# 🧪 Test VNPay ngay bây giờ!

## ✅ Code đã được push và Vercel đang deploy

---

## 🚀 Các bước test (5 phút):

### Bước 1: Đợi Vercel deploy xong (1-2 phút)
Vào: https://vercel.com/dashboard
- Click project **maison-shop-deploy**
- Tab **Deployments**
- Đợi deployment mới nhất có status **Ready** (màu xanh)

### Bước 2: Thêm Environment Variables (2 phút)
**QUAN TRỌNG:** Nếu chưa thêm, phải thêm ngay!

Settings → Environment Variables → Add New:

```
Name: VNPAY_TMN_CODE
Value: T9TOMWLD

Name: VNPAY_HASH_SECRET
Value: 9TQWKBH6TV2YQRXD9FZM0YZFY36GCW1F

Name: VNPAY_URL
Value: https://sandbox.vnpayment.vn/paymentv2/vpcpay.html

Name: VNPAY_RETURN_URL
Value: https://maison-shop-deploy.vercel.app/api/payments/vnpay/return
```

Sau đó: Deployments → Redeploy

### Bước 3: Test (2 phút)
1. Truy cập: https://maison-shop-deploy.vercel.app
2. Đăng nhập (hoặc đăng ký)
3. Thêm sản phẩm vào giỏ
4. Click **Checkout**
5. Điền thông tin giao hàng
6. **Chọn VNPay** (phải có option này!)
7. Click **Đặt hàng ngay**
8. Thanh toán với thẻ test:
   ```
   Số thẻ: 9704198526191432198
   Ngân hàng: NCB
   OTP: 123456
   ```

---

## ❓ Câu hỏi nhanh:

### Q1: Bạn đã thêm Environment Variables vào Vercel chưa?
- [ ] Chưa → **Phải thêm ngay!** (xem Bước 2)
- [ ] Rồi → Đã Redeploy chưa?

### Q2: Deployment status là gì?
- [ ] Building (màu vàng) → Đợi thêm
- [ ] Ready (màu xanh) → OK, test được
- [ ] Error (màu đỏ) → Xem logs

### Q3: Trên trang Checkout có thấy option VNPay không?
- [ ] Có → Perfect! Tiếp tục test thanh toán
- [ ] Không → Hard refresh (Ctrl+Shift+R) hoặc Incognito

---

## 🎯 Kết quả mong đợi:

### Trên trang Checkout phải thấy:
```
Phương thức thanh toán

○ 🏠 Thanh toán khi nhận hàng (COD)
○ 💳 VNPay (ATM / Visa / Mastercard)  ← CÁI NÀY!
```

### Khi click "Đặt hàng ngay":
1. Redirect sang trang VNPay sandbox
2. Nhập thẻ test
3. Redirect về `/payment/success`
4. Order status = "paid"

---

## 🐛 Troubleshooting nhanh:

### Không thấy VNPay option:
1. Hard refresh: `Ctrl + Shift + R`
2. Mở Incognito window
3. Check deployment đã Ready chưa
4. Check đã thêm env vars chưa

### Lỗi khi thanh toán:
1. Vào Vercel → Logs
2. Tìm lỗi màu đỏ
3. Check env vars đúng chưa

### Redirect về failed:
1. Check `VNPAY_HASH_SECRET` đúng chưa
2. Check `VNPAY_RETURN_URL` đúng domain chưa

---

## 📞 Cho tôi biết:

1. Deployment status: Building / Ready / Error?
2. Đã thêm env vars chưa?
3. Có thấy VNPay option không?
4. Lỗi gì nếu có?

---

**Bắt đầu test ngay! 🚀**
