import Link from 'next/link'
import { AdminLayout, AdminMiniBadge, AdminStatCard } from '@/components/admin/AdminLayout'
import AdminCreateModal from '@/components/admin/AdminCreateModal'
import AdminRowActions from '@/components/admin/AdminRowActions'
import { getAdminCategoriesData } from '@/lib/admin-data'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  const data = await getAdminCategoriesData()
  const featured = data.stats.categoryWithMostProducts

  return (
    <AdminLayout
      active="categories"
      title="Quản lý danh mục"
      subtitle="Theo dõi danh mục gốc, số sản phẩm đang gắn và số danh mục con từ model Category và Product."
      actions={
        <>
          <AdminCreateModal resource="category" />
          <Link href="/admin" className="rounded-full border border-outline-variant/20 bg-white px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:border-primary/30 hover:text-primary">
            Về dashboard
          </Link>
          <Link href="/admin/products" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-container">
            Sản phẩm giảm giá
          </Link>
        </>
      }
    >
      <section className="grid gap-4 md:grid-cols-3">
        <AdminStatCard label="Tổng danh mục" value={String(data.stats.totalCategories)} note="Chỉ tính danh mục gốc" tone="accent" />
        <AdminStatCard label="Sản phẩm active" value={String(data.stats.activeProductsCount)} note="Đang hiển thị trong storefront" tone="success" />
        <AdminStatCard label="Nhiều sản phẩm nhất" value={featured ? String(featured.productCount) : '0'} note={featured ? featured.name : 'Chưa có dữ liệu'} tone="warning" />
      </section>

      <section className="rounded-[28px] border border-outline-variant/20 bg-surface-lowest p-6 shadow-[0_16px_40px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-display font-bold uppercase tracking-[0.22em] text-on-surface-muted">Category manager</p>
            <h3 className="mt-1 font-display text-2xl font-black text-on-surface">Danh sách danh mục</h3>
          </div>
          <AdminMiniBadge tone="accent">{data.stats.totalCategories} categories</AdminMiniBadge>
        </div>

        <div className="mt-5 overflow-hidden rounded-[22px] border border-outline-variant/20">
          <table className="w-full">
            <thead className="bg-surface-low">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-on-surface-muted">Danh mục</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-on-surface-muted">Slug</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-on-surface-muted">Sản phẩm</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-on-surface-muted">Danh mục con</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-on-surface-muted">Trạng thái</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-on-surface-muted">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 bg-white">
              {data.categories.map((category: any) => (
                <tr key={String(category._id)} className="hover:bg-surface-low/60">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-surface-low text-xl">
                        {category.icon || '⌬'}
                      </div>
                      <div>
                        <p className="font-semibold text-on-surface">{category.name}</p>
                        <p className="text-xs text-on-surface-muted">{category.description || 'Không có mô tả'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-on-surface-muted">{category.slug}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-on-surface">{category.productCount || 0}</td>
                  <td className="px-4 py-4 text-sm text-on-surface">{category.subcategoryCount || 0}</td>
                  <td className="px-4 py-4">
                    {category.isActive ? <AdminMiniBadge tone="success">Active</AdminMiniBadge> : <AdminMiniBadge tone="danger">Hidden</AdminMiniBadge>}
                  </td>
                  <td className="px-4 py-4">
                    <AdminRowActions resource="category" id={String(category._id)} item={category} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  )
}