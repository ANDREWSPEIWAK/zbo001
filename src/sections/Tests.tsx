import { useEffect, useMemo, useState } from 'react'
import { actions, useStore } from '../store'
import { recipes, ttkCategories } from '../data/recipes'
import { examBlocks, examQuestions } from '../data/exam'
import { serviceCases } from '../data/cases'
import { Chip, Pill, ProgressBar, ProgressRing } from '../components/app-ui'

type Mode = 'hub' | 'quiz' | 'exam' | 'cases' | 'blitz'

/* ---------- quiz generator ---------- */
interface QuizQ {
  prompt: string
  options: string[]
  correct: number
  note: string
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function genQuiz(count = 10): QuizQ[] {
  const pool = shuffle(recipes)
  const qs: QuizQ[] = []
  for (const r of pool) {
    if (qs.length >= count) break
    const kind = qs.length % 3
    if (kind === 0) {
      const others = shuffle(recipes.filter((x) => x.id !== r.id && x.category === r.category))
      if (others.length < 3) continue
      const opts = shuffle([r.recipe.ru, ...others.slice(0, 3).map((o) => o.recipe.ru)])
      qs.push({
        prompt: `ТТК напитка «${r.name}»?`,
        options: opts,
        correct: opts.indexOf(r.recipe.ru),
        note: r.method.ru,
      })
    } else if (kind === 1) {
      const cat = ttkCategories.find((c) => c.id === r.category)!
      const others = shuffle(ttkCategories.filter((c) => c.id !== r.category)).slice(0, 3)
      const opts = shuffle([cat.title, ...others.map((o) => o.title)])
      qs.push({
        prompt: `К какой категории относится «${r.name}»?`,
        options: opts,
        correct: opts.indexOf(cat.title),
        note: `${r.name} — категория «${cat.title}».`,
      })
    } else {
      if (r.steps.ru.length < 2) continue
      const first = r.steps.ru[0]
      const others = shuffle(recipes.filter((x) => x.id !== r.id && x.steps.ru[0] !== first)).slice(0, 3)
      const opts = shuffle([first, ...others.map((o) => o.steps.ru[0])])
      qs.push({
        prompt: `Первый шаг сборки «${r.name}»?`,
        options: opts,
        correct: opts.indexOf(first),
        note: `Полная сборка: ${r.steps.ru.join(' → ')}`,
      })
    }
  }
  return qs
}

/* ---------- shared option button ---------- */
function OptionBtn({ text, state, onClick }: { text: string; state: 'idle' | 'right' | 'wrong' | 'dim'; onClick: () => void }) {
  const colors = {
    idle: { bg: '#1B1B1D', border: '#3A3A3D', fg: '#FFFFFF' },
    right: { bg: '#C9D98A22', border: '#C9D98A', fg: '#C9D98A' },
    wrong: { bg: '#EB5A5222', border: '#EB5A52', fg: '#EB5A52' },
    dim: { bg: '#0F0F10', border: '#2A2A2D', fg: '#555555' },
  }[state]
  return (
    <button onClick={onClick}
      className="w-full rounded-[24px] px-4 py-3 text-left text-[13px] font-bold transition-all"
      style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.fg }}>
      {text}
    </button>
  )
}

/* ---------- Quiz ---------- */
function Quiz({ onExit }: { onExit: () => void }) {
  const [qs] = useState(() => genQuiz(10))
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const done = i >= qs.length

  const answer = (idx: number) => {
    if (picked !== null) return
    setPicked(idx)
    if (idx === qs[i].correct) setScore((s) => s + 1)
  }

  const next = () => {
    setPicked(null)
    setI((x) => x + 1)
  }

  useEffect(() => {
    if (done) {
      const pct = Math.round((score / qs.length) * 100)
      actions.recordQuiz(pct)
      actions.addXp(Math.round(pct / 5), 'квиз ТТК')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done])

  if (done) {
    const pct = Math.round((score / qs.length) * 100)
    return (
      <div className="rounded-card bg-light p-8 text-center anim-pop">
        <ProgressRing value={pct} size={110} color={pct >= 80 ? '#C9D98A' : pct >= 50 ? '#FDC55E' : '#EB5A52'} stroke={6}>
          <span className="font-display text-[22px] font-extrabold">{pct}%</span>
        </ProgressRing>
        <p className="font-display mt-4 text-[18px] font-extrabold" style={{ color: '#111111' }}>{score}/{qs.length} верно</p>
        <p className="mt-2 text-[13px]" style={{ color: '#555555' }}>
          {pct >= 80 ? 'Меню сидит в руках. Так держать!' : pct >= 50 ? 'Неплохо. Слабые места — в карточках ТТК.' : 'Открой ТТК и пройди Build-тренажёр по ошибкам.'}
        </p>
        <button onClick={onExit} className="mt-6 rounded-btn px-8 py-3 text-[13px] font-extrabold uppercase"
          style={{ background: '#111111', color: '#FFFFFF', height: 48 }}>К тестам</button>
      </div>
    )
  }

  const q = qs[i]
  return (
    <div className="anim-rise">
      <div className="flex items-center justify-between text-[12px]" style={{ color: '#555555' }}>
        <span>Вопрос {i + 1}/{qs.length}</span>
        <span style={{ color: '#C9D98A' }}>верно: {score}</span>
      </div>
      <div className="mt-2"><ProgressBar value={(i / qs.length) * 100} color="#C9D98A" /></div>
      <div className="rounded-card bg-light mt-5 p-6">
        <h3 className="font-display text-[16px] font-extrabold leading-snug" style={{ color: '#111111' }}>{q.prompt}</h3>
        <div className="mt-5 space-y-2">
          {q.options.map((o, idx) => (
            <OptionBtn key={idx} text={o}
              state={picked === null ? 'idle' : idx === q.correct ? 'right' : idx === picked ? 'wrong' : 'dim'}
              onClick={() => answer(idx)} />
          ))}
        </div>
        {picked !== null && (
          <div className="anim-rise mt-4 rounded-[16px] p-3 text-[12px] leading-relaxed" style={{ background: '#FFFFFF', color: '#111111' }}>
            {q.note}
          </div>
        )}
      </div>
      {picked !== null && (
        <button onClick={next} className="mt-4 w-full rounded-btn px-4 py-3 text-[13px] font-extrabold uppercase anim-pop"
          style={{ background: '#111111', color: '#FFFFFF', height: 48 }}>
          {i + 1 === qs.length ? 'Результат' : 'Дальше →'}
        </button>
      )}
    </div>
  )
}

/* ---------- Blitz ---------- */
function Blitz({ onExit }: { onExit: () => void }) {
  const DURATION = 60
  const [left, setLeft] = useState(DURATION)
  const [q, setQ] = useState<QuizQ | null>(() => genQuiz(1)[0])
  const [correct, setCorrect] = useState(0)
  const [total, setTotal] = useState(0)
  const over = left <= 0

  const nextQ = () => setQ(genQuiz(1)[0])
  useEffect(() => {
    if (over) return
    const id = setInterval(() => setLeft((x) => x - 1), 1000)
    return () => clearInterval(id)
  }, [over])
  useEffect(() => {
    if (over) {
      actions.recordBlitz(correct)
      actions.addXp(correct * 3, 'блиц «Час пик»')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [over])

  const answer = (idx: number) => {
    if (!q || over) return
    setTotal((t) => t + 1)
    if (idx === q.correct) setCorrect((c) => c + 1)
    nextQ()
  }

  if (over) {
    return (
      <div className="rounded-card bg-light p-8 text-center anim-pop">
        <p className="eyebrow" style={{ color: '#5B3FF0' }}>Время вышло</p>
        <p className="font-display mt-3 text-[36px] font-extrabold" style={{ color: '#EB5A52' }}>{correct}</p>
        <p className="mt-1 text-[13px]" style={{ color: '#555555' }}>верных из {total} за минуту</p>
        <p className="mt-3 text-[13px]" style={{ color: '#111111' }}>
          {correct >= 8 ? 'Ты — машина потока. Утренний пик Мельбурна тебе по плечу.' : correct >= 5 ? 'Хороший темп. Ещё пара заходов — и будет 8+.' : 'В пике счёт на секунды. Подтяни ТТК и возвращайся.'}
        </p>
        <button onClick={onExit} className="mt-6 rounded-btn px-8 py-3 text-[13px] font-extrabold uppercase"
          style={{ background: '#EB5A52', color: '#FFFFFF', height: 48 }}>К тестам</button>
      </div>
    )
  }

  return (
    <div className="anim-rise">
      <div className="flex items-center justify-between">
        <span className="font-display text-[22px] font-extrabold" style={{ color: left <= 10 ? '#EB5A52' : '#FDC55E' }}>0:{String(left).padStart(2, '0')}</span>
        <Pill color="#EB5A52">ЧАС ПИК</Pill>
        <span className="text-[13px] font-bold" style={{ color: '#C9D98A' }}>+{correct}</span>
      </div>
      <div className="mt-2"><ProgressBar value={(left / DURATION) * 100} color={left <= 10 ? '#EB5A52' : '#FDC55E'} /></div>
      {q && (
        <div className="rounded-card bg-light mt-5 p-6" key={q.prompt}>
          <h3 className="font-display text-[16px] font-extrabold leading-snug" style={{ color: '#111111' }}>{q.prompt}</h3>
          <div className="mt-5 space-y-2">
            {q.options.map((o, idx) => (
              <OptionBtn key={idx} text={o} state="idle" onClick={() => answer(idx)} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------- Exam ---------- */
function Exam() {
  const s = useStore()
  const [block, setBlock] = useState(0)
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const blockQs = useMemo(() => examQuestions.filter((q) => q.block === examBlocks[block]), [block])
  const q = blockQs[idx]
  const knownInBlock = blockQs.filter((x) => s.examKnown[x.id]).length

  const mark = (known: boolean) => {
    actions.recordExam(q.id, known)
    setRevealed(false)
    if (idx + 1 < blockQs.length) setIdx(idx + 1)
    else if (block + 1 < examBlocks.length) { setBlock(block + 1); setIdx(0) }
  }

  const totalKnown = Object.values(s.examKnown).filter(Boolean).length

  return (
    <div className="anim-rise">
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {examBlocks.map((b, i) => (
          <Chip key={b} active={i === block} onClick={() => { setBlock(i); setIdx(0); setRevealed(false) }}>{b}</Chip>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-[12px]" style={{ color: '#555555' }}>
        <span>Вопрос {idx + 1}/{blockQs.length}</span>
        <span style={{ color: '#C9D98A' }}>закрыто в блоке: {knownInBlock}/{blockQs.length} · всего {totalKnown}/40</span>
      </div>
      <div className="mt-2"><ProgressBar value={(knownInBlock / blockQs.length) * 100} color="#C9D98A" /></div>

      {q ? (
        <div className="rounded-card bg-light mt-4 p-6">
          <p className="eyebrow" style={{ color: '#5B3FF0' }}>Ответь вслух или про себя, затем сверься</p>
          <h3 className="font-display mt-3 text-[16px] font-extrabold leading-snug" style={{ color: '#111111' }}>{q.prompt}</h3>
          {!revealed ? (
            <button onClick={() => setRevealed(true)} className="mt-6 w-full rounded-btn border px-4 py-3 text-[13px] font-bold"
              style={{ borderColor: '#3A3A3D', color: '#111111', height: 48 }}>
              Показать эталон ответа
            </button>
          ) : (
            <div className="anim-rise">
              <div className="mt-4 rounded-[16px] p-4 text-[13px] leading-relaxed" style={{ background: '#FFFFFF', color: '#111111', border: '1px solid #C9D98A55' }}>
                {q.model}
              </div>
              <p className="mt-4 text-center text-[12px]" style={{ color: '#555555' }}>Твой ответ был близок к эталону?</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button onClick={() => mark(true)} className="rounded-btn px-4 py-3 text-[13px] font-extrabold uppercase"
                  style={{ background: '#C9D98A', color: '#111111', height: 48 }}>Знал · +8 XP</button>
                <button onClick={() => mark(false)} className="rounded-btn px-4 py-3 text-[13px] font-extrabold uppercase"
                  style={{ background: '#EB5A52', color: '#FFFFFF', height: 48 }}>Надо повторить</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-card bg-light mt-4 p-6 text-center text-[13px]" style={{ color: '#555555' }}>Блок закрыт.</div>
      )}
    </div>
  )
}

/* ---------- Cases ---------- */
function Cases() {
  const s = useStore()
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const c = serviceCases[i]
  const solvedBest = s.casesScore[c.id] ?? -1

  const pick = (idx: number) => {
    if (picked !== null) return
    setPicked(idx)
    actions.recordCase(c.id, c.options[idx].score)
  }

  return (
    <div className="anim-rise">
      <div className="flex items-center justify-between text-[12px]" style={{ color: '#555555' }}>
        <span>Кейс {i + 1}/{serviceCases.length}</span>
        <Pill color="#FDC55E">{c.block}</Pill>
      </div>
      <div className="mt-2"><ProgressBar value={(i / serviceCases.length) * 100} color="#FDC55E" /></div>
      <div className="rounded-card bg-light mt-4 p-6">
        <p className="text-[13px] leading-relaxed" style={{ color: '#111111' }}>{c.scene}</p>
        <div className="mt-5 space-y-2">
          {c.options.map((o, idx) => {
            let st: 'idle' | 'right' | 'wrong' | 'dim' = 'idle'
            if (picked !== null) {
              if (o.score === 2) st = 'right'
              else if (idx === picked) st = 'wrong'
              else st = 'dim'
            }
            return <OptionBtn key={idx} text={o.text} state={st} onClick={() => pick(idx)} />
          })}
        </div>
        {picked !== null && (
          <div className="anim-rise mt-4">
            <p className="text-[12px] font-bold" style={{ color: c.options[picked].score === 2 ? '#C9D98A' : c.options[picked].score === 1 ? '#FDC55E' : '#EB5A52' }}>
              {c.options[picked].score === 2 ? 'Профессиональное решение · +12 XP' : c.options[picked].score === 1 ? 'Терпимо, но есть лучше' : 'Ошибка'}
              {solvedBest === 2 && picked !== null && c.options[picked].score < 2 ? ' (ранее решён верно)' : ''}
            </p>
            <div className="mt-2 rounded-[16px] p-3 text-[12px] leading-relaxed" style={{ background: '#FFFFFF', color: '#111111' }}>
              {c.explain}
            </div>
          </div>
        )}
      </div>
      {picked !== null && (
        <button onClick={() => { setPicked(null); setI((x) => (x + 1) % serviceCases.length) }}
          className="mt-4 w-full rounded-btn px-4 py-3 text-[13px] font-extrabold uppercase anim-pop"
          style={{ background: '#C9D98A', color: '#111111', height: 48 }}>
          {i + 1 === serviceCases.length ? 'Сначала ↺' : 'Следующий кейс →'}
        </button>
      )}
    </div>
  )
}

/* ---------- Hub ---------- */
export default function Tests() {
  const s = useStore()
  const [mode, setMode] = useState<Mode>('hub')

  if (mode === 'quiz') return <div><BackBtn onClick={() => setMode('hub')} /><Quiz onExit={() => setMode('hub')} /></div>
  if (mode === 'blitz') return <div><BackBtn onClick={() => setMode('hub')} /><Blitz onExit={() => setMode('hub')} /></div>
  if (mode === 'exam') return <div><BackBtn onClick={() => setMode('hub')} /><Exam /></div>
  if (mode === 'cases') return <div><BackBtn onClick={() => setMode('hub')} /><Cases /></div>

  const knownCount = Object.values(s.known).filter(Boolean).length
  const examTotal = Object.values(s.examKnown).filter(Boolean).length
  const casesPerfect = Object.values(s.casesScore).filter((v) => v === 2).length

  const cards = [
    { id: 'quiz' as Mode, kicker: 'Квиз · 10 вопросов', title: 'ТТК под контролем',
      desc: 'Рецепты, категории, первые шаги сборки. Вопросы генерируются из всех 79 ТТК.',
      stat: `лучший: ${s.quizBest}%`, color: '#C9D98A' },
    { id: 'blitz' as Mode, kicker: '60 секунд', title: 'Блиц «Час пик»',
      desc: 'Минутный спринт на скорость вспоминания меню. Как утро в Мельбурне: без пауз.',
      stat: `рекорд: ${s.blitzBest}`, color: '#EB5A52' },
    { id: 'exam' as Mode, kicker: '40 вопросов · 4 блока', title: 'Экзамен бариста',
      desc: 'Сервис, техника, фильтр, эспрессо. Открытые вопросы с эталоном ответа и самооценкой.',
      stat: `закрыто: ${examTotal}/40`, color: '#FDC55E' },
    { id: 'cases' as Mode, kicker: '12 ситуаций', title: 'Кейсы смены',
      desc: 'Реальные ситуации с гостями, очередью и станцией. Логика выбора, а не зубрёжка.',
      stat: `решено идеально: ${casesPerfect}/12`, color: '#C9D98A' },
  ]

  return (
    <div className="space-y-6">
      <div className="anim-rise">
        <p className="eyebrow">Проверка знаний</p>
        <h1 className="font-display mt-2 text-[24px] font-extrabold uppercase leading-tight" style={{ color: '#FFFFFF' }}>Тесты и экзамен</h1>
        <p className="mt-2 text-[13px]" style={{ color: '#555555' }}>
          Четыре формата: от быстрого блица до полной аттестации. ТТК выучено: {knownCount}/79 — квиз берёт вопросы из всего меню.
        </p>
      </div>
      <div className="grid gap-3">
        {cards.map((c, i) => (
          <button key={c.id} onClick={() => setMode(c.id)}
            className="rounded-card bg-light p-5 text-left anim-rise" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center justify-between">
              <p className="eyebrow" style={{ color: '#5B3FF0' }}>{c.kicker}</p>
              <span className="text-[10px]" style={{ color: '#555555' }}>{c.stat}</span>
            </div>
            <h3 className="font-display mt-2 text-[15px] font-extrabold uppercase" style={{ color: '#111111' }}>{c.title}</h3>
            <p className="mt-2 text-[12px] leading-relaxed" style={{ color: '#555555' }}>{c.desc}</p>
            <p className="mt-4 text-[12px] font-bold" style={{ color: c.color }}>Начать →</p>
          </button>
        ))}
      </div>
    </div>
  )
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="mb-5 rounded-pill border px-4 py-2 text-[12px] font-bold"
      style={{ borderColor: '#3A3A3D', color: '#FFFFFF' }}>← Все тесты</button>
  )
}
