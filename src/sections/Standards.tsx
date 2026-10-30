import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { t, type Lang } from '../lang'
import { actions, useStore } from '../store'
import { disciplineChecklists } from '../data/discipline'
import { timeStandards } from '../data/service'
import { CardLight, ButtonPrimary, ChecklistRow, ProgressBar, Chip, Pill, H1 } from '../components/app-ui'

export default function Standards({ lang }: { lang: Lang }) {
  const L = (key: string) => t(key, lang)
  const s = useStore()
  const [tab, setTab] = useState<'standards' | 'checklists' | 'time'>('standards')
  const [itemDone, setItemDone] = useState<Record<string, Set<string>>>({})

  const today = new Date().toISOString().slice(0, 10)
  const toggleItem = useCallback((clId: string, itemId: string) => {
    setItemDone((prev) => {
      const set = new Set(prev[clId] || [])
      if (set.has(itemId)) set.delete(itemId)
      else set.add(itemId)
      return { ...prev, [clId]: set }
    })
  }, [])

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="space-y-2"
      >
        <Eyebrow>Стандарты сети · чек-листы</Eyebrow>
        <H1>{L('standards.title_ru')}</H1>
        <p className="mt-1 text-[13px]" style={{ color: '#555555' }}>{L('standards.subtitle_ru')}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
        className="no-scrollbar flex gap-2 overflow-x-auto"
      >
        {(['standards', 'checklists', 'time'] as const).map((id) => {
          const labels: Record<string, string> = { standards: 'Стандарты', checklists: 'Чек-листы', time: 'Стандарты времени' }
          return <Chip key={id} active={tab === id} onClick={() => setTab(id)}>{labels[id]}</Chip>
        })}
      </motion.div>

      {tab === 'standards' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.2 }}
          className="space-y-4"
        >
          {[
            { id: 'service', title: 'Стандарт сервиса', kicker: 'Гость и стойка', body: 'Четыре шага контакта: встреча → потребность → одно предложение → прощание. Допродажа — не чаще одного раза за заказ.' },
            { id: 'hygiene', title: 'Стандарт гигиены', kicker: 'Станция и оборудование', body: 'Стимер продевается и вытирается сразу после молока. Корзина вычищается после каждого шота. Бэкфлаш всех групп — ежедневно в конце смены.' },
            { id: 'pouring', title: 'Стандарт подачи', kicker: 'Чистая чашка, имя, температура', body: 'Напиток сверяется с чеком перед выдачей. Чистый стакан и край, крышка, имя, температура и вид напитка, отсутствие пролива.' },
            { id: 'bar', title: 'Работа на баре', kicker: 'Поток и синхрон', body: 'Шот стартует до взбивания молока. Молоко ждёт шот максимум 10 секунд. Фильтр ставится первым «фоном». Холодное собирается на отдельной станции.' },
          ].map((st) => (
            <motion.div key={st.id} whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.99 }} className="space-y-3">
              <CardLight className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <Eyebrow color="yellow">{st.kicker}</Eyebrow>
                    <Pill dark>Все уровни</Pill>
                  </div>
                </div>
                <h3 className="font-display mt-1 text-[15px] font-extrabold uppercase leading-none" style={{ color: '#111111' }}>{st.title}</h3>
                <p className="mt-1 text-[13px] leading-relaxed" style={{ color: '#111111' }}>{st.body}</p>
              </CardLight>
            </motion.div>
          ))}
        </motion.div>
      )}

      {tab === 'checklists' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.2 }}
          className="space-y-4"
        >
          {disciplineChecklists.map((cl) => {
            const done = itemDone[cl.id] || new Set()
            const pct = cl.items.length ? Math.round((done.size / cl.items.length) * 100) : 0
            const doneToday = (s.checklistsDone[cl.id] || []).includes(today)
            return (
              <motion.div key={cl.id} whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.99 }} className="space-y-4">
                <CardLight className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Eyebrow color="violet">{cl.kicker}</Eyebrow>
                      <h3 className="font-display mt-1 text-[15px] font-extrabold uppercase leading-none" style={{ color: '#111111' }}>{cl.title}</h3>
                    </div>
                    <div className="text-left">
                      <p className="font-display text-[14px] font-extrabold tnum" style={{ color: '#111111' }}>{pct}%</p>
                      <p className="text-[11px] font-bold" style={{ color: '#555555' }}>{done.size} / {cl.items.length}</p>
                    </div>
                  </div>
                  <div className="mt-2"><ProgressBar value={pct} /></div>
                  <div className="mt-3 space-y-1">
                    {cl.items.map((it) => (
                      <ChecklistRow key={it.id} checked={done.has(it.id)} label={it.text} note={it.tip} onToggle={() => toggleItem(cl.id, it.id)} disabled={doneToday} />
                    ))}
                  </div>
                  <div className="mt-3 flex items-start gap-2">
                    <ButtonPrimary onClick={() => { if (done.size === cl.items.length) actions.completeChecklist(cl.id) }} disabled={done.size !== cl.items.length || doneToday} fullWidth={false}>
                      {L('standards.close_ru')}
                    </ButtonPrimary>
                    {doneToday && <span className="text-[11px] font-bold" style={{ color: '#C9D98A' }}>✓ {L('standards.today_ru')}</span>}
                  </div>
                </CardLight>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {tab === 'time' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.2 }}
          className="space-y-4"
        >
          <Eyebrow color="yellow">{L('standards.src_ru')}</Eyebrow>
          <p className="mt-1 text-[13px] leading-relaxed" style={{ color: '#555555' }}>{L('standards.desc_ru')}</p>
          <div className="mt-4 space-y-3">
            {timeStandards.map((t) => (
              <CardLight key={t.drink} className="flex items-start justify-between gap-3 p-4">
                <div>
                  <h3 className="font-display text-[13px] font-extrabold uppercase leading-none" style={{ color: '#111111' }}>{t.drink}</h3>
                  <p className="mt-0.5 text-[11px] font-bold" style={{ color: '#555555' }}>{t.note}</p>
                </div>
                <div className="text-left">
                  <p className="font-display text-[14px] font-extrabold tnum" style={{ color: '#FDC55E' }}>{t.target}</p>
                  <p className="text-[11px] font-bold" style={{ color: '#EB5A52' }}>Лимит {t.limit}</p>
                </div>
              </CardLight>
            ))}
          </div>
          <div className="rounded-card bg-surface p-4" style={{ border: '1px dashed #3A3A3D' }}>
            <Eyebrow color="violet">{L('standards.custom_ru')}</Eyebrow>
            <p className="mt-1 text-[12px]" style={{ color: '#555555' }}>{L('standards.custom_desc_ru')}</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

function Eyebrow({ color = 'lime', children }: { color?: string; children: React.ReactNode }) {
  return <p className="mb-2" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.14em', color, margin: 0 }}>{children}</p>
}
