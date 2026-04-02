'use client'
import { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useAuth } from '@/app/providers'

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const colors = [
  { label: 'Đen', value: '#1a1a2e' },
  { label: 'Trắng', value: '#fbf9f8' },
  { label: 'Nâu', value: '#8b7355' },
  { label: 'Be', value: '#c4a882' },
  { label: 'Đỏ', value: '#ab2e00' },
]
const sortOptions = [
  { label: 'Mới nhất', value: 'newest' },
  { label: 'Giá tăng dần', value: 'priceLow' },
  { label: 'Giá giảm dần', value: 'priceHigh' },
  { label: 'Bán chạy nhất', value: 'popular' },
]
const categoryIcons: { [key: string]: string } = {
  'Áo': '👕',
  'Quần': '👖',
  'Giày': '👟',
  'Túi xách': '👜',
  'Phụ kiện': '⌚',
}

interface Product {
  _id: string
  name: string
  slug: string
  price: number
  salePrice?: number
  images: Array<{ url: string; alt: string }>
  category: { name: string }
  rating: { average: number; count: number }
}

interface Category {
  id: string
  name: string
  slug: string
}

function ShopPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 8, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [priceRange, setPriceRange] = useState([0, 5000000])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [addingToCart, setAddingToCart] = useState<Set<string>>(new Set())
  const [cartMessage, setCartMessage] = useState<string>('')

  const currentPage = parseInt(searchParams.get('page') || '1')
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/categories?active=true`, { cache: 'no-store' })
        const data = await res.json()
        console.log('Categories fetched:', data)
        if (data.data) {
          setCategories(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    fetchCategories()
  }, [baseUrl])

  const toggleColor = (color: string) => {
    setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color])
  }

  const clearFilters = () => {
    setSelectedCategory('')
    setPriceRange([0, 5000000])
    setSelectedColors([])
    setSortBy('newest')
    router.push('/shop?page=1')
  }

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        let url = `${baseUrl}/api/products?page=${currentPage}&limit=8&sort=${sortBy}`
        
        if (selectedCategory && categories.length > 0) {
          // Use the ID from the selected category
          const category = categories.find(c => c.name === selectedCategory)
          console.log('🔍 Selected:', selectedCategory)
          console.log('📂 Categories:', categories)
          console.log('✅ Found category:', category)
          if (category) {
            url += `&category=${category.id}`
            console.log('📤 Sending category ID:', category.id)
          }
        }
        
        url += `&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}`
        
        const res = await fetch(url, { cache: 'no-store' })
        const data = await res.json()
        
        if (data.products) {
          setProducts(data.products)
          setPagination(data.pagination)
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [currentPage, sortBy, selectedCategory, priceRange, baseUrl])

  const handlePageChange = (page: number) => {
    router.push(`/shop?page=${page}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    router.push('/shop?page=1')
  }

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()

    if (authLoading) {
      return
    }

    // Check if user is logged in
    if (!isAuthenticated || !user?.id) {
      setCartMessage('Bạn cần đăng nhập để thêm vào giỏ hàng')
      setTimeout(() => setCartMessage(''), 2000)
      router.push('/login?redirect=/shop')
      return
    }

    try {
      setAddingToCart(prev => new Set(prev).add(product._id))

      const response = await fetch(`${baseUrl}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          productId: product._id,
          quantity: 1,
          size: 'M',
          color: '#1a1a2e',
        }),
      })

      const data = await response.json()
      if (data.success) {
        setCartMessage('Đã thêm vào giỏ hàng!')
        setTimeout(() => setCartMessage(''), 2000)
      } else if (response.status === 401) {
        setCartMessage('Bạn cần đăng nhập để thêm vào giỏ hàng')
        setTimeout(() => setCartMessage(''), 2000)
        router.push('/login?redirect=/shop')
      } else {
        setCartMessage(data.error || 'Lỗi khi thêm vào giỏ hàng')
        setTimeout(() => setCartMessage(''), 2000)
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      setCartMessage('Lỗi khi thêm vào giỏ hàng')
      setTimeout(() => setCartMessage(''), 2000)
    } finally {
      setAddingToCart(prev => {
        const newSet = new Set(prev)
        newSet.delete(product._id)
        return newSet
      })
    }
  }

  return (
    <>
      <Navbar />
      <main className="bg-surface min-h-screen">
        {/* Page Header */}
        <div className="bg-surface-low border-b border-surface-mid">
          <div className="container mx-auto px-8 py-10">
            <p className="text-on-surface-muted text-sm font-body mb-1">
              <span className="hover:text-primary cursor-pointer">Trang chủ</span>
              <span className="mx-2">/</span>
              <span>Cửa hàng</span>
            </p>
            <h1 className="font-display font-black text-3xl text-[#1a1a2e] tracking-tight">
              Tất cả sản phẩm
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-8 py-10 flex gap-8">
          {/* Sidebar */}
          <aside className={`flex-shrink-0 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
            <div className="space-y-6">
              {/* Category */}
              <div>
                <h3 className="font-display font-semibold text-sm text-[#1a1a2e] mb-3 uppercase tracking-wider">
                  Danh mục
                </h3>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value)
                    router.push('/shop?page=1')
                  }}
                  className="input-field w-full py-2 text-sm cursor-pointer"
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>
                      {categoryIcons[cat.name] || '📦'} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-display font-semibold text-sm text-[#1a1a2e] mb-3 uppercase tracking-wider">
                  Mức giá
                </h3>
                <input
                  type="range"
                  min={0}
                  max={5000000}
                  step={100000}
                  value={priceRange[1]}
                  onChange={e => setPriceRange([0, Number(e.target.value)])}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-on-surface-muted font-body mt-2">
                  <span>0₫</span>
                  <span>{(priceRange[1] / 1000000).toFixed(1)}tr₫</span>
                </div>
              </div>

              {/* Colors */}
              <div>
                <h3 className="font-display font-semibold text-sm text-[#1a1a2e] mb-3 uppercase tracking-wider">Màu sắc</h3>
                <div className="flex flex-wrap gap-3">
                  {colors.map(c => (
                    <button
                      key={c.value}
                      onClick={() => toggleColor(c.value)}
                      title={c.label}
                      className={`w-7 h-7 rounded-full transition-all cursor-pointer border-2 ${
                        selectedColors.includes(c.value) ? 'border-primary scale-110' : 'border-outline-variant/40'
                      }`}
                      style={{ backgroundColor: c.value }}
                    />
                  ))}
                </div>
              </div>

              {/* Clear filters */}
              <button
                onClick={clearFilters}
                className="btn-ghost text-sm w-full text-left font-semibold text-primary hover:text-primary border-none bg-transparent cursor-pointer"
              >
                ✕ Xoá bộ lọc
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-surface-mid">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="flex items-center gap-2 text-sm font-display font-medium text-on-surface bg-transparent border-none cursor-pointer hover:text-primary transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="15" y2="12" /><line x1="3" y1="18" x2="9" y2="18" />
                  </svg>
                  Bộ lọc
                </button>
                <span className="text-on-surface-muted text-sm font-body">
                  {pagination.total} sản phẩm
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-on-surface-muted font-body">Sắp xếp:</span>
                <select
                  value={sortBy}
                  onChange={e => handleSortChange(e.target.value)}
                  className="input-field w-auto py-2 text-sm cursor-pointer"
                >
                  {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {loading ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-on-surface-muted">Đang tải...</p>
                </div>
              ) : products.length > 0 ? (
                products.map(p => (
                  <div key={p._id} className="group">
                    <Link href={`/product/${p.slug}`} className="no-underline block relative mb-4 overflow-hidden rounded-btn" style={{ aspectRatio: '1' }}>
                      <Image
                        src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'}
                        alt={p.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {p.salePrice && (
                        <div className="absolute top-3 right-3 bg-primary text-white font-display font-bold text-xs px-2.5 py-1 rounded-btn">
                          -{Math.round(((p.price - p.salePrice) / p.price) * 100)}%
                        </div>
                      )}
                      
                      {/* Add to Cart Button */}
                      <button
                        onClick={(e) => handleAddToCart(e, p)}
                        disabled={addingToCart.has(p._id)}
                        className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 w-full bg-[#1a1a2e] text-white py-3 text-sm font-display font-semibold hover:bg-primary transition-colors border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {addingToCart.has(p._id) ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                      </button>
                    </Link>

                    <Link href={`/product/${p.slug}`} className="no-underline block">
                      <p className="font-body text-sm text-on-surface-muted mb-2 group-hover:text-primary transition-colors">
                        {p.category?.name || 'Sản phẩm'}
                      </p>
                      <p className="font-display font-bold text-[#1a1a2e] mb-2 line-clamp-2 group-hover:text-primary transition-colors text-sm">
                        {p.name}
                      </p>
                    </Link>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-display font-bold text-primary">
                        {p.salePrice ? p.salePrice.toLocaleString('vi-VN') : p.price.toLocaleString('vi-VN')}₫
                      </span>
                      {p.salePrice && (
                        <span className="font-body text-sm text-on-surface-muted line-through">
                          {p.price.toLocaleString('vi-VN')}₫
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(s => (
                        <svg key={s} width="12" height="12" viewBox="0 0 24 24"
                          fill={s <= Math.round(p.rating?.average || 0) ? '#ab2e00' : '#efeded'} stroke="none">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                      <span className="text-xs text-on-surface-muted font-body ml-1">({p.rating?.count || 0})</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-on-surface-muted">Không có sản phẩm nào</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-btn font-display font-semibold text-sm bg-surface-lowest text-on-surface hover:bg-primary hover:text-white transition-all cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ←
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-btn font-display font-semibold text-sm transition-all cursor-pointer border-none ${
                      page === currentPage
                        ? 'bg-primary text-white'
                        : 'bg-surface-lowest text-on-surface hover:bg-primary hover:text-white'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="w-10 h-10 rounded-btn font-display font-semibold text-sm bg-surface-lowest text-on-surface hover:bg-primary hover:text-white transition-all cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Toast Notification */}
        {cartMessage && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-5">
            <div className="bg-green-600 text-white px-6 py-3 rounded-lg font-display font-semibold shadow-lg">
              {cartMessage}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopPageContent />
    </Suspense>
  )
}
