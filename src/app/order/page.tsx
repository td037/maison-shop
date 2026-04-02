'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

interface OrderItem {
  _id: string
  productId: string
  name: string
  sku: string
  price: number
  salePrice?: number
  size: string
  color: string
  quantity: number
  subtotal: number
}

interface OrderData {
  _id: string
  orderNumber: string
  userId?: {
    name?: string
    email?: string
    phone?: string
  }
  guestInfo?: {
    fullName: string
    phone: string
    email: string
  }
  items: OrderItem[]
  shippingAddress: string
  paymentMethod: string
  paymentStatus: string
  orderStatus: string
  subtotal: number
  shippingCost: number
  discountAmount: number
  totalAmount: number
  note?: string
  createdAt: string
  orderTimeline?: Array<{ status: string; timestamp: string; note: string }>
}

function OrderPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('orderId')

  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId) {
      setError('Không tìm thấy ID đơn hàng')
      setLoading(false)
      return
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Không thể tải đơn hàng')
        }

        setOrder(data.data)
      } catch (err) {
        console.error('Error fetching order:', err)
        setError(err instanceof Error ? err.message : 'Lỗi khi tải đơn hàng')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      shipping: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPaymentStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: 'Chờ thanh toán',
      paid: 'Đã thanh toán',
      failed: 'Thanh toán thất bại',
      refunded: 'Đã hoàn tiền',
    }
    return texts[status] || status
  }

  const getOrderStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      preparing: 'Đang chuẩn bị',
      shipping: 'Đang giao hàng',
      delivered: 'Đã giao hàng',
      cancelled: 'Đã hủy',
    }
    return texts[status] || status
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="bg-surface min-h-screen py-16">
          <div className="container mx-auto px-8">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-on-surface-muted">Đang tải đơn hàng...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (error || !order) {
    return (
      <>
        <Navbar />
        <main className="bg-surface min-h-screen py-16">
          <div className="container mx-auto px-8">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error || 'Không tìm thấy đơn hàng'}</p>
              <Link href="/shop" className="text-primary hover:underline">
                ← Quay lại mua sắm
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const customerName = order.userId?.name || order.guestInfo?.fullName || 'Khách lẻ'
  const customerPhone = order.userId?.phone || order.guestInfo?.phone || 'Chưa có'
  const customerEmail = order.userId?.email || order.guestInfo?.email || 'Chưa có'

  return (
    <>
      <Navbar />
      <main className="bg-surface min-h-screen py-12">
        <div className="container mx-auto px-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display font-bold text-3xl text-[#1a1a2e] mb-2">
              Chi tiết đơn hàng
            </h1>
            <p className="text-on-surface-muted">Cảm ơn bạn đã đặt hàng!</p>
          </div>

          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-btn p-6 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div>
                <h2 className="font-display font-semibold text-green-800">Đơn hàng đã được tạo thành công!</h2>
                <p className="text-green-700 text-sm mt-1">
                  Mã đơn hàng: <span className="font-semibold">{order.orderNumber}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {/* Order Status */}
            <div className="bg-surface-lowest rounded-btn p-6 border border-surface-mid">
              <p className="text-on-surface-muted text-sm font-body mb-2">Trạng thái đơn hàng</p>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
                  {getOrderStatusText(order.orderStatus)}
                </span>
              </div>
            </div>

            {/* Payment Status */}
            <div className="bg-surface-lowest rounded-btn p-6 border border-surface-mid">
              <p className="text-on-surface-muted text-sm font-body mb-2">Trạng thái thanh toán</p>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.paymentStatus)}`}>
                  {getPaymentStatusText(order.paymentStatus)}
                </span>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Info */}
              <div className="bg-surface-lowest rounded-btn p-6 border border-surface-mid">
                <h3 className="font-display font-bold text-lg text-[#1a1a2e] mb-4">Thông tin khách hàng</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-on-surface-muted text-sm">Họ và tên</p>
                    <p className="font-semibold text-[#1a1a2e]">{customerName}</p>
                  </div>
                  <div>
                    <p className="text-on-surface-muted text-sm">Số điện thoại</p>
                    <p className="font-semibold text-[#1a1a2e]">{customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-on-surface-muted text-sm">Email</p>
                    <p className="font-semibold text-[#1a1a2e]">{customerEmail}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-surface-lowest rounded-btn p-6 border border-surface-mid">
                <h3 className="font-display font-bold text-lg text-[#1a1a2e] mb-4">Địa chỉ giao hàng</h3>
                <p className="text-[#1a1a2e] leading-relaxed">{order.shippingAddress}</p>
              </div>

              {/* Order Items */}
              <div className="bg-surface-lowest rounded-btn p-6 border border-surface-mid">
                <h3 className="font-display font-bold text-lg text-[#1a1a2e] mb-4">Sản phẩm</h3>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex gap-4 pb-4 border-b border-surface-mid last:border-0 last:pb-0">
                      <div className="flex-1">
                        <h4 className="font-display font-semibold text-[#1a1a2e] mb-1">{item.name}</h4>
                        <p className="text-on-surface-muted text-xs mb-2">
                          {item.size && `Size: ${item.size}`} {item.color && `· Color: ${item.color}`}
                        </p>
                        <p className="text-on-surface-muted text-sm">Số lượng: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-semibold text-[#1a1a2e]">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          }).format(item.subtotal)}
                        </p>
                        <p className="text-on-surface-muted text-xs">
                          {item.quantity} × {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          }).format(item.salePrice || item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-surface-lowest rounded-btn p-6 border border-surface-mid sticky top-24">
                <h3 className="font-display font-bold text-lg text-[#1a1a2e] mb-4">Tóm tắt đơn hàng</h3>

                <div className="space-y-3 pb-4 border-b border-surface-mid text-sm">
                  <div className="flex justify-between">
                    <span className="text-on-surface-muted">Tạm tính</span>
                    <span className="font-semibold text-[#1a1a2e]">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(order.subtotal)}
                    </span>
                  </div>

                  {order.shippingCost > 0 && (
                    <div className="flex justify-between">
                      <span className="text-on-surface-muted">Vận chuyển</span>
                      <span className="font-semibold text-[#1a1a2e]">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(order.shippingCost)}
                      </span>
                    </div>
                  )}

                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá</span>
                      <span className="font-semibold">
                        -{new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(order.discountAmount)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center py-4 mb-4">
                  <span className="font-display font-bold text-[#1a1a2e]">Tổng cộng</span>
                  <span className="font-display font-black text-xl text-primary">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(order.totalAmount)}
                  </span>
                </div>

                {/* Payment Method */}
                <div className="bg-surface-low rounded px-3 py-2 mb-4">
                  <p className="text-xs text-on-surface-muted mb-1">Phương thức thanh toán</p>
                  <p className="font-semibold text-[#1a1a2e]">
                    {order.paymentMethod === 'cod'
                      ? 'Thanh toán khi nhận hàng'
                      : order.paymentMethod === 'momo'
                      ? 'Ví MoMo'
                      : order.paymentMethod === 'card'
                      ? 'Thẻ tín dụng'
                      : order.paymentMethod}
                  </p>
                </div>

                {/* Order Number */}
                <div className="bg-surface-low rounded px-3 py-2">
                  <p className="text-xs text-on-surface-muted mb-1">Mã đơn hàng</p>
                  <p className="font-mono font-semibold text-[#1a1a2e]">{order.orderNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          {order.orderTimeline && order.orderTimeline.length > 0 && (
            <div className="mt-8 bg-surface-lowest rounded-btn p-6 border border-surface-mid">
              <h3 className="font-display font-bold text-lg text-[#1a1a2e] mb-4">Lịch sử đơn hàng</h3>
              <div className="space-y-3">
                {order.orderTimeline.map((entry, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary mt-1.5"></div>
                      {idx < order.orderTimeline!.length - 1 && <div className="w-0.5 h-8 bg-surface-mid"></div>}
                    </div>
                    <div className="pb-2">
                      <p className="font-semibold text-[#1a1a2e] text-sm">
                        {entry.note || getOrderStatusText(entry.status)}
                      </p>
                      <p className="text-xs text-on-surface-muted">
                        {new Date(entry.timestamp).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex gap-4">
            <Link
              href="/shop"
              className="flex-1 bg-primary text-white font-semibold py-3 rounded-btn text-center hover:opacity-90 transition"
            >
              ← Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function OrderPage() {
  return (
    <Suspense fallback={null}>
      <OrderPageContent />
    </Suspense>
  )
}
