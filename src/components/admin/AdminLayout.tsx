import Link from 'next/link'
import type { ReactNode } from 'react'

export type AdminSection = 'dashboard' | 'users' | 'products' | 'orders' | 'categories' | 'analytics'

const navItems: Array<{ label: string; href: string; icon: string; section: AdminSection }> = [
  { label: 'Dashboard', href: '/admin', icon: '◌', section: 'dashboard' },
  { label: 'Quản lý user', href: '/admin/customers', icon: '⎯', section: 'users' },
  { label: 'Sản phẩm giảm giá', href: '/admin/products', icon: '✦', section: 'products' },
  { label: 'Quản lý đơn hàng', href: '/admin/orders', icon: '▣', section: 'orders' },
  { label: 'Quản lý danh mục', href: '/admin/categories', icon: '⌬', section: 'categories' },
  { label: 'Thống kê doanh thu', href: '/admin/analytics', icon: '↗', section: 'analytics' },
]

interface AdminLayoutProps {
  active: AdminSection
  title: string
  subtitle: string
  children: ReactNode
  actions?: ReactNode
}

interface AdminStatCardProps {
  label: string
  value: string
  note?: string
  tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger'
}

function toneClasses(tone: NonNullable<AdminStatCardProps['tone']>) {
  switch (tone) {
    case 'accent':
      return 'border-primary/20 bg-primary/10 text-primary'
    case 'success':
      return 'border-emerald-500/20 bg-emerald-500/8 text-emerald-700'
    case 'warning':
      return 'border-amber-500/20 bg-amber-500/8 text-amber-700'
    case 'danger':
      return 'border-error/20 bg-error/10 text-error'
    default:
      return 'border-outline-variant/20 bg-surface-lowest text-on-surface'
  }
}

export function AdminStatCard({ label, value, note, tone = 'neutral' }: AdminStatCardProps) {
  return (
    <div className={`rounded-[24px] border p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] ${toneClasses(tone)}`}>
      <p className="text-[11px] font-display font-bold uppercase tracking-[0.22em] text-on-surface-muted">{label}</p>
      <p className="mt-3 text-3xl font-display font-black tracking-tight text-on-surface">{value}</p>
      {note ? <p className="mt-2 text-sm font-body text-on-surface-muted">{note}</p> : null}
    </div>
  )
}

export function AdminMiniBadge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger' }) {
  const classes =
    tone === 'accent'
      ? 'bg-primary/10 text-primary'
      : tone === 'success'
      ? 'bg-emerald-500/10 text-emerald-700'
      : tone === 'warning'
      ? 'bg-amber-500/10 text-amber-700'
      : tone === 'danger'
      ? 'bg-error/10 text-error'
      : 'bg-surface-mid text-on-surface-muted'

  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-display font-bold uppercase tracking-[0.18em] ${classes}`}>{children}</span>
}

export function AdminLayout({ active, title, subtitle, children, actions }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(171,46,0,0.08),transparent_28%),linear-gradient(180deg,#fbf7f5_0%,#f7f3ef_100%)] text-on-surface">
      <div className="flex min-h-screen">
        <aside className="hidden w-[19rem] flex-col border-r border-outline-variant/30 bg-[#11111f] text-white lg:flex">
          <div className="border-b border-white/10 px-7 py-7">
            <p className="text-[11px] font-display font-bold uppercase tracking-[0.3em] text-white/55">Admin Portal</p>
            <h1 className="mt-2 font-display text-2xl font-black tracking-tight">MAISON<span className="text-primary">.</span></h1>
            <p className="mt-2 text-sm text-white/55">Quản trị cửa hàng thời trang</p>
          </div>

          <nav className="flex-1 space-y-2 px-4 py-6">
            {navItems.map((item) => {
              const isActive = item.section === active
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-[18px] px-4 py-3.5 text-sm font-body transition-all ${
                    isActive
                      ? 'bg-white text-[#11111f] shadow-[0_10px_25px_rgba(255,255,255,0.08)]'
                      : 'text-white/75 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${isActive ? 'bg-[#11111f] text-white' : 'bg-white/8 text-white/80'}`}>{item.icon}</span>
                  <span className="font-semibold">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-white/10 px-4 py-5">
            <div className="rounded-[20px] border border-white/10 bg-white/6 px-4 py-4">
              <p className="text-xs font-display font-bold uppercase tracking-[0.22em] text-white/45">Workspace</p>
              <p className="mt-2 text-sm font-semibold text-white">Bảng điều khiển nội bộ</p>
              <p className="mt-1 text-xs text-white/55">Dữ liệu lấy từ model và API hiện có</p>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-outline-variant/20 bg-white/78 backdrop-blur-xl">
            <div className="flex flex-col gap-4 px-5 py-5 md:px-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[11px] font-display font-bold uppercase tracking-[0.24em] text-on-surface-muted">Admin</p>
                <h2 className="mt-1 font-display text-3xl font-black tracking-tight text-on-surface">{title}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-muted">{subtitle}</p>
              </div>
              {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
            </div>
          </header>

          <main className="flex-1 px-5 py-6 md:px-8 md:py-8">
            <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}
