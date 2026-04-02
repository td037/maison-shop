'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import AdminEditModal from '@/components/admin/AdminEditModal'

type ResourceType = 'product' | 'category' | 'user' | 'order'

interface AdminRowActionsProps {
  resource: ResourceType
  id: string
  item: any
}

function buildApiUrl(resource: ResourceType, id: string) {
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

export default function AdminRowActions({ resource, id, item }: AdminRowActionsProps) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  const handleDelete = async () => {
    const confirmText = window.confirm('Xóa bản ghi này? Hành động không thể hoàn tác.')
    if (!confirmText) return

    try {
      setBusy(true)
      const response = await fetch(buildApiUrl(resource, id), { method: 'DELETE' })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Delete failed')
      }
      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Delete failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <AdminEditModal resource={resource} id={id} item={item} />
      <button disabled={busy} onClick={handleDelete} className="rounded-full border border-error/20 px-3 py-1.5 text-xs font-semibold text-error transition-colors hover:bg-error/10 disabled:opacity-50">
        Delete
      </button>
    </div>
  )
}
