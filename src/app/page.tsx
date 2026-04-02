
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { reviews, formatPrice } from '@/lib/data';

// Fetch categories từ API MongoDB
async function getCategories() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const url = `${baseUrl}/api/categories?limit=6&random=true`;
    
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  } catch {
    return [];
  }
}

// Fetch top discount products từ API MongoDB
async function getTopDiscountProducts() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const url = `${baseUrl}/api/products?topDiscount=4`;
    
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  } catch {
    return [];
  }
}

// Fetch 8 newest products từ API MongoDB
async function getNewestProducts() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const url = `${baseUrl}/api/products?limit=8&sort=newest`;
    
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    
    if (data.products && Array.isArray(data.products)) {
      return data.products;
    }
    return [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const randomCategories = await getCategories();
  const topDiscountProducts = await getTopDiscountProducts();
  const newestProducts = await getNewestProducts();

  return (
    <>
      <Navbar />
      <main className="bg-surface">

        {/* ── HERO ── */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80"
              alt="Hero"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e]/80 via-[#1a1a2e]/40 to-transparent" />
          </div>

          <div className="container mx-auto px-8 relative z-10">
            <div className="max-w-xl">
              <p className="section-label text-white/70 mb-4 animate-fade-up">Bộ sưu tập mới · SS 2026</p>
              <h1
                className="font-display font-black text-white leading-none mb-6 animate-fade-up stagger-1"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '-0.02em' }}
              >
                Phong cách<br />
                <span style={{ background: 'linear-gradient(135deg, #cf4519, #ab2e00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  không giới hạn
                </span>
              </h1>
              <p className="text-white/70 text-lg leading-relaxed mb-8 animate-fade-up stagger-2">
                Khám phá những thiết kế tinh tế, chất liệu cao cấp – được chắt lọc riêng cho bạn.
              </p>
              <div className="flex gap-4 animate-fade-up stagger-3">
                <Link href="/shop" className="btn-primary">
                  Khám phá ngay
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link href="/shop?filter=sale" className="inline-flex items-center gap-2 px-6 py-3 font-display font-semibold text-sm text-white border border-white/30 rounded-btn hover:bg-white/10 transition-all no-underline">
                  Xem Sale
                </Link>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="absolute bottom-8 left-0 right-0">
            <div className="container mx-auto px-8">
              <div className="flex flex-wrap gap-6 justify-end">
                {[
                  { icon: '🛡️', text: 'Hàng chính hãng' },
                  { icon: '🔄', text: 'Đổi trả 30 ngày' },
                  { icon: '🚚', text: 'Ship toàn quốc' },
                ].map((b) => (
                  <div key={b.text} className="flex items-center gap-2 text-white/80 text-sm font-body">
                    <span>{b.icon}</span>
                    <span>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CATEGORIES ── */}
        <section className="section-gap bg-surface-low">
          <div className="container mx-auto px-8">
            <div className="text-center mb-12">
              <p className="section-label mb-3">Danh mục</p>
              <h2 className="font-display font-bold text-[#1a1a2e]" style={{ fontSize: 'var(--headline-md)', letterSpacing: '-0.02em' }}>
                Khám phá theo phong cách
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {randomCategories.map((cat: any, i: number) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className="group relative overflow-hidden rounded-btn no-underline"
                  style={{ aspectRatio: i < 2 ? '2/3' : '1/1' }}
                >
                  <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/80 via-transparent to-transparent group-hover:from-primary/70 transition-all duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="font-display font-bold text-white text-sm">{cat.name}</p>
                    <p className="text-white/60 text-xs font-body">{cat.count ?? 0} sản phẩm</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        {/* ...existing code... */}

        {/* ── FLASH SALE ── */}
        <section className="section-gap">
          <div className="container mx-auto px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="section-label mb-2">Ưu đãi có hạn</p>
                <h2 className="font-display font-bold text-[#1a1a2e] text-3xl tracking-tight">
                  Flash Sale 🔥
                </h2>
              </div>
              {/* Countdown */}
              <div className="flex items-center gap-2">
                <p className="text-on-surface-muted text-sm font-body mr-2">Kết thúc sau:</p>
                {['02', '14', '39'].map((t, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="bg-[#1a1a2e] text-white font-display font-bold text-lg w-12 h-12 flex items-center justify-center rounded-btn">
                      {t}
                    </div>
                    {i < 2 && <span className="font-display font-bold text-primary text-xl">:</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {topDiscountProducts.map((p: any) => (
                <Link key={p._id} href={`/product/${p.slug}`} className="group no-underline">
                  <div className="relative mb-4 overflow-hidden rounded-btn" style={{ aspectRatio: '1' }}>
                    <Image
                      src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'}
                      alt={p.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {p.discountPercent > 0 && (
                      <div className="absolute top-3 right-3 bg-primary text-white font-display font-bold text-xs px-2.5 py-1 rounded-btn">
                        -{p.discountPercent}%
                      </div>
                    )}
                  </div>
                  <p className="font-body text-sm text-on-surface-muted mb-2 group-hover:text-primary transition-colors">
                    {p.category?.name || 'Sản phẩm'}
                  </p>
                  <p className="font-display font-bold text-[#1a1a2e] mb-2 line-clamp-2 group-hover:text-primary transition-colors text-sm">
                    {p.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-primary">
                      {p.salePrice?.toLocaleString('vi-VN')}₫
                    </span>
                    <span className="font-body text-sm text-on-surface-muted line-through">
                      {p.price?.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── BRAND STORY BANNER ── */}
        <section className="bg-surface-mid">
          <div className="grid md:grid-cols-2 min-h-[500px]">
            <div className="relative min-h-[300px]">
              <Image
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=900&q=80"
                alt="Brand Story"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-center px-12 py-16 bg-[#1a1a2e]">
              <div className="max-w-md">
                <p className="section-label text-primary-container mb-4">Câu chuyện thương hiệu</p>
                <h2
                  className="font-display font-black text-white mb-6 leading-tight"
                  style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', letterSpacing: '-0.02em' }}
                >
                  Thời trang là ngôn ngữ riêng của bạn
                </h2>
                <p className="text-white/60 text-base leading-relaxed mb-8 font-body">
                  Mỗi sản phẩm tại MAISON. được chọn lọc kỹ càng, đảm bảo chất lượng cao cấp và phong cách bền vững. Chúng tôi tin rằng thời trang tốt không cần phải đắt tiền – chỉ cần đúng chỗ.
                </p>
                <Link href="#" className="btn-primary">
                  Tìm hiểu thêm
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── NEW ARRIVALS ── */}
        <section className="section-gap">
          <div className="container mx-auto px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="section-label mb-2">Hàng mới về</p>
                <h2 className="font-display font-bold text-[#1a1a2e] text-3xl tracking-tight">
                  Bộ sưu tập mới nhất
                </h2>
              </div>
              <Link href="/shop" className="btn-ghost text-sm">
                Xem tất cả →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {newestProducts.map((p: any) => {
                const discountPercent = p.salePrice && p.price 
                  ? Math.round(((p.price - p.salePrice) / p.price) * 100)
                  : 0;
                return (
                <Link key={p._id} href={`/product/${p.slug}`} className="group no-underline">
                  <div className="relative mb-4 overflow-hidden rounded-btn" style={{ aspectRatio: '1' }}>
                    <Image
                      src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'}
                      alt={p.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {discountPercent > 0 && (
                      <div className="absolute top-3 right-3 bg-primary text-white font-display font-bold text-xs px-2.5 py-1 rounded-btn">
                        -{discountPercent}%
                      </div>
                    )}
                  </div>
                  <p className="font-body text-sm text-on-surface-muted mb-2 group-hover:text-primary transition-colors">
                    {p.category?.name || 'Sản phẩm'}
                  </p>
                  <p className="font-display font-bold text-[#1a1a2e] mb-2 line-clamp-2 group-hover:text-primary transition-colors text-sm">
                    {p.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-primary">
                      {p.salePrice ? p.salePrice.toLocaleString('vi-VN') : p.price.toLocaleString('vi-VN')}₫
                    </span>
                    {p.salePrice && (
                      <span className="font-body text-sm text-on-surface-muted line-through">
                        {p.price.toLocaleString('vi-VN')}₫
                      </span>
                    )}
                  </div>
                </Link>
              );
              })}
            </div>
          </div>
        </section>

        {/* ── PROMO BANNER ── */}
        <section className="container mx-auto px-8 pb-12">
          <div
            className="rounded-btn p-10 md:p-14 text-center text-white relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #ab2e00, #cf4519)' }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />
            <p className="section-label text-white/70 mb-3 relative">Ưu đãi đặc biệt</p>
            <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight mb-4 relative" style={{ letterSpacing: '-0.02em' }}>
              Miễn phí vận chuyển
            </h2>
            <p className="text-white/80 text-lg mb-8 relative font-body">
              Cho tất cả đơn hàng từ <strong>500.000₫</strong> trên toàn quốc
            </p>
            <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary font-display font-bold text-sm rounded-btn hover:bg-surface-low transition-colors no-underline relative">
              Mua sắm ngay
            </Link>
          </div>
        </section>

        {/* ── REVIEWS ── */}
        <section className="section-gap bg-surface-low">
          <div className="container mx-auto px-8">
            <div className="text-center mb-12">
              <p className="section-label mb-3">Đánh giá</p>
              <h2 className="font-display font-bold text-[#1a1a2e] text-3xl tracking-tight mb-2">
                Khách hàng nói gì?
              </h2>
              <div className="flex items-center justify-center gap-2 mt-3">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} width="20" height="20" viewBox="0 0 24 24" fill="#ab2e00" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
                <span className="font-display font-bold text-[#1a1a2e] ml-2">4.8/5</span>
                <span className="text-on-surface-muted text-sm font-body">(1.200+ đánh giá)</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {reviews.map((r) => (
                <div key={r.id} className="bg-surface-lowest p-7 rounded-btn shadow-card">
                  <div className="flex gap-0.5 mb-4">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} width="14" height="14" viewBox="0 0 24 24"
                        fill={s <= r.rating ? '#ab2e00' : '#efeded'} stroke="none">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-on-surface text-sm leading-relaxed mb-5 font-body">"{r.text}"</p>
                  <div className="flex items-center gap-3">
                    <Image src={r.avatar} alt={r.name} width={40} height={40} className="rounded-full object-cover" />
                    <div>
                      <p className="font-display font-semibold text-sm text-[#1a1a2e]">{r.name}</p>
                      <p className="text-on-surface-muted text-xs font-body">{r.product}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
