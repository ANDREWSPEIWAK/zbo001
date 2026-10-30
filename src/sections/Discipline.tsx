import { useState } from 'react'
import { motion } from 'framer-motion'
import { t, type Lang } from '../lang'
import { disciplineChecklists, disciplineRules, levelLabels } from '../data/discipline'
import { Card, Button, Chip } from '../components/app-ui'

export default function Discipline({ lang }: { lang: Lang }) {
  const L = (key: string) => t(key, lang)
  const [tab, setTab] = useState<'rules' | 'checklists'>('rules')

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="space-y-2"
      >
        <p className="eyebrow">Дисциплина сети</p>
        <h1 className="font-display mt-1 text-[28px] font-extrabold uppercase leading-none" style={{ color: '#FFFFFF' }}>{L('discipline.title_ru')}</h1>
        <p className="mt-1 text-[13px]" style={{ color: '#666666' }}>{L('discipline.subtitle_ru')}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
        className="no-scrollbar flex gap-2 overflow-x-auto"
      >
        <Chip active={tab === 'rules'} onClick={() => setTab('rules')}>{L('discipline.rules_ru')}</Chip>
        <Chip active={tab === 'checklists'} onClick={() => setTab('checklists')}>{L('discipline.checklists_ru')}</Chip>
      </motion.div>

      {tab === 'rules' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.2 }}
          className="space-y-3"
        >
          {disciplineRules.map((r) => {
            const lvl = levelLabels[r.level]
            const bg = lvl.color === '#F87171' ? 'bg-[#F8717122]' : lvl.color === '#FBBF24' ? 'bg-[#FBBF2422]' : 'bg-[#C9DB8A22]'
            return (
              <motion.div key={r.id}
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.99 }}
                className="space-y-3"
              >
                <Card light className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className={`rounded-[22px] px-3 py-1 text-[11px] font-bold ${bg}`} style={{ color: lvl.color }}>
                        {lvl.label}
                      </span>
                      <h3 className="font-display mt-1 text-[15px] font-extrabold uppercase leading-none" style={{ color: '#0F0F10' }}>{r.title}</h3>
                    </div>
                    <span className={`text-[11px] font-bold ${r.level === 'critical' ? 'text-[#F87171]' : r.level === 'major' ? 'text-[#FBBF24]' : 'text-[#C9DB8A]'}`}>
                      {r.level}
                    </span>
                  </div>
                  <p className="mt-1 text-[13px] leading-relaxed" style={{ color: '#0F0F10' }}>{r.rule}</p>
                  <div className="mt-3 grid gap-2">
                    <div className="rounded-[20px] p-3" style={{ background: '#FFFFFF' }}>
                      <p className="eyebrow mb-1" style={{ color: '#8B5CF6' }}>{L('discipline.why_ru')}</p>
                      <p className="text-[12px] leading-relaxed" style={{ color: '#0F0F10' }}>{r.why}</p>
                    </div>
                    <div className="rounded-[20px] p-3" style={{ background: '#FFFFFF' }}>
                      <p className="eyebrow mb-1" style={{ color: '#F87171' }}>{L('discipline.how_ru')}</p>
                      <p className="text-[12px] leading-relaxed" style={{ color: '#0F0F10' }}>{r.how}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {tab === 'checklists' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.2 }}
          className="space-y-4"
        >
          {disciplineChecklists.map((cl) => (
            <motion.div key={cl.id}
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.99 }}
              className="space-y-4"
            >
              <Card light className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="eyebrow" style={{ color: '#8B5CF6' }}>{cl.kicker}</p>
                    <h3 className="font-display mt-1 text-[15px] font-extrabold uppercase leading-none" style={{ color: '#0F0F10' }}>{cl.title}</h3>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  {cl.items.map((it) => (
                    <div key={it.id} className="flex items-start gap-3 border-t border-solid border-[#3A3A3D] px-4 py-3 btn-press">
                      <button type="button" aria-pressed={false}
                        className="mt-0.5 flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-[6px] border-2"
                        style={{ borderColor: '#FFFFFF', background: 'transparent' }}
                      />
                      <span className="flex-1 text-[14px] font-bold leading-relaxed" style={{ color: '#0F0F10' }}>{it.text}</span>
                      {it.tip && <span className="text-right text-[11px] font-bold" style={{ color: '#666666' }}>{it.tip}</span>}
                    </div>
                  ))}
                </div>
                <Button variant="secondary" className="mt-3 w-auto" style={{ height: 44, padding: '0 14px', fontSize: '12px' }}>{L('discipline.open_std_ru')}</Button>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
