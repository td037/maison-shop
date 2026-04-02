'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useAuth } from '@/app/providers'

interface ProductData {
  _id: string
  name: string
  slug: string
  price: number
  salePrice?: number
  description?: string
  images?: Array<{ url: string; alt?: string }>
  category?: { name: string; slug: string; _id?: string }
  rating?: { average: number; count: number }
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()

  const [product, setProduct] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('#1a1a2e')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [mainImage, setMainImage] = useState<string>('')
  const [addingToCart, setAddingToCart] = useState(false)
  const [cartMessage, setCartMessage] = useState<string>('')

  // Fetch product by slug
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`${baseUrl}/api/products/slug/${slug}`, { cache: 'no-store' })
        
        if (!response.ok) {
          throw new Error('Sản phẩm không tìm thấy')
        }
        
        const data = await response.json()
        
        if (data.data) {
          setProduct(data.data)
          // Set initial main image
          if (data.data.images && data.data.images.length > 0) {
            setMainImage(data.data.images[0].url)
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err)
        setError(err instanceof Error ? err.message : 'Không thể tải sản phẩm')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchProduct()
    }
  }, [slug, baseUrl])

  const handleAddToCart = async () => {
    if (authLoading) {
      return
    }

    if (!isAuthenticated || !user?.id) {
      setCartMessage('Bạn cần đăng nhập để thêm vào giỏ hàng')
      setTimeout(() => setCartMessage(''), 2000)
      router.push(`/login?redirect=/product/${slug}`)
      return
    }

    try {
      setAddingToCart(true)

      const response = await fetch(`${baseUrl}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          productId: product?._id,
          quantity,
          size: 'M',
          color: '#1a1a2e',
        }),
      })

      const data = await response.json()
      if (data.success) {
        setCartMessage('✓ Đã thêm vào giỏ hàng!')
        setQuantity(1)
        setTimeout(() => setCartMessage(''), 2000)
      } else if (response.status === 401) {
        setCartMessage('Bạn cần đăng nhập để thêm vào giỏ hàng')
        setTimeout(() => setCartMessage(''), 2000)
        router.push(`/login?redirect=/product/${slug}`)
        return
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      setCartMessage('Lỗi khi thêm vào giỏ hàng')
      setTimeout(() => setCartMessage(''), 2000)
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="bg-surface min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-on-surface-muted">Đang tải sản phẩm...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <main className="bg-surface min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-on-surface-muted mb-4">{error || 'Sản phẩm không tồn tại'}</p>
            <Link href="/shop" className="text-primary hover:text-primary font-semibold">
              Quay lại cửa hàng →
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const discount = product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0
  const images = product.images?.map(img => img.url) || [mainImage]

  const tabs = ['description', 'specs', 'reviews', 'qa']
  const tabLabels: Record<string, string> = {
    description: 'Mô tả', specs: 'Thông số', reviews: `Đánh giá (${product.rating?.count || 0})`, qa: 'Hỏi & Đáp'
  }

  return (
    <>
      <Navbar />
      <main className="bg-surface min-h-screen">
        {/* Breadcrumb */}
        <div className="container mx-auto px-8 py-5">
          <p className="text-on-surface-muted text-sm font-body">
            <Link href="/" className="hover:text-primary no-underline text-on-surface-muted">Trang chủ</Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:text-primary no-underline text-on-surface-muted">Cửa hàng</Link>
            <span className="mx-2">/</span>
            <span className="text-on-surface">{product.name}</span>
          </p>
        </div>

        {/* Product Section */}
        <section className="container mx-auto px-8 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-16">

            {/* Gallery */}
            <div className="flex gap-4">
              {/* Thumbnails */}
              <div className="flex flex-col gap-3 w-20 flex-shrink-0">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(img)}
                    className={`relative aspect-square overflow-hidden rounded-btn border-2 transition-all cursor-pointer bg-transparent p-0 ${
                      mainImage === img ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="relative flex-1 overflow-hidden rounded-btn bg-surface-low" style={{ aspectRatio: '3/4' }}>
                <Image src={mainImage} alt={product.name} fill className="object-cover transition-all duration-500" />
                {discount > 0 && (
                  <div className="absolute top-4 left-4">
                    <span className="badge-sale text-sm px-3 py-1">-{discount}%</span>
                  </div>
                )}
              </div>
            </div>

            {/* Info Panel */}
            <div className="py-2">
              <div className="flex items-center gap-3 mb-3">
                <span className="section-label">MAISON.</span>
                <span className="text-on-surface-muted text-xs font-body">SKU: {product._id.slice(-4).toUpperCase()}</span>
              </div>

              <h1 className="font-display font-black text-[#1a1a2e] mb-4 leading-tight" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em' }}>
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} width="16" height="16" viewBox="0 0 24 24"
                      fill={s <= Math.round(product.rating?.average || 0) ? '#ab2e00' : 'none'}
                      stroke="#ab2e00" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <span className="font-display font-semibold text-sm text-on-surface">{product.rating?.average || 0}</span>
                <span className="text-on-surface-muted text-sm font-body">({product.rating?.count || 0} đánh giá)</span>
                <span className="text-green-600 text-sm font-body font-medium">✓ Còn hàng</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-surface-mid">
                <span className="font-display font-black text-3xl text-[#1a1a2e]">
                  {(product.salePrice || product.price).toLocaleString('vi-VN')}₫
                </span>
                {product.salePrice && (
                  <span className="font-body text-lg text-on-surface-muted line-through">
                    {product.price.toLocaleString('vi-VN')}₫
                  </span>
                )}
              </div>

              {/* Color - Commented out */}
              {/* <div className="mb-6">
                <p className="font-display font-semibold text-sm text-[#1a1a2e] mb-3 uppercase tracking-wider">
                  Màu sắc: <span className="text-primary font-bold">{selectedColor || 'Chọn màu'}</span>
                </p>
                <div className="flex gap-3">
                  {['#1a1a2e', '#8b7355', '#c4a882', '#f5f3f3'].map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(c)}
                      className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${
                        selectedColor === c ? 'border-primary scale-110' : 'border-outline-variant/40'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div> */}

              {/* Size - Commented out */}
              {/* <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-display font-semibold text-sm text-[#1a1a2e] uppercase tracking-wider">Kích cỡ</p>
                  <button className="btn-ghost text-xs">Hướng dẫn chọn size →</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-[44px] px-3 py-2 text-sm font-display font-semibold rounded-btn border transition-all cursor-pointer ${
                        selectedSize === s
                          ? 'bg-[#1a1a2e] text-white border-[#1a1a2e]'
                          : 'bg-surface-lowest text-on-surface border-outline-variant/40 hover:border-[#1a1a2e]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div> */}

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <p className="font-display font-semibold text-sm text-[#1a1a2e] uppercase tracking-wider">Số lượng</p>
                <div className="flex items-center border border-outline-variant/40 rounded-btn overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center bg-surface-low hover:bg-surface-mid transition-colors border-none cursor-pointer font-bold text-lg"
                  >−</button>
                  <span className="w-12 h-10 flex items-center justify-center font-display font-bold text-sm bg-surface-lowest">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center bg-surface-low hover:bg-surface-mid transition-colors border-none cursor-pointer font-bold text-lg"
                  >+</button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3 mb-6">
                <button 
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="btn-primary flex-1 justify-center py-4 text-base disabled:opacity-70 disabled:cursor-not-allowed transition-opacity"
                >
                  {addingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                </button>
                <button
                  onClick={() => window.location.href = '/checkout'}
                  className="flex-1 py-4 font-display font-bold text-base border-2 border-[#1a1a2e] text-[#1a1a2e] rounded-btn hover:bg-[#1a1a2e] hover:text-white transition-all cursor-pointer bg-transparent"
                >
                  Mua ngay
                </button>
              </div>

              {/* Secondary actions */}
              <div className="flex gap-6 mb-8">
                <button className="flex items-center gap-2 text-sm text-on-surface-muted hover:text-primary transition-colors bg-transparent border-none cursor-pointer font-body">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  Yêu thích
                </button>
                <button className="flex items-center gap-2 text-sm text-on-surface-muted hover:text-primary transition-colors bg-transparent border-none cursor-pointer font-body">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                  Chia sẻ
                </button>
              </div>

              {/* Shipping Info */}
              <div className="bg-surface-low rounded-btn p-5 space-y-3">
                {[
                  { icon: '🚚', title: 'Giao hàng miễn phí', sub: 'Cho đơn từ 500.000₫' },
                  { icon: '🔄', title: 'Đổi trả 30 ngày', sub: 'Không cần lý do' },
                  { icon: '🛡️', title: 'Hàng chính hãng', sub: 'Cam kết 100%' },
                ].map(item => (
                  <div key={item.title} className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <p className="font-display font-semibold text-sm text-[#1a1a2e]">{item.title}</p>
                      <p className="text-on-surface-muted text-xs font-body">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="bg-surface-low">
          <div className="container mx-auto px-8">
            <div className="flex border-b border-surface-mid">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-display font-semibold text-sm transition-all border-none cursor-pointer bg-transparent border-b-2 -mb-px ${
                    activeTab === tab
                      ? 'text-primary border-primary'
                      : 'text-on-surface-muted border-transparent hover:text-on-surface'
                  }`}
                >
                  {tabLabels[tab]}
                </button>
              ))}
            </div>
            <div className="py-8 max-w-3xl">
              {activeTab === 'description' && (
                <div className="space-y-4 text-on-surface leading-relaxed font-body">
                  {product.description ? (
                    <p>{product.description}</p>
                  ) : (
                    <p>Sản phẩm chất lượng cao từ MAISON., thiết kế hiện đại phù hợp với xu hướng thời trang mới nhất.</p>
                  )}
                </div>
              )}
              {activeTab === 'reviews' && (
                <div className="space-y-5">
                  {[1,2,3].map(i => (
                    <div key={i} className="bg-surface-lowest p-5 rounded-btn">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 bg-surface-mid rounded-full flex items-center justify-center font-display font-bold text-sm text-[#1a1a2e]">
                          {String.fromCharCode(65 + i)}
                        </div>
                        <div>
                          <p className="font-display font-semibold text-sm text-[#1a1a2e]">Khách hàng {i}</p>
                          <p className="text-xs text-on-surface-muted font-body">Đã mua hàng · 1/03/2026</p>
                        </div>
                        <div className="ml-auto flex gap-0.5">
                          {[1,2,3,4,5].map(s => (
                            <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill="#ab2e00" stroke="none">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-on-surface leading-relaxed font-body">
                        Sản phẩm tuyệt vời, chất vải mềm mịn, form áo chuẩn như hình. Giao hàng nhanh, đóng gói cẩn thận. Rất hài lòng!
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Toast Notification */}
        {cartMessage && (
          <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-80 bg-green-600 text-white px-4 py-3 rounded-btn shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300 z-50">
            <p className="font-body text-sm font-medium">{cartMessage}</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
