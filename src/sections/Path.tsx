import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { actions, useStore } from '../store'
import { t, type Lang } from '../lang'
import { levels, modules, attestations } from '../data/curriculum'
import { rankFor, badges } from '../data/gamification'
import { recipes } from '../data/recipes'
import { ProgressRing, ProgressBar, Card, Button, Pill } from '../components/app-ui'

export default function Path({ lang }: { lang: Lang }) {
  const s = useStore()
  const r = rankFor(s.xp)
  const knownCount = Object.values(s.known).filter(Boolean).length
  const totalTtk = recipes.length
  const lessonsCount = Object.values(s.lessonsRead).filter(Boolean).length
  const totalLessons = levels.reduce((acc, lv) => acc + lv.moduleIds.length, 0)
  const examTotal = Object.values(s.examKnown).filter(Boolean).length
  const totalExam = 40

  const L = (key: string) => t(key, lang)

  const greetingKey = useMemo(() => {
    const h = new Date().getHours()
    if (h < 6) return 'path.greeting_night_ru'
    if (h < 12) return 'path.greeting_morning_ru'
    if (h < 18) return 'path.greeting_day_ru'
    return 'path.greeting_evening_ru'
  }, [])
  const greeting = L(greetingKey)

  const nextModule = useMemo(() => {
    for (const lv of levels) {
      for (const m of modules.filter((m) => m.levelId === lv.id)) {
        if (!s.modulesDone[m.id]) return { lv, m }
      }
    }
    return null
  }, [s.modulesDone])

  const blocks = [
    { id: 'ttk', title: L('path.block_ttk_ru'), value: `${knownCount}`, total: `${totalTtk}`, color: '#C9DB8A' },
    { id: 'lessons', title: L('path.block_lessons_ru'), value: `${lessonsCount}`, total: `${totalLessons}`, color: '#C9DB8A' },
    { id: 'exam', title: L('path.block_exam_ru'), value: `${examTotal}`, total: `${totalExam}`, color: '#FBBF24' },
    { id: 'badges', title: L('path.block_badges_ru'), value: `${s.earnedBadges.length}`, total: `${badges.length}`, color: '#FBBF24' },
  ]

  const continueTarget = nextModule
    ? { label: nextModule.m.title, subtitle: nextModule.lv.title, id: nextModule.m.id }
    : { label: L('path.path_completed_ru'), subtitle: '', id: '' }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <p className="eyebrow">{greeting}</p>
          <h1 className="mt-1 font-display text-[28px] font-extrabold uppercase leading-none" style={{ color: '#FFFFFF' }}>
            {L('path.title_ru')} <span style={{ color: '#C9DB8A' }}>бариста</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <ProgressRing value={r.next ? (r.into / r.span) * 100 : 100} size={80} color="#FBBF24" stroke={6}>
            <span className="font-display text-[14px] font-extrabold tnum" style={{ color: '#0F0F10' }}>{s.xp}</span>
          </ProgressRing>
          <div>
            <p className="font-display text-[16px] font-extrabold" style={{ color: '#FBBF24' }}>{r.current.title}</p>
            {r.next && <p className="text-[11px] font-bold tnum" style={{ color: '#666666' }}>до «{r.next.title}» {r.next.xp - s.xp} XP</p>}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
        className="space-y-3"
      >
        <Card light accent="#FBBF24" className="space-y-3">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <p className="eyebrow" style={{ color: '#8B5CF6' }}>{L('path.continue_ru')}</p>
              <h2 className="font-display mt-1 text-[20px] font-extrabold uppercase leading-none" style={{ color: '#0F0F10' }}>
                Продолжить {continueTarget.id ? '«' + continueTarget.label + '»' : ''}
              </h2>
              <p className="mt-0.5 text-[12px] font-bold" style={{ color: '#666666' }}>{continueTarget.subtitle}</p>
            </div>
            <ProgressRing value={r.next ? (r.into / r.span) * 100 : 100} size={44} color="#C9DB8A" stroke={4}>
              <span className="text-[9px] font-bold tnum" style={{ color: '#0F0F10' }}>{Math.round((r.next ? (r.into / r.span) * 100 : 100))}%</span>
            </ProgressRing>
          </div>
          {continueTarget.id && (
            <Button onClick={() => actions.completeModule(continueTarget.id)} className="mt-3 w-full" style={{ height: 44, fontSize: '12px' }}>
              {L('path.open_module_ru')}
            </Button>
          )}
          {!continueTarget.id && (
            <p className="mt-3 text-[12px] font-bold text-left" style={{ color: '#C9DB8A' }}>{L('path.path_completed_ru')}</p>
          )}
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.2 }}
        className="grid grid-cols-2 gap-3"
      >
        {blocks.map((b) => (
          <Card key={b.id} light className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow" style={{ color: '#8B5CF6' }}>{b.title}</p>
                <p className="font-display mt-0.5 text-[13px] font-extrabold tnum" style={{ color: '#0F0F10' }}>{b.value} / {b.total}</p>
              </div>
              <ProgressRing value={(parseInt(b.value) / parseInt(b.total)) * 100} size={48} color={b.color} stroke={5}>
                <span className="text-[10px] font-bold tnum" style={{ color: '#0F0F10' }}>{Math.round((parseInt(b.value) / parseInt(b.total)) * 100)}%</span>
              </ProgressRing>
            </div>
            <div className="mt-2"><ProgressBar value={(parseInt(b.value) / parseInt(b.total)) * 100} color={b.color} h={5} /></div>
          </Card>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.3 }}
        className="rounded-card bg-surface overflow-hidden"
      >
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <h2 className="font-display text-[15px] font-extrabold uppercase" style={{ color: '#0F0F10' }}>{L('path.quests_ru')}</h2>
            <Pill color="#FBBF24">{L('path.quests_update_ru')}</Pill>
          </div>
          <div className="space-y-3">
            {s.quests.items.map((q) => (
              <div key={q.id} className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-[13px] font-bold ${q.done ? 'line-through opacity-50' : ''}`} style={{ color: '#0F0F10' }}>{q.title}</p>
                    <span className="text-[11px] font-bold tnum" style={{ color: q.done ? '#C9DB8A' : '#666666' }}>
                      {q.progress}/{q.target} · +{q.xp} XP
                    </span>
                  </div>
                  <div className="mt-1"><ProgressBar value={(q.progress / q.target) * 100} color={q.done ? '#C9DB8A' : '#FBBF24'} h={5} /></div>
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold"
                  style={{ background: q.done ? '#C9DB8A' : '#1A1A1C', color: q.done ? '#0F0F10' : '#FFFFFF' }}>
                  {q.done ? '✓' : '·'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.4 }}
        className="space-y-3"
      >
        <h2 className="font-display text-[15px] font-extrabold uppercase" style={{ color: '#FFFFFF' }}>{L('path.levels_ru')}</h2>
        <div className="mt-3 space-y-3">
          {levels.map((lv) => {
            const mods = modules.filter((m) => m.levelId === lv.id)
            const doneCount = mods.filter((m) => s.modulesDone[m.id]).length
            const pct = mods.length ? (doneCount / mods.length) * 100 : 0
            const xpLocked = (lv.id === 'skilled' && s.xp < 200) || (lv.id === 'pro' && s.xp < 600)
            return (
              <Card key={lv.id} light className="overflow-hidden space-y-0">
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="eyebrow" style={{ color: '#8B5CF6' }}>Уровень {lv.n} · {lv.duration}</p>
                      <h3 className="font-display mt-1 text-[15px] font-extrabold uppercase leading-none" style={{ color: '#0F0F10' }}>
                        {lv.title}
                      </h3>
                      <p className="mt-0.5 text-[12px] font-bold" style={{ color: '#666666' }}>{lv.tagline}</p>
                    </div>
                    <div className="text-left">
                      <p className="font-display text-[14px] font-extrabold tnum" style={{ color: xpLocked ? '#F87171' : '#C9DB8A' }}>
                        {xpLocked ? `закр. при ${lv.id === 'skilled' ? 200 : 600} XP` : Math.round(pct) + '%'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3"><ProgressBar value={pct} color={pct === 100 ? '#C9DB8A' : '#FBBF24'} h={5} /></div>
                </div>
                {!xpLocked && (
                  <div className="border-t border-solid border-[#3A3A3D] pt-4 space-y-2">
                    {mods.map((m) => {
                      const done = !!s.modulesDone[m.id]
                      return (
                        <Button
                          key={m.id}
                          variant={done ? 'secondary' : 'ghost'}
                          onClick={() => actions.completeModule(m.id)}
                          className="text-left justify-between"
                          style={{
                            height: 44,
                            background: done ? '#C9DB8A' : 'transparent',
                            color: done ? '#0F0F10' : '#FFFFFF',
                            border: done ? 'none' : '1px solid #3A3A3D',
                            fontSize: '12px',
                            padding: '0 12px',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span>{m.title}</span>
                          <span style={{ color: done ? '#0F0F10' : '#FBBF24' }}>{done ? '✓' : '→'}</span>
                        </Button>
                      )
                    })}
                    <Button
                      variant="ghost"
                      onClick={() => {}}
                      className="text-left justify-between"
                      style={{ height: 44, border: '1px solid #3A3A3D', color: '#F87171', fontSize: '12px', padding: '0 12px', justifyContent: 'space-between' }}
                    >
                      <span>{attestations[lv.id]?.title}</span>
                      <span style={{ color: '#F87171' }}>проверяет наставник</span>
                    </Button>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </motion.div>

      <div className="text-left text-[11px]" style={{ color: '#666666' }}>
        {L('path.source_ru')}
      </div>
    </div>
  )
}
