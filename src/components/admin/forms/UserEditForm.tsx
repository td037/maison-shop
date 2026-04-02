'use client'

interface UserEditFormProps {
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

export default function UserEditForm({ form, onChange }: UserEditFormProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-outline-variant/20 bg-surface-low p-5">
        <SectionTitle title="Thông tin tài khoản" description="Chỉnh sửa tên, email, số điện thoại và vai trò." />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Tên">
            <input value={String(form.name || '')} onChange={(e) => onChange('name', e.target.value)} className="input-field w-full" placeholder="Nguyễn Văn A" />
          </Field>
          <Field label="Email">
            <input type="email" value={String(form.email || '')} onChange={(e) => onChange('email', e.target.value)} className="input-field w-full" placeholder="user@example.com" />
          </Field>
          <Field label="Số điện thoại">
            <input value={String(form.phone || '')} onChange={(e) => onChange('phone', e.target.value)} className="input-field w-full" placeholder="0912345678" />
          </Field>
          <Field label="Vai trò">
            <select value={String(form.role || 'customer')} onChange={(e) => onChange('role', e.target.value)} className="input-field w-full">
              <option value="customer">customer</option>
              <option value="admin">admin</option>
            </select>
          </Field>
        </div>
      </div>
    </div>
  )
}