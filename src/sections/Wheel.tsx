import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { t, type Lang } from '../lang'
import { wheelCategories } from '../data/wheel'
import { SearchInput, Chip } from '../components/app-ui'

const CATEGORY_COLOR: Record<string, string> = {
  floral: '#C9D98A',
  berry: '#EB5A52',
  citrus: '#FDC55E',
  stone: '#EB5A52',
  wine: '#5B3FF0',
  green: '#523E80',
  nut: '#EB5A52',
  sweet: '#FDC55E',
}

function NoteChip({ note, color }: { note: string; color: string }) {
  const light = color === '#FDC55E' || color === '#C9D98A' || color === '#EB5A52'
  return (
    <span key={note} className="rounded-[12px] px-2.5 py-1 text-[11px] font-bold"
      style={{ background: color, color: light ? '#111111' : '#FFFFFF' }}>
      {note}
    </span>
  )
}

export default function Wheel({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const L = (key: string) => t(key, lang)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return wheelCategories.filter((c) => {
      if (!q) return true
      return c.title.toLowerCase().includes(q) ||
        c.short.toLowerCase().includes(q) ||
        c.notes.some((n) => n.toLowerCase().includes(q)) ||
        c.regions.some((r) => r.name.toLowerCase().includes(q) || r.why.toLowerCase().includes(q))
    })
  }, [search])

  if (open) {
    const cat = wheelCategories.find((c) => c.id === open)
    if (!cat) return null
    const color = CATEGORY_COLOR[cat.id] || '#1B1B1D'
    const light = color === '#FDC55E' || color === '#C9D98A' || color === '#EB5A52'

    return (
      <div className="space-y-6">
        <motion.button onClick={() => setOpen(null)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="mb-5 rounded-[22px] border px-4 py-2 text-[12px] font-bold btn-press"
          style={{ borderColor: '#3A3A3D', color: '#FFFFFF' }}
        >
          ← {L('wheel.back_ru')}
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="space-y-4"
        >
          <div className="flex items-start justify-between">
            <div style={{ width: 48, height: 48, borderRadius: 16, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: light ? '#111111' : '#FFFFFF', fontWeight: 800, fontSize: 20 }}>{cat.short[0]}</span>
            </div>
            <div>
              <EyebrowInline color={color}>{cat.short}</EyebrowInline>
              <h1 className="font-display mt-1 text-[25px] font-extrabold uppercase leading-none" style={{ color: '#111111' }}>{cat.title}</h1>
            </div>
          </div>

          <div className="space-y-3">
            <Eyebrow color="#555555">{L('wheel.notes_ru')}</Eyebrow>
            <div className="flex flex-wrap gap-2">
              {cat.notes.map((n) => <NoteChip key={n} note={n} color={color} />)}
            </div>
          </div>

          <div className="space-y-3">
            <Eyebrow color="#555555">{L('wheel.where_ru')}</Eyebrow>
            <div className="space-y-2">
              {cat.regions.map((rg) => (
                <div key={rg.name} className="flex items-start justify-between gap-3 rounded-[20px] p-3" style={{ background: '#FFFFFF' }}>
                  <div>
                    <p className="text-[13px] font-bold" style={{ color: '#111111' }}>{rg.name}</p>
                    <p className="mt-0.5 text-[12px] leading-relaxed" style={{ color: '#555555' }}>{rg.why}</p>
                  </div>
                  <span style={{ color: color, fontWeight: 800, fontSize: 12 }}>●</span>
                </div>
              ))}
            </div>
          </div>

          {cat.grind && (
            <div className="space-y-3">
              <Eyebrow color="violet">Молот и заварка</Eyebrow>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[20px] p-3" style={{ background: '#1B1B1D' }}>
                  <p className="text-[11px] font-bold uppercase" style={{ color: '#C9D98A' }}>Помол</p>
                  <p className="mt-1 text-[12px]" style={{ color: '#111111' }}>{cat.grind}</p>
                </div>
                <div className="rounded-[20px] p-3" style={{ background: '#1B1B1D' }}>
                  <p className="text-[11px] font-bold uppercase" style={{ color: '#C9D98A' }}>Заварка</p>
                  <p className="mt-1 text-[12px]" style={{ color: '#111111' }}>{cat.brew}</p>
                </div>
              </div>
            </div>
          )}

          <CardAccentInline>
            <Eyebrow color="violet">{L('wheel.selling_ru')}</Eyebrow>
            <p className="mt-1 text-[12px]" style={{ color: '#111111' }}>
              {L('wheel.selling_desc_ru')}
            </p>
          </CardAccentInline>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="space-y-2"
      >
        <Eyebrow>{L('wheel.title_ru')}</Eyebrow>
        <H1>{L('wheel.title_ru')}</H1>
        <p className="mt-1 text-[13px]" style={{ color: '#555555' }}>{L('wheel.subtitle_ru')}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
      >
        <SearchInput value={search} onChange={setSearch} placeholder={L('ttk.search_ru')} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.2 }}
        className="no-scrollbar flex gap-2 overflow-x-auto pb-1 mt-2"
      >
        <Chip active={!open && search === ''} onClick={() => setOpen(null)}>{L('ttk.all_ru')}</Chip>
        {wheelCategories.map((c) => {
          const color = CATEGORY_COLOR[c.id] || '#1B1B1D'
          return (
            <Chip key={c.id} active={open === c.id} onClick={() => setOpen(c.id)}>
              <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: color, marginRight: 6 }} />
              {lang === 'ru' ? c.short : c.title}
            </Chip>
          )
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.3 }}
        className="grid gap-3"
      >
        {filtered.map((c, i) => {
          const color = CATEGORY_COLOR[c.id] || '#1B1B1D'
          const light = color === '#FDC55E' || color === '#C9D98A' || color === '#EB5A52'
          const isOpen = open === c.id
          return (
            <motion.div key={c.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setOpen(c.id)}
              className="cursor-pointer CardLight p-5 flex flex-col gap-3"
              style={{ border: isOpen ? `2px solid ${color}` : '1px solid #3A3A3D', background: isOpen ? '#2A2A2D' : '#1B1B1D', animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div style={{ width: 36, height: 36, borderRadius: 12, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: light ? '#111111' : '#FFFFFF', fontWeight: 800, fontSize: 14 }}>{c.short[0]}</span>
                </div>
                <span className="text-[10px] font-bold uppercase" style={{ color: color }}>{lang === 'ru' ? c.short : c.title}</span>
              </div>
              <h3 className="font-display mt-1 text-[15px] font-extrabold uppercase leading-none" style={{ color: '#111111' }}>{c.title}</h3>

              <div className="mt-auto flex flex-wrap gap-1 mb-2">
                {c.notes.slice(0, 3).map((n) => <NoteChip key={n} note={n} color={color} />)}
                {c.notes.length > 3 && <span className="text-[10px] font-bold" style={{ color: '#555555' }}>+{c.notes.length - 3}</span>}
              </div>

              <div className="flex items-center justify-between text-[11px] font-bold">
                <span style={{ color: '#555555' }}>{c.regions.length} регион{(c.regions.length > 1 ? 'а' : '')}</span>
                <span style={{ color: '#C9D98A' }}>▶</span>
              </div>
            </motion.div>
          )
        })}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-[13px]" style={{ color: '#555555' }}>
            Ничего не найдено. Попробуйте другой запрос.
          </div>
        )}
      </motion.div>

      <CardAccentInline>
        <Eyebrow color="violet">{L('wheel.selling_ru')}</Eyebrow>
        <p className="mt-1 text-[12px]" style={{ color: '#111111' }}>{L('wheel.selling_desc_ru')}</p>
      </CardAccentInline>
    </div>
  )
}

function EyebrowInline({ color = 'lime', children }: { color?: string; children: React.ReactNode }) {
  return <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.14em', color, margin: 0 }}>{children}</p>
}

function Eyebrow({ color = 'lime', children }: { color?: string; children: React.ReactNode }) {
  return <p className="mb-2" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.14em', color, margin: 0 }}>{children}</p>
}

function CardAccentInline({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-card bg-surface p-4" style={{ border: '1px dashed #3A3A3D' }}>
      {children}
    </div>
  )
}

function H1({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h1 className={`mt-1 ${className}`} style={{ fontFamily: "'Unbounded', 'Manrope', sans-serif", fontWeight: 800, fontSize: 28, textTransform: 'uppercase', lineHeight: 1.1 }}>{children}</h1>
}
