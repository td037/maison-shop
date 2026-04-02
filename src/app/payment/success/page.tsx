'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const dynamic = 'force-dynamic'

interface OrderData {
  _id: string
  orderNumber: string
  status: string
  paymentStatus: string
  total: number
  items: Array<{
    name: string
    quantity: number
    price: number
    salePrice?: number
  }>
  shippingAddress?: {
    name: string
    phone: string
    email: string
    street: string
    city: string
  }
  createdAt: string
}

function PaymentSuccessPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)

  const orderId = searchParams.get('orderId')
  const orderNumber = searchParams.get('orderNumber')

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const query = orderId
          ? `?orderId=${orderId}`
          : orderNumber
          ? `?orderNumber=${orderNumber}`
          : ''

        const response = await fetch(`${baseUrl}/api/orders${query}`)
        const data = await response.json()

        if (data.success && data.data) {
          const orderData = Array.isArray(data.data) ? data.data[0] : data.data
          setOrder(orderData)
        }
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        setLoading(false)
      }
    }

    if (orderId || orderNumber) {
      fetchOrder()
    }
  }, [orderId, orderNumber, baseUrl])

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="bg-surface min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-on-surface-muted">Đang tải...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="bg-surface min-h-screen">
        <div className="container mx-auto px-8 py-16">
          <div className="max-w-2xl mx-auto">
            {/* Success Icon */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h1 className="font-display font-bold text-3xl text-[#1a1a2e] mb-2">
                Thanh toán thành công!
              </h1>
              <p className="text-on-surface-muted text-lg mb-6">
                Đơn hàng của bạn đã được xác nhận
              </p>
              {order && (
                <p className="text-primary font-display font-bold text-2xl">
                  Đơn hàng: {order.orderNumber}
                </p>
              )}
            </div>

            {/* Order Details */}
            {order && (
              <div className="bg-surface-lowest rounded-btn p-8 mb-8 space-y-6">
                {/* Order Info */}
                <div>
                  <h2 className="font-display font-bold text-lg text-[#1a1a2e] mb-4">
                    Thông tin đơn hàng
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-on-surface-muted text-sm font-body">Ngày đặt hàng</p>
                      <p className="font-display font-semibold text-[#1a1a2e]">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-on-surface-muted text-sm font-body">Trạng thái</p>
                      <p className="font-display font-semibold text-green-600">✓ Đã xác nhận</p>
                    </div>
                    <div>
                      <p className="text-on-surface-muted text-sm font-body">Thanh toán</p>
                      <p className="font-display font-semibold text-green-600">✓ Đã thanh toán</p>
                    </div>
                    <div>
                      <p className="text-on-surface-muted text-sm font-body">Tổng tiền</p>
                      <p className="font-display font-bold text-primary text-lg">
                        {order.total.toLocaleString('vi-VN')}₫
                      </p>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                {order.shippingAddress && (
                  <div className="border-t border-surface-mid pt-6">
                    <h3 className="font-display font-bold text-lg text-[#1a1a2e] mb-4">
                      Địa chỉ giao hàng
                    </h3>
                    <p className="font-display font-semibold text-[#1a1a2e] mb-1">
                      {order.shippingAddress.name}
                    </p>
                    <p className="text-on-surface-muted text-sm font-body">
                      {order.shippingAddress.street}, {order.shippingAddress.city}
                    </p>
                    <p className="text-on-surface-muted text-sm font-body">
                      Tel: {order.shippingAddress.phone}
                    </p>
                  </div>
                )}

                {/* Items */}
                <div className="border-t border-surface-mid pt-6">
                  <h3 className="font-display font-bold text-lg text-[#1a1a2e] mb-4">
                    Sản phẩm đã đặt
                  </h3>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-start pb-3 border-b border-surface-mid last:border-b-0">
                        <div>
                          <p className="font-display font-semibold text-[#1a1a2e]">
                            {item.name}
                          </p>
                          <p className="text-on-surface-muted text-sm font-body">
                            Số lượng: {item.quantity}
                          </p>
                        </div>
                        <p className="font-display font-bold text-primary">
                          {(item.salePrice || item.price).toLocaleString('vi-VN')}₫
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-primary/10 rounded-btn p-6 mb-8">
              <h3 className="font-display font-bold text-[#1a1a2e] mb-3">Bước tiếp theo:</h3>
              <ul className="space-y-2 text-sm font-body">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">1.</span>
                  <span>Chúng tôi sẽ xác nhận đơn hàng qua email trong vòng 1-2 giờ</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">2.</span>
                  <span>Sản phẩm sẽ được chuẩn bị và giao hàng trong 3-5 ngày làm việc</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">3.</span>
                  <span>Bạn sẽ nhận được SMS cập nhật về tình trạng giao hàng</span>
                </li>
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4">
              <Link
                href="/shop"
                className="flex-1 btn-primary text-center py-3 font-display font-bold"
              >
                Tiếp tục mua sắm
              </Link>
              <Link
                href={`/account/orders?orderNumber=${order?.orderNumber}`}
                className="flex-1 py-3 font-display font-bold border-2 border-[#1a1a2e] text-[#1a1a2e] rounded-btn hover:bg-[#1a1a2e] hover:text-white transition-all cursor-pointer bg-transparent"
              >
                Xem chi tiết đơn hàng
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <PaymentSuccessPageContent />
    </Suspense>
  )
}
