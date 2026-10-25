import { useState } from 'react'
import { actions, useStore } from '../store'
import { disciplineChecklists, disciplineRules, levelLabels } from '../data/discipline'
import { Chip, ProgressBar } from '../components/app-ui'

function ChecklistCard({ id }: { id: string }) {
  const s = useStore()
  const list = disciplineChecklists.find((c) => c.id === id)!
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [showTips, setShowTips] = useState<string | null>(null)
  const today = new Date().toISOString().slice(0, 10)
  const doneToday = (s.checklistsDone[id] || []).includes(today)
  const totalDone = (s.checklistsDone[id] || []).length

  const count = list.items.filter((it) => checked[it.id]).length
  const all = count === list.items.length

  return (
    <div className="rounded-card bg-light overflow-hidden">
      <div className="p-5" style={{ background: '#1B1B1D' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">{list.kicker}</p>
            <h3 className="font-display mt-1 text-[15px] font-extrabold uppercase" style={{ color: '#FFFFFF' }}>{list.title}</h3>
          </div>
          {doneToday
            ? <span className="rounded-pill px-[12px] py-[5px] text-[12px] font-bold" style={{ background: '#C9D98A', color: '#111111' }}>сегодня ✓</span>
            : <span className="rounded-pill px-[12px] py-[5px] text-[12px] font-bold" style={{ background: '#FDC55E', color: '#111111' }}>{count}/{list.items.length}</span>}
        </div>
        <div className="mt-3"><ProgressBar value={doneToday ? 100 : (count / list.items.length) * 100} color={doneToday ? '#C9D98A' : '#FDC55E'} /></div>
        <p className="mt-2 text-[10px]" style={{ color: '#555555' }}>выполнено раз: {totalDone}</p>
      </div>
      <div>
        {list.items.map((it) => {
          const on = doneToday || !!checked[it.id]
          return (
            <div key={it.id} className="border-t px-4 py-3" style={{ borderColor: '#CFCCC4' }}>
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  disabled={doneToday}
                  onClick={() => setChecked((prev) => ({ ...prev, [it.id]: !prev[it.id] }))}
                  aria-pressed={on}
                  className="mt-0.5 flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-[6px] border-2"
                  style={{ borderColor: '#111111', background: on ? '#111111' : 'transparent' }}
                >
                  {on && <span style={{ color: '#C9D98A', fontSize: 12, fontWeight: 700 }}>✓</span>}
                </button>
                <span className={`flex-1 text-[13px] font-bold ${on ? 'line-through opacity-50' : ''}`} style={{ color: '#111111' }}>
                  {it.text}
                </span>
                <button
                  type="button"
                  onClick={() => setShowTips(showTips === it.id ? null : it.id)}
                  className="shrink-0 rounded-pill px-2 py-0.5 text-[10px] font-bold"
                  style={{ background: '#1B1B1D', color: '#FDC55E' }}
                >
                  как соблюдать
                </button>
              </div>
              {showTips === it.id && (
                <p className="anim-rise mt-2 ml-8 rounded-[16px] p-3 text-[12px] leading-relaxed"
                  style={{ background: '#FFFFFF', color: '#111111', border: '1px solid #FDC55E55' }}>
                  {it.tip}
                </p>
              )}
            </div>
          )
        })}
      </div>
      {!doneToday && (
        <div className="p-4">
          <button
            disabled={!all}
            onClick={() => actions.completeChecklist(id)}
            className="w-full rounded-btn px-4 py-3 text-[13px] font-extrabold uppercase disabled:cursor-not-allowed disabled:opacity-30"
            style={{ background: '#111111', color: '#FFFFFF', height: 48 }}
          >
            {all ? 'Закрыть чек-лист · +30 XP' : `Осталось ${list.items.length - count} пунктов`}
          </button>
        </div>
      )}
    </div>
  )
}

export default function Discipline() {
  const [tab, setTab] = useState<'checks' | 'rules'>('checks')
  return (
    <div className="space-y-6">
      <div className="anim-rise">
        <p className="eyebrow">Стандарты и дисциплина</p>
        <h1 className="font-display mt-2 text-[28px] font-extrabold uppercase leading-tight" style={{ color: '#FFFFFF' }}>Дисциплина станции</h1>
        <p className="mt-2 text-[13px]" style={{ color: '#555555' }}>
          Рабочие чек-листы смены и дисциплинарные требования — с конкретными рекомендациями, как их соблюдать без лишних нервов.
        </p>
      </div>

      <div className="flex gap-2 anim-rise">
        <Chip active={tab === 'checks'} onClick={() => setTab('checks')}>Чек-листы</Chip>
        <Chip active={tab === 'rules'} onClick={() => setTab('rules')}>Требования</Chip>
      </div>

      {tab === 'checks' && (
        <div className="space-y-4">
          {disciplineChecklists.map((c) => <ChecklistCard key={c.id} id={c.id} />)}
        </div>
      )}

      {tab === 'rules' && (
        <div className="space-y-3">
          {disciplineRules.map((r) => {
            const lv = levelLabels[r.level]
            return (
              <details key={r.id} className="rounded-tile bg-light overflow-hidden anim-rise">
                <summary className="flex cursor-pointer items-center gap-3 p-4">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: lv.color }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold" style={{ color: '#111111' }}>{r.title}</p>
                    <p className="truncate text-[12px]" style={{ color: '#555555' }}>{r.rule}</p>
                  </div>
                  <span className="rounded-pill px-[12px] py-[5px] text-[12px] font-bold" style={{ background: lv.color, color: '#FFFFFF' }}>{lv.label}</span>
                </summary>
                <div className="space-y-3 border-t p-4" style={{ borderColor: '#CFCCC4', background: '#FFFFFF' }}>
                  <div>
                    <p className="eyebrow" style={{ color: '#5B3FF0' }}>Требование</p>
                    <p className="mt-1 text-[13px] leading-relaxed" style={{ color: '#111111' }}>{r.rule}</p>
                  </div>
                  <div>
                    <p className="eyebrow" style={{ color: '#EB5A52' }}>Зачем это</p>
                    <p className="mt-1 text-[13px] leading-relaxed" style={{ color: '#111111' }}>{r.why}</p>
                  </div>
                  <div className="rounded-[24px] p-3" style={{ background: '#C9D98A22', border: '1px solid #C9D98A55' }}>
                    <p className="eyebrow" style={{ color: '#C9D98A' }}>Как соблюдать</p>
                    <p className="mt-1 text-[13px] leading-relaxed" style={{ color: '#111111' }}>{r.how}</p>
                  </div>
                </div>
              </details>
            )
          })}
        </div>
      )}
    </div>
  )
}
