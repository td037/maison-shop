'use client'

interface OrderCreateFormProps {
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

export default function OrderCreateForm({ form, onChange }: OrderCreateFormProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-outline-variant/20 bg-surface-low p-5">
        <SectionTitle title="Khách hàng" description="Tạo đơn thủ công cho khách lẻ hoặc gắn vào user có sẵn." />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="User ID (tùy chọn)">
            <input value={String(form.userId || '')} onChange={(e) => onChange('userId', e.target.value)} className="input-field w-full" placeholder="Để trống nếu là guest" />
          </Field>
          <Field label="Payment method">
            <select value={String(form.paymentMethod || 'cod')} onChange={(e) => onChange('paymentMethod', e.target.value)} className="input-field w-full">
              <option value="cod">cod</option>
              <option value="bank_transfer">bank_transfer</option>
              <option value="momo">momo</option>
              <option value="zalopay">zalopay</option>
              <option value="card">card</option>
            </select>
          </Field>
          <Field label="Delivery method">
            <select value={String(form.deliveryMethod || 'standard')} onChange={(e) => onChange('deliveryMethod', e.target.value)} className="input-field w-full">
              <option value="standard">standard</option>
              <option value="express">express</option>
            </select>
          </Field>
          <Field label="Full name">
            <input value={String(form.fullName || '')} onChange={(e) => onChange('fullName', e.target.value)} className="input-field w-full" placeholder="Nguyễn Văn A" />
          </Field>
          <Field label="Email">
            <input type="email" value={String(form.email || '')} onChange={(e) => onChange('email', e.target.value)} className="input-field w-full" placeholder="customer@example.com" />
          </Field>
          <Field label="Phone">
            <input value={String(form.phone || '')} onChange={(e) => onChange('phone', e.target.value)} className="input-field w-full" placeholder="0912345678" />
          </Field>
        </div>
      </div>

      <div className="rounded-[24px] border border-outline-variant/20 bg-white p-5">
        <SectionTitle title="Địa chỉ & items" description="Dán JSON items trực tiếp để tạo đơn nhanh từ admin." />
        <Field label="Address">
          <input value={String(form.address || '')} onChange={(e) => onChange('address', e.target.value)} className="input-field w-full" placeholder="Số nhà, phường, quận, thành phố" />
        </Field>
        <Field label="Items JSON">
          <textarea value={String(form.itemsJson || '')} onChange={(e) => onChange('itemsJson', e.target.value)} className="input-field min-h-40 w-full font-mono text-sm" />
        </Field>
        <Field label="Note">
          <textarea value={String(form.note || '')} onChange={(e) => onChange('note', e.target.value)} className="input-field min-h-24 w-full" placeholder="Ghi chú riêng cho đơn hàng" />
        </Field>
      </div>
    </div>
  )
}
