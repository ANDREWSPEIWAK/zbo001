import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { t, type Lang } from '../lang'
import { wheelCategories } from '../data/wheel'
import { Search, Chip } from '../components/app-ui'

const CATEGORY_COLOR: Record<string, string> = {
  floral: '#C9DB8A',
  berry: '#F87171',
  citrus: '#FBBF24',
  stone: '#F87171',
  wine: '#8B5CF6',
  green: '#6D28D9',
  nut: '#F87171',
  sweet: '#FBBF24',
}

function NoteChip({ note, color }: { note: string; color: string }) {
  const light = color === '#FBBF24' || color === '#C9DB8A' || color === '#F87171'
  return (
    <span
      key={note}
      className="rounded-[12px] px-2.5 py-1 text-[11px] font-bold"
      style={{ background: color, color: light ? '#0F0F10' : '#FFFFFF' }}
    >
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
    const color = CATEGORY_COLOR[cat.id] || '#1A1A1C'
    const light = color === '#FBBF24' || color === '#C9DB8A' || color === '#F87171'

    return (
      <div className="space-y-6">
        <motion.button
          onClick={() => setOpen(null)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="mb-5 rounded-[22px] border px-4 py-2 text-[12px] font-bold btn-press"
          style={{ borderColor: '#3A3A3D', color: '#FFFFFF' }}
        >
          <span style={{ marginRight: 6 }}>←</span> {L('wheel.back_ru') === '← Tastes' ? L('wheel.back_en') : L('wheel.back_ru')}
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="space-y-4"
        >
          <div className="flex items-start justify-between">
            <div style={{ width: 48, height: 48, borderRadius: 16, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: light ? '#0F0F10' : '#FFFFFF', fontWeight: 800, fontSize: 20 }}>{cat.short[0]}</span>
            </div>
            <div>
              <p className="eyebrow" style={{ color: color }}>{cat.short}</p>
              <h1 className="font-display mt-1 text-[25px] font-extrabold uppercase leading-none" style={{ color: '#0F0F10' }}>{cat.title}</h1>
            </div>
          </div>

          {/* Notes as color chips */}
          <div className="space-y-3">
            <p className="eyebrow" style={{ color: '#666666' }}>{L('wheel.notes_ru') === 'Notes' ? L('wheel.notes_en') : L('wheel.notes_ru')}</p>
            <div className="flex flex-wrap gap-2">
              {cat.notes.map((n) => (
                <NoteChip key={n} note={n} color={color} />
              ))}
            </div>
          </div>

          {/* Regions */}
          <div className="space-y-3">
            <p className="eyebrow" style={{ color: '#666666' }}>{L('wheel.where_ru') === 'Where to find' ? L('wheel.where_en') : L('wheel.where_ru')}</p>
            <div className="space-y-2">
              {cat.regions.map((rg) => (
                <div key={rg.name} className="flex items-start justify-between gap-3 rounded-[20px] p-3" style={{ background: '#FFFFFF' }}>
                  <div>
                    <p className="text-[13px] font-bold" style={{ color: '#0F0F10' }}>{rg.name}</p>
                    <p className="mt-0.5 text-[12px] leading-relaxed" style={{ color: '#666666' }}>{rg.why}</p>
                  </div>
                  <span style={{ color: color, fontWeight: 800, fontSize: 12 }}>{color === '#FBBF24' || color === '#C9DB8A' || color === '#F87171' ? '●' : '●'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Brewing tips */}
          {cat.grind && (
            <div className="space-y-3">
              <p className="eyebrow" style={{ color: '#8B5CF6' }}>Молот и заварка</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[20px] p-3" style={{ background: '#1A1A1C' }}>
                  <p className="text-[11px] font-bold uppercase" style={{ color: '#C9DB8A' }}>Помол</p>
                  <p className="mt-1 text-[12px]" style={{ color: '#0F0F10' }}>{cat.grind}</p>
                </div>
                <div className="rounded-[20px] p-3" style={{ background: '#1A1A1C' }}>
                  <p className="text-[11px] font-bold uppercase" style={{ color: '#C9DB8A' }}>Заварка</p>
                  <p className="mt-1 text-[12px]" style={{ color: '#0F0F10' }}>{cat.brew}</p>
                </div>
              </div>
            </div>
          )}

          {/* How to sell */}
          <div className="rounded-card bg-surface p-4" style={{ border: '1px dashed #3A3A3D' }}>
            <p className="eyebrow" style={{ color: '#8B5CF6' }}>{L('wheel.selling_ru') === 'How to sell' ? L('wheel.selling_en') : L('wheel.selling_ru')}</p>
            <p className="mt-1 text-[12px] leading-relaxed" style={{ color: '#0F0F10' }}>
              {L('wheel.selling_desc_ru') === 'Linked to “Service” block: describe the note in simple words and offer an alternative according to the guest’s taste.' ? L('wheel.selling_desc_en') : L('wheel.selling_desc_ru')}
            </p>
          </div>
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
        <p className="eyebrow">{L('wheel.title_ru') === 'Tastes' ? L('wheel.title_en') : L('wheel.title_ru')}</p>
        <h1 className="font-display mt-1 text-[28px] font-extrabold uppercase leading-none" style={{ color: '#FFFFFF' }}>
          {L('wheel.title_ru') === 'Tastes' ? L('wheel.title_en') : L('wheel.title_ru')}
        </h1>
        <p className="mt-1 text-[13px]" style={{ color: '#666666' }}>
          {L('wheel.subtitle_ru') === '8 categories, notes and “Where to find” block by regions. Materials from SCA flavor wheel and network cards.' ? L('wheel.subtitle_en') : L('wheel.subtitle_ru')}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
      >
        <Search value={search} onChange={setSearch} placeholder={L('ttk.search_ru') === 'Search: flat white, raf, V60…' ? L('ttk.search_en') : L('ttk.search_ru')} />
      </motion.div>

      {/* Category chips - scrollable */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.2 }}
        className="no-scrollbar flex gap-2 overflow-x-auto pb-1 mt-2"
      >
        <Chip active={!open && search === ''} onClick={() => setOpen(null)}>{L('ttk.all_ru') === 'All' ? L('ttk.all_en') : L('ttk.all_ru')}</Chip>
        {wheelCategories.map((c) => {
          const color = CATEGORY_COLOR[c.id] || '#1A1A1C'
          return (
            <Chip
              key={c.id}
              active={open === c.id}
              onClick={() => setOpen(c.id)}
            >
              <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: color, marginRight: 6 }} />
              {lang === 'ru' ? c.short : c.title}
            </Chip>
          )
        })}
      </motion.div>

      {/* Category grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.3 }}
        className="grid gap-3"
      >
        {filtered.map((c, i) => {
          const color = CATEGORY_COLOR[c.id] || '#1A1A1C'
          const light = color === '#FBBF24' || color === '#C9DB8A' || color === '#F87171'
          const isOpen = open === c.id
          return (
            <motion.div
              key={c.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setOpen(c.id)}
              className="cursor-pointer rounded-card bg-surface p-5 flex flex-col gap-3"
              style={{
                border: isOpen ? `2px solid ${color}` : '1px solid #3A3A3D',
                background: isOpen ? '#2A2A2D' : '#1A1A1C',
                animationDelay: `${i * 50}ms`,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div style={{ width: 36, height: 36, borderRadius: 12, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: light ? '#0F0F10' : '#FFFFFF', fontWeight: 800, fontSize: 14 }}>{c.short[0]}</span>
                </div>
                <span className="text-[10px] font-bold uppercase" style={{ color: color }}>
                  {lang === 'ru' ? c.short : c.title}
                </span>
              </div>
              <h3 className="font-display mt-1 text-[15px] font-extrabold uppercase leading-none" style={{ color: '#0F0F10' }}>{c.title}</h3>

              {/* Notes preview */}
              <div className="mt-auto flex flex-wrap gap-1 mb-2">
                {c.notes.slice(0, 3).map((n) => (
                  <NoteChip key={n} note={n} color={color} />
                ))}
                {c.notes.length > 3 && (
                  <span className="text-[10px] font-bold" style={{ color: '#666666' }}>+{c.notes.length - 3}</span>
                )}
              </div>

              {/* Region count */}
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span style={{ color: '#666666' }}>{c.regions.length} регион{(c.regions.length > 1 ? 'а' : '')}</span>
                <span style={{ color: '#C9DB8A' }}>▶</span>
              </div>
            </motion.div>
          )
        })}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-[13px]" style={{ color: '#666666' }}>
            Ничего не найдено. Попробуйте другой запрос.
          </div>
        )}
      </motion.div>

      <div className="rounded-card bg-surface p-4" style={{ border: '1px dashed #3A3A3D' }}>
        <p className="eyebrow" style={{ color: '#8B5CF6' }}>{L('wheel.selling_ru') === 'How to sell' ? L('wheel.selling_en') : L('wheel.selling_ru')}</p>
        <p className="mt-1 text-[12px]" style={{ color: '#0F0F10' }}>
          {L('wheel.selling_desc_ru') === 'Linked to “Service” block: describe the note in simple words and offer an alternative according to the guest’s taste.' ? L('wheel.selling_desc_en') : L('wheel.selling_desc_ru')}
        </p>
      </div>
    </div>
  )
}
