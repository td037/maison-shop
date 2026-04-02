'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { products, formatPrice } from '@/lib/data'
import { useAuth } from '@/app/providers'

const sidebarLinks = [
  { id: 'profile', label: 'Hồ sơ cá nhân', icon: '👤' },
  { id: 'orders', label: 'Đơn hàng của tôi', icon: '📦' },
  { id: 'wishlist', label: 'Yêu thích', icon: '❤️' },
  { id: 'addresses', label: 'Sổ địa chỉ', icon: '📍' },
  { id: 'password', label: 'Đổi mật khẩu', icon: '🔒' },
  { id: 'points', label: 'Điểm tích lũy', icon: '⭐' },
]

interface Address {
  _id?: string
  label: 'Nhà' | 'Văn phòng' | 'Khác'
  street: string
  ward?: string
  district: string
  city: string
  province: string
  postalCode?: string
  isDefault: boolean
}

interface OrderItem {
  productId?: { _id?: string; name?: string } | string
  name: string
  quantity: number
  subtotal: number
}

interface OrderData {
  _id: string
  orderNumber: string
  createdAt: string
  totalAmount: number
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  orderStatus: 'pending' | 'confirmed' | 'preparing' | 'shipping' | 'delivered' | 'cancelled'
  items: OrderItem[]
  userId?: { name?: string; email?: string; phone?: string }
  guestInfo?: { fullName?: string; email?: string; phone?: string }
}

const orderStatusLabel: Record<OrderData['orderStatus'], string> = {
  pending: 'Đang xử lý',
  confirmed: 'Đã xác nhận',
  preparing: 'Đang chuẩn bị',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã huỷ',
}

const orderStatusTone: Record<OrderData['orderStatus'], string> = {
  pending: 'text-orange-600 bg-orange-50',
  confirmed: 'text-blue-600 bg-blue-50',
  preparing: 'text-indigo-600 bg-indigo-50',
  shipping: 'text-sky-600 bg-sky-50',
  delivered: 'text-green-600 bg-green-50',
  cancelled: 'text-red-600 bg-red-50',
}

const paymentStatusLabel: Record<OrderData['paymentStatus'], string> = {
  pending: 'Chờ thanh toán',
  paid: 'Đã thanh toán',
  failed: 'Thanh toán lỗi',
  refunded: 'Đã hoàn tiền',
}

const paymentStatusTone: Record<OrderData['paymentStatus'], string> = {
  pending: 'text-orange-600 bg-orange-50',
  paid: 'text-green-600 bg-green-50',
  failed: 'text-red-600 bg-red-50',
  refunded: 'text-purple-600 bg-purple-50',
}

export default function AccountPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('profile')
  const { user, isLoading, logout, checkAuth, isAuthenticated } = useAuth()
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
  })
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [orders, setOrders] = useState<OrderData[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState('')
  
  // Address state
  const [addresses, setAddresses] = useState<Address[]>([])
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [addressForm, setAddressForm] = useState<Address>({
    label: 'Nhà',
    street: '',
    ward: '',
    district: '',
    city: '',
    province: '',
    postalCode: '',
    isDefault: false,
  })
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({})
  const [addressSaving, setAddressSaving] = useState(false)

  const validateProfileForm = () => {
    const newErrors: Record<string, string> = {};

    if (!profileData.name.trim()) {
      newErrors.name = 'Họ và tên không được để trống';
    }

    if (profileData.phone && !/^[0-9\s\-\+\(\)]{10,15}$/.test(profileData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ (10-15 ký tự)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Sync profileData with user data & load addresses
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
      })
      // Load addresses
      if ((user as any).addresses) {
        setAddresses((user as any).addresses)
      }
    }
  }, [user])

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) {
        setOrders([])
        return
      }

      try {
        setOrdersLoading(true)
        setOrdersError('')
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
        const response = await fetch(`${baseUrl}/api/orders?userId=${user.id}`, { cache: 'no-store' })
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Không thể tải đơn hàng')
        }

        setOrders(Array.isArray(data.orders) ? data.orders : [])
      } catch (error) {
        setOrdersError(error instanceof Error ? error.message : 'Không thể tải đơn hàng')
        setOrders([])
      } finally {
        setOrdersLoading(false)
      }
    }

    fetchOrders()
  }, [user?.id])

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setAddressForm(prev => ({ ...prev, [name]: val }))
  }

  const validateAddressForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!addressForm.street.trim()) {
      newErrors.street = 'Đường phố không được để trống'
    }
    if (!addressForm.district.trim()) {
      newErrors.district = 'Quận/huyện không được để trống'
    }
    if (!addressForm.city.trim()) {
      newErrors.city = 'Thành phố không được để trống'
    }
    if (!addressForm.province.trim()) {
      newErrors.province = 'Tỉnh/thành phố không được để trống'
    }
    
    setAddressErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddressSubmit = async () => {
    if (!validateAddressForm()) return
    
    setAddressSaving(true)
    try {
      const method = editingAddressId ? 'PUT' : 'POST'
      const endpoint = editingAddressId 
        ? `/api/users/addresses/${editingAddressId}`
        : '/api/users/addresses'
      
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressForm),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Lưu địa chỉ thất bại')
      }

      const updatedUser = await response.json()
      if ((updatedUser as any).addresses) {
        setAddresses((updatedUser as any).addresses)
      }
      
      setShowAddressForm(false)
      setEditingAddressId(null)
      setAddressForm({
        label: 'Nhà',
        street: '',
        ward: '',
        district: '',
        city: '',
        province: '',
        postalCode: '',
        isDefault: false,
      })
      await checkAuth()
    } catch (error) {
      setAddressErrors({ submit: error instanceof Error ? error.message : 'Lưu thất bại' })
    } finally {
      setAddressSaving(false)
    }
  }

  const handleEditAddress = (addr: Address) => {
    setAddressForm(addr)
    setEditingAddressId(addr._id || null)
    setShowAddressForm(true)
    setAddressErrors({})
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Bạn chắc chắn muốn xoá địa chỉ này?')) return
    
    try {
      const response = await fetch(`/api/users/addresses/${addressId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Xoá thất bại')
      
      const updatedUser = await response.json()
      if ((updatedUser as any).addresses) {
        setAddresses((updatedUser as any).addresses)
      }
      await checkAuth()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Xoá thất bại')
    }
  }

  const handleSetDefault = async (addressId: string) => {
    try {
      const response = await fetch(`/api/users/addresses/${addressId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setDefault: true }),
      })

      if (!response.ok) throw new Error('Đặt mặc định thất bại')
      
      const updatedUser = await response.json()
      if ((updatedUser as any).addresses) {
        setAddresses((updatedUser as any).addresses)
      }
      await checkAuth()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Đặt mặc định thất bại')
    }
  }

  const handleProfileSave = async () => {
    if (!validateProfileForm()) return;
    
    setSaving(true)
    setSaveMessage('')
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Lưu thất bại')
      }

      setSaveMessage('✓ Lưu thành công!')
      // Refresh user data
      await checkAuth()
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      setSaveMessage(error instanceof Error ? error.message : 'Lưu thất bại')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="bg-surface min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-on-surface-muted">Đang tải...</p>
          </div>
        </main>
      </>
    )
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <main className="bg-surface min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-on-surface-muted mb-4">Vui lòng đăng nhập để truy cập trang này</p>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="bg-surface min-h-screen">
        <div className="bg-surface-low">
          <div className="container mx-auto px-8 py-10">
            <h1 className="font-display font-black text-3xl text-[#1a1a2e] tracking-tight">Tài khoản</h1>
          </div>
        </div>

        <div className="container mx-auto px-8 py-10 flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            {/* Avatar */}
            <div className="bg-surface-lowest rounded-btn p-5 mb-4 text-center">
              <div className="w-16 h-16 rounded-full bg-surface-mid mx-auto mb-3 overflow-hidden relative">
                <Image
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
                  alt="Avatar" fill className="object-cover"
                />
              </div>
              <p className="font-display font-bold text-sm text-[#1a1a2e]">{user?.name || 'Người dùng'}</p>
              <p className="text-xs text-on-surface-muted font-body mt-0.5">{user?.email}</p>
              <span className="inline-flex items-center gap-1 mt-2 text-xs font-display font-bold text-primary">
                ⭐ 2.450 điểm
              </span>
            </div>

            <nav className="bg-surface-lowest rounded-btn overflow-hidden">
              {sidebarLinks.map((link, i) => (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 text-left transition-all border-none cursor-pointer font-body text-sm ${
                    activeTab === link.id
                      ? 'bg-primary/5 text-primary font-semibold border-l-2 border-primary'
                      : 'bg-transparent text-on-surface hover:bg-surface-low'
                  } ${i < sidebarLinks.length - 1 ? 'border-b border-surface-mid' : ''}`}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </button>
              ))}
              <button onClick={logout} className="w-full flex items-center gap-3 px-5 py-3.5 text-left border-t border-surface-mid text-sm text-red-500 hover:bg-red-50 transition-colors bg-transparent cursor-pointer font-body">
                <span>🚪</span>
                Đăng xuất
              </button>
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="bg-surface-lowest rounded-btn p-8">
                <h2 className="font-display font-bold text-xl text-[#1a1a2e] mb-6">Hồ sơ cá nhân</h2>
                {saveMessage && (
                  <div className={`mb-6 p-4 rounded-btn text-sm font-display font-semibold ${
                    saveMessage.includes('✓') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {saveMessage}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="section-label mb-2 block">Họ và tên</label>
                    <input 
                      type="text" 
                      name="name"
                      value={profileData.name} 
                      onChange={handleProfileChange}
                      className="input-field" 
                    />
                  </div>
                  <div>
                    <label className="section-label mb-2 block">Email</label>
                    <input type="text" defaultValue={user?.email || ''} disabled className="input-field opacity-60" />
                  </div>
                  <div>
                    <label className="section-label mb-2 block">Số điện thoại</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      placeholder="0901 234 567 hoặc 0901-234-567" 
                      className={`input-field ${errors.phone ? 'border-red-500 bg-red-50' : ''}`}
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-xs font-body mt-1">{errors.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="section-label mb-2 block">Ngày sinh</label>
                    <input 
                      type="date" 
                      name="dateOfBirth"
                      value={profileData.dateOfBirth}
                      onChange={handleProfileChange}
                      className="input-field" 
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="section-label mb-2 block">Giới tính</label>
                    <div className="flex gap-4">
                      {[
                        { label: 'Nữ', value: 'female' },
                        { label: 'Nam', value: 'male' },
                        { label: 'Khác', value: 'other' }
                      ].map(g => (
                        <label key={g.value} className="flex items-center gap-2 cursor-pointer font-body text-sm">
                          <input 
                            type="radio" 
                            name="gender"
                            value={g.value}
                            checked={profileData.gender === g.value}
                            onChange={handleProfileChange}
                            className="accent-primary" 
                          />
                          {g.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-surface-mid">
                  <button 
                    onClick={handleProfileSave}
                    disabled={saving}
                    className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {saving ? '...' : 'Lưu thay đổi'}
                  </button>
                </div>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="bg-surface-lowest rounded-btn overflow-hidden">
                <div className="p-6 border-b border-surface-mid">
                  <h2 className="font-display font-bold text-xl text-[#1a1a2e]">Đơn hàng của tôi</h2>
                </div>
                {ordersLoading ? (
                  <div className="p-8 text-center text-on-surface-muted">Đang tải đơn hàng...</div>
                ) : ordersError ? (
                  <div className="p-8 text-center">
                    <p className="text-red-600 font-body">{ordersError}</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-on-surface-muted font-body">Bạn chưa có đơn hàng nào.</p>
                    <button onClick={() => router.push('/shop')} className="mt-4 btn-primary">
                      Mua sắm ngay
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-surface-mid">
                    {orders.map((order) => (
                      <div key={order._id} className="p-5 hover:bg-surface-low transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-display font-bold text-sm text-[#1a1a2e]">{order.orderNumber}</p>
                            <p className="text-xs text-on-surface-muted font-body mt-0.5">
                              {new Date(order.createdAt).toLocaleDateString('vi-VN')} · {order.items?.length || 0} sản phẩm
                            </p>
                            <p className="text-xs text-on-surface-muted font-body mt-1">
                              {order.userId?.name || order.guestInfo?.fullName || 'Khách lẻ'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-display font-bold text-sm text-[#1a1a2e]">{formatPrice(order.totalAmount)}</p>
                            <div className="mt-1 flex flex-wrap justify-end gap-2">
                              <span className={`inline-flex px-2.5 py-0.5 rounded-sm text-xs font-display font-bold ${orderStatusTone[order.orderStatus] || 'text-on-surface bg-surface-mid'}`}>
                                {orderStatusLabel[order.orderStatus] || order.orderStatus}
                              </span>
                              <span className={`inline-flex px-2.5 py-0.5 rounded-sm text-xs font-display font-bold ${paymentStatusTone[order.paymentStatus] || 'text-on-surface bg-surface-mid'}`}>
                                {paymentStatusLabel[order.paymentStatus] || order.paymentStatus}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3 mt-4">
                          <button
                            type="button"
                            onClick={() => router.push(`/order?orderId=${order._id}`)}
                            className="btn-ghost text-xs"
                          >
                            Xem chi tiết →
                          </button>
                          {order.orderStatus === 'delivered' && (
                            <button className="text-xs font-display font-semibold text-on-surface-muted hover:text-primary transition-colors bg-transparent border-none cursor-pointer">
                              Đặt lại
                            </button>
                          )}
                          {order.orderStatus === 'shipping' && (
                            <button className="text-xs font-display font-semibold text-blue-600 bg-transparent border-none cursor-pointer hover:underline">
                              Theo dõi đơn hàng
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div>
                <div className="bg-surface-lowest rounded-btn p-6 mb-4">
                  <h2 className="font-display font-bold text-xl text-[#1a1a2e]">Sản phẩm yêu thích ({products.length})</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  {products.map(p => (
                    <div key={p.id} className="product-card group relative">
                      <div className="relative mb-4 overflow-hidden bg-surface-low" style={{ aspectRatio: '3/4' }}>
                        <Image src={p.image} alt={p.name} fill className="object-cover" />
                        <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center border-none cursor-pointer hover:bg-red-50">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="#ab2e00" stroke="#ab2e00" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                          </svg>
                        </button>
                      </div>
                      <p className="font-display font-semibold text-sm text-[#1a1a2e] mb-2">{p.name}</p>
                      <p className="font-display font-bold text-sm text-primary mb-3">{formatPrice(p.price)}</p>
                      <button className="w-full py-2.5 bg-[#1a1a2e] text-white text-xs font-display font-bold rounded-btn hover:bg-primary transition-colors border-none cursor-pointer">
                        Thêm vào giỏ hàng
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PASSWORD TAB */}
            {activeTab === 'password' && (
              <div className="bg-surface-lowest rounded-btn p-8">
                <h2 className="font-display font-bold text-xl text-[#1a1a2e] mb-6">Đổi mật khẩu</h2>
                <div className="max-w-md space-y-5">
                  {['Mật khẩu hiện tại', 'Mật khẩu mới', 'Xác nhận mật khẩu mới'].map(label => (
                    <div key={label}>
                      <label className="section-label mb-2 block">{label}</label>
                      <input type="password" className="input-field" placeholder="••••••••" />
                    </div>
                  ))}
                  <button className="btn-primary mt-2">Cập nhật mật khẩu</button>
                </div>
              </div>
            )}

            {/* POINTS TAB */}
            {activeTab === 'points' && (
              <div className="bg-surface-lowest rounded-btn p-8">
                <h2 className="font-display font-bold text-xl text-[#1a1a2e] mb-6">Điểm tích lũy</h2>
                <div className="bg-gradient-to-r from-primary to-primary-container rounded-btn p-6 text-white mb-6">
                  <p className="text-white/70 text-sm font-body mb-1">Điểm hiện có</p>
                  <p className="font-display font-black text-4xl tracking-tight">2.450</p>
                  <p className="text-white/70 text-sm font-body mt-1">= {formatPrice(245000)} giảm giá</p>
                </div>
                <div className="space-y-3">
                  {[
                    { desc: 'Mua hàng #MSN-001234', date: '15/03', pts: '+387', color: 'text-green-600' },
                    { desc: 'Mua hàng #MSN-001198', date: '02/03', pts: '+89', color: 'text-green-600' },
                    { desc: 'Đổi điểm giảm giá', date: '18/02', pts: '-200', color: 'text-red-500' },
                  ].map((tx, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-surface-mid">
                      <div>
                        <p className="font-body text-sm text-on-surface font-medium">{tx.desc}</p>
                        <p className="text-xs text-on-surface-muted font-body">{tx.date}</p>
                      </div>
                      <span className={`font-display font-bold text-sm ${tx.color}`}>{tx.pts}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                {/* Address List */}
                <div className="bg-surface-lowest rounded-btn overflow-hidden">
                  <div className="p-6 border-b border-surface-mid flex items-center justify-between">
                    <h2 className="font-display font-bold text-xl text-[#1a1a2e]">Sổ địa chỉ ({addresses.length})</h2>
                    <button 
                      onClick={() => {
                        setShowAddressForm(true)
                        setEditingAddressId(null)
                        setAddressForm({
                          label: 'Nhà',
                          street: '',
                          ward: '',
                          district: '',
                          city: '',
                          province: '',
                          postalCode: '',
                          isDefault: false,
                        })
                        setAddressErrors({})
                      }}
                      className="btn-primary text-sm"
                    >
                      + Thêm địa chỉ
                    </button>
                  </div>
                  {addresses.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-on-surface-muted font-body">Chưa có địa chỉ nào</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-surface-mid">
                      {addresses.map((addr, idx) => (
                        <div key={addr._id || idx} className="p-6 hover:bg-surface-low transition-colors relative">
                          {addr.isDefault && (
                            <span className="absolute top-3 right-3 px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-display font-bold rounded-sm">
                              Mặc định
                            </span>
                          )}
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1">
                              <p className="font-display font-bold text-sm text-[#1a1a2e] mb-1">{addr.label}</p>
                              <p className="font-body text-sm text-on-surface">
                                {addr.street}
                                {addr.ward && `, ${addr.ward}`}
                              </p>
                              <p className="font-body text-sm text-on-surface-muted">
                                {addr.district}, {addr.city}, {addr.province}
                                {addr.postalCode && ` - ${addr.postalCode}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-3 pt-4 border-t border-surface-mid">
                            <button 
                              onClick={() => handleEditAddress(addr)}
                              className="text-xs font-display font-semibold text-primary hover:text-primary-dark bg-transparent border-none cursor-pointer"
                            >
                              Sửa
                            </button>
                            {!addr.isDefault && (
                              <>
                                <button 
                                  onClick={() => handleSetDefault(addr._id || '')}
                                  className="text-xs font-display font-semibold text-on-surface-muted hover:text-on-surface bg-transparent border-none cursor-pointer"
                                >
                                  Đặt mặc định
                                </button>
                                <button 
                                  onClick={() => handleDeleteAddress(addr._id || '')}
                                  className="text-xs font-display font-semibold text-red-500 hover:text-red-600 ml-auto bg-transparent border-none cursor-pointer"
                                >
                                  Xoá
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Address Form */}
                {showAddressForm && (
                  <div className="bg-surface-lowest rounded-btn p-8">
                    <h3 className="font-display font-bold text-lg text-[#1a1a2e] mb-6">
                      {editingAddressId ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
                    </h3>
                    {addressErrors.submit && (
                      <div className="mb-6 p-4 rounded-btn text-sm font-display font-semibold bg-red-50 text-red-600">
                        {addressErrors.submit}
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-5 mb-6">
                      <div>
                        <label className="section-label mb-2 block">Loại địa chỉ</label>
                        <select 
                          name="label"
                          value={addressForm.label}
                          onChange={handleAddressChange}
                          className="input-field"
                        >
                          <option>Nhà</option>
                          <option>Văn phòng</option>
                          <option>Khác</option>
                        </select>
                      </div>
                      <div>
                        <label className="section-label mb-2 block">Mã bưu chính</label>
                        <input 
                          type="text" 
                          name="postalCode"
                          value={addressForm.postalCode}
                          onChange={handleAddressChange}
                          placeholder="VD: 100000" 
                          className="input-field"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="section-label mb-2 block">Đường phố {addressErrors.street && <span className="text-red-500">*</span>}</label>
                        <input 
                          type="text" 
                          name="street"
                          value={addressForm.street}
                          onChange={handleAddressChange}
                          placeholder="VD: Số 123 Đường Lê Lợi" 
                          className={`input-field ${addressErrors.street ? 'border-red-500 bg-red-50' : ''}`}
                        />
                        {addressErrors.street && (
                          <p className="text-red-600 text-xs font-body mt-1">{addressErrors.street}</p>
                        )}
                      </div>
                      <div>
                        <label className="section-label mb-2 block">Phường/Xã</label>
                        <input 
                          type="text" 
                          name="ward"
                          value={addressForm.ward}
                          onChange={handleAddressChange}
                          placeholder="VD: Phường Bến Thành" 
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="section-label mb-2 block">Quận/Huyện {addressErrors.district && <span className="text-red-500">*</span>}</label>
                        <input 
                          type="text" 
                          name="district"
                          value={addressForm.district}
                          onChange={handleAddressChange}
                          placeholder="VD: Quận 1" 
                          className={`input-field ${addressErrors.district ? 'border-red-500 bg-red-50' : ''}`}
                        />
                        {addressErrors.district && (
                          <p className="text-red-600 text-xs font-body mt-1">{addressErrors.district}</p>
                        )}
                      </div>
                      <div>
                        <label className="section-label mb-2 block">Thành phố {addressErrors.city && <span className="text-red-500">*</span>}</label>
                        <input 
                          type="text" 
                          name="city"
                          value={addressForm.city}
                          onChange={handleAddressChange}
                          placeholder="VD: TP Hồ Chí Minh" 
                          className={`input-field ${addressErrors.city ? 'border-red-500 bg-red-50' : ''}`}
                        />
                        {addressErrors.city && (
                          <p className="text-red-600 text-xs font-body mt-1">{addressErrors.city}</p>
                        )}
                      </div>
                      <div>
                        <label className="section-label mb-2 block">Tỉnh/Thành phố {addressErrors.province && <span className="text-red-500">*</span>}</label>
                        <input 
                          type="text" 
                          name="province"
                          value={addressForm.province}
                          onChange={handleAddressChange}
                          placeholder="VD: TP Hồ Chí Minh" 
                          className={`input-field ${addressErrors.province ? 'border-red-500 bg-red-50' : ''}`}
                        />
                        {addressErrors.province && (
                          <p className="text-red-600 text-xs font-body mt-1">{addressErrors.province}</p>
                        )}
                      </div>
                      <div className="col-span-2">
                        <label className="flex items-center gap-2 cursor-pointer font-body text-sm">
                          <input 
                            type="checkbox" 
                            name="isDefault"
                            checked={addressForm.isDefault}
                            onChange={handleAddressChange}
                            className="accent-primary" 
                          />
                          Đặt làm địa chỉ mặc định
                        </label>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-6 border-t border-surface-mid">
                      <button 
                        onClick={handleAddressSubmit}
                        disabled={addressSaving}
                        className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {addressSaving ? '...' : (editingAddressId ? 'Cập nhật' : 'Thêm')}
                      </button>
                      <button 
                        onClick={() => {
                          setShowAddressForm(false)
                          setEditingAddressId(null)
                          setAddressErrors({})
                        }}
                        className="btn-ghost"
                      >
                        Huỷ
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
