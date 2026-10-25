import { useMemo, useState } from 'react'
import { actions, useStore } from '../store'
import { levels, modules, attestations, type TheoryBlock } from '../data/curriculum'
import { rankFor, badges } from '../data/gamification'
import { ProgressRing, ProgressBar, Pill } from '../components/app-ui'
import { recipes } from '../data/recipes'

function TheoryView({ blocks }: { blocks: TheoryBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((b, i) => {
        if (b.type === 'h')
          return <h4 key={i} className="font-display mt-6 text-[13px] font-extrabold uppercase tracking-wide" style={{ color: '#C9D98A' }}>{b.text}</h4>
        if (b.type === 'p')
          return <p key={i} className="text-[13px] leading-relaxed" style={{ color: '#111111' }}>{b.text}</p>
        if (b.type === 'ul')
          return (
            <ul key={i} className="space-y-2">
              {b.items.map((it, j) => (
                <li key={j} className="flex gap-2 text-[13px] leading-relaxed" style={{ color: '#111111' }}>
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: '#FDC55E' }} />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          )
        if (b.type === 'ol')
          return (
            <ol key={i} className="space-y-2">
              {b.items.map((it, j) => (
                <li key={j} className="flex gap-3 text-[13px] leading-relaxed" style={{ color: '#111111' }}>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                    style={{ background: '#1B1B1D', color: '#C9D98A' }}>{j + 1}</span>
                  <span>{it}</span>
                </li>
              ))}
            </ol>
          )
        if (b.type === 'callout')
          return (
            <div key={i} className="rounded-[24px] p-4 text-[13px] leading-relaxed"
              style={{ background: '#C9D98A22', border: '1px solid #C9D98A55', color: '#111111' }}>
              {b.text}
            </div>
          )
        return (
          <div key={i} className="overflow-x-auto rounded-[24px] border" style={{ borderColor: '#CFCCC4' }}>
            <table className="w-full text-[12px]">
              <thead>
                <tr style={{ background: '#1B1B1D' }}>
                  {b.headers.map((h, j) => (
                    <th key={j} className="px-3 py-2 text-left font-bold uppercase" style={{ color: '#C9D98A' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.rows.map((row, j) => (
                  <tr key={j} className="border-t" style={{ borderColor: '#CFCCC4' }}>
                    {row.map((cell, k) => (
                      <td key={k} className="px-3 py-2" style={{ color: '#111111' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      })}
    </div>
  )
}

function ModuleModal({ moduleId, onClose }: { moduleId: string; onClose: () => void }) {
  const mod = modules.find((m) => m.id === moduleId)!
  const { modulesDone } = useStore()
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const done = !!modulesDone[moduleId]
  const allChecked = mod.checklist.every((c) => checked[c.id])
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" style={{ background: 'rgba(15,15,16,.85)' }} onClick={onClose}>
      <div
        className="anim-rise max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-card p-6"
        style={{ background: '#E8E6DF', color: '#111111' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow" style={{ color: '#5B3FF0' }}>{mod.duration}</p>
            <h2 className="font-display mt-1 text-[20px] font-extrabold uppercase">{mod.title}</h2>
            <p className="mt-1 text-[13px]" style={{ color: '#555555' }}>{mod.subtitle}</p>
          </div>
          <button onClick={onClose} className="rounded-pill px-3 py-1.5 text-[12px] font-bold" style={{ background: '#1B1B1D', color: '#FFFFFF' }}>Закрыть</button>
        </div>

        <div className="mt-6">
          <TheoryView blocks={mod.theory} />
        </div>

        <div className="mt-8 rounded-[24px] p-4" style={{ background: '#FFFFFF' }}>
          <p className="eyebrow mb-3" style={{ color: '#5B3FF0' }}>Практика — отметь выполненное</p>
          <div className="space-y-2">
            {mod.checklist.map((c) => (
              <label key={c.id} className="flex cursor-pointer items-start gap-3 rounded-[16px] p-2">
                <input
                  type="checkbox"
                  checked={!!checked[c.id] || done}
                  disabled={done}
                  onChange={() => setChecked((s) => ({ ...s, [c.id]: !s[c.id] }))}
                  className="mt-0.5 h-5 w-5 accent-[#C9D98A]"
                />
                <span className="text-[13px]" style={{ color: '#111111' }}>{c.text}</span>
              </label>
            ))}
          </div>
          {!done && (
            <button
              disabled={!allChecked}
              onClick={() => { actions.completeModule(mod.id); onClose() }}
              className="mt-4 w-full rounded-btn px-4 py-3 text-[13px] font-extrabold uppercase disabled:cursor-not-allowed disabled:opacity-30"
              style={{ background: '#111111', color: '#FFFFFF', height: 48 }}
            >
              Модуль освоен · +40 XP
            </button>
          )}
          {done && <p className="mt-3 text-center text-[13px] font-bold" style={{ color: '#C9D98A' }}>Модуль закрыт ✓</p>}
        </div>
      </div>
    </div>
  )
}

export default function Path() {
  const s = useStore()
  const [openModule, setOpenModule] = useState<string | null>(null)
  const [openAtt, setOpenAtt] = useState<string | null>(null)
  const r = rankFor(s.xp)
  const knownCount = Object.values(s.known).filter(Boolean).length
  const quests = s.quests.items
  const questsDone = quests.filter((q) => q.done).length

  const greeting = useMemo(() => {
    const h = new Date().getHours()
    if (h < 6) return 'Ночная смена? Уважаю'
    if (h < 12) return 'Утренний пик ждёт'
    if (h < 18) return 'Дневной поток'
    return 'Вечерний сервис'
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 anim-rise">
        <div>
          <p className="eyebrow">{greeting}</p>
          <h1 className="font-display mt-2 text-[28px] font-extrabold uppercase leading-tight">
            Твой путь <span style={{ color: '#C9D98A' }}>бариста</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <ProgressRing value={r.next ? (r.into / r.span) * 100 : 100} size={72} color="#FDC55E">
            <span className="font-display text-[14px] font-extrabold" style={{ color: '#FFFFFF' }}>{s.xp}</span>
          </ProgressRing>
          <div>
            <p className="font-display text-[18px] font-extrabold" style={{ color: '#FDC55E' }}>{r.current.title}</p>
            {r.next && <p className="text-[12px]" style={{ color: '#555555' }}>до «{r.next.title}» ещё {r.next.xp - s.xp} XP</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 anim-rise">
        {[
          { label: 'Стрик', value: `${s.streak.count} дн`, color: '#EB5A52' },
          { label: 'Рецепты ТТК', value: `${knownCount}/79`, color: '#C9D98A' },
          { label: 'Бейджи', value: `${s.earnedBadges.length}/${badges.length}`, color: '#FDC55E' },
          { label: 'Квесты дня', value: `${questsDone}/${quests.length || 3}`, color: '#C9D98A' },
        ].map((it) => (
          <div key={it.label} className="rounded-card bg-light p-4">
            <p className="eyebrow" style={{ color: '#5B3FF0' }}>{it.label}</p>
            <p className="font-display mt-2 text-[20px] font-extrabold" style={{ color: it.color }}>{it.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-card bg-light p-5 anim-rise">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-[15px] font-extrabold uppercase" style={{ color: '#111111' }}>Квесты дня</h2>
          <Pill color="#FDC55E">обновятся завтра</Pill>
        </div>
        <div className="mt-4 space-y-3">
          {quests.map((q) => (
            <div key={q.id} className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-[13px] font-bold ${q.done ? 'line-through opacity-50' : ''}`} style={{ color: '#111111' }}>{q.title}</p>
                  <span className="text-[11px] font-bold" style={{ color: q.done ? '#C9D98A' : '#555555' }}>
                    {q.progress}/{q.target} · +{q.xp} XP
                  </span>
                </div>
                <ProgressBar value={(q.progress / q.target) * 100} color={q.done ? '#C9D98A' : '#FDC55E'} h={5} />
              </div>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold"
                style={{ background: q.done ? '#C9D98A' : '#1B1B1D', color: q.done ? '#111111' : '#FFFFFF' }}>
                {q.done ? '✓' : '·'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {levels.map((lv) => {
        const mods = modules.filter((m) => m.levelId === lv.id)
        const doneCount = mods.filter((m) => s.modulesDone[m.id]).length
        const pct = mods.length ? (doneCount / mods.length) * 100 : 0
        const locked =
          (lv.id === 'skilled' && s.xp < 200) || (lv.id === 'pro' && s.xp < 600)
        return (
          <div key={lv.id} className="rounded-card bg-light overflow-hidden anim-rise">
            <div className="p-5" style={{ background: '#1B1B1D' }}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="eyebrow">Уровень {lv.n} · {lv.duration}</p>
                  <h2 className="font-display mt-1 text-[18px] font-extrabold uppercase">
                    {lv.title} <span className="text-[13px] font-medium" style={{ color: '#555555' }}>/ {lv.en}</span>
                  </h2>
                  <p className="mt-1 text-[13px]" style={{ color: '#C9D98A' }}>{lv.tagline}</p>
                  <p className="mt-1 text-[12px]" style={{ color: '#555555' }}>{lv.focus}</p>
                </div>
                <div className="flex items-center gap-3">
                  {locked && <Pill color="#EB5A52">откроется на {lv.id === 'skilled' ? 200 : 600} XP</Pill>}
                  <ProgressRing value={pct} size={60} color={pct === 100 ? '#C9D98A' : '#FDC55E'}>
                    <span className="text-[11px] font-bold" style={{ color: '#FFFFFF' }}>{Math.round(pct)}%</span>
                  </ProgressRing>
                </div>
              </div>
              <div className="mt-3"><ProgressBar value={pct} color="#C9D98A" /></div>
            </div>
            {!locked && (
              <div>
                {mods.map((m) => {
                  const done = !!s.modulesDone[m.id]
                  return (
                    <button key={m.id} onClick={() => setOpenModule(m.id)}
                      className="flex w-full items-center gap-4 border-t px-5 py-4 text-left transition-colors"
                      style={{ borderColor: '#CFCCC4' }}>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-bold"
                        style={{ background: done ? '#C9D98A' : '#1B1B1D', color: done ? '#111111' : '#FDC55E' }}>
                        {done ? '✓' : '+'}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-bold" style={{ color: '#111111' }}>{m.title}</p>
                        <p className="truncate text-[12px]" style={{ color: '#555555' }}>{m.subtitle} · {m.duration}</p>
                      </div>
                      <span className="text-[12px]" style={{ color: '#555555' }}>→</span>
                    </button>
                  )
                })}
                <button onClick={() => setOpenAtt(openAtt === lv.id ? null : lv.id)}
                  className="flex w-full items-center gap-4 border-t px-5 py-4 text-left transition-colors"
                  style={{ borderColor: '#CFCCC4' }}>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-bold"
                    style={{ background: '#1B1B1D', color: '#EB5A52' }}>!</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold" style={{ color: '#111111' }}>{attestations[lv.id]?.title}</p>
                    <p className="text-[12px]" style={{ color: '#555555' }}>Проверяет: {attestations[lv.id]?.examiner}</p>
                  </div>
                  <span className="text-[12px]" style={{ color: '#555555' }}>{openAtt === lv.id ? '↑' : '↓'}</span>
                </button>
                {openAtt === lv.id && attestations[lv.id] && (
                  <div className="space-y-2 px-5 py-4" style={{ background: '#FFFFFF' }}>
                    {attestations[lv.id].items.map((it, i) => (
                      <div key={it.id} className="flex gap-3 text-[13px]" style={{ color: '#111111' }}>
                        <span className="text-[11px] font-bold" style={{ color: '#FDC55E' }}>{String(i + 1).padStart(2, '0')}</span>
                        <span>{it.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}

      <div className="rounded-card bg-light p-5 anim-rise" style={{ borderColor: '#FDC55E' }}>
        <p className="eyebrow" style={{ color: '#5B3FF0' }}>Метрика дня</p>
        <p className="mt-2 text-[13px] leading-relaxed" style={{ color: '#111111' }}>
          В топовых спешелти-барах Австралии молочный напиток уходит гостю за <b style={{ color: '#FDC55E' }}>90 секунд</b>,
          а полная очередь — за <b style={{ color: '#FDC55E' }}>4 минуты</b>. Проверь себя в Rush-симуляторе во вкладке «Смена».
        </p>
      </div>

      <div className="text-center text-[12px]" style={{ color: '#555555' }}>
        В меню сейчас {recipes.length} позиций ТТК · прогресс сохраняется в этом браузере
      </div>

      {openModule && <ModuleModal moduleId={openModule} onClose={() => setOpenModule(null)} />}
    </div>
  )
}
