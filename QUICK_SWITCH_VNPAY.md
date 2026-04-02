# ⚡ Quick Switch VNPay Environment

## 🎯 Chuyển đổi nhanh môi trường VNPay

### Cách 1: Dùng npm scripts (Dễ nhất)

```bash
# Chuyển sang Demo
npm run vnpay:demo

# Chuyển sang Test
npm run vnpay:test

# Chuyển sang Production
npm run vnpay:prod
```

### Cách 2: Dùng node script

```bash
node switch-vnpay-env.js demo
node switch-vnpay-env.js test
node switch-vnpay-env.js production
```

### Cách 3: Sửa thủ công .env.local

Mở `.env.local` và thay đổi:

```env
# Demo
VNPAY_TMN_CODE=DEMOSHOP
VNPAY_HASH_SECRET=DEMOSECRETKEY

# Test
VNPAY_TMN_CODE=2QXUI4B4
VNPAY_HASH_SECRET=RAOEXHYVSDDIIENYWSLDIIZTANXUXZFJ
```

---

## 📝 Sau khi chuyển đổi

1. **Restart server**
   ```bash
   npm run dev
   ```

2. **Kiểm tra log**
   - Server sẽ hiển thị môi trường đang dùng
   - Check terminal khi thanh toán

3. **Test thanh toán**
   - Thêm sản phẩm vào giỏ
   - Checkout với VNPay
   - Dùng thẻ test để thanh toán

---

## 🧪 Thẻ test

```
Số thẻ: 9704198526191432198
Ngân hàng: NCB
OTP: 123456
```

---

## 📚 Tài liệu chi tiết

- [VNPAY_ENVIRONMENTS.md](./VNPAY_ENVIRONMENTS.md) - So sánh các môi trường
- [VNPAY_REGISTER_TEST.md](./VNPAY_REGISTER_TEST.md) - Đăng ký tài khoản test
- [VNPAY_TEST_GUIDE.md](./VNPAY_TEST_GUIDE.md) - Hướng dẫn test chi tiết

---

## ✅ Checklist

- [ ] Chọn môi trường phù hợp
- [ ] Chạy script chuyển đổi
- [ ] Restart server
- [ ] Test thanh toán
- [ ] Kiểm tra callback

**Done! 🚀**
