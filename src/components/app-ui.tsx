import { useStore } from '../store'
import { useState } from 'react'

/* ---------- ProgressBar ---------- */
export function ProgressBar({ value, color = '#C9DB8A', track = '#3A3A3D', h = 8 }: { value: number; color?: string; track?: string; h?: number }) {
  return (
    <div className="w-full overflow-hidden rounded-[4px]" style={{ height: h, background: track }}>
      <div
        className="h-full rounded-[4px] transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color }}
      />
    </div>
  )
}

/* ---------- Card ---------- */
export function Card({ children, className = '', accent, light = true }: {
  children: React.ReactNode; className?: string; accent?: string; light?: boolean
}) {
  const bg = light ? '#1A1A1C' : (accent || '#3A3A3D')
  const textColor = light ? '#FFFFFF' : '#FFFFFF'
  return (
    <div
      className={`rounded-card p-5 ${className} card-press`}
      style={{ background: bg, color: textColor, border: accent ? `1px solid ${accent}` : 'none', boxShadow: '0 12px 32px rgba(0,0,0,0.55)' }}
    >
      {children}
    </div>
  )
}

/* ---------- Pill ---------- */
export function Pill({ children, color = '#8B5CF6', className = '' }: { children: React.ReactNode; color?: string; className?: string }) {
  const light = color === '#FBBF24' || color === '#C9DB8A' || color === '#F87171' || color === '#1A1A1C'
  const textColor = light ? '#0F0F10' : '#FFFFFF'
  return (
    <span
      className={`inline-flex items-center rounded-[22px] px-[14px] py-[7px] text-[12px] font-bold uppercase ${className}`}
      style={{ background: color, color: textColor, fontFamily: 'Manrope, sans-serif', height: 44, display: 'inline-flex', alignItems: 'center' }}
    >
      {children}
    </span>
  )
}

/* ---------- Chip ---------- */
export function Chip({ children, active = false, onClick, className = '' }: {
  children: React.ReactNode; active?: boolean; onClick?: () => void; className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-[22px] px-[14px] py-[7px] text-[13px] font-bold transition-all ${className} btn-press`}
      style={{
        background: active ? '#C9DB8A' : 'transparent',
        color: active ? '#0F0F10' : '#FFFFFF',
        border: active ? 'none' : '1px solid #3A3A3D',
        fontFamily: 'Manrope, sans-serif',
        height: 44,
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      {children}
    </button>
  )
}

/* ---------- Button ---------- */
export function Button({ children, variant = 'primary', className = '', ...props }: {
  children: React.ReactNode; variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: '#0F0F10', color: '#FFFFFF', height: 52, borderRadius: 26 },
    secondary: { background: '#C9DB8A', color: '#0F0F10', height: 52, borderRadius: 26 },
    ghost: { background: 'transparent', color: '#FFFFFF', height: 52, borderRadius: 26, border: '1px solid #3A3A3D' },
    danger: { background: '#F87171', color: '#0F0F10', height: 52, borderRadius: 26 },
  }
  return (
    <button
      className={`w-full px-4 font-display text-[13px] font-extrabold uppercase transition-transform btn-press ${className}`}
      style={{ ...styles[variant], fontFamily: 'Unbounded, sans-serif', ...(props.style || {}) }}
      {...props}
    >
      {children}
    </button>
  )
}

/* ---------- Input ---------- */
export function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`h-[44px] w-full rounded-[22px] border px-4 text-[13px] outline-none ${className}`}
      style={{ borderColor: '#3A3A3D', background: '#3A3A3D', color: '#FFFFFF' }}
      {...props}
    />
  )
}

/* ---------- Search ---------- */
export function Search({ value, onChange, placeholder, onFilter }: {
  value: string; onChange: (v: string) => void; placeholder?: string; onFilter?: () => void
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-[48px] flex-1 items-center rounded-[24px] px-4" style={{ background: '#1A1A1C', color: '#FFFFFF' }}>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-full w-full bg-transparent text-[14px] outline-none placeholder:text-[#666666]"
          style={{ color: '#FFFFFF' }}
        />
      </div>
      <button
        type="button"
        onClick={onFilter}
        aria-label="Фильтр"
        className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full btn-press"
        style={{ background: '#8B5CF6', color: '#FFFFFF' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
      </button>
    </div>
  )
}

/* ---------- ChecklistRow ---------- */
export function ChecklistRow({ checked, label, note, onToggle, disabled }: {
  checked: boolean; label: string; note?: string; onToggle?: () => void; disabled?: boolean
}) {
  return (
    <div className="flex items-start gap-3 border-t border-solid border-[#3A3A3D] px-4 py-3 btn-press">
      <button
        type="button"
        disabled={disabled}
        onClick={onToggle}
        aria-pressed={checked}
        className="mt-0.5 flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-[6px] border-2"
        style={{ borderColor: '#FFFFFF', background: checked ? '#C9DB8A' : 'transparent' }}
      >
        {checked && <span style={{ color: '#0F0F10', fontSize: 12, fontWeight: 700 }}>✓</span>}
      </button>
      <span className={`flex-1 text-[14px] font-bold leading-relaxed ${checked ? 'line-through opacity-50' : ''}`} style={{ color: '#FFFFFF' }}>
        {label}
      </span>
      {note && <span className="text-right text-[11px] font-bold" style={{ color: '#666666' }}>{note}</span>}
    </div>
  )
}

/* ---------- AccordionRow ---------- */
export function AccordionRow({ title, subtitle, children, defaultOpen = false }: {
  title: string; subtitle?: string; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-[28px] bg-surface text-ink overflow-hidden card-press">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
      >
        <div className="min-w-0 flex-1">
          <p className="font-display text-[14px] font-extrabold uppercase leading-none" style={{ color: '#FFFFFF' }}>{title}</p>
          {subtitle && <p className="mt-0.5 text-[12px] font-bold" style={{ color: '#666666' }}>{subtitle}</p>}
        </div>
        <span className="text-[18px] transition-transform" style={{ color: '#FFFFFF', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>›</span>
      </button>
      {open && <div className="border-t border-solid border-[#3A3A3D] px-4 py-4 text-[13px] leading-relaxed" style={{ color: '#FFFFFF' }}>{children}</div>}
    </div>
  )
}

/* ---------- ProgressRing ---------- */
export function ProgressRing({ value, size = 56, stroke = 4, color = '#C9DB8A', track = '#3A3A3D', children }: {
  value: number; size?: number; stroke?: number; color?: string; track?: string; children?: React.ReactNode
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const off = c - (Math.min(100, Math.max(0, value)) / 100) * c
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  )
}

/* ---------- SectionHead ---------- */
export function SectionHead({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="anim-rise">
      <p className="eyebrow">{kicker}</p>
      <h1 className="mt-1 font-display text-[28px] font-extrabold uppercase leading-none" style={{ color: '#FFFFFF' }}>
        {title}
      </h1>
    </div>
  )
}

/* ---------- Toasts ---------- */
export function Toasts() {
  const { toasts } = useStore()
  return (
    <div className="pointer-events-none fixed left-1/2 top-4 z-[100] flex w-full max-w-sm -translate-x-1/2 flex-col items-center gap-2 px-4">
      {toasts.map((t) => {
        const [, msg] = t.split('|')
        return (
          <div key={t} className="anim-pop rounded-[22px] px-4 py-2 text-[13px] font-bold"
            style={{ background: '#FBBF24', color: '#0F0F10' }}>
            {msg}
          </div>
        )
      })}
    </div>
  )
}
