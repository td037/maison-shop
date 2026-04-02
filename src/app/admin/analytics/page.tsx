import Link from 'next/link'
import { AdminLayout, AdminMiniBadge, AdminStatCard } from '@/components/admin/AdminLayout'
import { formatCurrencyVnd, getAdminAnalyticsData } from '@/lib/admin-data'

export const dynamic = 'force-dynamic'

const statusToneMap: Record<string, 'neutral' | 'accent' | 'success' | 'warning' | 'danger'> = {
  pending: 'warning',
  confirmed: 'accent',
  shipping: 'accent',
  delivered: 'success',
  cancelled: 'danger',
}

export default async function AdminAnalyticsPage() {
  const data = await getAdminAnalyticsData()
  const revenueMax = Math.max(...data.revenueSeries.map((item) => item.revenue), 1)
  const topRevenueDay = data.revenueSeries.reduce((best, item) => (item.revenue > best.revenue ? item : best), data.revenueSeries[0] || { date: '--', revenue: 0, orders: 0 })

  return (
    <AdminLayout
      active="analytics"
      title="Thống kê doanh thu"
      subtitle="Tổng hợp doanh thu, số đơn đã thanh toán và đường xu hướng 30 ngày gần nhất từ model Order."
      actions={
        <>
          <Link href="/admin" className="rounded-full border border-outline-variant/20 bg-white px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:border-primary/30 hover:text-primary">
            Về dashboard
          </Link>
          <Link href="/admin/orders" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-container">
            Quản lý đơn
          </Link>
        </>
      }
    >
      <section className="grid gap-4 md:grid-cols-4">
        <AdminStatCard label="Tổng doanh thu" value={formatCurrencyVnd(data.totalRevenue)} note="Chỉ tính đơn đã thanh toán" tone="success" />
        <AdminStatCard label="Đơn đã thanh toán" value={String(data.paidOrdersCount)} note="Nguồn từ paymentStatus = paid" tone="accent" />
        <AdminStatCard label="Tỷ lệ chuyển đổi" value={`${data.conversionRate}%`} note="Paid orders / total orders" tone="warning" />
        <AdminStatCard label="Đơn huỷ" value={String(data.cancelledCount)} note="Đơn có orderStatus = cancelled" tone="danger" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-[28px] border border-outline-variant/20 bg-surface-lowest p-6 shadow-[0_16px_40px_rgba(0,0,0,0.04)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-display font-bold uppercase tracking-[0.22em] text-on-surface-muted">Revenue trend</p>
              <h3 className="mt-1 font-display text-2xl font-black text-on-surface">Biểu đồ doanh thu 30 ngày</h3>
            </div>
            <AdminMiniBadge tone="success">Top day {topRevenueDay.date}</AdminMiniBadge>
          </div>

          <div className="mt-6 space-y-3">
            {data.revenueSeries.map((point) => {
              const width = Math.max((point.revenue / revenueMax) * 100, 3)
              return (
                <div key={point.date} className="grid grid-cols-[72px_1fr_92px] items-center gap-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-muted">{point.date}</span>
                  <div className="h-3 overflow-hidden rounded-full bg-surface-mid">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary via-[#cf4519] to-[#6d1c00]" style={{ width: `${width}%` }} />
                  </div>
                  <div className="text-right text-sm font-semibold text-on-surface">{formatCurrencyVnd(point.revenue)}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-outline-variant/20 bg-[#11111f] p-6 text-white shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
            <p className="text-[11px] font-display font-bold uppercase tracking-[0.22em] text-white/45">Order health</p>
            <h3 className="mt-1 font-display text-2xl font-black">Trạng thái đơn hàng</h3>
            <div className="mt-6 space-y-3">
              {data.ordersByStatus.map((item) => (
                <div key={item.status} className="flex items-center justify-between rounded-[18px] bg-white/6 px-4 py-3">
                  <AdminMiniBadge tone={statusToneMap[item.status] || 'neutral'}>{item.status}</AdminMiniBadge>
                  <span className="text-sm font-semibold text-white">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-outline-variant/20 bg-surface-lowest p-6 shadow-[0_16px_40px_rgba(0,0,0,0.04)]">
            <p className="text-[11px] font-display font-bold uppercase tracking-[0.22em] text-on-surface-muted">Snapshot</p>
            <div className="mt-4 space-y-4 text-sm">
              <div className="flex items-center justify-between rounded-[18px] bg-surface-low px-4 py-3">
                <span className="text-on-surface-muted">Orders tracked</span>
                <span className="font-semibold text-on-surface">{data.orderCount}</span>
              </div>
              <div className="flex items-center justify-between rounded-[18px] bg-surface-low px-4 py-3">
                <span className="text-on-surface-muted">Top revenue day</span>
                <span className="font-semibold text-on-surface">{formatCurrencyVnd(topRevenueDay.revenue)}</span>
              </div>
              <div className="flex items-center justify-between rounded-[18px] bg-surface-low px-4 py-3">
                <span className="text-on-surface-muted">Orders/day avg</span>
                <span className="font-semibold text-on-surface">{(data.orderCount / 30).toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  )
}
