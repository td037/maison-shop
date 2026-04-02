import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-white">
      {/* Newsletter */}
      <div className="bg-gradient-to-r from-primary to-primary-container">
        <div className="container mx-auto px-8 py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="section-label text-white/70 mb-2">Newsletter</p>
            <h3 className="font-display font-bold text-2xl tracking-tight text-white">
              Đăng ký nhận ưu đãi độc quyền
            </h3>
            <p className="text-white/70 text-sm mt-1">Giảm ngay 10% cho đơn hàng đầu tiên</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <input
              type="email"
              placeholder="Email của bạn..."
              className="flex-1 md:w-72 bg-white/10 border border-white/20 rounded-btn px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none focus:bg-white/20 transition-colors"
            />
            <button className="bg-white text-primary font-display font-bold text-sm px-6 py-3 rounded-btn hover:bg-surface-low transition-colors whitespace-nowrap">
              Đăng ký
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="font-display font-black text-2xl tracking-display text-white">
              MAISON<span className="text-primary-container">.</span>
            </span>
            <p className="text-white/50 text-sm mt-4 leading-relaxed">
              Thương hiệu thời trang cao cấp Việt Nam – Nơi phong cách gặp gỡ chất lượng.
            </p>
            <div className="flex gap-4 mt-6">
              {['facebook', 'instagram', 'tiktok'].map((s) => (
                <a key={s} href="#" className="w-9 h-9 rounded-btn bg-white/10 flex items-center justify-center hover:bg-primary-container transition-colors text-white/70 hover:text-white">
                  <span className="text-xs font-bold font-display uppercase">{s[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-sm tracking-wider uppercase text-white/40 mb-5">Cửa hàng</h4>
            <ul className="space-y-3">
              {['Hàng mới về', 'Best sellers', 'Sale up to 50%', 'Bộ sưu tập', 'Lookbook'].map((l) => (
                <li key={l}>
                  <Link href="/shop" className="text-white/60 hover:text-white text-sm transition-colors no-underline font-body">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-semibold text-sm tracking-wider uppercase text-white/40 mb-5">Hỗ trợ</h4>
            <ul className="space-y-3">
              {['Hướng dẫn mua hàng', 'Chính sách đổi trả', 'Chính sách vận chuyển', 'Bảng size', 'Liên hệ'].map((l) => (
                <li key={l}>
                  <a href="#" className="text-white/60 hover:text-white text-sm transition-colors no-underline font-body">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-sm tracking-wider uppercase text-white/40 mb-5">Liên hệ</h4>
            <ul className="space-y-3 text-sm text-white/60 font-body">
              <li>📍 123 Nguyễn Huệ, Q.1, TP.HCM</li>
              <li>📞 1800-1234 (Miễn phí)</li>
              <li>✉️ hello@maison.vn</li>
              <li>🕐 8:00 – 22:00 mỗi ngày</li>
            </ul>
            {/* Payment Icons */}
            <div className="mt-6">
              <p className="text-white/40 text-xs mb-3 uppercase tracking-wider">Thanh toán</p>
              <div className="flex flex-wrap gap-2">
                {['VISA', 'MC', 'MoMo', 'Zalo', 'COD'].map((p) => (
                  <span key={p} className="px-2 py-1 bg-white/10 rounded text-xs text-white/70 font-bold font-display">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs font-body">© 2026 MAISON. Tất cả quyền được bảo lưu.</p>
          <div className="flex gap-6">
            {['Điều khoản', 'Bảo mật', 'Cookie'].map((l) => (
              <a key={l} href="#" className="text-white/40 hover:text-white/70 text-xs no-underline transition-colors font-body">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
