'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminModalShell from '@/components/admin/AdminModalShell'
import ProductCreateForm from '@/components/admin/forms/ProductCreateForm'
import CategoryCreateForm from '@/components/admin/forms/CategoryCreateForm'
import UserEditForm from '@/components/admin/forms/UserEditForm'
import OrderEditForm from '@/components/admin/forms/OrderEditForm'

type ResourceType = 'product' | 'category' | 'user' | 'order'

type CategoryOption = { id: string; name: string }

interface AdminEditModalProps {
  resource: ResourceType
  id: string
  item: any
}

function endpointFor(resource: ResourceType, id: string) {
  switch (resource) {
    case 'product':
      return `/api/products/${id}`
    case 'category':
      return `/api/categories/${id}`
    case 'user':
      return `/api/users/${id}`
    case 'order':
      return `/api/orders/${id}`
  }
}

function titleFor(resource: ResourceType) {
  switch (resource) {
    case 'product':
      return 'Chỉnh sửa sản phẩm'
    case 'category':
      return 'Chỉnh sửa danh mục'
    case 'user':
      return 'Chỉnh sửa user'
    case 'order':
      return 'Chỉnh sửa đơn hàng'
  }
}

function descriptionFor(resource: ResourceType) {
  switch (resource) {
    case 'product':
      return 'Cập nhật giá, tồn kho, danh mục và trạng thái sản phẩm.'
    case 'category':
      return 'Sửa tên, slug, mô tả và cấu trúc danh mục.'
    case 'user':
      return 'Cập nhật thông tin tài khoản mà không đụng tới mật khẩu.'
    case 'order':
      return 'Sửa trạng thái, thanh toán và ghi chú xử lý đơn.'
  }
}

function initialState(resource: ResourceType, item: any) {
  switch (resource) {
    case 'product':
      return {
        name: item?.name ?? '',
        sku: item?.sku ?? '',
        price: item?.price != null ? String(item.price) : '',
        salePrice: item?.salePrice != null ? String(item.salePrice) : '',
        category: item?.category?._id ?? item?.category ?? '',
        description: item?.description ?? '',
        totalStock: item?.totalStock != null ? String(item.totalStock) : '0',
        isActive: Boolean(item?.isActive ?? true),
        isFeatured: Boolean(item?.isFeatured ?? false),
        images: Array.isArray(item?.images) ? item.images.map((image: any) => image?.url || image).filter(Boolean) : [],
      }
    case 'category':
      return {
        name: item?.name ?? '',
        slug: item?.slug ?? '',
        description: item?.description ?? '',
        icon: item?.icon ?? '⌬',
        order: item?.order != null ? String(item.order) : '0',
        parentCategory: item?.parentCategory?._id ?? item?.parentCategory ?? '',
        isActive: Boolean(item?.isActive ?? true),
      }
    case 'user':
      return {
        name: item?.name ?? '',
        email: item?.email ?? '',
        phone: item?.phone ?? '',
        role: item?.role ?? 'customer',
      }
    case 'order':
      return {
        orderStatus: item?.orderStatus ?? 'pending',
        paymentStatus: item?.paymentStatus ?? 'pending',
        note: item?.note ?? '',
        internalNotes: item?.internalNotes ?? '',
        trackingJson: item?.tracking ? JSON.stringify(item.tracking, null, 2) : '',
      }
  }
}

export default function AdminEditModal({ resource, id, item }: AdminEditModalProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [form, setForm] = useState<Record<string, any>>(() => initialState(resource, item))

  useEffect(() => {
    if (open) {
      setForm(initialState(resource, item))
      setError(null)
    }
  }, [open, resource, item])

  useEffect(() => {
    if (!open || resource !== 'product') return

    const loadCategories = async () => {
      try {
        const response = await fetch('/api/categories?active=true')
        const data = await response.json()
        if (data?.data) {
          setCategories(
            data.data.map((category: any) => ({
              id: category.id,
              name: category.name,
            }))
          )
        }
      } catch (err) {
        console.error('Failed to load categories:', err)
      }
    }

    loadCategories()
  }, [open, resource])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const headerDescription = useMemo(() => descriptionFor(resource), [resource])

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const closeModal = () => {
    setOpen(false)
    setBusy(false)
    setError(null)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setBusy(true)
    setError(null)

    try {
      let payload: Record<string, any> = {}

      if (resource === 'product') {
        if (!form.name || !form.price || !form.category) {
          throw new Error('Vui lòng nhập tên, giá và danh mục')
        }

        const imageUrls = Array.isArray(form.images) ? form.images.filter(Boolean) : []

        payload = {
          name: String(form.name),
          sku: String(form.sku || ''),
          price: Number(form.price),
          salePrice: form.salePrice ? Number(form.salePrice) : undefined,
          category: String(form.category),
          description: String(form.description || ''),
          totalStock: Number(form.totalStock || 0),
          isActive: Boolean(form.isActive),
          isFeatured: Boolean(form.isFeatured),
          images: imageUrls.map((url: string, index: number) => ({
            url,
            alt: String(form.name || 'Product image'),
            displayOrder: index,
          })),
        }
      }

      if (resource === 'category') {
        if (!form.name || !form.slug) {
          throw new Error('Vui lòng nhập tên và slug danh mục')
        }

        payload = {
          name: String(form.name),
          slug: String(form.slug),
          description: String(form.description || ''),
          icon: String(form.icon || ''),
          order: Number(form.order || 0),
          parentCategory: form.parentCategory ? String(form.parentCategory) : null,
          isActive: Boolean(form.isActive),
        }
      }

      if (resource === 'user') {
        if (!form.name || !form.email) {
          throw new Error('Vui lòng nhập tên và email')
        }

        payload = {
          name: String(form.name),
          email: String(form.email),
          phone: String(form.phone || ''),
          role: String(form.role || 'customer'),
        }
      }

      if (resource === 'order') {
        payload = {
          orderStatus: String(form.orderStatus || 'pending'),
          paymentStatus: String(form.paymentStatus || 'pending'),
          note: String(form.note || ''),
          internalNotes: String(form.internalNotes || ''),
        }

        if (String(form.trackingJson || '').trim()) {
          try {
            payload.tracking = JSON.parse(String(form.trackingJson))
          } catch {
            throw new Error('Tracking JSON không hợp lệ')
          }
        }
      }

      const response = await fetch(endpointFor(resource, id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || `Failed to update ${resource}`)
      }

      closeModal()
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to update ${resource}`)
    } finally {
      setBusy(false)
    }
  }

  const modalForm = () => {
    if (resource === 'product') {
      return <ProductCreateForm form={form} categories={categories} onChange={handleChange} />
    }

    if (resource === 'category') {
      return <CategoryCreateForm form={form} onChange={handleChange} />
    }

    if (resource === 'user') {
      return <UserEditForm form={form} onChange={handleChange} />
    }

    return <OrderEditForm form={form} item={item} onChange={handleChange} />
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-primary/20 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10 disabled:opacity-50"
      >
        Edit
      </button>

      <AdminModalShell
        open={open}
        onClose={closeModal}
        modeLabel="Edit"
        title={titleFor(resource)}
        description={headerDescription}
        primaryNoteLabel="Record"
        primaryNoteValue={String(id).slice(0, 8).toUpperCase()}
        secondaryNoteLabel="Tip"
        secondaryNoteValue="ESC hoặc click nút Đóng để thoát mà không lưu thay đổi."
        formTitle={titleFor(resource)}
      >
        {error ? (
          <div className="mt-5 rounded-[20px] border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            {modalForm()}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-outline-variant/15 pt-5">
            <button type="button" onClick={closeModal} className="rounded-full border border-outline-variant/20 px-5 py-2.5 text-sm font-semibold text-on-surface transition-colors hover:border-primary/30 hover:text-primary">
              Hủy
            </button>
            <button type="submit" disabled={busy} className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60">
              {busy ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </AdminModalShell>
    </>
  )
}