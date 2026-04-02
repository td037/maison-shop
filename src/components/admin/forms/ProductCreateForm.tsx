'use client'

interface ProductCreateFormProps {
  form: Record<string, any>
  categories: Array<{ id: string; name: string }>
  onChange: (field: string, value: any) => void
}

function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-4">
      <p className="text-[11px] font-display font-bold uppercase tracking-[0.22em] text-on-surface-muted">{title}</p>
      <p className="mt-1 text-sm text-on-surface-muted">{description}</p>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2 text-sm font-semibold text-on-surface">
      <span className="text-[11px] font-display font-bold uppercase tracking-[0.22em] text-on-surface-muted">{label}</span>
      {children}
    </label>
  )
}

function toDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Không thể đọc file ảnh'))
    reader.readAsDataURL(file)
  })
}

export default function ProductCreateForm({ form, categories, onChange }: ProductCreateFormProps) {
  const images = Array.isArray(form.images) ? form.images.filter(Boolean) : []

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    try {
      const nextImages = await Promise.all(files.map((file) => toDataUrl(file)))
      onChange('images', [...images, ...nextImages])
    } finally {
      event.target.value = ''
    }
  }

  const removeImage = (index: number) => {
    onChange('images', images.filter((_: string, imageIndex: number) => imageIndex !== index))
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-outline-variant/20 bg-surface-low p-5">
        <SectionTitle title="Thông tin chính" description="Tên, giá, danh mục và SKU cho sản phẩm mới." />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Tên sản phẩm">
            <input value={String(form.name || '')} onChange={(e) => onChange('name', e.target.value)} className="input-field w-full" placeholder="Áo Blazer Oversize Cao Cấp" />
          </Field>
          <Field label="SKU">
            <input value={String(form.sku || '')} onChange={(e) => onChange('sku', e.target.value)} className="input-field w-full" placeholder="SKU-001" />
          </Field>
          <Field label="Giá gốc">
            <input type="number" value={String(form.price || '')} onChange={(e) => onChange('price', e.target.value)} className="input-field w-full" placeholder="1290000" />
          </Field>
          <Field label="Giá sale">
            <input type="number" value={String(form.salePrice || '')} onChange={(e) => onChange('salePrice', e.target.value)} className="input-field w-full" placeholder="990000" />
          </Field>
          <Field label="Danh mục">
            <select value={String(form.category || '')} onChange={(e) => onChange('category', e.target.value)} className="input-field w-full">
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Tồn kho">
            <input type="number" value={String(form.totalStock || '0')} onChange={(e) => onChange('totalStock', e.target.value)} className="input-field w-full" />
          </Field>
        </div>
      </div>

      <div className="rounded-[24px] border border-outline-variant/20 bg-white p-5">
        <SectionTitle title="Ảnh sản phẩm" description="Tải lên một hoặc nhiều ảnh để hiển thị ở trang sản phẩm và thẻ sản phẩm." />
        <div className="rounded-[20px] border border-dashed border-outline-variant/30 bg-surface-low px-4 py-5">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-3 text-center">
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-on-surface">Kéo thả hoặc bấm để chọn ảnh</p>
              <p className="mt-1 text-xs text-on-surface-muted">PNG, JPG, WEBP. Có thể chọn nhiều ảnh cùng lúc.</p>
            </div>
          </label>
        </div>

        {images.length > 0 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((imageUrl: string, index: number) => (
              <div key={`${imageUrl.slice(0, 24)}-${index}`} className="group relative overflow-hidden rounded-[18px] border border-outline-variant/20 bg-surface-low">
                <div className="relative aspect-[4/5] bg-surface-low">
                  <img src={imageUrl} alt={`Ảnh sản phẩm ${index + 1}`} className="h-full w-full object-cover" />
                </div>
                <div className="flex items-center justify-between gap-3 px-3 py-2">
                  <span className="truncate text-xs text-on-surface-muted">Ảnh {index + 1}</span>
                  <button type="button" onClick={() => removeImage(index)} className="rounded-full border border-outline-variant/20 px-3 py-1 text-xs font-semibold text-on-surface transition-colors hover:border-error/30 hover:text-error">
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-on-surface-muted">Chưa có ảnh nào được tải lên.</p>
        )}
      </div>

      <div className="rounded-[24px] border border-outline-variant/20 bg-white p-5">
        <SectionTitle title="Nội dung" description="Mô tả chi tiết và trạng thái hiển thị trên storefront." />
        <Field label="Mô tả">
          <textarea value={String(form.description || '')} onChange={(e) => onChange('description', e.target.value)} className="input-field min-h-36 w-full" placeholder="Mô tả ngắn gọn về chất liệu, form dáng, màu sắc..." />
        </Field>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <label className="inline-flex items-center gap-2 rounded-full border border-outline-variant/20 px-4 py-2">
            <input type="checkbox" checked={Boolean(form.isActive)} onChange={(e) => onChange('isActive', e.target.checked)} />
            Hiển thị
          </label>
          <label className="inline-flex items-center gap-2 rounded-full border border-outline-variant/20 px-4 py-2">
            <input type="checkbox" checked={Boolean(form.isFeatured)} onChange={(e) => onChange('isFeatured', e.target.checked)} />
            Featured
          </label>
        </div>
      </div>
    </div>
  )
}
