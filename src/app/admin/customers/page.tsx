import Link from 'next/link'
import { AdminLayout, AdminMiniBadge, AdminStatCard } from '@/components/admin/AdminLayout'
import AdminCreateModal from '@/components/admin/AdminCreateModal'
import AdminRowActions from '@/components/admin/AdminRowActions'
import { formatCurrencyVnd, formatDateTime, getAdminUsersData } from '@/lib/admin-data'

export const dynamic = 'force-dynamic'

const roleToneMap: Record<string, 'neutral' | 'accent' | 'success' | 'warning' | 'danger'> = {
  customer: 'neutral',
  admin: 'accent',
}

export default async function AdminCustomersPage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const role = typeof searchParams?.role === 'string' ? searchParams.role : 'all'
  const page = typeof searchParams?.page === 'string' ? Number(searchParams.page) : 1
  const q = typeof searchParams?.q === 'string' ? searchParams.q : ''
  const data = await getAdminUsersData({ role, page, limit: 12, search: q })

  return (
    <AdminLayout
      active="users"
      title="Quản lý user"
      subtitle="Theo dõi khách hàng, quyền truy cập và tổng chi tiêu của từng tài khoản từ model User và Order."
      actions={
        <>
          <AdminCreateModal resource="user" />
          <Link href="/admin" className="rounded-full border border-outline-variant/20 bg-white px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:border-primary/30 hover:text-primary">
            Về dashboard
          </Link>
          <Link href="/admin/orders" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-container">
            Xem đơn hàng
          </Link>
        </>
      }
    >
      <section className="grid gap-4 md:grid-cols-3">
        <AdminStatCard label="Tổng user" value={String(data.pagination.total)} note="Bao gồm customer và admin" tone="accent" />
        <AdminStatCard label="Customer" value={String(data.roleCounts.customer)} note="Người dùng mua hàng" tone="neutral" />
        <AdminStatCard label="Admin" value={String(data.roleCounts.admin)} note="Tài khoản quản trị" tone="success" />
      </section>

      <section className="rounded-[28px] border border-outline-variant/20 bg-surface-lowest p-6 shadow-[0_16px_40px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-display font-bold uppercase tracking-[0.22em] text-on-surface-muted">User management</p>
            <h3 className="mt-1 font-display text-2xl font-black text-on-surface">Danh sách người dùng</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {['all', 'customer', 'admin'].map((item) => (
              <Link
                key={item}
                href={item === 'all' ? '/admin/customers' : `/admin/customers?role=${item}`}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${role === item ? 'bg-primary text-white' : 'border border-outline-variant/20 bg-white text-on-surface hover:border-primary/30 hover:text-primary'}`}
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
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-on-surface-muted">Người dùng</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-on-surface-muted">Liên hệ</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-on-surface-muted">Vai trò</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-on-surface-muted">Đơn hàng</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-on-surface-muted">Chi tiêu</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-on-surface-muted">Đăng nhập gần nhất</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-on-surface-muted">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 bg-white">
              {data.users.map((user: any) => (
                <tr key={String(user._id)} className="hover:bg-surface-low/60">
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-semibold text-on-surface">{user.name}</p>
                      <p className="text-xs text-on-surface-muted">Tham gia: {formatDateTime(user.createdAt)}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm text-on-surface">{user.email}</p>
                      <p className="text-xs text-on-surface-muted">{user.phone || 'Chưa cập nhật'}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4"><AdminMiniBadge tone={roleToneMap[user.role] || 'neutral'}>{user.role}</AdminMiniBadge></td>
                  <td className="px-4 py-4 text-sm text-on-surface">{user.orderCount || 0}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-on-surface">{formatCurrencyVnd(user.spent || 0)}</td>
                  <td className="px-4 py-4 text-sm text-on-surface-muted">{formatDateTime(user.lastLogin)}</td>
                  <td className="px-4 py-4">
                    <AdminRowActions resource="user" id={String(user._id)} item={user} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 text-sm">
          <p className="text-on-surface-muted">Trang {data.pagination.page} / {data.pagination.totalPages} · {data.pagination.total} người dùng</p>
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