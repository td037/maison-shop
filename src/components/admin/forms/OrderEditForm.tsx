'use client'

interface OrderEditFormProps {
  form: Record<string, any>
  onChange: (field: string, value: string) => void
  item: any
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

export default function OrderEditForm({ form, onChange, item }: OrderEditFormProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-outline-variant/20 bg-surface-low p-5">
        <SectionTitle title="Đơn hàng" description="Cập nhật trạng thái xử lý, thanh toán và ghi chú." />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Mã đơn">
            <input value={String(item.orderNumber || '')} disabled className="input-field w-full opacity-70" />
          </Field>
          <Field label="Khách hàng">
            <input value={String(item.userId?.name || item.guestInfo?.fullName || 'Khách lẻ')} disabled className="input-field w-full opacity-70" />
          </Field>
          <Field label="Trạng thái đơn">
            <select value={String(form.orderStatus || 'pending')} onChange={(e) => onChange('orderStatus', e.target.value)} className="input-field w-full">
              <option value="pending">pending</option>
              <option value="confirmed">confirmed</option>
              <option value="preparing">preparing</option>
              <option value="shipping">shipping</option>
              <option value="delivered">delivered</option>
              <option value="cancelled">cancelled</option>
            </select>
          </Field>
          <Field label="Thanh toán">
            <select value={String(form.paymentStatus || 'pending')} onChange={(e) => onChange('paymentStatus', e.target.value)} className="input-field w-full">
              <option value="pending">pending</option>
              <option value="paid">paid</option>
              <option value="failed">failed</option>
              <option value="refunded">refunded</option>
            </select>
          </Field>
        </div>
      </div>

      <div className="rounded-[24px] border border-outline-variant/20 bg-white p-5">
        <SectionTitle title="Ghi chú & vận chuyển" description="Cập nhật note nội bộ và tracking dạng JSON." />
        <Field label="Note">
          <textarea value={String(form.note || '')} onChange={(e) => onChange('note', e.target.value)} className="input-field min-h-28 w-full" placeholder="Ghi chú cho đơn hàng" />
        </Field>
        <Field label="Internal notes">
          <textarea value={String(form.internalNotes || '')} onChange={(e) => onChange('internalNotes', e.target.value)} className="input-field min-h-28 w-full" placeholder="Ghi chú nội bộ cho admin" />
        </Field>
        <Field label="Tracking JSON">
          <textarea value={String(form.trackingJson || '')} onChange={(e) => onChange('trackingJson', e.target.value)} className="input-field min-h-40 w-full font-mono text-sm" placeholder='{"carrier":"GHN","trackingNumber":"..."}' />
        </Field>
      </div>
    </div>
  )
}