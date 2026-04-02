'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { formatPrice } from '@/lib/data'
import { useAuth } from '@/app/providers'

export const dynamic = 'force-dynamic'

const steps = ['Giỏ hàng', 'Giao hàng', 'Thanh toán', 'Xác nhận']
const provinces = [
  { name: 'TP. Hồ Chí Minh', districts: ['Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8', 'Quận 9', 'Quận 10', 'Quận 11', 'Quận 12', 'Thủ Đức', 'Gò Vấp', 'Bình Thạnh', 'Tân Bình', 'Tân Phú', 'Từ Liêm'] },
  { name: 'Hà Nội', districts: ['Ba Đình', 'Hoàn Kiếm', 'Tây Hồ', 'Long Biên', 'Thanh Trì', 'Sơn Tây', 'Mỹ Đức'] },
  { name: 'Đà Nẵng', districts: ['Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn', 'Liên Chiểu'] },
  { name: 'Cần Thơ', districts: ['Ninh Kiều', 'Bình Thủy', 'Cái Răng', 'Phong Điền', 'Cờ Đỏ'] },
  { name: 'Biên Hòa', districts: ['Thành phố Biên Hòa', 'Tân Phú', 'Long Thạnh', 'Nhơn Trạch'] },
]
const wards = ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10']
const paymentMethods = [
  { id: 'cod', label: 'Thanh toán khi nhận hàng (COD)', icon: '🏠' },
  // { id: 'bank', label: 'Chuyển khoản ngân hàng', icon: '🏦' },
  // { id: 'momo', label: 'Ví MoMo', icon: '💜' },
  // { id: 'zalopay', label: 'ZaloPay', icon: '💙' },
  // { id: 'card', label: 'Thẻ tín dụng / Ghi nợ', icon: '💳' },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [currentStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [delivery, setDelivery] = useState('standard')
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedWard, setSelectedWard] = useState('')
  const [districts, setDistricts] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  // Form states
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')

  // Cart states
  const [cartItems, setCartItems] = useState<any[]>([])
  const [cartLoading, setCartLoading] = useState(true)

  // Fetch cart on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (authLoading) {
          return
        }

        setCartLoading(true)

        if (!isAuthenticated || !user?.id) {
          router.push('/login?redirect=/checkout')
          return
        }

        const res = await fetch(`/api/cart?userId=${user.id}`)
        const data = await res.json()
        
        if (data.data?.items) {
          setCartItems(data.data.items)
        }
      } catch (error) {
        console.error('Failed to fetch cart:', error)
      } finally {
        setCartLoading(false)
      }
    }

    fetchCart()
  }, [authLoading, isAuthenticated, user?.id, router])

  const handleProvinceChange = (provinceName: string) => {
    setSelectedProvince(provinceName)
    const province = provinces.find(p => p.name === provinceName)
    setDistricts(province?.districts || [])
    setSelectedDistrict('')
    setSelectedWard('')
  }

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district)
    setSelectedWard('')
  }

  const handleOrder = async () => {
    // Validation
    if (!fullName.trim() || !phone.trim() || !selectedProvince || !selectedDistrict || !selectedWard || !address.trim()) {
      alert('Vui lòng điền đầy đủ thông tin')
      return
    }

    if (authLoading) {
      return
    }

    if (!isAuthenticated || !user?.id) {
      alert('Bạn cần đăng nhập để đặt hàng')
      router.push('/login?redirect=/checkout')
      return
    }

    setIsLoading(true)
    try {
      // Get cart items from API
      const cartRes = await fetch(`/api/cart?userId=${user.id}`)
      const cartData = await cartRes.json()
      
      if (!cartData.data?.items || cartData.data.items.length === 0) {
        alert('Giỏ hàng trống')
        setIsLoading(false)
        return
      }

      console.log('Cart items:', cartData.data.items)

      // Create order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          customerInfo: {
            fullName,
            phone,
            email,
            address: `${address}, ${selectedWard}, ${selectedDistrict}, ${selectedProvince}`,
          },
          deliveryMethod: delivery,
          paymentMethod,
          items: cartData.data.items,
          note,
        }),
      })

      const responseText = await orderRes.text()
      console.log('Order response:', responseText)

      let orderData
      try {
        orderData = JSON.parse(responseText)
      } catch (e) {
        console.error('Failed to parse response:', responseText)
        alert('Lỗi: Không thể tạo đơn hàng. Kiểm tra console để biết chi tiết.')
        setIsLoading(false)
        return
      }

      if (!orderRes.ok) {
        const errorMsg = orderData?.error || 'Tạo đơn hàng thất bại'
        alert(`Lỗi: ${errorMsg}`)
        setIsLoading(false)
        return
      }

      // Clear cart after successful order
      try {
        await fetch(`/api/cart?userId=${user.id}`, {
          method: 'DELETE',
        })
      } catch (err) {
        console.warn('Failed to clear cart:', err)
      }

      // Redirect to order details page
      router.push(`/order?orderId=${orderData.data?._id}`)
    } catch (error) {
      console.error('Order error:', error)
      alert('Lỗi: ' + (error instanceof Error ? error.message : 'Không xác định'))
      setIsLoading(false)
    }
  }

  const subtotal = cartItems.reduce((s: any, item: any) => s + ((item.salePrice || item.price) * item.quantity), 0)
  const shippingFee = delivery === 'express' ? 50000 : 0
  const total = subtotal + shippingFee

  return (
    <>
      <Navbar />
      <main className="bg-surface min-h-screen">
        {/* Progress Steps */}
        <div className="bg-surface-lowest shadow-card">
          <div className="container mx-auto px-8 py-5">
            <div className="flex items-center justify-center gap-0">
              {steps.map((step, i) => (
                <div key={step} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-sm transition-all ${
                      i <= currentStep
                        ? 'text-white'
                        : 'bg-surface-mid text-on-surface-muted'
                    }`}
                    style={i <= currentStep ? { background: 'linear-gradient(135deg, #ab2e00, #cf4519)' } : {}}
                    >
                      {i < currentStep ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      ) : i + 1}
                    </div>
                    <span className={`text-xs mt-1.5 font-body ${i <= currentStep ? 'text-primary font-semibold' : 'text-on-surface-muted'}`}>
                      {step}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-16 md:w-28 h-px mx-3 mb-5 transition-all ${i < currentStep ? 'bg-primary' : 'bg-surface-mid'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-8 py-10">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Left Form */}
            <div className="lg:col-span-2 space-y-6">

              {/* Contact Info */}
              <div className="bg-surface-lowest rounded-btn p-7">
                <h2 className="font-display font-bold text-lg text-[#1a1a2e] mb-5">Thông tin liên hệ</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="section-label mb-2 block">Họ và tên *</label>
                    <input type="text" className="input-field" placeholder="Nguyễn Văn A" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  </div>
                  <div>
                    <label className="section-label mb-2 block">Số điện thoại *</label>
                    <input type="tel" className="input-field" placeholder="0901 234 567" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <label className="section-label mb-2 block">Email</label>
                    <input type="email" className="input-field" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-surface-lowest rounded-btn p-7">
                <h2 className="font-display font-bold text-lg text-[#1a1a2e] mb-5">Địa chỉ giao hàng</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="section-label mb-2 block">Tỉnh / Thành phố *</label>
                    <select className="input-field" value={selectedProvince} onChange={(e) => handleProvinceChange(e.target.value)}>
                      <option value="">Chọn tỉnh / thành phố</option>
                      {provinces.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="section-label mb-2 block">Quận / Huyện *</label>
                    <select className="input-field" value={selectedDistrict} onChange={(e) => handleDistrictChange(e.target.value)} disabled={!selectedProvince}>
                      <option value="">Chọn quận / huyện</option>
                      {districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="section-label mb-2 block">Phường / Xã *</label>
                    <select className="input-field" value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)} disabled={!selectedDistrict}>
                      <option value="">Chọn phường / xã</option>
                      {selectedDistrict && wards.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="section-label mb-2 block">Địa chỉ cụ thể *</label>
                    <input type="text" className="input-field" placeholder="Số nhà, tên đường..." value={address} onChange={(e) => setAddress(e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <label className="section-label mb-2 block">Ghi chú đơn hàng</label>
                    <textarea rows={3} className="input-field resize-none" placeholder="Ghi chú về đơn hàng, thời gian giao hàng..." value={note} onChange={(e) => setNote(e.target.value)}></textarea>
                  </div>
                </div>
              </div>

              {/* Delivery Method */}
              <div className="bg-surface-lowest rounded-btn p-7">
                <h2 className="font-display font-bold text-lg text-[#1a1a2e] mb-5">Phương thức giao hàng</h2>
                <div className="space-y-3">
                  {[
                    { id: 'standard', label: 'Giao hàng tiêu chuẩn', sub: '3 – 5 ngày làm việc', price: 'Miễn phí' },
                    { id: 'express', label: 'Giao hàng nhanh', sub: '1 – 2 ngày làm việc', price: '50.000₫' },
                  ].map(d => (
                    <label
                      key={d.id}
                      className={`flex items-center gap-4 p-4 rounded-btn cursor-pointer border-2 transition-all ${
                        delivery === d.id ? 'border-primary bg-primary/5' : 'border-surface-mid hover:border-outline-variant'
                      }`}
                    >
                      <input type="radio" name="delivery" value={d.id} checked={delivery === d.id}
                        onChange={() => setDelivery(d.id)} className="accent-primary" />
                      <div className="flex-1">
                        <p className="font-display font-semibold text-sm text-[#1a1a2e]">{d.label}</p>
                        <p className="text-on-surface-muted text-xs font-body">{d.sub}</p>
                      </div>
                      <span className={`font-display font-bold text-sm ${d.price === 'Miễn phí' ? 'text-green-600' : 'text-on-surface'}`}>
                        {d.price}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-surface-lowest rounded-btn p-7">
                <h2 className="font-display font-bold text-lg text-[#1a1a2e] mb-5">Phương thức thanh toán</h2>
                <div className="space-y-3">
                  {paymentMethods.map(m => (
                    <div key={m.id}>
                      <label
                        className={`flex items-center gap-4 p-4 rounded-btn cursor-pointer border-2 transition-all ${
                          paymentMethod === m.id ? 'border-primary bg-primary/5' : 'border-surface-mid hover:border-outline-variant'
                        }`}
                      >
                        <input type="radio" name="payment" value={m.id} checked={paymentMethod === m.id}
                          onChange={() => setPaymentMethod(m.id)} className="accent-primary" />
                        <span className="text-xl">{m.icon}</span>
                        <span className="font-body text-sm text-on-surface font-medium">{m.label}</span>
                      </label>

                      {/* Card form */}
                      {/* {paymentMethod === 'card' && m.id === 'card' && (
                        <div className="mt-3 p-5 bg-surface-low rounded-btn space-y-4">
                          <div>
                            <label className="section-label mb-2 block">Số thẻ</label>
                            <input type="text" className="input-field" placeholder="0000 0000 0000 0000" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="section-label mb-2 block">Ngày hết hạn</label>
                              <input type="text" className="input-field" placeholder="MM/YY" />
                            </div>
                            <div>
                              <label className="section-label mb-2 block">CVV</label>
                              <input type="text" className="input-field" placeholder="•••" />
                            </div>
                          </div>
                        </div>
                      )} */}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Summary */}
            <div className="lg:col-span-1">
              <div className="bg-surface-lowest rounded-btn p-6 sticky top-24">
                <h2 className="font-display font-bold text-base text-[#1a1a2e] mb-5 pb-4 border-b border-surface-mid">
                  Đơn hàng ({cartItems.length} sản phẩm)
                </h2>

                {cartLoading ? (
                  <div className="text-center py-8 text-on-surface-muted">Đang tải giỏ hàng...</div>
                ) : cartItems.length === 0 ? (
                  <div className="text-center py-8 text-on-surface-muted">
                    <p>Giỏ hàng trống</p>
                    <Link href="/shop" className="text-primary hover:underline text-sm mt-2 inline-block">Tiếp tục mua sắm</Link>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-5">
                      {cartItems.map((item: any) => (
                        <div key={item._id || item.productId} className="flex gap-3">
                          {item.image && (
                            <div className="relative w-14 h-16 flex-shrink-0 rounded overflow-hidden bg-surface-low">
                              <Image src={item.image} alt={item.name || 'Product'} fill className="object-cover" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-display font-semibold text-xs text-[#1a1a2e] leading-snug line-clamp-2">
                              {item.name || 'Sản phẩm'}
                            </p>
                            <p className="text-on-surface-muted text-xs font-body mt-0.5">
                              {item.quantity}x · {item.size ? `Size ${item.size}` : ''} {item.color ? `· ${item.color}` : ''}
                            </p>
                          </div>
                          <span className="font-display font-bold text-xs text-[#1a1a2e] flex-shrink-0">
                            {formatPrice((item.salePrice || item.price || 0) * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <div className="space-y-2 pb-4 border-b border-surface-mid text-sm font-body">
                  <div className="flex justify-between">
                    <span className="text-on-surface-muted">Tạm tính</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-muted">Vận chuyển</span>
                    <span className={`font-semibold ${shippingFee === 0 ? 'text-green-600' : ''}`}>
                      {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-4">
                  <span className="font-display font-bold text-on-surface">Tổng cộng</span>
                  <span className="font-display font-black text-xl text-[#1a1a2e]">{formatPrice(total)}</span>
                </div>

                <button 
                  onClick={handleOrder} 
                  disabled={isLoading}
                  className="btn-primary w-full justify-center py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Đang xử lý...' : 'Đặt hàng ngay 🎉'}
                </button>

                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-on-surface-muted font-body">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Thanh toán an toàn & bảo mật
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
