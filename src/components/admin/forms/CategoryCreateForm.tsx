'use client'

interface CategoryCreateFormProps {
  form: Record<string, any>
  onChange: (field: string, value: string | boolean) => void
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

export default function CategoryCreateForm({ form, onChange }: CategoryCreateFormProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-outline-variant/20 bg-surface-low p-5">
        <SectionTitle title="Danh mục" description="Đặt tên, slug và thứ tự hiển thị cho danh mục mới." />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Tên danh mục">
            <input value={String(form.name || '')} onChange={(e) => onChange('name', e.target.value)} className="input-field w-full" placeholder="Áo" />
          </Field>
          <Field label="Slug">
            <input value={String(form.slug || '')} onChange={(e) => onChange('slug', e.target.value)} className="input-field w-full" placeholder="ao" />
          </Field>
          <Field label="Icon">
            <input value={String(form.icon || '')} onChange={(e) => onChange('icon', e.target.value)} className="input-field w-full" placeholder="⌬" />
          </Field>
          <Field label="Thứ tự">
            <input type="number" value={String(form.order || '0')} onChange={(e) => onChange('order', e.target.value)} className="input-field w-full" />
          </Field>
        </div>
      </div>

      <div className="rounded-[24px] border border-outline-variant/20 bg-white p-5">
        <SectionTitle title="Mô tả & phân cấp" description="Thêm mô tả, danh mục cha và trạng thái hiển thị." />
        <Field label="Mô tả">
          <textarea value={String(form.description || '')} onChange={(e) => onChange('description', e.target.value)} className="input-field min-h-36 w-full" placeholder="Mô tả ngắn cho danh mục..." />
        </Field>
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto]">
          <Field label="Danh mục cha (tùy chọn)">
            <input value={String(form.parentCategory || '')} onChange={(e) => onChange('parentCategory', e.target.value)} className="input-field w-full" placeholder="ObjectId danh mục cha" />
          </Field>
          <label className="mt-7 inline-flex items-center gap-2 rounded-full border border-outline-variant/20 px-4 py-2 text-sm">
            <input type="checkbox" checked={Boolean(form.isActive)} onChange={(e) => onChange('isActive', e.target.checked)} />
            Hiển thị
          </label>
        </div>
      </div>
    </div>
  )
}
