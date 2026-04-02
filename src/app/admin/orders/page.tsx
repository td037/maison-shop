import Link from 'next/link'
import { AdminLayout, AdminMiniBadge, AdminStatCard } from '@/components/admin/AdminLayout'
import AdminCreateModal from '@/components/admin/AdminCreateModal'
import AdminRowActions from '@/components/admin/AdminRowActions'
import { formatCurrencyVnd, formatDateTime, getAdminOrdersData } from '@/lib/admin-data'

export const dynamic = 'force-dynamic'

const statusToneMap: Record<string, 'neutral' | 'accent' | 'success' | 'warning' | 'danger'> = {
  pending: 'warning',
  confirmed: 'accent',
  shipping: 'accent',
  delivered: 'success',
  cancelled: 'danger',
}

export default async function AdminOrdersPage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const status = typeof searchParams?.status === 'string' ? searchParams.status : 'all'
  const page = typeof searchParams?.page === 'string' ? Number(searchParams.page) : 1
  const data = await getAdminOrdersData({ status, page, limit: 10 })

  return (
    <AdminLayout
      active="orders"
      title="Quản lý đơn hàng"
      subtitle="Theo dõi trạng thái đơn, giá trị đơn và lịch sử tạo đơn hàng theo thời gian thực từ model Order."
      actions={
        <>
          <AdminCreateModal resource="order" />
          <Link href="/admin" className="rounded-full border border-outline-variant/20 bg-white px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:border-primary/30 hover:text-primary">
            Về dashboard
          </Link>
          <Link href="/admin/analytics" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-container">
            Thống kê doanh thu
          </Link>
        </>
      }
    >
      <section className="grid gap-4 md:grid-cols-5">
        {data.statusCounts.map((item) => (
          <AdminStatCard key={item.status} label={item.status} value={String(item.count)} note="Đơn hàng theo trạng thái" tone={statusToneMap[item.status] || 'neutral'} />
        ))}
      </section>

      <section className="rounded-[28px] border border-outline-variant/20 bg-surface-lowest p-6 shadow-[0_16px_40px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-display font-bold uppercase tracking-[0.22em] text-on-surface-muted">Order filters</p>
            <h3 className="mt-1 font-display text-2xl font-black text-on-surface">Danh sách đơn hàng</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'confirmed', 'shipping', 'delivered', 'cancelled'].map((item) => (
              <Link
                key={item}
                href={item === 'all' ? '/admin/orders' : `/admin/orders?status=${item}`}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${status === item ? 'bg-primary text-white' : 'border border-outline-variant/20 bg-white text-on-surface hover:border-primary/30 hover:text-primary'}`}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-[22px] border border-outline-variant/20">
          <table className="w-full">
            <thead className="bg-surface-low">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-on-surface-muted">Mã đơn</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-on-surface-muted">Khách hàng</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-on-surface-muted">Sản phẩm</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-on-surface-muted">Tổng tiền</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-on-surface-muted">Thanh toán</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-on-surface-muted">Trạng thái</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-on-surface-muted">Ngày tạo</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-on-surface-muted">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 bg-white">
              {data.orders.map((order: any) => {
                const customer = order.userId?.name || order.guestInfo?.fullName || 'Khách lẻ'
                const paymentTone = order.paymentStatus === 'paid' ? 'success' : order.paymentStatus === 'failed' ? 'danger' : 'warning'
                return (
                  <tr key={String(order._id)} className="hover:bg-surface-low/60">
                    <td className="px-4 py-4 text-sm font-semibold text-on-surface">{order.orderNumber}</td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-semibold text-on-surface">{customer}</p>
                        <p className="text-xs text-on-surface-muted">{order.userId?.email || order.guestInfo?.email || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-on-surface-muted">{order.items?.length || 0} sản phẩm</td>
                    <td className="px-4 py-4 text-sm font-semibold text-on-surface">{formatCurrencyVnd(order.totalAmount)}</td>
                    <td className="px-4 py-4"><AdminMiniBadge tone={paymentTone as any}>{order.paymentStatus}</AdminMiniBadge></td>
                    <td className="px-4 py-4"><AdminMiniBadge tone={statusToneMap[order.orderStatus] || 'neutral'}>{order.orderStatus}</AdminMiniBadge></td>
                    <td className="px-4 py-4 text-sm text-on-surface-muted">{formatDateTime(order.createdAt)}</td>
                    <td className="px-4 py-4">
                      <AdminRowActions resource="order" id={String(order._id)} item={order} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 text-sm">
          <p className="text-on-surface-muted">Trang {data.pagination.page} / {data.pagination.totalPages} · {data.pagination.total} đơn hàng</p>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-outline-variant/20 bg-surface-low px-3 py-1.5 text-on-surface-muted">←</span>
            <span className="rounded-full bg-primary px-3 py-1.5 font-semibold text-white">{data.pagination.page}</span>
            <span className="rounded-full border border-outline-variant/20 bg-surface-low px-3 py-1.5 text-on-surface-muted">→</span>
          </div>
        </div>
      </section>
    </AdminLayout>
  )
}
