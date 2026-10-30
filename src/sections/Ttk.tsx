import { useMemo, useState } from 'react'
import { actions, useStore } from '../store'
import { recipes, ttkCategories, type Recipe } from '../data/recipes'
import { Search, Chip, ProgressBar, Pill } from '../components/app-ui'

const CATEGORY_COLOR: Record<string, string> = {
  espresso: '#F87171',
  filter: '#C9DB8A',
  special: '#8B5CF6',
  matcha: '#6D28D9',
  smoothie: '#FBBF24',
  lemonade: '#FBBF24',
  icetea: '#6D28D9',
  shake: '#C9DB8A',
  chocolate: '#F87171',
  cocktail: '#8B5CF6',
  juice: '#C9DB8A',
  wine: '#6D28D9',
  other: '#666666',
  icecream: '#FBBF24',
}

function RecipeModal({ recipe, onClose, onTrain, onRecall }: { recipe: Recipe; onClose: () => void; onTrain: () => void; onRecall: () => void }) {
  const s = useStore()
  const known = !!s.known[recipe.id]
  const cat = ttkCategories.find((c) => c.id === recipe.category)
  const color = CATEGORY_COLOR[recipe.category] || '#666666'

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" style={{ background: 'rgba(18,18,18,0.75)' }} onClick={onClose}>
      <div className="anim-rise max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-card p-5" style={{ background: '#1A1A1C', color: '#FFFFFF' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="eyebrow" style={{ color: color }}>{cat?.title}</p>
            <h2 className="mt-1 font-display text-[22px] font-extrabold uppercase leading-none" style={{ color: '#0F0F10' }}>{recipe.name}</h2>
            <span className={`inline-flex items-center rounded-[22px] px-3 py-1 text-[11px] font-bold mt-1`} style={{ background: '#1A1A1C', color: '#FFFFFF' }}>
              Единая схема ТТК · источник: карточка станции
            </span>
          </div>
          <button onClick={onClose} className="rounded-[22px] px-3 py-1.5 text-[12px] font-bold" style={{ background: '#1A1A1C', color: '#FFFFFF' }}>Закрыть</button>
        </div>

        {/* Unified recipe schema */}
        <div className="mt-4 grid gap-3">
          <div className="rounded-[24px] p-4" style={{ background: '#FFFFFF' }}>
            <p className="eyebrow" style={{ color: '#8B5CF6' }}>Рецепт (единая схема)</p>
            <p className="mt-1 font-display text-[15px] font-extrabold leading-relaxed" style={{ color: '#FFFFFF' }}>{recipe.recipe.ru}</p>
            <p className="mt-2 text-[11px] font-bold" style={{ color: '#666666' }}>Доза · выход · время · молоко · посуда — из карточка станции.</p>
          </div>
          <div className="rounded-[24px] p-4" style={{ background: '#FFFFFF' }}>
            <p className="eyebrow" style={{ color: '#F87171' }}>Ожидаемый вкус</p>
            <p className="mt-1 text-[13px] leading-relaxed" style={{ color: '#0F0F10' }}>{recipe.taste.ru}</p>
          </div>
          <div className="rounded-[24px] p-4" style={{ background: '#FFFFFF' }}>
            <p className="eyebrow" style={{ color: '#8B5CF6' }}>Сборка по шагам</p>
            <div className="mt-2 space-y-2">
              {recipe.steps.ru.map((st, i) => (
                <div key={i} className="flex gap-3 text-[13px]" style={{ color: '#0F0F10' }}>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                    style={{ background: '#1A1A1C', color: '#C9DB8A' }}>{i + 1}</span>
                  <span>{st}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-2">
          <button
            onClick={() => actions.markKnown(recipe.id, !known)}
            className="rounded-[26px] px-4 py-3 text-[13px] font-extrabold uppercase btn-press"
            style={{ background: known ? '#FFFFFF' : '#0F0F10', color: known ? '#0F0F10' : '#FFFFFF', height: 52, border: known ? '1px solid #3A3A3D' : 'none' }}
          >
            {known ? 'Знаю ✓' : 'Отметить знакомым · +6 XP'}
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={onTrain} className="rounded-[26px] px-4 py-3 text-[12px] font-extrabold uppercase btn-press"
              style={{ background: '#1A1A1C', color: '#FFFFFF', height: 52 }}>Собрать порядок</button>
            <button onClick={onRecall} className="rounded-[26px] px-4 py-3 text-[12px] font-extrabold uppercase btn-press"
              style={{ background: color, color: '#FFFFFF', height: 52 }}>Вспомни значения</button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- Вспомни: скрытые значения ---------- */
function RecallModal({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) {
  const [answer, setAnswer] = useState('')
  const [show, setShow] = useState(false)
  const [result, setResult] = useState<'ok' | 'bad' | null>(null)

  // pick the first numeric value in the recipe string as the target
  const nums = recipe.recipe.ru.match(/\d+(?:[.,]\d+)?/g)
  const target = nums ? nums[0] : '—'

  const check = () => {
    const ok = answer.trim().replace(/,/g, '.') === target
    setResult(ok ? 'ok' : 'bad')
    if (ok) actions.addXp(4, 'вспомни ТТК')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" style={{ background: 'rgba(18,18,18,0.75)' }} onClick={onClose}>
      <div className="anim-pop max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-card p-5" style={{ background: '#1A1A1C', color: '#0F0F10' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="eyebrow" style={{ color: '#FBBF24' }}>Режим «Вспомни»</p>
            <h2 className="mt-1 font-display text-[20px] font-extrabold uppercase leading-none" style={{ color: '#0F0F10' }}>{recipe.name}</h2>
          </div>
          <button onClick={onClose} className="rounded-[22px] px-3 py-1.5 text-[12px] font-bold" style={{ background: '#1A1A1C', color: '#FFFFFF' }}>Закрыть</button>
        </div>

        <p className="mt-4 text-[13px] leading-relaxed" style={{ color: '#0F0F10' }}>
          Назовите значение без подсказки. Допуск ±. Нажмите «Показать», чтобы свериться.
        </p>

        <div className="mt-4 rounded-[24px] p-5" style={{ background: '#FFFFFF' }}>
            <p className="eyebrow" style={{ color: '#F87171' }}>Вопрос</p>
          <p className="mt-1 font-display text-[16px] font-extrabold leading-relaxed" style={{ color: '#0F0F10' }}>
            {recipe.recipe.ru.replace(/\d+(?:[.,]\d+)?/, '____')}
          </p>
          {!show ? (
            <div className="mt-4">
              <input
                autoFocus
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="введите число, напр. 18"
                className="h-[44px] w-full rounded-[22px] border px-4 text-[14px] outline-none"
                style={{ borderColor: '#3A3A3D', background: '#1A1A1C', color: '#FFFFFF' }}
              />
              <button onClick={check} className="mt-3 rounded-[26px] px-4 py-3 text-[12px] font-extrabold uppercase btn-press w-full"
                style={{ background: '#0F0F10', color: '#FFFFFF', height: 44 }}>Показать эталон</button>
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              {
                (() => {
                  const color = result === 'ok' ? 'text-[#C9DB8A]' : 'text-[#F87171]'
                  const label = result === 'ok' ? 'Верно · +4 XP' : `Неверно. Эталон: ${target}`
                  return (
                    <p className={`text-[14px] font-bold ${color}`}>{label}</p>
                  )
                })()
              }
              <p className="mt-1 text-[12px]" style={{ color: '#0F0F10' }}>Полный рецепт: {recipe.recipe.ru}</p>
              <button onClick={() => { setShow(false); setResult(null); setAnswer('') }} className="rounded-[26px] px-4 py-3 text-[12px] font-extrabold uppercase btn-press w-full"
                style={{ background: '#1A1A1C', color: '#FFFFFF', height: 44 }}>Ещё раз</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Ttk() {
  const s = useStore()
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('all')
  const [open, setOpen] = useState<Recipe | null>(null)
  const [train, setTrain] = useState<Recipe | null>(null)
  const [recall, setRecall] = useState<Recipe | null>(null)

  const knownCount = Object.values(s.known).filter(Boolean).length

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return recipes.filter((r) => {
      if (cat !== 'all' && r.category !== cat) return false
      if (!q) return true
      return [r.name, r.recipe.ru, r.taste.ru, r.method.ru, ...r.steps.ru].join(' ').toLowerCase().includes(q)
    })
  }, [query, cat])

  return (
    <div className="space-y-6">
      <div className="anim-rise">
        <p className="eyebrow">ТТК · техкарты станции</p>
        <h1 className="font-display mt-2 text-[28px] font-extrabold uppercase leading-none" style={{ color: '#FFFFFF' }}>Рецепты и сборка</h1>
        <p className="mt-2 text-[13px]" style={{ color: '#666666' }}>
          Карточки: рецепт по единой схеме, вкус, метод, шаги. Проверяйте знание режимом «Вспомни», а не отметкой «знаю».
        </p>
      </div>

      <div className="rounded-card bg-surface p-4 anim-rise">
        <div className="flex items-center justify-between text-[12px]" style={{ color: '#666666' }}>
          <span>Знаю рецептов</span>
          <span className="font-bold tnum" style={{ color: '#C9DB8A' }}>{knownCount}/79</span>
        </div>
        <div className="mt-2"><ProgressBar value={(knownCount / 79) * 100} color="#C9DB8A" h={6} /></div>
      </div>

      <Search value={query} onChange={setQuery} placeholder="Поиск: flat white, раф, V60…" />

      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 anim-rise">
        <Chip active={cat === 'all'} onClick={() => setCat('all')}>Все</Chip>
        {ttkCategories.map((c) => (
          <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>{c.title}</Chip>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((r, i) => {
          const known = !!s.known[r.id]
          const color = CATEGORY_COLOR[r.category] || '#666666'
          return (
            <button key={r.id} onClick={() => setOpen(r)}
              className="rounded-card bg-surface flex w-full items-center gap-3 p-4 text-left anim-rise"
              style={{ animationDelay: `${Math.min(i, 12) * 30}ms`, borderLeft: `4px solid ${color}` }}>
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: known ? '#C9DB8A' : '#4A4A4D' }} />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-bold" style={{ color: '#0F0F10' }}>{r.name}</p>
                <p className="truncate text-[12px]" style={{ color: '#666666' }}>{r.recipe.ru}</p>
              </div>
              <Pill color={known ? '#C9DB8A' : color}>{ttkCategories.find((c) => c.id === r.category)?.title}</Pill>
            </button>
          )
        })}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-[13px]" style={{ color: '#666666' }}>Ничего не найдено. Попробуй другой запрос.</p>
        )}
      </div>

      {open && !train && !recall && <RecipeModal recipe={open} onClose={() => setOpen(null)} onTrain={() => setTrain(open)} onRecall={() => setRecall(open)} />}
      {train && <BuildTrainer recipe={train} onClose={() => { setTrain(null); setOpen(null) }} />}
      {recall && <RecallModal recipe={recall} onClose={() => { setRecall(null); setOpen(null) }} />}
    </div>
  )
}

function BuildTrainer({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) {
  const correct = recipe.steps.ru
  const [pool] = useState(() => [...correct].sort(() => Math.random() - 0.5))
  const [picked, setPicked] = useState<string[]>([])
  const [result, setResult] = useState<null | boolean>(null)

  const check = (next: string[]) => {
    if (next.length !== correct.length) return
    const ok = next.every((s, i) => s === correct[i])
    setResult(ok)
    if (ok) {
      actions.addXp(10, 'сборка верна')
      actions.markKnown(recipe.id, true)
    }
  }

  const pick = (step: string) => {
    if (result !== null) return
    const next = [...picked, step]
    setPicked(next)
    check(next)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" style={{ background: 'rgba(18,18,18,0.75)' }} onClick={onClose}>
      <div className="anim-pop max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-card p-5" style={{ background: '#1A1A1C', color: '#0F0F10' }} onClick={(e) => e.stopPropagation()}>
        <p className="eyebrow" style={{ color: '#FBBF24' }}>Build-тренажёр</p>
        <h2 className="font-display mt-1 text-[18px] font-extrabold uppercase leading-none" style={{ color: '#0F0F10' }}>{recipe.name}</h2>
        <p className="mt-1 text-[13px]" style={{ color: '#666666' }}>Соберите напиток: нажимайте шаги в правильном порядке.</p>

        <div className="mt-4 min-h-[64px] rounded-[24px] p-3" style={{ background: '#FFFFFF' }}>
          {picked.length === 0 && <p className="text-[13px] italic" style={{ color: '#666666' }}>Здесь появится ваша сборка…</p>}
          <div className="space-y-2">
            {picked.map((p, i) => {
              const okStep = result === null || correct[i] === p
              return (
                <div key={i} className="flex gap-2 rounded-[16px] px-2 py-1.5 text-[13px]"
                  style={{ background: result === null ? '#FFFFFF' : okStep ? '#C9DB8A22' : '#F8717122', color: '#0F0F10' }}>
                  <span className="text-[11px] font-bold" style={{ color: okStep ? '#C9DB8A' : '#F87171' }}>{i + 1}</span>
                  {p}
                </div>
              )
            })}
          </div>
        </div>

        {result === null && (
          <div className="mt-4 flex flex-wrap gap-2">
            {pool.filter((p) => !picked.includes(p)).map((p, i) => (
              <button key={i} onClick={() => pick(p)} className="rounded-pill px-3 py-2 text-[12px] font-bold btn-press"
                style={{ background: '#1A1A1C', color: '#FFFFFF' }}>{p}</button>
            ))}
          </div>
        )}

        {result !== null && (
          <div className="mt-4 rounded-[24px] p-4 text-center" style={{ background: result ? '#C9DB8A22' : '#F8717122' }}>
            <p className="font-display text-[16px] font-extrabold" style={{ color: result ? '#C9DB8A' : '#F87171' }}>
              {result ? 'Сборка идеальна · +10 XP' : 'Порядок нарушен'}
            </p>
            {!result && (
              <p className="mt-2 text-[12px]" style={{ color: '#0F0F10' }}>
                Верно: {correct.join(' → ')}
              </p>
            )}
            <button onClick={onClose} className="mt-4 rounded-[26px] px-6 py-2.5 text-[13px] font-extrabold uppercase btn-press"
              style={{ background: '#0F0F10', color: '#FFFFFF', height: 44 }}>Готово</button>
          </div>
        )}
      </div>
    </div>
  )
}
