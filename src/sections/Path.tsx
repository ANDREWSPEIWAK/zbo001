import { useMemo } from 'react'
import { actions, useStore } from '../store'
import { levels, modules, attestations } from '../data/curriculum'
import { rankFor, badges } from '../data/gamification'
import { ProgressRing, ProgressBar, Card, Button, Pill } from '../components/app-ui'

export default function Path() {
  const s = useStore()
  const r = rankFor(s.xp)
  const knownCount = Object.values(s.known).filter(Boolean).length
  const quests = s.quests.items

  const greeting = useMemo(() => {
    const h = new Date().getHours()
    if (h < 6) return 'Ночная смена? Уважаю'
    if (h < 12) return 'Утренний пик ждёт'
    if (h < 18) return 'Дневной поток'
    return 'Вечерний сервис'
  }, [])

  // next unfinished module across levels
  const nextModule = useMemo(() => {
    for (const lv of levels) {
      for (const m of modules.filter((m) => m.levelId === lv.id)) {
        if (!s.modulesDone[m.id]) return { lv, m }
      }
    }
    return null
  }, [s.modulesDone])

  const blocks = [
    { id: 'ttk', title: 'ТТК', value: `${knownCount}/79`, color: '#C9DB8A' },
    { id: 'lessons', title: 'Методики', value: `${Object.values(s.lessonsRead).filter(Boolean).length}/31`, color: '#C9DB8A' },
    { id: 'exam', title: 'Экзамен', value: `${Object.values(s.examKnown).filter(Boolean).length}/40`, color: '#FBC85F' },
    { id: 'badges', title: 'Бейджи', value: `${s.earnedBadges.length}/${badges.length}`, color: '#FBC85F' },
  ]

  const continueTarget = nextModule
    ? { label: nextModule.m.title, subtitle: nextModule.lv.title, id: nextModule.m.id }
    : { label: 'Все модули пройдены', subtitle: 'Проверьте бейджи и аттестацию', id: '' }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 anim-rise">
        <div>
          <p className="eyebrow">{greeting}</p>
          <h1 className="mt-1 font-display text-[28px] font-extrabold uppercase leading-none" style={{ color: '#FFFFFF' }}>
            Твой путь <span style={{ color: '#C9DB8A' }}>бариста</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <ProgressRing value={r.next ? (r.into / r.span) * 100 : 100} size={80} color="#FBC85F" stroke={6}>
            <span className="font-display text-[14px] font-extrabold tnum" style={{ color: '#111111' }}>{s.xp}</span>
          </ProgressRing>
          <div>
            <p className="font-display text-[16px] font-extrabold" style={{ color: '#FBC85F' }}>{r.current.title}</p>
            {r.next && <p className="text-[11px] font-bold tnum" style={{ color: '#555555' }}>до «{r.next.title}» {r.next.xp - s.xp} XP</p>}
          </div>
        </div>
      </div>

      {/* Продолжить — главный шаг */}
      <Card light accent="#FBC85F" className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow" style={{ color: '#5B45F0' }}>Что сделать сейчас</p>
            <h2 className="font-display mt-1 text-[20px] font-extrabold uppercase leading-none" style={{ color: '#111111' }}>
              Продолжить {continueTarget.id ? '«' + continueTarget.label + '»' : ''}
            </h2>
            <p className="mt-0.5 text-[12px] font-bold" style={{ color: '#555555' }}>{continueTarget.subtitle}</p>
          </div>
          <ProgressRing value={r.next ? (r.into / r.span) * 100 : 100} size={44} color="#C9DB8A" stroke={4}>
            <span className="text-[9px] font-bold tnum" style={{ color: '#111111' }}>{Math.round((r.next ? (r.into / r.span) * 100 : 100))}%</span>
          </ProgressRing>
        </div>
        {continueTarget.id && (
          <Button onClick={() => actions.completeModule(continueTarget.id)} className="mt-3 w-full" style={{ height: 44, fontSize: '12px' }}>
            Открыть модуль · +40 XP
          </Button>
        )}
        {!continueTarget.id && (
          <p className="mt-3 text-[12px] font-bold text-center" style={{ color: '#C9DB8A' }}>Программа пройдена — перейдите к аттестации.</p>
        )}
      </Card>

      {/* Прогресс-кольца по блокам */}
      <div className="grid grid-cols-2 gap-3 anim-rise">
        {blocks.map((b) => (
          <Card key={b.id} light className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="eyebrow" style={{ color: '#5B45F0' }}>{b.title}</p>
                <p className="font-display mt-0.5 text-[13px] font-extrabold tnum" style={{ color: '#111111' }}>{b.value}</p>
              </div>
              <ProgressRing value={(parseInt(b.value.split('/')[0]) / parseInt(b.value.split('/')[1])) * 100} size={48} color={b.color} stroke={5}>
                <span className="text-[10px] font-bold tnum" style={{ color: '#111111' }}>{Math.round((parseInt(b.value.split('/')[0]) / parseInt(b.value.split('/')[1])) * 100)}%</span>
              </ProgressRing>
            </div>
            <div className="mt-2"><ProgressBar value={(parseInt(b.value.split('/')[0]) / parseInt(b.value.split('/')[1])) * 100} color={b.color} h={5} /></div>
          </Card>
        ))}
      </div>

      {/* Квесты дня */}
      <div className="rounded-card bg-surface overflow-hidden anim-rise">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-[15px] font-extrabold uppercase" style={{ color: '#111111' }}>Квесты дня</h2>
            <Pill color="#FBC85F">обновятся завтра</Pill>
          </div>
          <div className="space-y-3">
            {quests.map((q) => (
              <div key={q.id} className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-[13px] font-bold ${q.done ? 'line-through opacity-50' : ''}`} style={{ color: '#111111' }}>{q.title}</p>
                    <span className="text-[11px] font-bold tnum" style={{ color: q.done ? '#C9DB8A' : '#555555' }}>
                      {q.progress}/{q.target} · +{q.xp} XP
                    </span>
                  </div>
                  <div className="mt-1"><ProgressBar value={(q.progress / q.target) * 100} color={q.done ? '#C9DB8A' : '#FBC85F'} h={5} /></div>
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold"
                  style={{ background: q.done ? '#C9DB8A' : '#1B1B1D', color: q.done ? '#111111' : '#FFFFFF' }}>
                  {q.done ? '✓' : '·'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Уровни */}
      <div className="space-y-3">
        <h2 className="font-display text-[15px] font-extrabold uppercase" style={{ color: '#FFFFFF' }}>Уровни карьеры</h2>
        <div className="mt-3 space-y-3">
          {levels.map((lv) => {
            const mods = modules.filter((m) => m.levelId === lv.id)
            const doneCount = mods.filter((m) => s.modulesDone[m.id]).length
            const pct = mods.length ? (doneCount / mods.length) * 100 : 0
            const xpLocked = (lv.id === 'skilled' && s.xp < 200) || (lv.id === 'pro' && s.xp < 600)
            return (
              <Card key={lv.id} light className="overflow-hidden space-y-0">
                <div className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="eyebrow" style={{ color: '#5B45F0' }}>Уровень {lv.n} · {lv.duration}</p>
                      <h3 className="font-display mt-1 text-[15px] font-extrabold uppercase leading-none" style={{ color: '#111111' }}>
                        {lv.title}
                      </h3>
                      <p className="mt-0.5 text-[12px] font-bold" style={{ color: '#555555' }}>{lv.tagline}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-[14px] font-extrabold tnum" style={{ color: xpLocked ? '#EE5A55' : '#C9DB8A' }}>
                        {xpLocked ? `закр. при ${lv.id === 'skilled' ? 200 : 600} XP` : Math.round(pct) + '%'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3"><ProgressBar value={pct} color={pct === 100 ? '#C9DB8A' : '#FBC85F'} h={5} /></div>
                </div>
                {!xpLocked && (
                  <div className="border-t border-solid border-[#CFCCC4] pt-4 space-y-2">
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
                            color: done ? '#111111' : '#FFFFFF',
                            border: done ? 'none' : '1px solid #2A2A2D',
                            fontSize: '12px',
                            padding: '0 12px',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span>{m.title}</span>
                          <span style={{ color: done ? '#111111' : '#FBC85F' }}>{done ? '✓' : '→'}</span>
                        </Button>
                      )
                    })}
                    <Button
                      variant="ghost"
                      onClick={() => {}}
                      className="text-left justify-between"
                      style={{ height: 44, border: '1px solid #2A2A2D', color: '#EE5A55', fontSize: '12px', padding: '0 12px', justifyContent: 'space-between' }}
                    >
                      <span>{attestations[lv.id]?.title}</span>
                      <span style={{ color: '#EE5A55' }}>проверяет наставник</span>
                    </Button>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>

      <div className="text-center text-[11px]" style={{ color: '#555555' }}>
        Источник норм и времени: калькуляции ТТК сети. Прогресс хранится только в этом браузере.
      </div>
    </div>
  )
}
