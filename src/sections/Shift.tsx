import { useEffect, useRef, useState } from 'react'
import { actions, useStore } from '../store'
import { barPositions, serviceFlow, timeStandards, sequenceRules, rushDrinks, rushStepsLegend, ausPrinciples, type RushDrink } from '../data/service'
import { guideStandards } from '../data/guide'
import { Chip, ProgressBar, Pill } from '../components/app-ui'

/* ---------------- Rush simulator ---------------- */
interface ActiveOrder {
  key: number
  drink: RushDrink
  progress: number
  patience: number
}

function Rush({ onExit }: { onExit: () => void }) {
  const DURATION = 60
  const [left, setLeft] = useState(DURATION)
  const [orders, setOrders] = useState<ActiveOrder[]>([])
  const [served, setServed] = useState(0)
  const [lost, setLost] = useState(0)
  const [flash, setFlash] = useState<'ok' | 'bad' | null>(null)
  const keyRef = useRef(0)
  const over = left <= 0

  useEffect(() => {
    if (over) return
    const id = setInterval(() => {
      setLeft((x) => x - 1)
      setOrders((os) => {
        const next = os.map((o) => ({ ...o, patience: o.patience - 1 }))
        const expired = next.filter((o) => o.patience <= 0).length
        if (expired > 0) setLost((l) => l + expired)
        return next.filter((o) => o.patience > 0)
      })
      if (Math.random() < 0.55) {
        setOrders((os) => {
          if (os.length >= 3) return os
          const drink = rushDrinks[Math.floor(Math.random() * rushDrinks.length)]
          keyRef.current += 1
          return [...os, { key: keyRef.current, drink, progress: 0, patience: drink.patience }]
        })
      }
    }, 1000)
    return () => clearInterval(id)
  }, [over])

  useEffect(() => {
    if (over) {
      actions.recordRush(served)
      actions.addXp(served * 5, 'Rush-симулятор')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [over])

  const tap = (step: string) => {
    if (over) return
    setOrders((os) => {
      const idx = os.findIndex((o) => o.drink.steps[o.progress] === step)
      if (idx === -1) {
        setFlash('bad')
        setTimeout(() => setFlash(null), 300)
        return os.map((o) => (o.patience > 2 ? { ...o, patience: o.patience - 2 } : o))
      }
      const next = [...os]
      const o = { ...next[idx], progress: next[idx].progress + 1 }
      setFlash('ok')
      setTimeout(() => setFlash(null), 200)
      if (o.progress >= o.drink.steps.length) {
        setServed((s) => s + 1)
        next.splice(idx, 1)
        return next
      }
      next[idx] = o
      return next
    })
  }

  if (over) {
    return (
      <div className="rounded-card bg-light p-8 text-center anim-pop">
        <p className="eyebrow" style={{ color: '#5B3FF0' }}>Смена окончена</p>
        <p className="font-display mt-3 text-[48px] font-extrabold" style={{ color: '#C9D98A' }}>{served}</p>
        <p className="mt-1 text-[13px]" style={{ color: '#555555' }}>гостей обслужено · потеряно: {lost}</p>
        <p className="mx-auto mt-4 max-w-sm text-[13px] leading-relaxed" style={{ color: '#111111' }}>
          {served >= 6
            ? 'Уровень топового спешелти-бара: поток не остановить. Так держат утро в Сиднее.'
            : served >= 4
              ? 'Хороший темп. Следи за приоритетом — обслуживай самый «горячий» заказ первым.'
              : 'Начинай с самого нетерпеливого гостя и помни порядок сборки из ТТК.'}
        </p>
        <button onClick={onExit} className="mt-6 rounded-btn px-8 py-3 text-[13px] font-extrabold uppercase"
          style={{ background: '#111111', color: '#FFFFFF', height: 48 }}>К Shift OS</button>
      </div>
    )
  }

  return (
    <div className="anim-rise">
      <div className="flex items-center justify-between">
        <span className="font-display text-[24px] font-extrabold" style={{ color: left <= 10 ? '#EB5A52' : '#FDC55E' }}>0:{String(left).padStart(2, '0')}</span>
        <div className="flex gap-2">
          <Pill color="#C9D98A">обслужено {served}</Pill>
          <Pill color="#EB5A52">ушло {lost}</Pill>
        </div>
      </div>
      <div className="mt-2"><ProgressBar value={(left / DURATION) * 100} color={left <= 10 ? '#EB5A52' : '#FDC55E'} /></div>

      <div className="mt-4 space-y-2">
        {orders.length === 0 && (
          <div className="rounded-card bg-light p-6 text-center text-[13px]" style={{ color: '#555555' }}>
            Гости подходят к стойке…
          </div>
        )}
        {[...orders].sort((a, b) => a.patience - b.patience).map((o) => {
          const pct = (o.patience / o.drink.patience) * 100
          const color = pct > 50 ? '#C9D98A' : pct > 25 ? '#FDC55E' : '#EB5A52'
          return (
            <div key={o.key} className="rounded-card bg-light p-4" style={{ borderColor: color }}>
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-bold" style={{ color: '#111111' }}>{o.drink.name}</p>
                <span className="text-[10px]" style={{ color: '#555555' }}>{o.progress}/{o.drink.steps.length}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {o.drink.steps.map((st, i) => (
                  <span key={i} className="rounded-pill px-2 py-0.5 text-[10px] font-bold"
                    style={{
                      background: i < o.progress ? '#C9D98A' : i === o.progress ? '#FDC55E' : '#1B1B1D',
                      color: i <= o.progress ? '#111111' : '#FFFFFF',
                    }}>
                    {st}
                  </span>
                ))}
              </div>
              <div className="mt-2"><ProgressBar value={pct} color={color} h={4} /></div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {rushStepsLegend.map((st) => (
          <button key={st} onClick={() => tap(st)}
            className="rounded-[24px] py-3 text-[12px] font-bold transition-transform active:scale-95"
            style={{
              background: flash === 'bad' ? '#EB5A5233' : '#1B1B1D',
              border: '1px solid #3A3A3D',
              color: '#FFFFFF',
            }}>
            {st}
          </button>
        ))}
      </div>
      <p className="mt-2 text-center text-[11px]" style={{ color: '#555555' }}>
        Нажимай шаги в порядке сборки. Ошибка = −2 сек терпения гостя. Обслуживай самый горячий заказ!
      </p>
    </div>
  )
}

/* ---------------- main section ---------------- */
export default function Shift() {
  const s = useStore()
  const [tab, setTab] = useState<'model' | 'standards' | 'rush'>('model')
  const [rushOn, setRushOn] = useState(false)

  return (
    <div className="space-y-6">
      <div className="anim-rise">
        <p className="eyebrow">Shift OS · сервис и тайминг</p>
        <h1 className="font-display mt-2 text-[28px] font-extrabold uppercase leading-tight" style={{ color: '#FFFFFF' }}>Смена как система</h1>
        <p className="mt-2 text-[13px]" style={{ color: '#555555' }}>
          Модель высокопоточного спешелти-бара: позиции, поток, секвенсинг и стандарты времени — как в топовых кофейнях Австралии.
        </p>
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto anim-rise">
        {([
          ['model', 'Модель бара'],
          ['standards', 'Стандарты времени'],
          ['rush', 'Rush-симулятор'],
        ] as const).map(([id, label]) => (
          <Chip key={id} active={tab === id} onClick={() => { setTab(id); setRushOn(false) }}>{label}</Chip>
        ))}
      </div>

      {tab === 'model' && (
        <div className="space-y-6">
          <div className="rounded-card bg-light p-5 anim-rise">
            <h2 className="font-display text-[15px] font-extrabold uppercase" style={{ color: '#111111' }}>5 принципов потока</h2>
            <div className="mt-4 space-y-4">
              {ausPrinciples.map((p, i) => (
                <div key={i} className="flex gap-3">
                  <span className="font-display text-[18px] font-extrabold" style={{ color: '#FDC55E' }}>{i + 1}</span>
                  <div>
                    <p className="text-[13px] font-bold" style={{ color: '#111111' }}>{p.title}</p>
                    <p className="mt-1 text-[13px] leading-relaxed" style={{ color: '#555555' }}>{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="anim-rise">
            <h2 className="font-display text-[15px] font-extrabold uppercase" style={{ color: '#FFFFFF' }}>Схема потока заказа</h2>
            <div className="mt-3 space-y-0">
              {serviceFlow.map((f, i) => (
                <div key={f.n} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold"
                      style={{ background: '#C9D98A', color: '#111111' }}>{f.n}</span>
                    {i < serviceFlow.length - 1 && <span className="w-px flex-1" style={{ background: '#3A3A3D' }} />}
                  </div>
                  <div className="pb-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[13px] font-bold" style={{ color: '#FFFFFF' }}>{f.title}</p>
                      <span className="text-[10px] font-bold" style={{ color: '#FDC55E' }}>{f.time}</span>
                    </div>
                    <p className="mt-1 text-[13px] leading-relaxed" style={{ color: '#555555' }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="anim-rise">
            <h2 className="font-display text-[15px] font-extrabold uppercase" style={{ color: '#FFFFFF' }}>Позиции в пике</h2>
            <p className="mt-1 text-[12px]" style={{ color: '#555555' }}>В малой смене один человек совмещает позиции — но логика потока та же.</p>
            <div className="mt-3 space-y-3">
              {barPositions.map((p) => (
                <details key={p.id} className="rounded-tile bg-light overflow-hidden group">
                  <summary className="flex cursor-pointer items-center justify-between p-4">
                    <div>
                      <p className="text-[13px] font-bold" style={{ color: '#111111' }}>{p.title} <span className="text-[10px] uppercase" style={{ color: '#555555' }}>· {p.en}</span></p>
                      <p className="mt-0.5 text-[12px]" style={{ color: '#555555' }}>{p.mission}</p>
                    </div>
                    <span className="transition-transform group-open:rotate-90" style={{ color: '#555555' }}>→</span>
                  </summary>
                  <div className="border-t p-4" style={{ borderColor: '#CFCCC4', background: '#FFFFFF' }}>
                    <ul className="space-y-2">
                      {p.duties.map((d, i) => (
                        <li key={i} className="flex gap-2 text-[13px]" style={{ color: '#111111' }}>
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: '#C9D98A' }} />
                          {d}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 rounded-[16px] p-3 text-[12px] font-bold" style={{ background: '#EB5A5222', color: '#EB5A52' }}>
                      {p.rule}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>

          <div className="rounded-card bg-light p-5 anim-rise">
            <h2 className="font-display text-[15px] font-extrabold uppercase" style={{ color: '#111111' }}>Секвенсинг: порядок запуска</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {sequenceRules.map((r, i) => (
                <div key={i} className="rounded-[24px] p-4" style={{ background: '#FFFFFF' }}>
                  <p className="text-[13px] font-bold" style={{ color: '#C9D98A' }}>{r.title}</p>
                  <p className="mt-1 text-[12px] leading-relaxed" style={{ color: '#555555' }}>{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'standards' && (
        <div className="space-y-6">
          <div className="rounded-card bg-light overflow-x-auto anim-rise">
            <table className="w-full min-w-[480px] text-[13px]">
              <thead>
                <tr style={{ background: '#1B1B1D' }}>
                  {['Напиток / метрика', 'Цель', 'Лимит', 'Ключ'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest" style={{ color: '#C9D98A' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeStandards.map((t, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: '#CFCCC4' }}>
                    <td className="px-4 py-3 font-bold" style={{ color: '#111111' }}>{t.drink}</td>
                    <td className="px-4 py-3 font-bold" style={{ color: '#FDC55E' }}>{t.target}</td>
                    <td className="px-4 py-3 font-bold" style={{ color: '#EB5A52' }}>{t.limit}</td>
                    <td className="px-4 py-3 text-[12px]" style={{ color: '#555555' }}>{t.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="anim-rise">
            <h2 className="font-display text-[15px] font-extrabold uppercase" style={{ color: '#FFFFFF' }}>Отраслевые ориентиры</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {guideStandards.map((g) => (
                <div key={g.id} className="rounded-card bg-light p-4">
                  <p className="eyebrow" style={{ color: '#FDC55E' }}>{g.kicker}</p>
                  <h3 className="font-display mt-1 text-[15px] font-extrabold uppercase" style={{ color: '#111111' }}>{g.title}</h3>
                  <p className="mt-1 text-[12px] leading-relaxed" style={{ color: '#555555' }}>{g.body}</p>
                  <div className="mt-3 overflow-hidden rounded-[16px] border" style={{ borderColor: '#CFCCC4' }}>
                    <table className="w-full text-[12px]">
                      <tbody>
                        {g.table.rows.map((row, j) => (
                          <tr key={j} className={j > 0 ? 'border-t' : ''} style={{ borderColor: '#CFCCC4' }}>
                            <td className="px-3 py-2" style={{ color: '#555555' }}>{row[0]}</td>
                            <td className="px-3 py-2 text-right font-bold" style={{ color: '#111111' }}>{row[1]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'rush' && (
        <div>
          {rushOn ? (
            <>
              <button onClick={() => setRushOn(false)} className="mb-5 rounded-pill border px-4 py-2 text-[12px] font-bold"
                style={{ borderColor: '#3A3A3D', color: '#FFFFFF' }}>← Назад</button>
              <Rush onExit={() => setRushOn(false)} />
            </>
          ) : (
            <div className="rounded-card bg-light p-8 text-center anim-rise" style={{ borderColor: '#EB5A52' }}>
              <p className="eyebrow" style={{ color: '#EB5A52' }}>Тренажёр потока</p>
              <h2 className="font-display mt-2 text-[22px] font-extrabold uppercase" style={{ color: '#111111' }}>Rush-симулятор</h2>
              <p className="mx-auto mt-3 max-w-md text-[13px] leading-relaxed" style={{ color: '#555555' }}>
                60 секунд утреннего пика. Гости приходят с заказами, терпение тает.
                Собирай напитки по шагам из ТТК, обслуживай самые горячие заказы первыми.
              </p>
              <p className="mt-4 text-[13px] font-bold" style={{ color: '#C9D98A' }}>Рекорд: {s.rushBest} гостей</p>
              <button onClick={() => setRushOn(true)} className="mt-6 rounded-btn px-10 py-4 text-[13px] font-extrabold uppercase"
                style={{ background: '#EB5A52', color: '#FFFFFF', height: 48 }}>
                Начать смену
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
