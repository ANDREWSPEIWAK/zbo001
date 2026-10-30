import { motion } from 'framer-motion'
import { actions, useStore } from '../store'
import { t, type Lang } from '../lang'
import { levels, modules, attestations } from '../data/curriculum'
import { rankFor, badges } from '../data/gamification'
import { recipes } from '../data/recipes'
import {
  Eyebrow, H1, CardLight, ProgressBar, ButtonPrimary,
  ProgressRing, Pill
} from '../components/app-ui'

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

  const nextModule = (() => {
    for (const lv of levels) {
      for (const m of modules.filter((m) => m.levelId === lv.id)) {
        if (!s.modulesDone[m.id]) return { lv, m }
      }
    }
    return null
  })()

  const blocks = [
    { id: 'ttk', title: L('path.block_ttk_ru'), value: `${knownCount}`, total: `${totalTtk}`, color: 'lime' },
    { id: 'lessons', title: L('path.block_lessons_ru'), value: `${lessonsCount}`, total: `${totalLessons}`, color: 'lime' },
    { id: 'exam', title: L('path.block_exam_ru'), value: `${examTotal}`, total: `${totalExam}`, color: 'yellow' },
    { id: 'badges', title: L('path.block_badges_ru'), value: `${s.earnedBadges.length}`, total: `${badges.length}`, color: 'yellow' },
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
          <Eyebrow>{greeting}</Eyebrow>
          <H1>{L('path.title_ru')} <span style={{ color: '#C9D98A' }}>бариста</span></H1>
        </div>
        <div className="flex items-center gap-3">
          <ProgressRing value={r.next ? (r.into / r.span) * 100 : 100} size={80} color="#FDC55E" stroke={6}>
            <span className="font-display text-[14px] font-extrabold tnum" style={{ color: '#111111' }}>{s.xp}</span>
          </ProgressRing>
          <div>
            <p className="font-display text-[16px] font-extrabold" style={{ color: '#FDC55E' }}>{r.current.title}</p>
            {r.next && <p className="text-[11px] font-bold tnum" style={{ color: '#555555' }}>до «{r.next.title}» {r.next.xp - s.xp} XP</p>}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
        className="space-y-3"
      >
        <CardLight className="space-y-3">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <Eyebrow color="violet">{L('path.continue_ru')}</Eyebrow>
              <h2 className="font-display mt-1 text-[20px] font-extrabold uppercase leading-none" style={{ color: '#111111' }}>
                Продолжить {continueTarget.id ? '«' + continueTarget.label + '»' : ''}
              </h2>
              <p className="mt-0.5 text-[12px] font-bold" style={{ color: '#555555' }}>{continueTarget.subtitle}</p>
            </div>
            <ProgressRing value={r.next ? (r.into / r.span) * 100 : 100} size={44} color="#C9D98A" stroke={4}>
              <span className="text-[9px] font-bold tnum" style={{ color: '#111111' }}>{Math.round((r.next ? (r.into / r.span) * 100 : 100))}%</span>
            </ProgressRing>
          </div>
          {continueTarget.id && (
            <ButtonPrimary onClick={() => actions.completeModule(continueTarget.id)} fullWidth={false} className="mt-3">
              {L('path.open_module_ru')}
            </ButtonPrimary>
          )}
          {!continueTarget.id && (
            <p className="mt-3 text-[12px] font-bold text-left" style={{ color: '#C9D98A' }}>{L('path.path_completed_ru')}</p>
          )}
        </CardLight>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.2 }}
        className="grid grid-cols-2 gap-3"
      >
        {blocks.map((b) => (
          <CardLight key={b.id} className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Eyebrow color="violet">{b.title}</Eyebrow>
                <p className="font-display mt-0.5 text-[13px] font-extrabold tnum" style={{ color: '#111111' }}>{b.value} / {b.total}</p>
              </div>
              <ProgressRing value={(parseInt(b.value) / parseInt(b.total)) * 100} size={48} color={b.color as string} stroke={5}>
                <span className="text-[10px] font-bold tnum" style={{ color: '#111111' }}>{Math.round((parseInt(b.value) / parseInt(b.total)) * 100)}%</span>
              </ProgressRing>
            </div>
            <div className="mt-2"><ProgressBar value={(parseInt(b.value) / parseInt(b.total)) * 100} /></div>
          </CardLight>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.3 }}
        className="CardLight overflow-hidden"
      >
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <H1 style={{ fontSize: 15 }}>{L('path.quests_ru')}</H1>
            <Pill dark>{L('path.quests_update_ru')}</Pill>
          </div>
          <div className="space-y-3">
            {s.quests.items.map((q) => (
              <div key={q.id} className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-[13px] font-bold ${q.done ? 'line-through opacity-50' : ''}`} style={{ color: '#111111' }}>{q.title}</p>
                    <span className="text-[11px] font-bold tnum" style={{ color: q.done ? '#C9D98A' : '#555555' }}>
                      {q.progress}/{q.target} · +{q.xp} XP
                    </span>
                  </div>
                  <div className="mt-1"><ProgressBar value={(q.progress / q.target) * 100} /></div>
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold"
                  style={{ background: q.done ? '#C9D98A' : '#1B1B1D', color: q.done ? '#111111' : '#FFFFFF' }}>
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
        <H1 style={{ fontSize: 15 }}>{L('path.levels_ru')}</H1>
        <div className="mt-3 space-y-3">
          {levels.map((lv) => {
            const mods = modules.filter((m) => m.levelId === lv.id)
            const doneCount = mods.filter((m) => s.modulesDone[m.id]).length
            const pct = mods.length ? (doneCount / mods.length) * 100 : 0
            const xpLocked = (lv.id === 'skilled' && s.xp < 200) || (lv.id === 'pro' && s.xp < 600)
            return (
              <CardLight key={lv.id} className="overflow-hidden space-y-0">
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <Eyebrow color="violet">Уровень {lv.n} · {lv.duration}</Eyebrow>
                      <h3 className="font-display mt-1 text-[15px] font-extrabold uppercase leading-none" style={{ color: '#111111' }}>
                        {lv.title}
                      </h3>
                      <p className="mt-0.5 text-[12px] font-bold" style={{ color: '#555555' }}>{lv.tagline}</p>
                    </div>
                    <div className="text-left">
                      <p className="font-display text-[14px] font-extrabold tnum" style={{ color: xpLocked ? '#EB5A52' : '#C9D98A' }}>
                        {xpLocked ? `закр. при ${lv.id === 'skilled' ? 200 : 600} XP` : Math.round(pct) + '%'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2"><ProgressBar value={pct} /></div>
                </div>
                {!xpLocked && (
                  <div className="border-t border-solid border-[#3A3A3D] pt-4 space-y-2">
                    {mods.map((m) => {
                      const done = !!s.modulesDone[m.id]
                      return (
                        <button
                          key={m.id}
                          onClick={() => actions.completeModule(m.id)}
                          className="w-full flex items-start justify-between gap-3 px-4 py-2.5 text-left btn-press"
                          style={{
                            height: 44,
                            background: done ? '#C9D98A' : 'transparent',
                            color: done ? '#111111' : '#FFFFFF',
                            border: done ? 'none' : '1px solid #3A3A3D',
                            fontSize: '12px',
                            padding: '0 12px',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span>{m.title}</span>
                          <span style={{ color: done ? '#111111' : '#FDC55E' }}>{done ? '✓' : '→'}</span>
                        </button>
                      )
                    })}
                    <button
                      onClick={() => {}}
                      className="w-full flex items-start justify-between gap-3 px-4 py-2.5 text-left btn-press"
                      style={{
                        height: 44,
                        border: '1px solid #3A3A3D',
                        color: '#EB5A52',
                        fontSize: '12px',
                        padding: '0 12px',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>{attestations[lv.id]?.title}</span>
                      <span style={{ color: '#EB5A52' }}>проверяет наставник</span>
                    </button>
                  </div>
                )}
              </CardLight>
            )
          })}
        </div>
      </motion.div>

      <div className="text-left text-[11px]" style={{ color: '#555555' }}>
        {L('path.source_ru')}
      </div>
    </div>
  )
}
