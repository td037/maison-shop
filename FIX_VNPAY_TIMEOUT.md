# 🔧 Sửa lỗi VNPay Timeout

## Lỗi hiện tại
"Giao dịch đã quá thời gian chờ thanh toán. Quý khách vui lòng thực hiện lại giao dịch."

## Nguyên nhân

### 1. Link thanh toán đã hết hạn (15 phút)
- Mỗi link VNPay chỉ có hiệu lực 15 phút
- Không thể dùng lại link cũ

### 2. Timezone không khớp
- Server Vercel có thể dùng UTC
- VNPay yêu cầu timezone Việt Nam (GMT+7)

## Giải pháp

### ✅ Cách 1: Tạo giao dịch mới (Khuyến nghị)

1. Quay lại trang checkout: https://maison-shop1.vercel.app/checkout
2. Chọn sản phẩm và thanh toán lại
3. Nhấn "Thanh toán VNPay" để tạo link mới
4. Thanh toán ngay trong vòng 15 phút

### ✅ Cách 2: Fix timezone (Nếu lỗi lặp lại)

Nếu mỗi lần thanh toán đều bị timeout ngay lập tức, có thể do timezone.

**Test thử:**
1. Tạo giao dịch mới
2. Thanh toán NGAY (trong 1 phút)
3. Nếu vẫn lỗi → Cần fix timezone

## Test VNPay

### Thẻ test VNPay:
```
Ngân hàng: NCB
Số thẻ: 9704198526191432198
Tên chủ thẻ: NGUYEN VAN A
Ngày phát hành: 07/15
Mật khẩu OTP: 123456
```

### Quy trình test:
1. Vào https://maison-shop1.vercel.app
2. Thêm sản phẩm vào giỏ
3. Checkout → Chọn VNPay
4. Nhập thông tin giao hàng
5. Nhấn "Thanh toán VNPay"
6. Chọn ngân hàng NCB
7. Nhập thông tin thẻ test
8. Xác nhận thanh toán

## Lưu ý quan trọng

⚠️ **KHÔNG dùng lại link cũ!**
- Mỗi link VNPay chỉ dùng được 1 lần
- Link hết hạn sau 15 phút
- Luôn tạo giao dịch mới để test

⏰ **Thời gian hiệu lực:**
- Link được tạo lúc: `vnp_CreateDate`
- Link hết hạn lúc: `vnp_ExpireDate` (+ 15 phút)
- Phải thanh toán trong khoảng thời gian này

## Kiểm tra logs

Nếu vẫn gặp vấn đề, check Vercel logs:
1. Vào Vercel Dashboard
2. Project maison-shop1 → Deployments
3. Click vào deployment mới nhất
4. Xem Runtime Logs
5. Tìm log "VNPay payment URL created"
6. Kiểm tra thời gian tạo giao dịch

## Debug timezone (Nếu cần)

Nếu nghi ngờ vấn đề timezone, thêm log vào `src/lib/vnpay.ts`:

```typescript
createPaymentUrl(params: VNPayPaymentParams): string {
  const date = new Date()
  console.log('🕐 Server time:', date.toISOString())
  console.log('🕐 Vietnam time:', date.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }))
  
  const createDate = this.formatDate(date)
  const expireDate = this.formatDate(new Date(date.getTime() + 15 * 60 * 1000))
  
  console.log('📅 CreateDate:', createDate)
  console.log('📅 ExpireDate:', expireDate)
  // ... rest of code
}
```

Sau đó check logs trên Vercel để xem thời gian có đúng không.
