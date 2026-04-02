# 🏦 VNPay Merchant Information

## Merchant hiện tại của bạn

Bạn đang dùng merchant test riêng:
```
VNPAY_TMN_CODE=T9TOMWLD
VNPAY_HASH_SECRET=9TQWKBH6TV2YQRXD9FZM0YZFY36GCW1F
```

## Thẻ test cho merchant T9TOMWLD

Với merchant này, bạn cần dùng thẻ test tương ứng. Thông tin thẻ test phụ thuộc vào cấu hình merchant của VNPay.

### Thẻ test phổ biến (NCB):
```
Ngân hàng: NCB
Số thẻ: 9704198526191432198
Tên: NGUYEN VAN A
Ngày phát hành: 07/15
Mật khẩu OTP: 123456
```

## Merchant demo của VNPay (Nếu muốn đổi)

Nếu muốn dùng merchant demo công khai của VNPay:

```env
VNPAY_TMN_CODE=DEMOV210
VNPAY_HASH_SECRET=RAOEXHYVSDDIIENYWSLDIIZTANXUXZFJ
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=https://maison-shop1.vercel.app/api/payments/vnpay/return
```

## Cách test thanh toán

### 1. Trên trang VNPay hiện tại:
- Click "Thẻ nội địa và tài khoản ngân hàng"
- Chọn ngân hàng NCB
- Nhập thông tin thẻ test
- Nhập OTP: 123456
- Xác nhận

### 2. Kết quả mong đợi:
- Thanh toán thành công
- Redirect về: `/payment/success`
- Đơn hàng được cập nhật trạng thái "paid"

## Troubleshooting

### Nếu gặp lỗi "Thẻ không hợp lệ":
- Kiểm tra lại số thẻ
- Thử ngân hàng khác (VCB, TCB, MB...)
- Liên hệ VNPay để lấy thẻ test cho merchant T9TOMWLD

### Nếu gặp lỗi "Chữ ký không hợp lệ":
- Kiểm tra VNPAY_HASH_SECRET trên Vercel
- Đảm bảo khớp với thông tin VNPay cung cấp

### Nếu thanh toán thành công nhưng không redirect:
- Kiểm tra VNPAY_RETURN_URL
- Phải là: `https://maison-shop1.vercel.app/api/payments/vnpay/return`
- Check logs trên Vercel

## Liên hệ VNPay

Nếu cần hỗ trợ về merchant T9TOMWLD:
- Email: hotrovnpay@vnpay.vn
- Hotline: 1900 55 55 77
- Yêu cầu: Thông tin thẻ test cho merchant T9TOMWLD
