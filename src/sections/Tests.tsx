import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { actions, useStore } from '../store'
import { recipes, ttkCategories } from '../data/recipes'
import { examBlocks, examQuestions } from '../data/exam'
import { serviceCases } from '../data/cases'
import { Chip, Pill, ProgressBar, ProgressRing, Card } from '../components/app-ui'

type Mode = 'hub' | 'quiz' | 'exam' | 'cases' | 'blitz'

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

function OptionBtn({ text, state, onClick }: { text: string; state: 'idle' | 'right' | 'wrong' | 'dim'; onClick: () => void }) {
  const colors = {
    idle: { bg: '#1A1A1C', border: '#3A3A3D', fg: '#FFFFFF' },
    right: { bg: '#C9DB8A22', border: '#C9DB8A', fg: '#C9DB8A' },
    wrong: { bg: '#F8717122', border: '#F87171', fg: '#F87171' },
    dim: { bg: '#0F0F10', border: '#3A3A3D', fg: '#666666' },
  }[state]
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="w-full rounded-[24px] px-4 py-3 text-left text-[13px] font-bold transition-all btn-press"
      style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.fg }}
    >
      {text}
    </motion.button>
  )
}

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
  }, [done])

  if (done) {
    const pct = Math.round((score / qs.length) * 100)
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="rounded-card bg-surface p-8 text-left"
      >
        <div className="flex items-center justify-between">
          <ProgressRing value={pct} size={110} color={pct >= 80 ? '#C9DB8A' : pct >= 50 ? '#FBBF24' : '#F87171'} stroke={6}>
            <span className="font-display text-[22px] font-extrabold">{pct}%</span>
          </ProgressRing>
          <div>
            <p className="font-display mt-4 text-[18px] font-extrabold" style={{ color: '#0F0F10' }}>{score}/{qs.length} верно</p>
            <p className="mt-2 text-[13px]" style={{ color: '#666666' }}>
              {pct >= 80 ? 'Меню сидит в руках. Так держать!' : pct >= 50 ? 'Неплохо. Слабые места — в карточках ТТК.' : 'Открой ТТК и пройдите Build-тренажёр по ошибкам.'}
            </p>
          </div>
        </div>
        <button onClick={onExit} className="mt-6 rounded-[26px] px-8 py-3 text-[13px] font-extrabold uppercase btn-press"
          style={{ background: '#0F0F10', color: '#FFFFFF', height: 52 }}>К тестам</button>
      </motion.div>
    )
  }

  const q = qs[i]
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="space-y-4"
    >
      <div className="flex items-start justify-between text-[12px]" style={{ color: '#666666' }}>
        <span>Вопрос {i + 1} / {qs.length}</span>
        <span style={{ color: '#C9DB8A' }}>верно: {score}</span>
      </div>
      <div className="mt-2"><ProgressBar value={(i / qs.length) * 100} color="#C9DB8A" /></div>
      <Card light className="mt-5 p-6 space-y-4">
        <h3 className="font-display text-[16px] font-extrabold leading-snug" style={{ color: '#0F0F10' }}>{q.prompt}</h3>
        <div className="space-y-2">
          {q.options.map((o, idx) => (
            <OptionBtn key={idx} text={o}
              state={picked === null ? 'idle' : idx === q.correct ? 'right' : idx === picked ? 'wrong' : 'dim'}
              onClick={() => answer(idx)} />
          ))}
        </div>
        {picked !== null && (
          <div className="rounded-[16px] p-3 text-[12px] leading-relaxed" style={{ background: '#FFFFFF', color: '#0F0F10' }}>
            {q.note}
          </div>
        )}
      </Card>
      {picked !== null && (
        <motion.button onClick={next}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 w-full rounded-[26px] px-4 py-3 text-[13px] font-extrabold uppercase btn-press"
          style={{ background: '#0F0F10', color: '#FFFFFF', height: 52 }}
        >
          {i + 1 === qs.length ? 'Результат' : 'Дальше →'}
        </motion.button>
      )}
    </motion.div>
  )
}

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
  }, [over])

  const answer = (idx: number) => {
    if (!q || over) return
    setTotal((t) => t + 1)
    if (idx === q.correct) setCorrect((c) => c + 1)
    nextQ()
  }

  if (over) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="rounded-card bg-surface p-8 text-left"
      >
        <p className="eyebrow" style={{ color: '#8B5CF6' }}>Время вышло</p>
        <div className="flex items-start justify-between mt-3">
          <p className="font-display text-[48px] font-extrabold" style={{ color: '#F87171' }}>{correct}</p>
          <div>
            <p className="mt-1 text-[13px]" style={{ color: '#666666' }}>верных из {total} за минуту</p>
            <p className="text-[13px] leading-relaxed" style={{ color: '#0F0F10' }}>
              {correct >= 8
                ? 'Машина потока. Утренний пик вам по плечу.'
                : correct >= 5
                  ? 'Хороший темп. Ещё пара заходов — и будет 8+.'
                  : 'В пике счёт на секунды. Подтяните ТТК и возвращайтесь.'}
            </p>
          </div>
        </div>
        <button onClick={onExit} className="mt-6 rounded-[26px] px-8 py-3 text-[13px] font-extrabold uppercase btn-press"
          style={{ background: '#F87171', color: '#0F0F10', height: 52 }}>К тестам</button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="space-y-4"
    >
      <div className="flex items-start justify-between">
        <span className="font-display text-[24px] font-extrabold" style={{ color: left <= 10 ? '#F87171' : '#FBBF24' }}>0:{String(left).padStart(2, '0')}</span>
        <div className="flex gap-2">
          <Pill color="#C9DB8A">обслужено {correct}</Pill>
          <Pill color="#F87171">ушло {total - correct}</Pill>
        </div>
      </div>
      <div className="mt-2"><ProgressBar value={(left / DURATION) * 100} color={left <= 10 ? '#F87171' : '#FBBF24'} /></div>
      {q && (
        <Card light className="mt-5 p-6" key={q.prompt}>
          <h3 className="font-display text-[16px] font-extrabold leading-snug" style={{ color: '#0F0F10' }}>{q.prompt}</h3>
          <div className="mt-5 space-y-2">
            {q.options.map((o, idx) => (
              <OptionBtn key={idx} text={o} state="idle" onClick={() => answer(idx)} />
            ))}
          </div>
        </Card>
      )}
    </motion.div>
  )
}

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="space-y-4"
    >
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {examBlocks.map((b, i) => (
          <Chip key={b} active={i === block} onClick={() => { setBlock(i); setIdx(0); setRevealed(false) }}>{b}</Chip>
        ))}
      </div>
      <div className="mt-3 flex items-start justify-between text-[12px]" style={{ color: '#666666' }}>
        <span>Вопрос {idx + 1} / {blockQs.length}</span>
        <span style={{ color: '#C9DB8A' }}>закрыто в блоке: {knownInBlock} / {blockQs.length} · всего {totalKnown} / 40</span>
      </div>
      <div className="mt-2"><ProgressBar value={(knownInBlock / blockQs.length) * 100} color="#C9DB8A" /></div>

      {q ? (
        <Card light className="mt-4 p-6 space-y-4">
          <p className="eyebrow" style={{ color: '#8B5CF6' }}>Ответьте вслух или про себя, затем сверьтесь с эталоном</p>
          <h3 className="font-display mt-3 text-[16px] font-extrabold leading-snug" style={{ color: '#0F0F10' }}>{q.prompt}</h3>
          {!revealed ? (
            <button onClick={() => setRevealed(true)} className="mt-6 w-full rounded-[26px] border px-4 py-3 text-[13px] font-bold btn-press"
              style={{ borderColor: '#3A3A3D', color: '#0F0F10', height: 52 }}>
              Показать эталон ответа
            </button>
          ) : (
            <div>
              <div className="rounded-[16px] p-4 text-[13px] leading-relaxed" style={{ background: '#FFFFFF', color: '#0F0F10', border: '1px solid #C9DB8A55' }}>
                {q.model}
              </div>
              <p className="mt-4 text-left text-[12px] font-bold" style={{ color: '#666666' }}>Ваш ответ был близок к эталону?</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button onClick={() => mark(true)} className="rounded-[26px] px-4 py-3 text-[13px] font-extrabold uppercase btn-press"
                  style={{ background: '#C9DB8A', color: '#0F0F10', height: 52 }}>Знал · +8 XP</button>
                <button onClick={() => mark(false)} className="rounded-[26px] px-4 py-3 text-[13px] font-extrabold uppercase btn-press"
                  style={{ background: '#F87171', color: '#FFFFFF', height: 52 }}>Надо повторить</button>
              </div>
            </div>
          )}
        </Card>
      ) : (
        <Card light className="mt-4 p-6 text-left">
          <p className="text-[13px]" style={{ color: '#666666' }}>Блок закрыт.</p>
        </Card>
      )}
    </motion.div>
  )
}

function resultColor(score: number): string {
  if (score === 2) return 'text-[#C9DB8A]'
  if (score === 1) return 'text-[#FBBF24]'
  return 'text-[#F87171]'
}

function resultLabel(score: number): React.ReactNode {
  if (score === 2) return 'Профессиональное решение · +12 XP'
  if (score === 1) return 'Терпимо, но есть лучше'
  return 'Ошибка'
}

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="space-y-4"
    >
      <div className="flex items-start justify-between text-[12px]" style={{ color: '#666666' }}>
        <span>Кейс {i + 1} / {serviceCases.length}</span>
        <Pill color="#FBBF24">{c.block}</Pill>
      </div>
      <div className="mt-2"><ProgressBar value={(i / serviceCases.length) * 100} color="#FBBF24" /></div>
      <Card light className="mt-4 p-6 space-y-4">
        <p className="text-[13px] leading-relaxed" style={{ color: '#0F0F10' }}>{c.scene}</p>
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
          <div>
            <p className={`text-[12px] font-bold ${resultColor(c.options[picked].score)}`}>
              {resultLabel(c.options[picked].score)}
              {solvedBest === 2 && picked !== null && c.options[picked].score < 2 ? ' (ранее решён верно)' : ''}
            </p>
            <div className="mt-2 rounded-[16px] p-3 text-[12px] leading-relaxed" style={{ background: '#FFFFFF', color: '#0F0F10' }}>
              {c.explain}
            </div>
          </div>
        )}
      </Card>
      {picked !== null && (
        <motion.button onClick={() => { setPicked(null); setI((x) => (x + 1) % serviceCases.length) }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 w-full rounded-[26px] px-4 py-3 text-[13px] font-extrabold uppercase btn-press"
          style={{ background: '#C9DB8A', color: '#0F0F10', height: 52 }}
        >
          {i + 1 === serviceCases.length ? 'Сначала ↺' : 'Следующий кейс →'}
        </motion.button>
      )}
    </motion.div>
  )
}

export default function Tests() {
  const s = useStore()
  const [mode, setMode] = useState<Mode>('hub')

  if (mode === 'quiz') return <div><BackBtn onClick={() => setMode('hub')} /><Quiz onExit={() => setMode('hub')} /></div>
  if (mode === 'blitz') return <div><BackBtn onClick={() => setMode('hub')} /><Blitz onExit={() => setMode('hub')} /></div>
  if (mode === 'exam') return <div><BackBtn onClick={() => setMode('hub')} /><Exam /></div>
  if (mode === 'cases') return <div><BackBtn onClick={() => setMode('hub')} /><Cases /></div>

  const knownCount = Object.values(s.known).filter(Boolean).length
  const totalTtk = recipes.length
  const examTotal = Object.values(s.examKnown).filter(Boolean).length
  const casesPerfect = Object.values(s.casesScore).filter((v) => v === 2).length

  const cards = [
    { id: 'quiz' as Mode, kicker: 'Квиз · 10 вопросов', title: 'ТТК под контролем',
      desc: 'Рецепты, категории, первые шаги сборки. Вопросы из всего меню.',
      stat: `лучший: ${s.quizBest}%`, color: '#C9DB8A' },
    { id: 'blitz' as Mode, kicker: '60 секунд', title: 'Блиц «Час пик»',
      desc: 'Минутный спринт на скорость вспоминания меню. Без пауз.',
      stat: `рекорд: ${s.blitzBest}`, color: '#F87171' },
    { id: 'exam' as Mode, kicker: '40 вопросов · 4 блока', title: 'Экзамен бариста',
      desc: 'Сервис, техника, фильтр, эспрессо. Открытые вопросы с эталоном и самооценкой.',
      stat: `закрыто: ${examTotal} / 40`, color: '#FBBF24' },
    { id: 'cases' as Mode, kicker: '12 ситуаций', title: 'Кейсы смены',
      desc: 'Реальные ситуации с гостями, очередью и станцией. Логика выбора.',
      stat: `решено идеально: ${casesPerfect} / 12`, color: '#C9DB8A' },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="space-y-2"
      >
        <p className="eyebrow">Проверка знаний</p>
        <h1 className="font-display mt-1 text-[28px] font-extrabold uppercase leading-none" style={{ color: '#FFFFFF' }}>Тесты и экзамен</h1>
        <p className="mt-1 text-[13px]" style={{ color: '#666666' }}>
          Четыре формата: от быстрого блица до полной аттестации. ТТК выучено: {knownCount} / {totalTtk} — квиз берёт вопросы из всего меню.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
        className="grid gap-3"
      >
        {cards.map((c, i) => (
          <motion.button key={c.id} onClick={() => setMode(c.id)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-card bg-surface p-5 text-left" style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start justify-between">
              <p className="eyebrow" style={{ color: '#8B5CF6' }}>{c.kicker}</p>
              <span className="text-[10px] font-bold" style={{ color: '#666666' }}>{c.stat}</span>
            </div>
            <h3 className="font-display mt-2 text-[15px] font-extrabold uppercase leading-none" style={{ color: '#0F0F10' }}>{c.title}</h3>
            <p className="mt-2 text-[12px] leading-relaxed" style={{ color: '#666666' }}>{c.desc}</p>
            <p className="mt-4 text-[12px] font-bold" style={{ color: c.color }}>Начать →</p>
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <motion.button onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="mb-5 rounded-[22px] border px-4 py-2 text-[12px] font-bold btn-press"
      style={{ borderColor: '#3A3A3D', color: '#FFFFFF' }}
    >
      ← Все тесты
    </motion.button>
  )
}
