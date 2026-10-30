import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { t, type Lang } from '../lang'
import { actions, useStore } from '../store'
import { barPositions, serviceFlow, timeStandards, sequenceRules, rushDrinks, rushStepsLegend, type RushDrink } from '../data/service'
import { Eyebrow, H1, CardLight, Chip, Pill, ProgressBar } from '../components/app-ui'

interface ActiveOrder {
  key: number
  drink: RushDrink
  progress: number
  patience: number
}

function Rush({ onExit, lang }: { onExit: () => void; lang: Lang }) {
  const L = (key: string) => t(key, lang)
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
      actions.addXp(served * 5, L('shift.rush_title_ru'))
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
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="CardLight p-8 text-left"
      >
        <Eyebrow color="violet">{L('shift.shift_end_ru')}</Eyebrow>
        <div className="flex items-start justify-between mt-3">
          <p className="font-display text-[48px] font-extrabold" style={{ color: '#C9D98A' }}>{served}</p>
          <div>
            <p className="mt-1 text-[13px]" style={{ color: '#555555' }}>{served} {L('shift.served_ru')} {lost}</p>
            <p className="text-[13px] leading-relaxed" style={{ color: '#111111' }}>
              {served >= 6 ? 'Машина потока. Поток не остановить — так держат утро в пике.' : served >= 4
                ? 'Хороший темп. Следите за приоритетом — обслуживайте самый «горячий» заказ первым.'
                : 'Начинайте с самого нетерпеливого гостя и помните порядок сборки из ТТК.'}
            </p>
          </div>
        </div>
        <button onClick={onExit} className="mt-6 rounded-[26px] px-8 py-3 text-[13px] font-extrabold uppercase btn-press"
          style={{ background: '#111111', color: '#FFFFFF', height: 52 }}>{L('shift.return_ru')}</button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="space-y-4"
    >
      <div className="flex items-start justify-between">
        <span className="font-display text-[24px] font-extrabold" style={{ color: left <= 10 ? '#EB5A52' : '#FDC55E' }}>0:{String(left).padStart(2, '0')}</span>
        <div className="flex gap-2">
          <Pill dark>{served} {L('tests.served_ru')}</Pill>
          <Pill dark>{lost} {L('tests.left_ru')}</Pill>
        </div>
      </div>
      <div className="mt-2"><ProgressBar value={(left / DURATION) * 100} /></div>

      <div className="mt-4 space-y-2">
        {orders.length === 0 && (
          <div className="CardLight p-6 text-left text-[13px]" style={{ color: '#555555' }}>
            Гости подходят к стойке…
          </div>
        )}
        {[...orders].sort((a, b) => a.patience - b.patience).map((o) => {
          const pct = (o.patience / o.drink.patience) * 100
          const color = pct > 50 ? '#C9D98A' : pct > 25 ? '#FDC55E' : '#EB5A52'
          return (
            <motion.div key={o.key} whileHover={{ scale: 1.005 }}
              className="CardLight p-4" style={{ borderColor: color }}
            >
              <div className="flex items-start justify-between">
                <p className="text-[13px] font-bold" style={{ color: '#111111' }}>{o.drink.name}</p>
                <span className="text-[10px]" style={{ color: '#555555' }}>{o.progress} / {o.drink.steps.length}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {o.drink.steps.map((st, i) => (
                  <span key={i} className="rounded-pill px-2 py-0.5 text-[10px] font-bold"
                    style={{ background: i < o.progress ? '#C9D98A' : i === o.progress ? '#FDC55E' : '#1B1B1D', color: i <= o.progress ? '#111111' : '#FFFFFF' }}>
                    {st}
                  </span>
                ))}
              </div>
              <div className="mt-2"><ProgressBar value={pct} /></div>
            </motion.div>
          )
        })}
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {rushStepsLegend.map((st) => (
          <button key={st} onClick={() => tap(st)}
            className="rounded-[24px] py-3 text-[12px] font-bold btn-press"
            style={{ background: flash === 'bad' ? '#EB5A5233' : '#1B1B1D', border: '1px solid #3A3A3D', color: '#FFFFFF' }}>
            {st}
          </button>
        ))}
      </div>
      <p className="mt-2 text-left text-[11px]" style={{ color: '#555555' }}>
        Нажимайте шаги в порядке сборки. Ошибка = −2 сек терпения гостя. Обслуживайте самый горячий заказ!
      </p>
    </motion.div>
  )
}

export default function Shift({ lang }: { lang: Lang }) {
  const L = (key: string) => t(key, lang)
  const s = useStore()
  const [tab, setTab] = useState<'model' | 'standards' | 'rush'>('model')
  const [rushOn, setRushOn] = useState(false)

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="space-y-2"
      >
        <Eyebrow>Смена · сервис и тайминг</Eyebrow>
        <H1>{L('shift.title_ru')}</H1>
        <p className="mt-1 text-[13px]" style={{ color: '#555555' }}>{L('shift.subtitle_ru')}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
        className="no-scrollbar flex gap-2 overflow-x-auto"
      >
        {(['model', 'standards', 'rush'] as const).map(([id, label]) => (
          <Chip key={id} active={tab === id as typeof tab} onClick={() => { setTab(id as typeof tab); setRushOn(false) }}>{label}</Chip>
        ))}
      </motion.div>

      {tab === 'model' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.2 }}
          className="space-y-6"
        >
          <CardLight className="space-y-4">
            <H1 style={{ fontSize: 15 }}>5 принципов потока</H1>
            <Eyebrow color="violet" style={{ marginBottom: 8 }}>Источник: калькуляции ТТК сети</Eyebrow>
            <div className="space-y-3">
              {[
                { title: 'Одна линия — один поток', body: 'Заказ движется по одной линии: касса → стакан в очередь → шот → молоко → пасс. Каждая позиция делает только своё звено.' },
                { title: 'Синхрон шота и молока', body: 'Молоко готовится к концу шота ±10 секунд. Молоко, которое ждёт, расслаивается; шот, который ждёт, теряет вкус.' },
                { title: 'Батчинг без потери качества', body: 'Один питчер на два напитка, две корзины в работе, фильтр «фоном». Ничто не простаивает.' },
                { title: 'Пасс как дирижёр', body: 'Экспедитор видит всю очередь и управляет приоритетами: «с собой» и просроченные — вперёд.' },
                { title: 'Стандарты времени публичны', body: 'Цифры перед глазами команды: капучино 90 секунд, полная очередь ≤ 4 минуты.' },
              ].map((p, i) => (
                <div key={i} className="flex gap-3">
                  <span className="font-display text-[18px] font-extrabold" style={{ color: '#FDC55E' }}>{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-[13px] font-bold" style={{ color: '#111111' }}>{p.title}</p>
                    <p className="mt-1 text-[13px] leading-relaxed" style={{ color: '#555555' }}>{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardLight>

          <CardLight className="space-y-4">
            <H1 style={{ fontSize: 15 }}>Схема потока заказа</H1>
            <div className="mt-3 space-y-3">
              {serviceFlow.map((f, i) => (
                <div key={f.n} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold"
                      style={{ background: '#C9D98A', color: '#111111' }}>{f.n}</span>
                    {i < serviceFlow.length - 1 && <span className="w-px flex-1" style={{ background: '#3A3A3D' }} />}
                  </div>
                  <div className="pb-4">
                    <div className="flex flex-wrap items-start gap-2">
                      <p className="text-[13px] font-bold" style={{ color: '#111111' }}>{f.title}</p>
                      <span className="text-[10px] font-bold" style={{ color: '#FDC55E' }}>{f.time}</span>
                    </div>
                    <p className="mt-1 text-[12px] leading-relaxed" style={{ color: '#555555' }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardLight>

          <CardLight className="space-y-4">
            <H1 style={{ fontSize: 15 }}>Позиции в пике</H1>
            <p className="mt-1 text-[12px]" style={{ color: '#555555' }}>В малой смене один человек совмещает позиции — но логика потока та же.</p>
            <div className="mt-3 space-y-3">
              {barPositions.map((p) => (
                <CardLight key={p.id} className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-[13px] font-bold" style={{ color: '#111111' }}>{p.title} <span className="text-[10px] uppercase" style={{ color: '#555555' }}>· {p.en}</span></p>
                      <p className="mt-0.5 text-[12px]" style={{ color: '#555555' }}>{p.mission}</p>
                    </div>
                    <span className="text-[12px] font-bold" style={{ color: '#555555' }}>→</span>
                  </div>
                  <ul className="space-y-1">
                    {p.duties.map((d, i) => (
                      <li key={i} className="flex gap-2 text-[13px]" style={{ color: '#111111' }}>
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: '#C9D98A' }} />
                        {d}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 rounded-[16px] p-2 text-[12px] font-bold" style={{ background: '#EB5A5222', color: '#EB5A52' }}>{p.rule}</p>
                </CardLight>
              ))}
            </div>
          </CardLight>

          <CardLight className="space-y-4">
            <H1 style={{ fontSize: 15 }}>Секвенсинг: порядок запуска</H1>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {sequenceRules.map((r, i) => (
                <div key={i} className="rounded-[24px] p-4" style={{ background: '#FFFFFF' }}>
                  <p className="text-[13px] font-bold" style={{ color: '#C9D98A' }}>{r.title}</p>
                  <p className="mt-1 text-[12px] leading-relaxed" style={{ color: '#555555' }}>{r.desc}</p>
                </div>
              ))}
            </div>
          </CardLight>
        </motion.div>
      )}

      {tab === 'standards' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.2 }}
          className="space-y-6"
        >
          <CardLight className="overflow-x-auto">
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
                  <tr key={i} className="border-t" style={{ borderColor: '#3A3A3D' }}>
                    <td className="px-4 py-3 font-bold" style={{ color: '#111111' }}>{t.drink}</td>
                    <td className="px-4 py-3 font-bold" style={{ color: '#FDC55E' }}>{t.target}</td>
                    <td className="px-4 py-3 font-bold" style={{ color: '#EB5A52' }}>{t.limit}</td>
                    <td className="px-4 py-3 text-[12px]" style={{ color: '#555555' }}>{t.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardLight>

          <CardLight className="space-y-4">
            <H1 style={{ fontSize: 15 }}>Отраслевые ориентиры</H1>
            <Eyebrow color="yellow" style={{ marginBottom: 8 }}>SCA: вода, экстракция, температура</Eyebrow>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {[
                { id: 'golden-cup', title: 'Golden Cup', kicker: 'Фильтр · SCA', body: '55 г на 1 л ≈ 1:18 ±10% · TDS 1,15–1,35% · экстракция 18–22% · вода 90–96 °C.' },
                { id: 'water', title: 'Вода', kicker: 'SCA Water Standard', body: 'Жёсткость 50–175 ppm · щёлочность 40–70 ppm · TDS 75–250 (ориент. 150) · pH ~7.' },
                { id: 'milk', title: 'Молоко', kicker: 'Микропена', body: 'Температура 55–65 °C, не выше 70 °C. Капучино — плотнее, латте — без шапки, флэт — минимум пены.' },
              ].map((g) => (
                <div key={g.id} className="rounded-[24px] p-4" style={{ background: '#FFFFFF' }}>
                  <Eyebrow color="yellow">{g.kicker}</Eyebrow>
                  <h3 className="font-display mt-1 text-[15px] font-extrabold uppercase leading-none" style={{ color: '#111111' }}>{g.title}</h3>
                  <p className="mt-1 text-[12px] leading-relaxed" style={{ color: '#555555' }}>{g.body}</p>
                </div>
              ))}
            </div>
          </CardLight>
        </motion.div>
      )}

      {tab === 'rush' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.2 }}
        >
          {rushOn ? (
            <>
              <motion.button onClick={() => setRushOn(false)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="mb-5 rounded-[22px] border px-4 py-2 text-[12px] font-bold btn-press"
                style={{ borderColor: '#3A3A3D', color: '#FFFFFF' }}
              >
                ← {L('shift.back_ru')}
              </motion.button>
              <Rush onExit={() => setRushOn(false)} lang={lang} />
            </>
          ) : (
            <CardLight className="p-8 text-center">
              <Eyebrow color="coral">Тренажёр потока</Eyebrow>
              <h2 className="font-display mt-2 text-[22px] font-extrabold uppercase leading-none" style={{ color: '#111111' }}>{L('shift.rush_title_ru')}</h2>
              <p className="mx-auto mt-3 max-w-md text-[13px] leading-relaxed" style={{ color: '#555555' }}>{L('shift.rush_desc_ru')}</p>
              <p className="mt-4 text-[13px] font-bold" style={{ color: '#C9D98A' }}>Рекорд: {s.rushBest} гостей</p>
              <motion.button onClick={() => setRushOn(true)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="mt-6 rounded-[26px] px-10 py-4 text-[13px] font-extrabold uppercase btn-press"
                style={{ background: '#EB5A52', color: '#111111', height: 52 }}
              >
                {L('shift.start_ru')}
              </motion.button>
            </CardLight>
          )}
        </motion.div>
      )}
    </div>
  )
}
