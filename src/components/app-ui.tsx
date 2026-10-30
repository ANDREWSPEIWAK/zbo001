import { useStore } from '../store'

type AccentColor = 'lime' | 'violet' | 'coral' | 'yellow' | 'plum'

const ACCENT_COLORS: Record<AccentColor, string> = {
  lime: '#C9D98A',
  violet: '#5B3FF0',
  coral: '#EB5A52',
  yellow: '#FDC55E',
  plum: '#523E80',
}

/* ---------- Eyebrow ---------- */
export function Eyebrow({ children, color = 'lime', className = '', style }: { children: React.ReactNode; color?: AccentColor; className?: string; style?: React.CSSProperties }) {
  return (
    <p className={className} style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.14em', color: ACCENT_COLORS[color], margin: 0, ...style }}>
      {children}
    </p>
  )
}

/* ---------- H1 ---------- */
export function H1({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <h1 className={`mt-1 ${className}`} style={{ fontFamily: "'Unbounded', 'Manrope', sans-serif", fontWeight: 800, fontSize: 28, textTransform: 'uppercase', lineHeight: 1.1, ...style }}>
      {children}
    </h1>
  )
}

/* ---------- CardLight ---------- */
export function CardLight({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={className} style={{ background: '#E8E6DF', color: '#111111', borderRadius: 32, padding: 16, ...style }}>
      {children}
    </div>
  )
}

/* ---------- CardAccent ---------- */
export function CardAccent({ children, className = '', style, color = 'yellow' }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; color?: AccentColor }) {
  const textColor = color === 'violet' || color === 'plum' ? '#FFFFFF' : '#111111'
  return (
    <div className={className} style={{ background: ACCENT_COLORS[color], color: textColor, borderRadius: 32, padding: 16, ...style }}>
      {children}
    </div>
  )
}

/* ---------- ButtonPrimary ---------- */
export function ButtonPrimary({ children, className = '', onClick, fullWidth = true, disabled }: { children: React.ReactNode; className?: string; onClick?: () => void; fullWidth?: boolean; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{
        background: disabled ? '#3A3A3D' : '#111111',
        color: '#FFFFFF',
        height: 48,
        borderRadius: 24,
        fontFamily: "'Unbounded', 'Manrope', sans-serif",
        fontWeight: 800,
        fontSize: 13,
        textTransform: 'uppercase',
        width: fullWidth ? '100%' : 'auto',
        padding: '0 20px',
      }}
    >
      {children}
    </button>
  )
}

/* ---------- Chip ---------- */
export function Chip({ children, active = false, className = '', onClick }: { children: React.ReactNode; active?: boolean; className?: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap ${className} btn-press`}
      style={{
        height: 36,
        padding: '0 14px',
        borderRadius: 20,
        fontFamily: "'Manrope', sans-serif",
        fontWeight: 700,
        fontSize: 13,
        textTransform: 'uppercase',
        background: active ? '#C9D98A' : 'transparent',
        color: active ? '#111111' : '#FFFFFF',
        border: active ? 'none' : '1px solid #3A3A3D',
      }}
    >
      {children}
    </button>
  )
}

/* ---------- Pill ---------- */
export function Pill({ children, className = '', dark = false }: { children: React.ReactNode; className?: string; dark?: boolean }) {
  return (
    <span className={`inline-flex items-center ${className}`} style={{
      height: 26,
      padding: '0 12px',
      borderRadius: 13,
      fontFamily: "'Manrope', sans-serif",
      fontWeight: 700,
      fontSize: 12,
      textTransform: 'uppercase',
      background: dark ? '#111111' : '#1B1B1D',
      color: '#FFFFFF',
      border: dark ? 'none' : '1px solid #2A2A2D',
    }}>
      {children}
    </span>
  )
}

/* ---------- ProgressBar ---------- */
export function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className={`w-full ${className}`} style={{ height: 8, borderRadius: 4, background: '#2A2A2D', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: '#C9D98A', transition: 'width 0.3s ease' }} />
    </div>
  )
}

/* ---------- Tile ---------- */
export function Tile({ children, color = 'lime', className = '' }: { children: React.ReactNode; color?: AccentColor; className?: string }) {
  const textColor = color === 'violet' || color === 'plum' ? '#FFFFFF' : '#111111'
  return (
    <div className={`flex items-center justify-center text-center ${className}`} style={{
      background: ACCENT_COLORS[color],
      color: textColor,
      borderRadius: 28,
      height: 96,
      padding: '0 12px',
      fontFamily: "'Unbounded', 'Manrope', sans-serif",
      fontWeight: 800,
      fontSize: 14,
      textTransform: 'uppercase',
      lineHeight: 1.15,
    }}>
      {children}
    </div>
  )
}

/* ---------- SearchInput ---------- */
export function SearchInput({ placeholder, onChange, value }: { placeholder?: string; onChange?: (v: string) => void; value?: string }) {
  return (
    <div className="flex items-center gap-2" style={{ background: '#E8E6DF', borderRadius: 24, height: 48, paddingLeft: 16, paddingRight: 4 }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none"
        style={{ color: '#111111', fontSize: 14 }}
      />
      <button type="button" aria-label="Фильтр" className="w-10 h-10 rounded-full bg-violet flex items-center justify-center text-white">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 6h18M7 12h10M10 18h4" />
        </svg>
      </button>
    </div>
  )
}

/* ---------- ChecklistRow ---------- */
export function ChecklistRow({ label, note, checked, onToggle, disabled }: { label: string; note?: string; checked?: boolean; onToggle?: () => void; disabled?: boolean }) {
  return (
    <button type="button" onClick={onToggle} disabled={disabled} className="w-full flex items-center justify-between py-3" style={{ borderTop: '1px solid #CFCCC4', color: '#111111' }}>
      <div className="flex items-center gap-3">
        <div style={{
          width: 20, height: 20, borderRadius: 6, border: checked ? 'none' : '2px solid #111111', background: checked ? '#111111' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {checked && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m20 6-11 11-5-5" />
            </svg>
          )}
        </div>
        <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 14 }}>{label}</span>
      </div>
      {note && <span style={{ fontSize: 11, color: '#555555' }}>{note}</span>}
    </button>
  )
}

/* ---------- ProgressRing ---------- */
export function ProgressRing({ value, size = 56, stroke = 4, color = '#C9D98A', children }: { value: number; size?: number; stroke?: number; color?: string; children?: React.ReactNode }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const off = c - (Math.min(100, Math.max(0, value)) / 100) * c
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#2A2A2D" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
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
          <div key={t} className="anim-pop rounded-[22px] px-4 py-2 text-[13px] font-bold" style={{ background: '#FDC55E', color: '#0F0F10' }}>
            {msg}
          </div>
        )
      })}
    </div>
  )
}
