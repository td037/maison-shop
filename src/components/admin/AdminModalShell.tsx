'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface AdminModalShellProps {
  open: boolean
  onClose: () => void
  modeLabel: string
  title: string
  description: string
  primaryNoteLabel: string
  primaryNoteValue: string
  secondaryNoteLabel: string
  secondaryNoteValue: string
  formTitle: string
  children: ReactNode
}

export default function AdminModalShell({
  open,
  onClose,
  modeLabel,
  title,
  description,
  primaryNoteLabel,
  primaryNoteValue,
  secondaryNoteLabel,
  secondaryNoteValue,
  formTitle,
  children,
}: AdminModalShellProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!mounted || !open) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-auto bg-[#11111f]/60 px-4 py-6 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className="my-8 grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-[32px] border border-white/10 bg-white shadow-[0_40px_120px_rgba(0,0,0,0.3)] lg:grid-cols-[320px_1fr]"
        onClick={(e) => e.stopPropagation()}
      >
        <aside className="relative overflow-hidden bg-[#11111f] p-8 text-white min-h-fit">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(171,46,0,0.28),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_30%)]" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <p className="text-[11px] font-display font-bold uppercase tracking-[0.3em] text-white/50">{modeLabel}</p>
              <h3 className="mt-2 font-display text-3xl font-black tracking-tight">{title}</h3>
              <p className="mt-4 text-sm leading-6 text-white/70">{description}</p>
            </div>
            <div className="space-y-3">
              <div className="rounded-[20px] border border-white/10 bg-white/6 px-4 py-4">
                <p className="text-[11px] font-display font-bold uppercase tracking-[0.22em] text-white/45">{primaryNoteLabel}</p>
                <p className="mt-2 text-sm font-semibold text-white">{primaryNoteValue}</p>
              </div>
              <div className="rounded-[20px] border border-white/10 bg-white/6 px-4 py-4">
                <p className="text-[11px] font-display font-bold uppercase tracking-[0.22em] text-white/45">{secondaryNoteLabel}</p>
                <p className="mt-2 text-sm leading-6 text-white/70">{secondaryNoteValue}</p>
              </div>
            </div>
          </div>
        </aside>

        <section className="flex max-h-[calc(100vh-6rem)] flex-col overflow-y-auto bg-[linear-gradient(180deg,#fff_0%,#faf7f4_100%)] p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-display font-bold uppercase tracking-[0.22em] text-on-surface-muted">Form</p>
              <h4 className="mt-1 font-display text-2xl font-black text-on-surface">{formTitle}</h4>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-outline-variant/20 px-3 py-1.5 text-sm font-semibold text-on-surface-muted transition-colors hover:border-primary/30 hover:text-primary"
            >
              Đóng
            </button>
          </div>
          {children}
        </section>
      </div>
    </div>,
    document.body
  )
}