'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const dynamic = 'force-dynamic'

function PaymentFailedPageContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('orderNumber')
  const reason = searchParams.get('reason') || 'Unknown error'

  return (
    <>
      <Navbar />
      <main className="bg-surface min-h-screen">
        <div className="container mx-auto px-8 py-16">
          <div className="max-w-2xl mx-auto">
            {/* Error Icon */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
              <h1 className="font-display font-bold text-3xl text-[#1a1a2e] mb-2">
                Thanh toán không thành công
              </h1>
              <p className="text-on-surface-muted text-lg mb-4">
                Có lỗi xảy ra trong quá trình thanh toán
              </p>
              {reason && (
                <p className="text-red-600 font-display font-semibold mb-6">
                  Lý do: {decodeURIComponent(reason)}
                </p>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-surface-lowest rounded-btn p-8 mb-8">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="text-2xl">💳</div>
                  <div>
                    <h3 className="font-display font-bold text-[#1a1a2e] mb-1">
                      Thanh toán qua Momo
                    </h3>
                    <p className="text-on-surface-muted text-sm font-body">
                      Vui lòng kiểm tra lại số tiền và thông tin tài khoản Momo của bạn
                    </p>
                  </div>
                </div>

                <div className="border-t border-surface-mid pt-4">
                  <div className="flex gap-4">
                    <div className="text-2xl">🔄</div>
                    <div>
                      <h3 className="font-display font-bold text-[#1a1a2e] mb-1">
                        Thử lại
                      </h3>
                      <p className="text-on-surface-muted text-sm font-body">
                        Đơn hàng của bạn vẫn được giữ trong giỏ. Bạn có thể thử thanh toán lại
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-surface-mid pt-4">
                  <div className="flex gap-4">
                    <div className="text-2xl">📞</div>
                    <div>
                      <h3 className="font-display font-bold text-[#1a1a2e] mb-1">
                        Cần trợ giúp?
                      </h3>
                      <p className="text-on-surface-muted text-sm font-body">
                        Liên hệ với chúng tôi qua: 0901 234 567 hoặc support@maison.vn
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Alternative Payment Methods */}
            <div className="bg-primary/5 rounded-btn p-8 mb-8">
              <h3 className="font-display font-bold text-lg text-[#1a1a2e] mb-4">
                Thử phương thức thanh toán khác
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-surface-lowest rounded-btn border-2 border-surface-mid hover:border-primary transition-colors cursor-pointer">
                  <p className="text-2xl mb-2">🏠</p>
                  <p className="font-display font-semibold text-sm text-[#1a1a2e]">COD</p>
                  <p className="text-on-surface-muted text-xs font-body">Thanh toán khi nhận</p>
                </div>
                <div className="p-4 bg-surface-lowest rounded-btn border-2 border-surface-mid hover:border-primary transition-colors cursor-pointer">
                  <p className="text-2xl mb-2">💙</p>
                  <p className="font-display font-semibold text-sm text-[#1a1a2e]">ZaloPay</p>
                  <p className="text-on-surface-muted text-xs font-body">Ví Zalo</p>
                </div>
                <div className="p-4 bg-surface-lowest rounded-btn border-2 border-surface-mid hover:border-primary transition-colors cursor-pointer">
                  <p className="text-2xl mb-2">🏦</p>
                  <p className="font-display font-semibold text-sm text-[#1a1a2e]">Ngân hàng</p>
                  <p className="text-on-surface-muted text-xs font-body">Chuyển khoản</p>
                </div>
                <div className="p-4 bg-surface-lowest rounded-btn border-2 border-surface-mid hover:border-primary transition-colors cursor-pointer">
                  <p className="text-2xl mb-2">💳</p>
                  <p className="font-display font-semibold text-sm text-[#1a1a2e]">Thẻ tín dụng</p>
                  <p className="text-on-surface-muted text-xs font-body">Visa, Mastercard</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4">
              <Link
                href="/checkout"
                className="flex-1 btn-primary text-center py-3 font-display font-bold"
              >
                Thử lại thanh toán
              </Link>
              <Link
                href="/cart"
                className="flex-1 py-3 font-display font-bold border-2 border-[#1a1a2e] text-[#1a1a2e] rounded-btn hover:bg-[#1a1a2e] hover:text-white transition-all cursor-pointer bg-transparent"
              >
                Quay về giỏ hàng
              </Link>
            </div>

            {/* Return to Shop */}
            <div className="text-center mt-8">
              <Link
                href="/shop"
                className="text-primary hover:text-primary font-display font-semibold text-sm"
              >
                ← Quay lại cửa hàng
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={null}>
      <PaymentFailedPageContent />
    </Suspense>
  )
}
