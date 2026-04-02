# Maison Shop - E-commerce Fashion

Ứng dụng web bán hàng thời trang hiện đại được xây dựng với Next.js, React, TypeScript và Tailwind CSS.

## 🚀 Hướng dẫn chạy dự án

### Yêu cầu
- Node.js 16+ và npm/yarn
- Git

### Các bước cài đặt

1. **Clone repository**
   ```bash
   git clone https://github.com/nhochuy519/cdptpp.git
   cd maison-shop
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install
   ```

3. **Chạy development server**
   ```bash
   npm run dev
   ```
   Ứng dụng sẽ khởi động tại `http://localhost:3000` (hoặc cổng khác nếu 3000 đang được sử dụng)

4. **Build cho production**
   ```bash
   npm run build
   npm run start
   ```

## 📁 Cấu trúc dự án

```
maison-shop/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # Layout gốc
│   │   ├── page.tsx      # Trang chủ
│   │   ├── shop/         # Trang cửa hàng
│   │   ├── product/      # Chi tiết sản phẩm
│   │   ├── cart/         # Giỏ hàng
│   │   ├── checkout/     # Thanh toán
│   │   ├── search/       # Tìm kiếm
│   │   └── account/      # Tài khoản
│   ├── components/       # React components
│   │   ├── layout/       # Navbar, Footer
│   │   └── ui/           # UI components
│   └── lib/             # Utility functions & data
├── public/              # Static files
├── tailwind.config.ts   # Tailwind CSS config
├── tsconfig.json        # TypeScript config
├── next.config.js       # Next.js config
└── package.json         # Dependencies
```

## 🚫 Các file KHÔNG được push lên Git

Những file sau đây được liệt kê trong `.gitignore` và sẽ **không được commit**:

### 📦 Dependencies & Build Files
- `node_modules/` - Node.js packages
- `/.next/` - Next.js build output
- `/out/` - Static export output
- `build/` - Build folder

### 🔐 Environment Variables
- `.env` - Environment variables (chứa secrets)
- `.env.local`
- `.env.development.local`
- `.env.test.local`
- `.env.production.local`

### 📝 Logs & Debug
- `*.log` - Các file log
- `npm-debug.log*`
- `yarn-debug.log*`
- `yarn-error.log*`
- `.nyc_output/` - Coverage reports

### 🖥️ IDE & OS Files
- `.vscode/` - VS Code settings (nếu không muốn share)
- `.idea/` - JetBrains IDE settings
- `*.swp`, `*.swo` - Vim swap files
- `.DS_Store` - macOS files
- `Thumbs.db` - Windows thumbnail files

### 🔒 Certificates
- `*.pem` - SSL certificates

## 📚 Scripts NPM

```bash
# Development
npm run dev          # Chạy dev server

# Production
npm run build        # Build cho production
npm run start        # Chạy production server

# Linting
npm run lint         # Chạy ESLint
```

## 🛠️ Công nghệ sử dụng

- **Next.js 14.2** - React framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **PostCSS** - CSS processing

## 📝 Ghi chú

- Khi clone lần đầu, chạy `npm install` để tải dependencies
- Nếu có lỗi TypeScript, reload VS Code hoặc restart Language Server
- Các file trong `.gitignore` sẽ không bao giờ được commit

## 👨‍💻 Hỗ trợ

Nếu gặp vấn đề:
1. Xóa `node_modules` và `.next`, chạy `npm install` lại
2. Kiểm tra phiên bản Node.js: `node --version`
3. Xóa cache npm: `npm cache clean --force`

---

**Happy coding! 🎉**
