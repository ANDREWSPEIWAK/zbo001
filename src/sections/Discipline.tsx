import { useState } from 'react'
import { motion } from 'framer-motion'
import { t, type Lang } from '../lang'
import { disciplineChecklists, disciplineRules, levelLabels } from '../data/discipline'
import { CardLight, Chip } from '../components/app-ui'

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
        <Eyebrow>Дисциплина сети</Eyebrow>
        <H1>{L('discipline.title_ru')}</H1>
        <p className="mt-1 text-[13px]" style={{ color: '#555555' }}>{L('discipline.subtitle_ru')}</p>
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
            const bg = lvl.color === '#EB5A52' ? 'bg-[#EB5A5222]' : lvl.color === '#FDC55E' ? 'bg-[#FDC55E22]' : 'bg-[#C9D98A22]'
            return (
              <motion.div key={r.id}
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.99 }}
                className="space-y-3"
              >
                <CardLight className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className={`rounded-[22px] px-3 py-1 text-[11px] font-bold ${bg}`} style={{ color: lvl.color }}>{lvl.label}</span>
                      <h3 className="font-display mt-1 text-[15px] font-extrabold uppercase leading-none" style={{ color: '#111111' }}>{r.title}</h3>
                    </div>
                    <span className={`text-[11px] font-bold ${r.level === 'critical' ? 'text-[#EB5A52]' : r.level === 'major' ? 'text-[#FDC55E]' : 'text-[#C9D98A]'}`}>{r.level}</span>
                  </div>
                  <p className="mt-1 text-[13px] leading-relaxed" style={{ color: '#111111' }}>{r.rule}</p>
                  <div className="mt-3 grid gap-2">
                    <div className="rounded-[20px] p-3" style={{ background: '#FFFFFF' }}>
                      <Eyebrow color="violet" style={{ marginBottom: 4 }}>{L('discipline.why_ru')}</Eyebrow>
                      <p className="text-[12px] leading-relaxed" style={{ color: '#111111' }}>{r.why}</p>
                    </div>
                    <div className="rounded-[20px] p-3" style={{ background: '#FFFFFF' }}>
                      <Eyebrow color="coral" style={{ marginBottom: 4 }}>{L('discipline.how_ru')}</Eyebrow>
                      <p className="text-[12px] leading-relaxed" style={{ color: '#111111' }}>{r.how}</p>
                    </div>
                  </div>
                </CardLight>
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
              <CardLight className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Eyebrow color="violet">{cl.kicker}</Eyebrow>
                    <h3 className="font-display mt-1 text-[15px] font-extrabold uppercase leading-none" style={{ color: '#111111' }}>{cl.title}</h3>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  {cl.items.map((it) => (
                    <div key={it.id} className="flex items-start gap-3 border-t border-solid border-[#3A3A3D] px-4 py-3 btn-press">
                      <button type="button" aria-pressed={false} className="mt-0.5 flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-[6px] border-2" style={{ borderColor: '#FFFFFF', background: 'transparent' }} />
                      <span className="flex-1 text-[14px] font-bold leading-relaxed" style={{ color: '#111111' }}>{it.text}</span>
                      {it.tip && <span className="text-right text-[11px] font-bold" style={{ color: '#555555' }}>{it.tip}</span>}
                    </div>
                  ))}
                </div>
                <button className="mt-3 w-auto" style={{ height: 44, padding: '0 14px', fontSize: '12px' }}>{L('discipline.open_std_ru')}</button>
              </CardLight>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

function Eyebrow({ color = 'lime', children, style }: { color?: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.14em', color, margin: 0, ...style }}>{children}</p>
}

function H1({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h1 className={`mt-1 ${className}`} style={{ fontFamily: "'Unbounded', 'Manrope', sans-serif", fontWeight: 800, fontSize: 28, textTransform: 'uppercase', lineHeight: 1.1 }}>{children}</h1>
}
