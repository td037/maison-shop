# 🔄 Cập nhật sang Project maison-shop1

## Bước 1: Lấy thông tin Project ID

1. Truy cập: https://vercel.com/dashboard
2. Tìm project **maison-shop1**
3. Click vào project
4. Vào **Settings** → **General**
5. Copy **Project ID** (dạng: `prj_xxxxxxxxxxxxx`)

## Bước 2: Lấy URL mới

Trong Vercel dashboard của project **maison-shop1**, tìm URL deployment:
- Có thể là: `https://maison-shop1.vercel.app`
- Hoặc: `https://maison-shop1-[team-name].vercel.app`

## Bước 3: Cập nhật file cấu hình

### 3.1. Cập nhật `.vercel/project.json`

Mở file `.vercel/project.json` và thay đổi:

```json
{
  "projectId": "PROJECT_ID_CỦA_BẠN",
  "orgId": "team_cxAO7UCZoezFMxxhgzDFnfrC",
  "projectName": "maison-shop1"
}
```

### 3.2. Cập nhật `.env.local`

Thay đổi các URL trong file `.env.local`:

```env
# VNPay Payment
VNPAY_RETURN_URL=https://maison-shop1.vercel.app/api/payments/vnpay/return

# MoMo Payment
MOMO_REDIRECT_URL=https://maison-shop1.vercel.app/payment/success
MOMO_IPN_URL=https://maison-shop1.vercel.app/webhooks/momo

# API URL
NEXT_PUBLIC_API_URL=https://maison-shop1.vercel.app
```

**Lưu ý:** Thay `maison-shop1.vercel.app` bằng URL thực tế của bạn!

## Bước 4: Cập nhật Environment Variables trên Vercel

1. Vào Vercel Dashboard → Project **maison-shop1**
2. Settings → Environment Variables
3. Cập nhật các biến sau với URL mới:

```
VNPAY_RETURN_URL=https://maison-shop1.vercel.app/api/payments/vnpay/return
MOMO_REDIRECT_URL=https://maison-shop1.vercel.app/payment/success
MOMO_IPN_URL=https://maison-shop1.vercel.app/webhooks/momo
NEXT_PUBLIC_API_URL=https://maison-shop1.vercel.app
```

## Bước 5: Push code và Redeploy

```bash
cd cdptpp-master
git add .
git commit -m "Update to maison-shop1 project"
git push origin main
```

Vercel sẽ tự động deploy lại.

## Bước 6: Test

Truy cập: `https://maison-shop1.vercel.app`

---

## ❓ Cần giúp đỡ?

Nếu bạn cần tôi cập nhật tự động, hãy cung cấp:
1. **Project ID** của maison-shop1
2. **URL** chính xác của deployment mới
