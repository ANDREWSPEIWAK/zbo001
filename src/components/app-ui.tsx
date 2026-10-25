import { useStore } from '../store'
import { useState } from 'react'

/* ---------- ProgressBar ---------- */
export function ProgressBar({ value, color = '#C9D98A', track = '#2A2A2D', h = 8 }: { value: number; color?: string; track?: string; h?: number }) {
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
export function Card({ children, className = '', accent, light = false }: {
  children: React.ReactNode; className?: string; accent?: string; light?: boolean
}) {
  const bg = light || !accent ? '#E8E6DF' : accent
  // plum/violet -> white text handled by parent? We set text color via style on container only if accent dark
  const textColor = accent === '#5B3FF0' || accent === '#523E80' ? '#FFFFFF' : (light ? '#111111' : (accent ? '#111111' : '#111111'))
  return (
    <div
      className={`rounded-card p-4 ${className}`}
      style={{ background: bg, color: textColor }}
    >
      {children}
    </div>
  )
}

/* ---------- Pill ---------- */
export function Pill({ children, color = '#5B3FF0', className = '' }: { children: React.ReactNode; color?: string; className?: string }) {
  const light = color === '#FDC55E' || color === '#C9D98A' || color === '#EB5A52' || color === '#E8E6DF'
  const textColor = light ? '#111111' : '#FFFFFF'
  return (
    <span
      className={`inline-flex items-center rounded-pill px-[12px] py-[5px] text-[12px] font-bold uppercase ${className}`}
      style={{ background: color, color: textColor, fontFamily: 'Manrope, sans-serif' }}
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
      className={`shrink-0 rounded-chip px-[14px] py-[8px] text-[13px] font-bold transition-all ${className}`}
      style={{
        background: active ? '#C9D98A' : 'transparent',
        color: active ? '#111111' : '#FFFFFF',
        border: active ? 'none' : '1px solid #3A3A3D',
        fontFamily: 'Manrope, sans-serif',
      }}
    >
      {children}
    </button>
  )
}

/* ---------- Tile ---------- */
export function Tile({ name, color, onClick, className = '' }: {
  name: string; color: string; onClick?: () => void; className?: string
}) {
  const light = color === '#FDC55E' || color === '#C9D98A' || color === '#EB5A52' || color === '#E8E6DF'
  const textColor = light ? '#111111' : '#FFFFFF'
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[96px] w-full items-center justify-center rounded-tile ${className}`}
      style={{ background: color, color: textColor }}
    >
      <span className="text-center font-display text-[14px] font-extrabold uppercase leading-[1.15]">
        {name}
      </span>
    </button>
  )
}

/* ---------- Button ---------- */
export function Button({ children, variant = 'primary', className = '', ...props }: {
  children: React.ReactNode; variant?: 'primary' | 'secondary' | 'ghost'; className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: '#111111', color: '#FFFFFF', height: 48, borderRadius: 24 },
    secondary: { background: '#C9D98A', color: '#111111', height: 48, borderRadius: 24 },
    ghost: { background: 'transparent', color: '#FFFFFF', height: 48, borderRadius: 24, border: '1px solid #3A3A3D' },
  }
  return (
    <button
      className={`w-full px-4 font-display text-[13px] font-extrabold uppercase transition-transform active:scale-[0.96] ${className}`}
      style={{ ...styles[variant], fontFamily: 'Unbounded, sans-serif' }}
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
      style={{ borderColor: '#3A3A3D', background: '#1B1B1D', color: '#FFFFFF' }}
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
      <div className="flex h-[48px] flex-1 items-center rounded-[24px] px-4" style={{ background: '#E8E6DF', color: '#111111' }}>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-full w-full bg-transparent text-[14px] outline-none placeholder:text-[#555555]"
          style={{ color: '#111111' }}
        />
      </div>
      <button
        type="button"
        onClick={onFilter}
        aria-label="Фильтр"
        className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full"
        style={{ background: '#5B3FF0', color: '#FFFFFF' }}
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
    <div className="flex items-start gap-3 border-t border-divider px-4 py-3" style={{ background: 'transparent' }}>
      <button
        type="button"
        disabled={disabled}
        onClick={onToggle}
        aria-pressed={checked}
        className="mt-0.5 flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-[6px] border-2"
        style={{ borderColor: '#111111', background: checked ? '#111111' : 'transparent' }}
      >
        {checked && <span style={{ color: '#C9D98A', fontSize: 12, fontWeight: 700 }}>✓</span>}
      </button>
      <span className={`flex-1 text-[14px] font-bold ${checked ? 'line-through opacity-50' : ''}`} style={{ color: '#111111' }}>
        {label}
      </span>
      {note && <span className="text-right text-[11px]" style={{ color: '#555555' }}>{note}</span>}
    </div>
  )
}

/* ---------- AccordionRow ---------- */
export function AccordionRow({ title, subtitle, children, defaultOpen = false }: {
  title: string; subtitle?: string; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-[28px] bg-light text-ink overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
      >
        <div className="min-w-0 flex-1">
          <p className="font-display text-[14px] font-extrabold uppercase" style={{ color: '#111111' }}>{title}</p>
          {subtitle && <p className="mt-0.5 text-[12px]" style={{ color: '#555555' }}>{subtitle}</p>}
        </div>
        <span className="text-[18px] transition-transform" style={{ color: '#111111', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>›</span>
      </button>
      {open && <div className="border-t border-divider px-4 py-4 text-[13px]" style={{ color: '#111111' }}>{children}</div>}
    </div>
  )
}


/* ---------- ProgressRing (kept) ---------- */
export function ProgressRing({ value, size = 56, stroke = 4, color = '#C9D98A', track = '#2A2A2D', children }: {
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
          style={{ transition: 'stroke-dashoffset .5s ease' }}
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
      <h1 className="mt-1 font-display text-[28px] font-extrabold uppercase leading-tight" style={{ color: '#FFFFFF' }}>
        {title}
      </h1>
    </div>
  )
}




export function Toasts() {
  const { toasts } = useStore()
  return (
    <div className="pointer-events-none fixed left-1/2 top-4 z-[100] flex w-full max-w-sm -translate-x-1/2 flex-col items-center gap-2 px-4">
      {toasts.map((t) => {
        const [, msg] = t.split('|')
        return (
          <div key={t} className="anim-pop rounded-pill px-4 py-2 text-sm font-bold"
            style={{ background: '#FDC55E', color: '#111111' }}>
            {msg}
          </div>
        )
      })}
    </div>
  )
}
