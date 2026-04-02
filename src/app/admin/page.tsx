import Link from 'next/link'
import { AdminLayout, AdminMiniBadge, AdminStatCard } from '@/components/admin/AdminLayout'
import { formatCurrencyVnd, getAdminDashboardData } from '@/lib/admin-data'

export const dynamic = 'force-dynamic'

const statusToneMap: Record<string, 'neutral' | 'accent' | 'success' | 'warning' | 'danger'> = {
  pending: 'warning',
  confirmed: 'accent',
  shipping: 'accent',
  delivered: 'success',
  cancelled: 'danger',
}

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData()
  const revenueMax = Math.max(...data.revenueSeries.map((item) => item.revenue), 1)

  return (
    <AdminLayout
      active="dashboard"
      title="Bảng điều khiển"
      subtitle="Tổng quan doanh thu, đơn hàng, sản phẩm và người dùng được tổng hợp trực tiếp từ model hiện có."
      actions={
        <>
          <Link href="/admin/analytics" className="rounded-full border border-outline-variant/20 bg-white px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:border-primary/30 hover:text-primary">
            Xem thống kê
          </Link>
          <Link href="/admin/orders" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-container">
            Đơn hàng gần đây
          </Link>
        </>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <AdminStatCard label="Người dùng" value={String(data.summary.users.total)} note={`${data.summary.users.customers} khách hàng, ${data.summary.users.admins} admin`} tone="neutral" />
        <AdminStatCard label="Sản phẩm" value={String(data.summary.products.total)} note={`${data.summary.products.active} đang hoạt động`} tone="neutral" />
        <AdminStatCard label="Giảm giá" value={String(data.summary.products.discounted)} note={`${data.summary.products.lowStock} sản phẩm sắp hết hàng`} tone="warning" />
        <AdminStatCard label="Đơn hàng" value={String(data.summary.orders.total)} note={`${data.summary.orders.pending} chờ xử lý`} tone="accent" />
        <AdminStatCard label="Doanh thu" value={formatCurrencyVnd(data.summary.revenue.paid)} note={`Giá trị đơn trung bình ${formatCurrencyVnd(data.summary.revenue.averageOrderValue)}`} tone="success" />
        <AdminStatCard label="Danh mục" value={String(data.summary.categories.total)} note="Được sắp xếp theo thứ tự quản trị" tone="neutral" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <div className="rounded-[28px] border border-outline-variant/20 bg-surface-lowest p-6 shadow-[0_16px_40px_rgba(0,0,0,0.04)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-display font-bold uppercase tracking-[0.22em] text-on-surface-muted">Revenue trend</p>
              <h3 className="mt-1 font-display text-2xl font-black text-on-surface">Doanh thu 14 ngày gần nhất</h3>
            </div>
            <AdminMiniBadge tone="success">{formatCurrencyVnd(data.summary.revenue.paid)}</AdminMiniBadge>
          </div>

          <div className="mt-6 space-y-3">
            {data.revenueSeries.map((point) => {
              const width = Math.max((point.revenue / revenueMax) * 100, 4)
              return (
                <div key={point.date} className="grid grid-cols-[72px_1fr_96px] items-center gap-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-muted">{point.date}</span>
                  <div className="h-3 overflow-hidden rounded-full bg-surface-mid">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-[#cf4519]" style={{ width: `${width}%` }} />
                  </div>
                  <div className="text-right text-sm font-semibold text-on-surface">{formatCurrencyVnd(point.revenue)}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-outline-variant/20 bg-[#11111f] p-6 text-white shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
            <p className="text-[11px] font-display font-bold uppercase tracking-[0.22em] text-white/45">Order status</p>
            <h3 className="mt-1 font-display text-2xl font-black">Phân bổ đơn hàng</h3>
            <div className="mt-6 space-y-3">
              {data.statusCounts.map((item) => (
                <div key={item.status} className="flex items-center justify-between rounded-[18px] bg-white/6 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <AdminMiniBadge tone={statusToneMap[item.status] || 'neutral'}>{item.status}</AdminMiniBadge>
                  </div>
                  <span className="text-sm font-semibold text-white">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-outline-variant/20 bg-surface-lowest p-6 shadow-[0_16px_40px_rgba(0,0,0,0.04)]">
            <p className="text-[11px] font-display font-bold uppercase tracking-[0.22em] text-on-surface-muted">Quick links</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm font-semibold">
              <Link href="/admin/customers" className="rounded-[18px] border border-outline-variant/20 bg-surface-low px-4 py-4 transition-colors hover:border-primary/30 hover:text-primary">Quản lý user</Link>
              <Link href="/admin/products" className="rounded-[18px] border border-outline-variant/20 bg-surface-low px-4 py-4 transition-colors hover:border-primary/30 hover:text-primary">Sản phẩm giảm giá</Link>
              <Link href="/admin/orders" className="rounded-[18px] border border-outline-variant/20 bg-surface-low px-4 py-4 transition-colors hover:border-primary/30 hover:text-primary">Đơn hàng</Link>
              <Link href="/admin/categories" className="rounded-[18px] border border-outline-variant/20 bg-surface-low px-4 py-4 transition-colors hover:border-primary/30 hover:text-primary">Danh mục</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <div className="rounded-[28px] border border-outline-variant/20 bg-surface-lowest p-6 shadow-[0_16px_40px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-display font-bold uppercase tracking-[0.22em] text-on-surface-muted">Recent orders</p>
              <h3 className="mt-1 font-display text-2xl font-black text-on-surface">Đơn hàng mới nhất</h3>
            </div>
            <Link href="/admin/orders" className="text-sm font-semibold text-primary hover:underline">Xem tất cả</Link>
          </div>

          <div className="mt-5 overflow-hidden rounded-[22px] border border-outline-variant/20">
            <table className="w-full">
              <thead className="bg-surface-low">
                <tr>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-on-surface-muted">Mã đơn</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-on-surface-muted">Khách hàng</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-on-surface-muted">Tổng</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-on-surface-muted">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 bg-white">
                {data.recentOrders.map((order: any) => {
                  const customer = order.userId?.name || order.guestInfo?.fullName || 'Khách lẻ'
                  return (
                    <tr key={String(order._id)} className="hover:bg-surface-low/60">
                      <td className="px-4 py-4 text-sm font-semibold text-on-surface">{order.orderNumber}</td>
                      <td className="px-4 py-4 text-sm text-on-surface-muted">{customer}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-on-surface">{formatCurrencyVnd(order.totalAmount)}</td>
                      <td className="px-4 py-4"><AdminMiniBadge tone={statusToneMap[order.orderStatus] || 'neutral'}>{order.orderStatus}</AdminMiniBadge></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-[28px] border border-outline-variant/20 bg-surface-lowest p-6 shadow-[0_16px_40px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-display font-bold uppercase tracking-[0.22em] text-on-surface-muted">Featured products</p>
              <h3 className="mt-1 font-display text-2xl font-black text-on-surface">Sản phẩm nổi bật</h3>
            </div>
            <Link href="/admin/products" className="text-sm font-semibold text-primary hover:underline">Quản lý giảm giá</Link>
          </div>

          <div className="mt-5 space-y-4">
            {data.topProducts.map((product: any) => (
              <div key={String(product._id)} className="flex items-center gap-4 rounded-[20px] border border-outline-variant/20 bg-surface-low px-4 py-4">
                <div className="h-14 w-14 overflow-hidden rounded-[16px] bg-surface-mid">
                  {product.images?.[0]?.url ? (
                    <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-on-surface">{product.name}</p>
                  <p className="text-xs text-on-surface-muted">{product.category?.name || 'Chưa phân loại'}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-on-surface">{formatCurrencyVnd(product.salePrice || product.price)}</p>
                  {product.salePrice ? <p className="text-xs text-primary">Giảm {Math.round(((product.price - product.salePrice) / product.price) * 100)}%</p> : <p className="text-xs text-on-surface-muted">Giá gốc</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AdminLayout>
  )
}
