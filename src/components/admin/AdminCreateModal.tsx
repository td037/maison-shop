'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import AdminModalShell from '@/components/admin/AdminModalShell'
import ProductCreateForm from '@/components/admin/forms/ProductCreateForm'
import CategoryCreateForm from '@/components/admin/forms/CategoryCreateForm'
import UserCreateForm from '@/components/admin/forms/UserCreateForm'
import OrderCreateForm from '@/components/admin/forms/OrderCreateForm'

type ResourceType = 'product' | 'category' | 'user' | 'order'

type CategoryOption = { id: string; name: string }

interface AdminCreateModalProps {
  resource: ResourceType
}

function initialState(resource: ResourceType): Record<string, any> {
  switch (resource) {
    case 'product':
      return {
        name: '',
        sku: '',
        price: '',
        salePrice: '',
        category: '',
        description: '',
        totalStock: '0',
        isActive: true,
        isFeatured: false,
        images: [],
      }
    case 'category':
      return {
        name: '',
        slug: '',
        description: '',
        icon: '⌬',
        order: '0',
        parentCategory: '',
        isActive: true,
      }
    case 'user':
      return {
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'customer',
      }
    case 'order':
      return {
        userId: '',
        fullName: '',
        email: '',
        phone: '',
        address: '',
        paymentMethod: 'cod',
        deliveryMethod: 'standard',
        note: '',
        itemsJson: '[{"productId":"","quantity":1}]',
      }
  }
}

function endpointFor(resource: ResourceType) {
  switch (resource) {
    case 'product':
      return '/api/products'
    case 'category':
      return '/api/categories'
    case 'user':
      return '/api/users'
    case 'order':
      return '/api/orders'
  }
}

function resourceLabel(resource: ResourceType) {
  switch (resource) {
    case 'product':
      return 'sản phẩm'
    case 'category':
      return 'danh mục'
    case 'user':
      return 'user'
    case 'order':
      return 'đơn hàng'
  }
}

function titleFor(resource: ResourceType) {
  switch (resource) {
    case 'product':
      return 'Tạo sản phẩm mới'
    case 'category':
      return 'Tạo danh mục mới'
    case 'user':
      return 'Tạo user mới'
    case 'order':
      return 'Tạo đơn hàng mới'
  }
}

function descriptionFor(resource: ResourceType) {
  switch (resource) {
    case 'product':
      return 'Tạo nhanh sản phẩm, gắn danh mục và bật sale ngay trong admin.'
    case 'category':
      return 'Thêm nhóm danh mục mới với icon, slug và thứ tự hiển thị.'
    case 'user':
      return 'Tạo tài khoản customer hoặc admin từ màn quản trị.'
    case 'order':
      return 'Tạo đơn hàng thủ công cho khách lẻ hoặc user đã có sẵn.'
  }
}

function noteLabel(resource: ResourceType) {
  switch (resource) {
    case 'product':
      return 'Quản lý giảm giá'
    case 'category':
      return 'Danh mục'
    case 'user':
      return 'Người dùng'
    case 'order':
      return 'Đơn hàng'
  }
}

export default function AdminCreateModal({ resource }: AdminCreateModalProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [form, setForm] = useState<Record<string, any>>(() => initialState(resource))

  useEffect(() => {
    setForm(initialState(resource))
    setError(null)
  }, [resource])

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

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const closeModal = () => {
    setOpen(false)
    setBusy(false)
    setError(null)
    setForm(initialState(resource))
  }

  const handleSubmit = async (event: FormEvent) => {
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
        if (!form.name || !form.email || !form.password) {
          throw new Error('Vui lòng nhập tên, email và mật khẩu')
        }

        payload = {
          name: String(form.name),
          email: String(form.email),
          password: String(form.password),
          phone: String(form.phone || ''),
          role: String(form.role || 'customer'),
        }
      }

      if (resource === 'order') {
        if (!form.fullName || !form.phone || !form.address || !form.itemsJson) {
          throw new Error('Vui lòng nhập thông tin khách và items JSON')
        }

        let items: any[] = []
        try {
          items = JSON.parse(String(form.itemsJson))
          if (!Array.isArray(items) || items.length === 0) {
            throw new Error('itemsJson phải là một mảng có ít nhất một phần tử')
          }
        } catch {
          throw new Error('itemsJson không hợp lệ')
        }

        payload = {
          sessionId: form.userId ? undefined : `admin-${Date.now()}`,
          userId: form.userId ? String(form.userId) : undefined,
          paymentMethod: String(form.paymentMethod || 'cod'),
          deliveryMethod: String(form.deliveryMethod || 'standard'),
          note: String(form.note || ''),
          customerInfo: {
            fullName: String(form.fullName),
            email: String(form.email || ''),
            phone: String(form.phone),
            address: String(form.address),
          },
          items,
        }
      }

      const response = await fetch(endpointFor(resource), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || `Failed to create ${resourceLabel(resource)}`)
      }

      closeModal()
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to create ${resourceLabel(resource)}`)
    } finally {
      setBusy(false)
    }
  }

  const formComponent = useMemo(() => {
    switch (resource) {
      case 'product':
        return <ProductCreateForm form={form} categories={categories} onChange={handleChange} />
      case 'category':
        return <CategoryCreateForm form={form} onChange={handleChange} />
      case 'user':
        return <UserCreateForm form={form} onChange={handleChange} />
      case 'order':
        return <OrderCreateForm form={form} onChange={handleChange} />
    }
  }, [resource, form, categories])

  return (
    <>
      <button type="button" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-container" onClick={() => setOpen(true)}>
        Thêm mới {resourceLabel(resource)}
      </button>

      <AdminModalShell
        open={open}
        onClose={closeModal}
        modeLabel="Create"
        title={titleFor(resource)}
        description={descriptionFor(resource)}
        primaryNoteLabel="Mode"
        primaryNoteValue="Tạo mới"
        secondaryNoteLabel={noteLabel(resource)}
        secondaryNoteValue="ESC hoặc click nút Đóng để thoát mà không lưu thay đổi."
        formTitle={titleFor(resource)}
      >
        {error ? (
          <div className="mt-5 rounded-[20px] border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto pr-1">{formComponent}</div>

          <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-outline-variant/15 pt-5">
            <button type="button" onClick={closeModal} className="rounded-full border border-outline-variant/20 px-5 py-2.5 text-sm font-semibold text-on-surface transition-colors hover:border-primary/30 hover:text-primary">
              Hủy
            </button>
            <button type="submit" disabled={busy} className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60">
              {busy ? 'Đang lưu...' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </AdminModalShell>
    </>
  )
}