import Link from 'next/link'
import { AdminLayout, AdminMiniBadge, AdminStatCard } from '@/components/admin/AdminLayout'
import AdminCreateModal from '@/components/admin/AdminCreateModal'
import AdminRowActions from '@/components/admin/AdminRowActions'
import { formatCurrencyVnd, getAdminDiscountProductsData } from '@/lib/admin-data'

export const dynamic = 'force-dynamic'

export default async function AdminDiscountProductsPage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const search = typeof searchParams?.q === 'string' ? searchParams.q : ''
  const page = typeof searchParams?.page === 'string' ? Number(searchParams.page) : 1
  const data = await getAdminDiscountProductsData({ search, page, limit: 10 })

  return (
    <AdminLayout
      active="products"
      title="Sản phẩm giảm giá"
      subtitle="Quản lý nhanh các sản phẩm đang sale, theo dõi mức giảm, tồn kho và sản phẩm nổi bật từ model Product."
      actions={
        <>
          <AdminCreateModal resource="product" />
          <Link href="/admin" className="rounded-full border border-outline-variant/20 bg-white px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:border-primary/30 hover:text-primary">
            Về dashboard
          </Link>
          <Link href="/admin/analytics" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-container">
            Xem doanh thu
          </Link>
        </>
      }
    >
      <section className="grid gap-4 md:grid-cols-3">
        <AdminStatCard label="Sản phẩm đang sale" value={String(data.stats.total)} note="Lọc từ salePrice trong model Product" tone="accent" />
        <AdminStatCard label="Sản phẩm nổi bật" value={String(data.stats.featuredCount)} note="Có isFeatured = true" tone="success" />
        <AdminStatCard label="Giảm giá trung bình" value={`${data.stats.averageDiscount}%`} note="Tính theo chênh lệch giá gốc và giá sale" tone="warning" />
      </section>

      <section className="rounded-[28px] border border-outline-variant/20 bg-surface-lowest p-6 shadow-[0_16px_40px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-display font-bold uppercase tracking-[0.22em] text-on-surface-muted">Discount inventory</p>
            <h3 className="mt-1 font-display text-2xl font-black text-on-surface">Danh sách sản phẩm đang giảm giá</h3>
          </div>
          <div className="text-sm text-on-surface-muted">
            Trang {data.pagination.page} / {data.pagination.totalPages} · {data.pagination.total} sản phẩm
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-[22px] border border-outline-variant/20">
          <table className="w-full">
            <thead className="bg-surface-low">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-on-surface-muted">Sản phẩm</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-on-surface-muted">Danh mục</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-on-surface-muted">Giá gốc</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-on-surface-muted">Giá sale</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-on-surface-muted">Giảm</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-on-surface-muted">Tồn kho</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-on-surface-muted">Nhãn</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-on-surface-muted">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 bg-white">
              {data.products.map((product: any) => (
                <tr key={String(product._id)} className="hover:bg-surface-low/60">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 overflow-hidden rounded-[16px] bg-surface-mid">
                        {product.images?.[0]?.url ? <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" /> : null}
                      </div>
                      <div>
                        <p className="font-semibold text-on-surface">{product.name}</p>
                        <p className="text-xs text-on-surface-muted">SKU: {product.sku || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-on-surface-muted">{product.categoryName}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-on-surface line-through">{formatCurrencyVnd(product.price)}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-on-surface">{formatCurrencyVnd(product.salePrice || product.price)}</td>
                  <td className="px-4 py-4"><AdminMiniBadge tone="danger">-{product.discountPercent}%</AdminMiniBadge></td>
                  <td className="px-4 py-4 text-sm text-on-surface">{product.totalStock ?? 0}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      {product.isFeatured ? <AdminMiniBadge tone="accent">Featured</AdminMiniBadge> : null}
                      {product.isNew ? <AdminMiniBadge tone="success">New</AdminMiniBadge> : null}
                      {product.isActive ? <AdminMiniBadge tone="neutral">Active</AdminMiniBadge> : <AdminMiniBadge tone="danger">Hidden</AdminMiniBadge>}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <AdminRowActions resource="product" id={String(product._id)} item={product} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 text-sm">
          <p className="text-on-surface-muted">Hiển thị 10 sản phẩm mỗi trang</p>
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