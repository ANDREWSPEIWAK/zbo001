import { useState } from 'react'
import { wheelCategories } from '../data/wheel'
import { Tile, Pill } from '../components/app-ui'

const tileColors: Record<string, string> = {
  citrus: '#C9D98A',
  stone: '#E8E6DF',
  wine: '#5B3FF0',
  green: '#523E80',
  nut: '#EB5A52',
  sweet: '#FDC55E',
}

const tileNames: Record<string, string> = {
  citrus: 'Цитрус',
  stone: 'Косточка',
  wine: 'Вино',
  green: 'Трава',
  nut: 'Орех',
  sweet: 'Сладость',
}

const pillColors = ['#FDC55E', '#C9D98A', '#5B3FF0', '#523E80', '#EB5A52', '#E8E6DF']

export default function Wheel() {
  const selectedIds = ['citrus', 'stone', 'wine', 'green', 'nut', 'sweet']
  const tiles = selectedIds.map((id) => wheelCategories.find((c) => c.id === id)!).filter(Boolean)
  const [active, setActive] = useState(tiles[0].id)
  const cat = wheelCategories.find((c) => c.id === active)!

  return (
    <div className="space-y-6">
      <div className="anim-rise">
        <h1 className="text-center font-display text-[28px] font-extrabold uppercase leading-tight" style={{ color: '#FFFFFF' }}>Вкусы</h1>
      </div>

      <div className="grid grid-cols-2 gap-3 anim-rise">
        {tiles.map((c) => (
          <Tile
            key={c.id}
            name={tileNames[c.id] ?? c.title}
            color={tileColors[c.id] ?? '#E8E6DF'}
            onClick={() => setActive(c.id)}
          />
        ))}
      </div>

      <div className="rounded-card bg-light p-6 anim-rise" style={{ textAlign: 'left' }}>
        <p className="eyebrow" style={{ color: '#5B3FF0', textAlign: 'left' }}>Нота вкуса</p>
        <div className="mt-2 flex flex-wrap gap-2" style={{ justifyContent: 'flex-start' }}>
          {cat.notes.map((n, i) => (
            <Pill key={n} color={pillColors[i % pillColors.length]}>{n}</Pill>
          ))}
        </div>

        <p className="eyebrow mt-5" style={{ color: '#5B3FF0', textAlign: 'left' }}>Регионы</p>
        <div className="mt-2 space-y-2">
          {cat.regions.map((r) => (
            <div key={r.name} className="flex flex-wrap items-baseline gap-2 rounded-[16px] p-3" style={{ background: '#FFFFFF', justifyContent: 'flex-start' }}>
              <Pill color="#C9D98A">{r.name}</Pill>
              <span className="text-[12px] leading-relaxed" style={{ color: '#555555' }}>{r.why}</span>
            </div>
          ))}
        </div>

        <p className="eyebrow mt-5" style={{ color: '#EB5A52', textAlign: 'left' }}>Как продавать</p>
        <p className="mt-2 text-[13px] leading-relaxed" style={{ color: '#111111', textAlign: 'left' }}>
          {cat.brew ?? `не «фруктовая кислотность», а «как спелый ${cat.notes[0] ?? 'фрукт'} — ярко, но сладко».`}
        </p>
      </div>
    </div>
  )
}
