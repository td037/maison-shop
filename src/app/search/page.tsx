'use client'
import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { formatPrice } from '@/lib/data'

interface ProductResult {
  _id: string
  name: string
  slug: string
  price: number
  salePrice?: number
  category?: { name?: string }
  images?: Array<{ url?: string }>
  rating?: { average?: number; count?: number }
  description?: string
}

function SearchPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<ProductResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  useEffect(() => {
    const fetchResults = async () => {
      const trimmedQuery = initialQuery.trim()

      if (!trimmedQuery) {
        setResults([])
        setLoading(false)
        setError(null)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`${baseUrl}/api/products?search=${encodeURIComponent(trimmedQuery)}&limit=24`, { cache: 'no-store' })
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Không thể tìm kiếm sản phẩm')
        }

        setResults(Array.isArray(data.products) ? data.products : [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tìm kiếm sản phẩm')
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [baseUrl, initialQuery])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const trimmedQuery = query.trim()
    if (!trimmedQuery) {
      router.push('/search')
      return
    }
    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`)
  }

  const normalizedResults = results.map((product) => {
    const salePrice = product.salePrice ?? undefined
    const discount = salePrice && product.price ? Math.round(((product.price - salePrice) / product.price) * 100) : 0
    const image = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80'
    return {
      id: product._id,
      name: product.name,
      slug: product.slug,
      price: salePrice || product.price,
      originalPrice: product.price,
      discount,
      rating: product.rating?.average || 0,
      reviews: product.rating?.count || 0,
      image,
      imageHover: image,
      tag: product.category?.name || null,
      colors: ['#1a1a2e'],
      sizes: ['One Size'],
      inStock: true,
      isNew: false,
    }
  })

  return (
    <>
      <Navbar />
      <main className="bg-surface min-h-screen">
        {/* Search Header */}
        <div className="bg-surface-low">
          <div className="container mx-auto px-8 py-10">
            <div className="max-w-2xl">
              <form onSubmit={handleSubmit} className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="input-field pr-12 text-lg py-4"
                  placeholder="Tìm kiếm sản phẩm..."
                />
                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-primary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                </button>
              </form>
              {query && !loading && !error && (
                <p className="text-on-surface-muted text-sm font-body mt-3">
                  {normalizedResults.length} kết quả cho <strong className="text-on-surface">"{query}"</strong>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-8 py-10">
          {loading ? (
            <div className="py-24 text-center text-on-surface-muted">Đang tìm sản phẩm...</div>
          ) : error ? (
            <div className="py-24 text-center">
              <h2 className="font-display font-bold text-2xl text-[#1a1a2e] mb-3">Có lỗi khi tìm kiếm</h2>
              <p className="text-on-surface-muted max-w-md mx-auto">{error}</p>
            </div>
          ) : normalizedResults.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <div className="flex gap-2 flex-wrap">
                  <span className="rounded-full bg-primary px-4 py-2 text-sm font-display font-semibold text-white">Kết quả tìm kiếm</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {normalizedResults.map((product) => (
                  <a key={product.id} href={`/product/${product.slug}`} className="group block rounded-[24px] border border-outline-variant/20 bg-white overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)] no-underline">
                    <div className="relative aspect-[3/4] overflow-hidden bg-surface-low">
                      <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      {product.discount > 0 ? (
                        <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-white">-{product.discount}%</span>
                      ) : null}
                    </div>
                    <div className="p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-on-surface-muted">{product.tag || 'Sản phẩm'}</p>
                      <h3 className="mt-2 line-clamp-2 font-display text-sm font-semibold text-on-surface group-hover:text-primary">{product.name}</h3>
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="font-display text-base font-bold text-[#1a1a2e]">{formatPrice(product.price)}</span>
                        {product.discount > 0 ? <span className="text-xs text-on-surface-muted line-through">{formatPrice(product.originalPrice)}</span> : null}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="text-center py-24">
              <div className="text-7xl mb-6">🔍</div>
              <h2 className="font-display font-bold text-2xl text-[#1a1a2e] mb-3">
                Không tìm thấy kết quả
              </h2>
              <p className="text-on-surface-muted font-body mb-8 max-w-md mx-auto">
                Thử tìm kiếm với từ khoá khác hoặc khám phá các danh mục sản phẩm của chúng tôi.
              </p>
              <div className="flex gap-4 justify-center">
                <a href="/shop" className="btn-primary no-underline">Khám phá cửa hàng</a>
                <button
                  onClick={() => {
                    setQuery('')
                    router.push('/search')
                  }}
                  className="px-6 py-3 font-display font-semibold text-sm border-2 border-[#1a1a2e] text-[#1a1a2e] rounded-btn hover:bg-[#1a1a2e] hover:text-white transition-all cursor-pointer bg-transparent"
                >
                  Xoá tìm kiếm
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageContent />
    </Suspense>
  )
}
