# 🧪 Test API Products

## Vấn đề hiện tại
Website không hiển thị sản phẩm vì:
1. Database có 4 sản phẩm (đã kiểm tra ✅)
2. Frontend đang fetch từ API nhưng không nhận được data

## Kiểm tra API

### 1. Test API trên local
```bash
# Test products API
curl http://localhost:3001/api/products

# Test categories API
curl http://localhost:3001/api/categories

# Test top discount products
curl http://localhost:3001/api/products?topDiscount=4
```

### 2. Test API trên Vercel
```bash
# Test products API
curl https://maison-shop1.vercel.app/api/products

# Test categories API
curl https://maison-shop1.vercel.app/api/categories

# Test top discount products
curl https://maison-shop1.vercel.app/api/products?topDiscount=4
```

## Giải pháp

### Cần kiểm tra trên Vercel Dashboard:

1. **Environment Variables** phải có:
   ```
   MONGODB_URI=mongodb+srv://maison_admin:Admin123456@cluster0.1rgooxl.mongodb.net/maison-shop?retryWrites=true&w=majority
   MONGODB_DB_NAME=maison-shop
   NEXT_PUBLIC_API_URL=https://maison-shop1.vercel.app
   ```

2. **Redeploy** sau khi thêm env vars

3. **Check logs** trên Vercel để xem lỗi gì

## Debug Steps

1. Mở browser console trên https://maison-shop1.vercel.app
2. Check Network tab xem API calls
3. Xem response từ `/api/products`
4. Nếu có lỗi, check Vercel logs

## Expected Response

API `/api/products` should return:
```json
{
  "products": [
    {
      "_id": "...",
      "name": "Áo Blazer Oversize Cao Cấp",
      "price": 1890000,
      "salePrice": 1290000,
      "images": [...],
      "isActive": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 4,
    "totalPages": 1
  }
}
```
