import { useEffect, useRef, useState } from 'react'
import { actions, useStore } from '../store'
import { barPositions, serviceFlow, timeStandards, sequenceRules, rushDrinks, rushStepsLegend, type RushDrink } from '../data/service'
import { Chip, ProgressBar, Pill, Card } from '../components/app-ui'

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
      <div className="rounded-card bg-surface p-8 text-center anim-pop">
        <p className="eyebrow" style={{ color: '#5B45F0' }}>Смена окончена</p>
        <p className="font-display mt-3 text-[48px] font-extrabold" style={{ color: '#C9DB8A' }}>{served}</p>
        <p className="mt-1 text-[13px]" style={{ color: '#555555' }}>гостей обслужено · потеряно: {lost}</p>
        <p className="mx-auto mt-4 max-w-sm text-[13px] leading-relaxed" style={{ color: '#111111' }}>
          {served >= 6
            ? 'Машина потока. Поток не остановить — так держат утро в пике.'
            : served >= 4
              ? 'Хороший темп. Следите за приоритетом — обслуживайте самый «горячий» заказ первым.'
              : 'Начинайте с самого нетерпеливого гостя и помните порядок сборки из ТТК.'}
        </p>
        <button onClick={onExit} className="mt-6 rounded-[26px] px-8 py-3 text-[13px] font-extrabold uppercase btn-press"
          style={{ background: '#111111', color: '#FFFFFF', height: 52 }}>Вернуться к смене</button>
      </div>
    )
  }

  return (
    <div className="anim-rise">
      <div className="flex items-center justify-between">
        <span className="font-display text-[24px] font-extrabold" style={{ color: left <= 10 ? '#EE5A55' : '#FBC85F' }}>0:{String(left).padStart(2, '0')}</span>
        <div className="flex gap-2">
          <Pill color="#C9DB8A">обслужено {served}</Pill>
          <Pill color="#EE5A55">ушло {lost}</Pill>
        </div>
      </div>
      <div className="mt-2"><ProgressBar value={(left / DURATION) * 100} color={left <= 10 ? '#EE5A55' : '#FBC85F'} /></div>

      <div className="mt-4 space-y-2">
        {orders.length === 0 && (
          <div className="rounded-card bg-surface p-6 text-center text-[13px]" style={{ color: '#555555' }}>
            Гости подходят к стойке…
          </div>
        )}
        {[...orders].sort((a, b) => a.patience - b.patience).map((o) => {
          const pct = (o.patience / o.drink.patience) * 100
          const color = pct > 50 ? '#C9DB8A' : pct > 25 ? '#FBC85F' : '#EE5A55'
          return (
            <div key={o.key} className="rounded-card bg-surface p-4" style={{ borderColor: color }}>
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-bold" style={{ color: '#111111' }}>{o.drink.name}</p>
                <span className="text-[10px]" style={{ color: '#555555' }}>{o.progress}/{o.drink.steps.length}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {o.drink.steps.map((st, i) => (
                  <span key={i} className="rounded-pill px-2 py-0.5 text-[10px] font-bold"
                    style={{
                      background: i < o.progress ? '#C9DB8A' : i === o.progress ? '#FBC85F' : '#1B1B1D',
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
            className="rounded-[24px] py-3 text-[12px] font-bold btn-press"
            style={{
              background: flash === 'bad' ? '#EE5A5533' : '#1B1B1D',
              border: '1px solid #2A2A2D',
              color: '#FFFFFF',
            }}>
            {st}
          </button>
        ))}
      </div>
      <p className="mt-2 text-center text-[11px]" style={{ color: '#555555' }}>
        Нажимайте шаги в порядке сборки. Ошибка = −2 сек терпения гостя. Обслуживайте самый горячий заказ!
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
        <p className="eyebrow">Смена · сервис и тайминг</p>
        <h1 className="font-display mt-2 text-[28px] font-extrabold uppercase leading-none" style={{ color: '#FFFFFF' }}>Смена как система</h1>
        <p className="mt-2 text-[13px]" style={{ color: '#555555' }}>
          Модель высокопоточного бара: позиции, поток, секвенсинг и стандарты времени. Цифры — из калькуляций ТТК сети.
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
          <Card light className="space-y-4 anim-rise">
            <h2 className="font-display text-[15px] font-extrabold uppercase" style={{ color: '#111111' }}>5 принципов потока</h2>
            <p className="eyebrow mb-2" style={{ color: '#5B45F0' }}>Источник: калькуляции ТТК сети</p>
            <div className="space-y-3">
              {[
                { title: 'Одна линия — один поток', body: 'Заказ движется по одной линии: касса → стакан в очередь → шот → молоко → пасс. Каждая позиция делает только своё звено.' },
                { title: 'Синхрон шота и молока', body: 'Молоко готовится к концу шота ±10 секунд. Молоко, которое ждёт, расслаивается; шот, который ждёт, теряет вкус.' },
                { title: 'Батчинг без потери качества', body: 'Один питчер на два напитка, две корзины в работе, фильтр «фоном». Ничто не простаивает.' },
                { title: 'Пасс как дирижёр', body: 'Экспедитор видит всю очередь и управляет приоритетами: «с собой» и просроченные — вперёд.' },
                { title: 'Стандарты времени публичны', body: 'Цифры перед глазами команды: капучино 90 секунд, полная очередь ≤ 4 минуты.' },
              ].map((p, i) => (
                <div key={i} className="flex gap-3">
                  <span className="font-display text-[18px] font-extrabold" style={{ color: '#FBC85F' }}>{i + 1}</span>
                  <div>
                    <p className="text-[13px] font-bold" style={{ color: '#111111' }}>{p.title}</p>
                    <p className="mt-1 text-[13px] leading-relaxed" style={{ color: '#555555' }}>{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card light className="space-y-4 anim-rise">
            <h2 className="font-display text-[15px] font-extrabold uppercase" style={{ color: '#111111' }}>Схема потока заказа</h2>
            <div className="mt-3 space-y-3">
              {serviceFlow.map((f, i) => (
                <div key={f.n} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold"
                      style={{ background: '#C9DB8A', color: '#111111' }}>{f.n}</span>
                    {i < serviceFlow.length - 1 && <span className="w-px flex-1" style={{ background: '#2A2A2D' }} />}
                  </div>
                  <div className="pb-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[13px] font-bold" style={{ color: '#111111' }}>{f.title}</p>
                      <span className="text-[10px] font-bold" style={{ color: '#FBC85F' }}>{f.time}</span>
                    </div>
                    <p className="mt-1 text-[12px] leading-relaxed" style={{ color: '#555555' }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card light className="space-y-4 anim-rise">
            <h2 className="font-display text-[15px] font-extrabold uppercase" style={{ color: '#111111' }}>Позиции в пике</h2>
            <p className="mt-1 text-[12px]" style={{ color: '#555555' }}>В малой смене один человек совмещает позиции — но логика потока та же.</p>
            <div className="mt-3 space-y-3">
              {barPositions.map((p) => (
                <Card key={p.id} light className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-bold" style={{ color: '#111111' }}>{p.title} <span className="text-[10px] uppercase" style={{ color: '#555555' }}>· {p.en}</span></p>
                      <p className="mt-0.5 text-[12px]" style={{ color: '#555555' }}>{p.mission}</p>
                    </div>
                    <span className="text-[12px] font-bold" style={{ color: '#555555' }}>→</span>
                  </div>
                  <ul className="space-y-1">
                    {p.duties.map((d, i) => (
                      <li key={i} className="flex gap-2 text-[13px]" style={{ color: '#111111' }}>
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: '#C9DB8A' }} />
                        {d}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 rounded-[16px] p-2 text-[12px] font-bold" style={{ background: '#EE5A5522', color: '#EE5A55' }}>
                    {p.rule}
                  </p>
                </Card>
              ))}
            </div>
          </Card>

          <Card light className="space-y-4 anim-rise">
            <h2 className="font-display text-[15px] font-extrabold uppercase" style={{ color: '#111111' }}>Секвенсинг: порядок запуска</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {sequenceRules.map((r, i) => (
                <div key={i} className="rounded-[24px] p-4" style={{ background: '#FFFFFF' }}>
                  <p className="text-[13px] font-bold" style={{ color: '#C9DB8A' }}>{r.title}</p>
                  <p className="mt-1 text-[12px] leading-relaxed" style={{ color: '#555555' }}>{r.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === 'standards' && (
        <div className="space-y-6">
          <Card light className="overflow-x-auto anim-rise">
            <table className="w-full min-w-[480px] text-[13px]">
              <thead>
                <tr style={{ background: '#1B1B1D' }}>
                  {['Напиток / метрика', 'Цель', 'Лимит', 'Ключ'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest" style={{ color: '#C9DB8A' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeStandards.map((t, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: '#CFCCC4' }}>
                    <td className="px-4 py-3 font-bold" style={{ color: '#111111' }}>{t.drink}</td>
                    <td className="px-4 py-3 font-bold" style={{ color: '#FBC85F' }}>{t.target}</td>
                    <td className="px-4 py-3 font-bold" style={{ color: '#EE5A55' }}>{t.limit}</td>
                    <td className="px-4 py-3 text-[12px]" style={{ color: '#555555' }}>{t.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card light className="space-y-4 anim-rise">
            <h2 className="font-display text-[15px] font-extrabold uppercase" style={{ color: '#FFFFFF' }}>Отраслевые ориентиры</h2>
            <p className="eyebrow mb-2" style={{ color: '#FBC85F' }}>SCA: вода, экстракция, температура</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {[
                { id: 'golden-cup', title: 'Golden Cup', kicker: 'Фильтр · SCA', body: '55 г на 1 л ≈ 1:18 ±10% · TDS 1,15–1,35% · экстракция 18–22% · вода 90–96 °C.' },
                { id: 'water', title: 'Вода', kicker: 'SCA Water Standard', body: 'Жёсткость 50–175 ppm · щёлочность 40–70 ppm · TDS 75–250 (ориент. 150) · pH ~7.' },
                { id: 'milk', title: 'Молоко', kicker: 'Микропена', body: 'Температура 55–65 °C, не выше 70 °C. Капучино — плотнее, латте — без шапки, флэт — минимум пены.' },
              ].map((g) => (
                <div key={g.id} className="rounded-[24px] p-4" style={{ background: '#FFFFFF' }}>
                  <p className="eyebrow" style={{ color: '#FBC85F' }}>{g.kicker}</p>
                  <h3 className="font-display mt-1 text-[15px] font-extrabold uppercase leading-none" style={{ color: '#111111' }}>{g.title}</h3>
                  <p className="mt-1 text-[12px] leading-relaxed" style={{ color: '#555555' }}>{g.body}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === 'rush' && (
        <div>
          {rushOn ? (
            <>
              <button onClick={() => setRushOn(false)} className="mb-5 rounded-[22px] border px-4 py-2 text-[12px] font-bold btn-press"
                style={{ borderColor: '#2A2A2D', color: '#FFFFFF' }}>← Назад</button>
              <Rush onExit={() => setRushOn(false)} />
            </>
          ) : (
            <Card light className="p-8 text-center anim-rise">
              <p className="eyebrow" style={{ color: '#EE5A55' }}>Тренажёр потока</p>
              <h2 className="font-display mt-2 text-[22px] font-extrabold uppercase leading-none" style={{ color: '#111111' }}>Rush-симулятор</h2>
              <p className="mx-auto mt-3 max-w-md text-[13px] leading-relaxed" style={{ color: '#555555' }}>
                60 секунд утреннего пика. Гости приходят с заказами, терпение тает. Собирайте напитки по шагам из ТТК, обслуживайте самые горячие заказы первыми.
              </p>
              <p className="mt-4 text-[13px] font-bold" style={{ color: '#C9DB8A' }}>Рекорд: {s.rushBest} гостей</p>
              <button onClick={() => setRushOn(true)} className="mt-6 rounded-[26px] px-10 py-4 text-[13px] font-extrabold uppercase btn-press"
                style={{ background: '#EE5A55', color: '#111111', height: 52 }}>Начать смену</button>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
