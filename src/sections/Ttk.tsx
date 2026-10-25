import { useMemo, useState } from 'react'
import { actions, useStore } from '../store'
import { recipes, ttkCategories, type Recipe } from '../data/recipes'
import { Search, Chip, ProgressBar, Pill } from '../components/app-ui'

function RecipeModal({ recipe, onClose, onTrain }: { recipe: Recipe; onClose: () => void; onTrain: () => void }) {
  const s = useStore()
  const known = !!s.known[recipe.id]
  const cat = ttkCategories.find((c) => c.id === recipe.category)
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" style={{ background: 'rgba(15,15,16,.85)' }} onClick={onClose}>
      <div className="anim-rise max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-card p-6"
        style={{ background: '#E8E6DF', color: '#111111' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow" style={{ color: '#5B3FF0' }}>{cat?.title}</p>
            <h2 className="font-display mt-1 text-[20px] font-extrabold uppercase">{recipe.name}</h2>
          </div>
          <button onClick={onClose} className="rounded-pill px-3 py-1.5 text-[12px] font-bold" style={{ background: '#1B1B1D', color: '#FFFFFF' }}>Закрыть</button>
        </div>

        <div className="mt-5 rounded-[24px] p-4" style={{ background: '#FFFFFF', border: '1px solid #C9D98A55' }}>
          <p className="eyebrow" style={{ color: '#C9D98A' }}>Рецепт</p>
          <p className="mt-2 text-[13px] font-bold leading-relaxed" style={{ color: '#111111' }}>{recipe.recipe.ru}</p>
        </div>

        <div className="mt-4">
          <p className="eyebrow" style={{ color: '#FDC55E' }}>Вкус</p>
          <p className="mt-1 text-[13px] leading-relaxed" style={{ color: '#111111' }}>{recipe.taste.ru}</p>
        </div>

        <div className="mt-4">
          <p className="eyebrow" style={{ color: '#EB5A52' }}>Метод</p>
          <p className="mt-1 text-[13px] leading-relaxed" style={{ color: '#111111' }}>{recipe.method.ru}</p>
        </div>

        <div className="mt-4">
          <p className="eyebrow" style={{ color: '#5B3FF0' }}>Сборка по шагам</p>
          <div className="mt-2 space-y-2">
            {recipe.steps.ru.map((st, i) => (
              <div key={i} className="flex gap-3 text-[13px]" style={{ color: '#111111' }}>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                  style={{ background: '#1B1B1D', color: '#C9D98A' }}>{i + 1}</span>
                <span>{st}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={() => actions.markKnown(recipe.id, !known)}
            className="flex-1 rounded-btn px-4 py-3 text-[13px] font-extrabold uppercase"
            style={{ background: known ? '#FFFFFF' : '#111111', color: known ? '#111111' : '#FFFFFF', height: 48, border: known ? '1px solid #3A3A3D' : 'none' }}
          >
            {known ? 'Знаю ✓ (снять отметку)' : 'Я знаю этот рецепт · +6 XP'}
          </button>
          <button onClick={onTrain} className="rounded-btn px-4 py-3 text-[13px] font-extrabold uppercase"
            style={{ background: '#EB5A52', color: '#FFFFFF', height: 48 }}>Тренировать</button>
        </div>
      </div>
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
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" style={{ background: 'rgba(15,15,16,.85)' }} onClick={onClose}>
      <div className="anim-pop max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-card p-6"
        style={{ background: '#E8E6DF', color: '#111111' }} onClick={(e) => e.stopPropagation()}>
        <p className="eyebrow" style={{ color: '#FDC55E' }}>Build-тренажёр</p>
        <h2 className="font-display mt-1 text-[18px] font-extrabold uppercase">{recipe.name}</h2>
        <p className="mt-1 text-[13px]" style={{ color: '#555555' }}>Собери напиток: нажимай шаги в правильном порядке.</p>

        <div className="mt-4 min-h-[64px] rounded-[24px] p-3" style={{ background: '#FFFFFF' }}>
          {picked.length === 0 && <p className="text-[13px] italic" style={{ color: '#555555' }}>Здесь появится твоя сборка…</p>}
          <div className="space-y-2">
            {picked.map((p, i) => {
              const okStep = result === null || correct[i] === p
              return (
                <div key={i} className="flex gap-2 rounded-[16px] px-2 py-1.5 text-[13px]"
                  style={{ background: result === null ? '#FFFFFF' : okStep ? '#C9D98A22' : '#EB5A5222', color: '#111111' }}>
                  <span className="text-[11px] font-bold" style={{ color: okStep ? '#C9D98A' : '#EB5A52' }}>{i + 1}</span>
                  {p}
                </div>
              )
            })}
          </div>
        </div>

        {result === null && (
          <div className="mt-4 flex flex-wrap gap-2">
            {pool.filter((p) => !picked.includes(p)).map((p, i) => (
              <button key={i} onClick={() => pick(p)} className="rounded-pill px-3 py-2 text-[12px] font-bold"
                style={{ background: '#1B1B1D', color: '#FFFFFF' }}>{p}</button>
            ))}
          </div>
        )}

        {result !== null && (
          <div className="mt-4 rounded-[24px] p-4 text-center" style={{ background: result ? '#C9D98A22' : '#EB5A5222' }}>
            <p className="font-display text-[16px] font-extrabold" style={{ color: result ? '#C9D98A' : '#EB5A52' }}>
              {result ? 'Сборка идеальна · +10 XP' : 'Порядок нарушен'}
            </p>
            {!result && (
              <p className="mt-2 text-[12px]" style={{ color: '#111111' }}>
                Верно: {correct.join(' → ')}
              </p>
            )}
            <button onClick={onClose} className="mt-4 rounded-btn px-6 py-2.5 text-[13px] font-extrabold uppercase"
              style={{ background: '#111111', color: '#FFFFFF', height: 44 }}>Готово</button>
          </div>
        )}
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
        <h1 className="font-display mt-2 text-[28px] font-extrabold uppercase leading-tight" style={{ color: '#FFFFFF' }}>Рецепты и сборка</h1>
        <p className="mt-2 text-[13px]" style={{ color: '#555555' }}>
          Карточки: рецепт, вкус, метод, шаги. Отмечай «знаю» и тренируй сборку, пока меню не сядет в руки.
        </p>
      </div>

      <div className="rounded-card bg-light p-4 anim-rise">
        <div className="flex items-center justify-between text-[12px]" style={{ color: '#555555' }}>
          <span>Знаю рецептов</span>
          <span className="font-bold" style={{ color: '#C9D98A' }}>{knownCount}/79</span>
        </div>
        <div className="mt-2"><ProgressBar value={(knownCount / 79) * 100} color="#C9D98A" /></div>
      </div>

      <Search value={query} onChange={setQuery} placeholder="Поиск: flat white, раф, V60, мартини…" />

      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 anim-rise">
        <Chip active={cat === 'all'} onClick={() => setCat('all')}>Все</Chip>
        {ttkCategories.map((c) => (
          <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>{c.title}</Chip>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((r, i) => {
          const known = !!s.known[r.id]
          return (
            <button key={r.id} onClick={() => setOpen(r)}
              className="rounded-card bg-light flex w-full items-center gap-3 p-4 text-left anim-rise"
              style={{ animationDelay: `${Math.min(i, 12) * 30}ms` }}>
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: known ? '#C9D98A' : '#3A3A3D' }} />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-bold" style={{ color: '#111111' }}>{r.name}</p>
                <p className="truncate text-[12px]" style={{ color: '#555555' }}>{r.recipe.ru}</p>
              </div>
              <Pill color={known ? '#C9D98A' : '#555555'}>{ttkCategories.find((c) => c.id === r.category)?.title}</Pill>
            </button>
          )
        })}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-[13px]" style={{ color: '#555555' }}>Ничего не найдено. Попробуй другой запрос.</p>
        )}
      </div>

      {open && !train && (
        <RecipeModal recipe={open} onClose={() => setOpen(null)} onTrain={() => setTrain(open)} />
      )}
      {train && <BuildTrainer recipe={train} onClose={() => { setTrain(null); setOpen(null) }} />}
    </div>
  )
}
