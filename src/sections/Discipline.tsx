import { useState } from 'react'
import { disciplineChecklists, disciplineRules, levelLabels } from '../data/discipline'
import { Card, Button, Chip, ChecklistRow } from '../components/app-ui'

function levelChip(lvl: { label: string; color: string }) {
  const bg =
    lvl.color === '#F87171' ? 'bg-[#F8717122]' : lvl.color === '#FBBF24' ? 'bg-[#FBBF2422]' : 'bg-[#C9DB8A22]'
  return (
    <span className={`rounded-[22px] px-3 py-1 text-[11px] font-bold ${bg}`} style={{ color: lvl.color }}>
      {lvl.label}
    </span>
  )
}

function levelText(level: 'critical' | 'major' | 'minor') {
  if (level === 'critical') return 'text-[#F87171]'
  if (level === 'major') return 'text-[#FBBF24]'
  return 'text-[#C9DB8A]'
}

export default function Discipline() {
  const [tab, setTab] = useState<'rules' | 'checklists'>('rules')

  return (
    <div className="space-y-6">
      <div className="anim-rise">
        <p className="eyebrow">Дисциплина сети</p>
        <h1 className="font-display mt-2 text-[28px] font-extrabold uppercase leading-none" style={{ color: '#FFFFFF' }}>Дисциплина</h1>
        <p className="mt-2 text-[13px]" style={{ color: '#666666' }}>
          Правила, нарушения стандартов и способы исправления — только из внутренних документов сети.
        </p>
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto anim-rise">
        <Chip active={tab === 'rules'} onClick={() => setTab('rules')}>Правила</Chip>
        <Chip active={tab === 'checklists'} onClick={() => setTab('checklists')}>Чек-листы смены</Chip>
      </div>

      {tab === 'rules' && (
        <div className="space-y-3">
          {disciplineRules.map((r) => {
            const lvl = levelLabels[r.level]
            return (
              <Card key={r.id} light className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    {levelChip(lvl)}
                    <h3 className="font-display mt-1 text-[15px] font-extrabold uppercase leading-none" style={{ color: '#FFFFFF' }}>{r.title}</h3>
                  </div>
                  <span className={`text-[11px] font-bold ${levelText(r.level)}`}>{r.level}</span>
                </div>
                <p className="mt-1 text-[13px] leading-relaxed" style={{ color: '#FFFFFF' }}>{r.rule}</p>
                <div className="mt-3 grid gap-2">
                  <div className="rounded-[20px] p-3" style={{ background: '#1A1A1C' }}>
                    <p className="eyebrow mb-1" style={{ color: '#8B5CF6' }}>Почему это важно</p>
                    <p className="text-[12px] leading-relaxed" style={{ color: '#FFFFFF' }}>{r.why}</p>
                  </div>
                  <div className="rounded-[20px] p-3" style={{ background: '#1A1A1C' }}>
                    <p className="eyebrow mb-1" style={{ color: '#F87171' }}>Как исправлять</p>
                    <p className="text-[12px] leading-relaxed" style={{ color: '#FFFFFF' }}>{r.how}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {tab === 'checklists' && (
        <div className="space-y-4">
          {disciplineChecklists.map((cl) => (
            <Card key={cl.id} light className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="eyebrow" style={{ color: '#8B5CF6' }}>{cl.kicker}</p>
                  <h3 className="font-display mt-1 text-[15px] font-extrabold uppercase leading-none" style={{ color: '#FFFFFF' }}>{cl.title}</h3>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                {cl.items.map((it) => (
                  <ChecklistRow key={it.id} checked={false} label={it.text} note={it.tip} onToggle={() => {}} />
                ))}
              </div>
              <Button variant="secondary" className="mt-3 w-auto" style={{ height: 44, padding: '0 14px', fontSize: '12px' }}>Открыть в разделе «Стандарты»</Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
