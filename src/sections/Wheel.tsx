import { useState } from 'react'
import { wheelCategories } from '../data/wheel'
import { Card, Pill } from '../components/app-ui'

const CATEGORY_FILL: Record<string, string> = {
  floral: '#1A1A1C',
  berry: '#F87171',
  citrus: '#FBBF24',
  stone: '#F87171',
  wine: '#8B5CF6',
  green: '#6D28D9',
  nut: '#F87171',
  sweet: '#FBBF24',
}

export default function Wheel() {
  const [open, setOpen] = useState<string | null>(null)

  if (open) return (
    <div className="space-y-6">
      <button onClick={() => setOpen(null)} className="mb-5 rounded-[22px] border px-4 py-2 text-[12px] font-bold btn-press"
          style={{ borderColor: '#3A3A3D', color: '#FFFFFF' }}>← Вкусы</button>
      <div className="anim-rise">
        <p className="eyebrow" style={{ color: '#8B5CF6' }}>Сенсория · где искать ноту</p>
        <h1 className="font-display mt-2 text-[25px] font-extrabold uppercase leading-none" style={{ color: '#FFFFFF' }}>{open}</h1>
      </div>
      <div className="rounded-card bg-surface p-5">
        <p className="text-[13px]" style={{ color: '#111111' }}>Выберите категорию в колесе вкусов, чтобы увидеть ноты и регионы.</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="anim-rise">
        <p className="eyebrow">Колесо вкусов SCA</p>
        <h1 className="font-display mt-2 text-[28px] font-extrabold uppercase leading-none" style={{ color: '#FFFFFF' }}>Вкусы</h1>
        <p className="mt-2 text-[13px]" style={{ color: '#666666' }}>
          8 категорий, ноты и блок «Где искать» по регионам. Материалы — из колеса вкусов SCA и карточек сети.
        </p>
      </div>

      <div className="grid gap-3">
        {wheelCategories.map((c) => {
          const fill = CATEGORY_FILL[c.id] || '#1A1A1C'
          const light = fill === '#FBBF24' || fill === '#C9DB8A' || fill === '#F87171' || fill === '#1A1A1C'
          return (
            <Card key={c.id} light={false} accent={fill} className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <div style={{ width: 40, height: 40, borderRadius: 12, background: fill, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: light ? '#111111' : '#FFFFFF', fontWeight: 800, fontSize: 14 }}>{c.short[0]}</span>
                </div>
                <Pill color={fill}>{c.short}</Pill>
              </div>
              <h3 className="font-display mt-1 text-[15px] font-extrabold uppercase leading-none" style={{ color: light ? '#111111' : '#FFFFFF' }}>{c.title}</h3>
              <div className="mt-auto space-y-2">
                <p className="eyebrow mb-1" style={{ color: '#666666' }}>Ноты</p>
                <div className="flex flex-wrap gap-1">
                  {c.notes.map((n) => (
                    <span key={n} className="rounded-[12px] px-2 py-1 text-[11px] font-bold" style={{ background: '#FFFFFF', color: '#111111' }}>{n}</span>
                  ))}
                </div>
                <p className="eyebrow mb-1" style={{ color: '#666666' }}>Где искать</p>
                <div className="space-y-1">
                  {c.regions.map((rg) => (
                    <div key={rg.name} className="flex justify-between text-[12px]">
                      <span style={{ color: '#111111' }}>{rg.name}</span>
                      <span style={{ color: '#666666' }}>{rg.why}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="rounded-card bg-surface p-4" style={{ border: '1px dashed #3A3A3D' }}>
        <p className="eyebrow" style={{ color: '#8B5CF6' }}>Как продавать</p>
        <p className="mt-1 text-[12px]" style={{ color: '#111111' }}>Связано с блоком «Сервис»: описывайте ноту простыми словами и предлагайте альтернативу под вкус гостя.</p>
      </div>
    </div>
  )
}
