'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/app/providers'

const navLinks = [
  { label: 'Trang chủ', href: '/' },
  // { label: 'Cửa hàng', href: '/shop' },
  { label: 'Danh mục', href: '/shop' },
  { label: 'Sale', href: '/shop?filter=sale' },
  { label: 'Blog', href: '#' },
  { label: 'Liên hệ', href: '#' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const userMenuCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  // Fetch cart count for authenticated user
  useEffect(() => {
    const updateCartCount = () => {
      if (isAuthenticated && user?.id) {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
        fetch(`${baseUrl}/api/cart?userId=${user.id}`)
          .then(res => res.json())
          .then(data => {
            const count = data.data?.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0
            setCartCount(count)
          })
          .catch(err => console.error('Failed to fetch cart:', err))
      } else {
        setCartCount(0)
      }
    }

    // Update on mount and when user changes
    updateCartCount()
    window.addEventListener('focus', updateCartCount)
    return () => window.removeEventListener('focus', updateCartCount)
  }, [isAuthenticated, user?.id])

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const cancelUserMenuClose = () => {
    if (userMenuCloseTimer.current) {
      clearTimeout(userMenuCloseTimer.current)
      userMenuCloseTimer.current = null
    }
  }

  const scheduleUserMenuClose = () => {
    cancelUserMenuClose()
    userMenuCloseTimer.current = setTimeout(() => {
      setUserMenuOpen(false)
    }, 160)
  }

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const query = searchQuery.trim()
    setSearchOpen(false)
    if (!query) {
      router.push('/search')
      return
    }
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  const searchHint = useMemo(() => 'Tìm theo tên, mô tả, sku, brand...', [])

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#1a1a2e] text-white text-center py-2 text-xs tracking-wide font-body overflow-hidden">
        <div className="animate-ticker inline-flex whitespace-nowrap gap-16">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="inline-flex gap-16">
              <span>🚚 Miễn phí vận chuyển cho đơn hàng trên 500.000₫</span>
              <span>✦ Đổi trả trong 30 ngày</span>
              <span>📞 Hotline: 1800-1234</span>
              <span>✦ Hàng chính hãng 100%</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main Nav */}
      <header
        className={`sticky top-0 z-50 h-[72px] flex items-center transition-all duration-300 ${
          scrolled ? 'glass-nav shadow-float' : 'bg-surface'
        }`}
      >
        <div className="container mx-auto px-8 flex items-center justify-between w-full">
          {/* Logo */}
          <Link href="/" className="no-underline flex-shrink-0">
            <span className="font-display font-black text-2xl tracking-display text-[#1a1a2e]">
              MAISON<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-9">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
              <Link
                key={link.label}
                href={link.href}
                className={`font-display font-medium text-sm tracking-wide transition-colors duration-200 no-underline ${
                  active
                    ? 'text-primary font-bold'
                    : 'text-on-surface hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            );})}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-5">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden sm:flex bg-transparent border-none cursor-pointer text-on-surface hover:text-primary transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </button>

            {/* Wishlist */}
            <button className="hidden sm:flex bg-transparent border-none cursor-pointer text-on-surface hover:text-primary transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>

            {/* Cart */}
            <Link href="/cart" className="relative bg-transparent border-none cursor-pointer text-on-surface hover:text-primary transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-[18px] h-[18px] bg-primary text-white rounded-full flex items-center justify-center text-[10px] font-bold font-body">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Account / Auth */}
            {isLoading ? (
              <div className="hidden sm:flex w-5 h-5 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
            ) : isAuthenticated ? (
              <div
                className="hidden sm:block relative"
                onMouseEnter={() => {
                  cancelUserMenuClose()
                  setUserMenuOpen(true)
                }}
                onMouseLeave={scheduleUserMenuClose}
                onFocusCapture={() => {
                  cancelUserMenuClose()
                  setUserMenuOpen(true)
                }}
                onBlurCapture={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    scheduleUserMenuClose()
                  }
                }}
              >
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-outline-variant/20 bg-white px-3 py-2 text-left text-on-surface transition-colors hover:border-primary/30 hover:text-primary"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <div className="hidden xl:block leading-tight">
                    <p className="text-sm font-display font-semibold text-on-surface">{user?.name || 'Tài khoản'}</p>
                    <p className="text-[11px] text-on-surface-muted">{user?.role === 'admin' ? 'Admin' : 'Customer'}</p>
                  </div>
                  <svg className={`h-4 w-4 text-on-surface-muted transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="m5 7 5 5 5-5" />
                  </svg>
                </button>

                {userMenuOpen ? (
                  <div
                    className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-[24px] border border-outline-variant/20 bg-white shadow-[0_24px_60px_rgba(0,0,0,0.14)]"
                    onMouseEnter={cancelUserMenuClose}
                    onMouseLeave={scheduleUserMenuClose}
                  >
                    <div className="border-b border-outline-variant/20 bg-surface-low px-4 py-4">
                      <p className="text-sm font-display font-semibold text-on-surface">{user?.name}</p>
                      <p className="mt-1 text-xs text-on-surface-muted">{user?.email}</p>
                    </div>

                    <div className="p-2">
                      <Link
                        href="/account"
                        className="flex items-center gap-3 rounded-[16px] px-3 py-3 text-sm font-medium text-on-surface transition-colors hover:bg-surface-low hover:text-primary"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        </span>
                        <span>
                          <span className="block font-semibold">Profile</span>
                          <span className="block text-xs text-on-surface-muted">Đi tới trang tài khoản</span>
                        </span>
                      </Link>

                      {user?.role === 'admin' ? (
                        <Link
                          href="/admin"
                          className="mt-1 flex items-center gap-3 rounded-[16px] px-3 py-3 text-sm font-medium text-on-surface transition-colors hover:bg-surface-low hover:text-primary"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                              <path d="M12 2 2 7l10 5 10-5-10-5Z" />
                              <path d="M2 17l10 5 10-5" />
                              <path d="M2 12l10 5 10-5" />
                            </svg>
                          </span>
                          <span>
                            <span className="block font-semibold">Admin</span>
                            <span className="block text-xs text-on-surface-muted">Mở bảng quản trị</span>
                          </span>
                        </Link>
                      ) : null}

                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false)
                          logout()
                        }}
                        className="mt-1 flex w-full items-center gap-3 rounded-[16px] px-3 py-3 text-left text-sm font-medium text-error transition-colors hover:bg-error/10"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-error/10 text-error">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M10 17l1 1 5-5" />
                            <path d="M14 7h7" />
                            <path d="M21 7v10" />
                            <path d="M21 17h-7" />
                            <path d="M13 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h8" />
                          </svg>
                        </span>
                        <span>
                          <span className="block font-semibold">Đăng xuất</span>
                          <span className="block text-xs text-on-surface-muted">Thoát khỏi phiên hiện tại</span>
                        </span>
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link href="/login" className="text-sm font-display font-medium text-on-surface hover:text-primary transition-colors no-underline">
                  Đăng nhập
                </Link>
                <Link href="/signup" className="text-sm font-display font-bold text-primary bg-transparent border border-primary px-3 py-1.5 rounded-btn hover:bg-primary hover:text-white transition-colors no-underline">
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden bg-transparent border-none cursor-pointer text-on-surface"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                {mobileOpen
                  ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                  : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
                }
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Search Bar Dropdown */}
      {searchOpen && (
        <div className="sticky top-[72px] z-40 bg-surface-lowest shadow-card px-8 py-4 animate-fade-in">
          <div className="container mx-auto max-w-2xl">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="input-field pr-24 text-base"
                aria-label="Tìm kiếm sản phẩm"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-container"
              >
                Tìm
              </button>
            </form>
            <p className="mt-2 text-xs text-on-surface-muted">{searchHint}</p>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 animate-fade-in">
          <div className="absolute inset-0 bg-[#1a1a2e]/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 right-0 w-72 h-full bg-surface-lowest shadow-float flex flex-col pt-6 px-6">
            <button onClick={() => setMobileOpen(false)} className="self-end mb-6 bg-transparent border-none cursor-pointer text-on-surface">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <nav className="flex flex-col gap-5">
              {navLinks.map((link) => {
                const active = isActive(link.href)
                return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`font-display font-semibold text-lg no-underline ${active ? 'text-primary' : 'text-on-surface'}`}
                >
                  {link.label}
                </Link>
              );
              })}
            </nav>
            <div className="mt-auto pb-8 border-t border-surface-mid pt-6">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
              ) : isAuthenticated ? (
                <div className="space-y-3">
                  <div className="px-3 py-2">
                    <p className="text-sm font-display font-semibold text-on-surface">{user?.name}</p>
                    <p className="text-xs text-on-surface-muted">{user?.email}</p>
                  </div>
                  <Link href="/account" onClick={() => setMobileOpen(false)} className="block w-full text-center btn-primary text-sm py-2.5 no-underline">
                    Tài khoản
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="w-full text-center bg-error/10 text-error font-display font-semibold text-sm py-2.5 rounded-btn cursor-pointer border-none hover:bg-error/20 transition-colors"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="space-y-3 flex gap-4">
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center border border-primary text-primary font-display font-semibold text-sm py-2.5 rounded-btn no-underline hover:bg-primary/10 transition-colors">
                    Đăng nhập
                  </Link>
                  <Link href="/signup" onClick={() => setMobileOpen(false)} className="flex-1 text-center btn-primary text-sm py-2.5 no-underline">
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
