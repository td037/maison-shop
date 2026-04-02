'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useAuth } from '@/app/providers'

interface CartItem {
  _id: string
  productId: string
  name: string
  slug: string
  price: number
  salePrice?: number
  image: string
  size: string
  color: string
  quantity: number
  subtotal: number
}

interface CartData {
  _id: string
  items: CartItem[]
  total: number
  itemCount: number
}

export default function CartPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

  const [cart, setCart] = useState<CartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)

  // Fetch cart
  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (authLoading) {
          return
        }

        setLoading(true)

        if (!isAuthenticated || !user?.id) {
          router.push('/login?redirect=/cart')
          return
        }

        const response = await fetch(`${baseUrl}/api/cart?userId=${user.id}`)
        const data = await response.json()

        if (data.success) {
          setCart(data.data)
        } else if (response.status === 401) {
          router.push('/login')
        }
      } catch (err) {
        console.error('Error fetching cart:', err)
        setError('Không thể tải giỏ hàng')
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [authLoading, isAuthenticated, user?.id, baseUrl, router])

  // Update quantity
  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      setUpdating(true)
      const response = await fetch(`${baseUrl}/api/cart`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          itemId,
          quantity,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setCart(data.data)
      } else if (response.status === 401) {
        router.push('/login?redirect=/cart')
      }
    } catch (err) {
      console.error('Error updating cart:', err)
    } finally {
      setUpdating(false)
    }
  }

  // Remove item
  const removeItem = async (itemId: string) => {
    try {
      const response = await fetch(
        `${baseUrl}/api/cart?userId=${user?.id}&itemId=${itemId}`,
        { method: 'DELETE' }
      )

      const data = await response.json()
      if (data.success) {
        setCart(data.data)
      } else if (response.status === 401) {
        router.push('/login?redirect=/cart')
      }
    } catch (err) {
      console.error('Error removing item:', err)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="bg-surface min-h-screen flex items-center justify-center">
          <p className="text-on-surface-muted">Đang tải giỏ hàng...</p>
        </main>
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="bg-surface min-h-screen">
          <div className="container mx-auto px-8 py-16 text-center">
            <p className="text-on-surface-muted mb-4">{error}</p>
            <Link href="/shop" className="text-primary hover:text-primary font-semibold">
              Quay lại cửa hàng →
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const isEmpty = !cart || cart.items.length === 0

  return (
    <>
      <Navbar />
      <main className="bg-surface min-h-screen">
        {/* Header */}
        <div className="bg-surface-low border-b border-surface-mid">
          <div className="container mx-auto px-8 py-10">
            <p className="text-on-surface-muted text-sm font-body mb-1">
              <span className="hover:text-primary cursor-pointer">Trang chủ</span>
              <span className="mx-2">/</span>
              <span>Giỏ hàng</span>
            </p>
            <h1 className="font-display font-black text-3xl text-[#1a1a2e] tracking-tight">
              Giỏ hàng
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-8 py-10">
          {isEmpty ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="font-display font-bold text-2xl text-[#1a1a2e] mb-3">
                Giỏ hàng của bạn trống
              </h2>
              <p className="text-on-surface-muted mb-6">
                Hãy thêm sản phẩm để tiếp tục
              </p>
              <Link href="/shop" className="btn-primary inline-block px-8 py-3">
                Tiếp tục mua hàng →
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-10">
              {/* Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart?.items.map(item => (
                  <div
                    key={item._id}
                    className="bg-surface-lowest rounded-btn p-5 flex gap-5 hover:shadow-card transition-shadow"
                  >
                    {/* Image */}
                    <Link href={`/product/${item.slug}`} className="flex-shrink-0">
                      <div className="relative w-24 h-24 overflow-hidden rounded-btn bg-surface-low">
                        <Image
                          src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.slug}`} className="no-underline block mb-2">
                        <h3 className="font-display font-bold text-[#1a1a2e] hover:text-primary transition-colors line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>
                      <div className="text-xs text-on-surface-muted font-body mb-2 space-y-1">
                        {item.size && <p>Kích cỡ: {item.size}</p>}
                        {item.color && <p>Màu: {item.color}</p>}
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-display font-bold text-primary">
                          {(item.salePrice || item.price).toLocaleString('vi-VN')}₫
                        </span>
                        {item.salePrice && (
                          <span className="font-body text-xs text-on-surface-muted line-through">
                            {item.price.toLocaleString('vi-VN')}₫
                          </span>
                        )}
                      </div>

                      {/* Quantity & Remove */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || updating}
                            className="w-8 h-8 flex items-center justify-center bg-surface-mid hover:bg-primary hover:text-white transition-colors rounded border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-display font-bold text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            disabled={updating}
                            className="w-8 h-8 flex items-center justify-center bg-surface-mid hover:bg-primary hover:text-white transition-colors rounded border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item._id)}
                          className="text-sm text-red-600 hover:text-red-700 font-body font-semibold bg-transparent border-none cursor-pointer"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="flex-shrink-0 text-right">
                      <p className="text-xs text-on-surface-muted font-body mb-2">Thành tiền</p>
                      <p className="font-display font-bold text-primary text-lg">
                        {item.subtotal.toLocaleString('vi-VN')}₫
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="bg-surface-lowest rounded-btn p-6 sticky top-24 space-y-5">
                  <h2 className="font-display font-bold text-lg text-[#1a1a2e]">
                    Tóm tắt đơn hàng
                  </h2>

                  <div className="space-y-3 border-b border-surface-mid pb-4">
                    <div className="flex justify-between text-sm font-body">
                      <span className="text-on-surface-muted">Tạm tính:</span>
                      <span className="text-[#1a1a2e] font-semibold">
                        {cart?.total.toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-body">
                      <span className="text-on-surface-muted">Phí vận chuyển:</span>
                      <span className="text-[#1a1a2e] font-semibold">Tính khi thanh toán</span>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-display font-bold text-[#1a1a2e]">Tổng:</span>
                    <span className="font-display font-bold text-primary text-xl">
                      {cart?.total.toLocaleString('vi-VN')}₫
                    </span>
                  </div>

                  <button
                    onClick={() => router.push('/checkout')}
                    className="btn-primary w-full py-3 font-display font-bold text-center"
                  >
                    Thanh toán
                  </button>

                  <Link
                    href="/shop"
                    className="block text-center py-3 bg-surface-low text-on-surface font-display font-bold rounded-btn hover:bg-surface-mid transition-colors"
                  >
                    Tiếp tục mua hàng
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
