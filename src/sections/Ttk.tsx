import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { actions, useStore } from '../store'
import { t, type Lang } from '../lang'
import { recipes, ttkCategories, type Recipe } from '../data/recipes'
import { SearchInput, Chip, ProgressBar, Pill, Eyebrow, H1 } from '../components/app-ui'

const CATEGORY_COLOR: Record<string, string> = {
  espresso: '#EB5A52',
  filter: '#C9D98A',
  special: '#5B3FF0',
  matcha: '#523E80',
  smoothie: '#FDC55E',
  lemonade: '#FDC55E',
  icetea: '#523E80',
  shake: '#C9D98A',
  chocolate: '#EB5A52',
  cocktail: '#5B3FF0',
  juice: '#C9D98A',
  wine: '#523E80',
  other: '#666666',
  icecream: '#FDC55E',
}

const XP_VALUES = {
  markKnown: 6,
  recallCorrect: 4,
  buildCorrect: 10,
} as const

function RecipeModal({ recipe, onClose, onTrain, onRecall, lang }: { recipe: Recipe; onClose: () => void; onTrain: () => void; onRecall: () => void; lang: Lang }) {
  const s = useStore()
  const L = (key: string) => t(key, lang)
  const known = !!s.known[recipe.id]
  const cat = ttkCategories.find((c) => c.id === recipe.category)
  const color = CATEGORY_COLOR[recipe.category] || '#666666'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      style={{ background: 'rgba(18,18,18,0.75)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-card p-5"
        style={{ background: '#1B1B1D', color: '#111111' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <EyebrowInline color={color}>{cat?.title}</EyebrowInline>
            <h2 className="mt-1 font-display text-[22px] font-extrabold uppercase leading-none" style={{ color: '#111111' }}>{recipe.name}</h2>
            <span className={`inline-flex items-center rounded-[22px] px-3 py-1 text-[11px] font-bold mt-1`} style={{ background: '#1B1B1D', color: '#FFFFFF' }}>
              {L('ttk.scheme_ru')}
            </span>
          </div>
          <button onClick={onClose} className="rounded-[22px] px-3 py-1.5 text-[12px] font-bold" style={{ background: '#1B1B1D', color: '#FFFFFF' }}>
            {L('ttk.close_ru')}
          </button>
        </div>

        <div className="mt-4 grid gap-3">
          <div className="rounded-[24px] p-4" style={{ background: '#FFFFFF' }}>
            <EyebrowInline color="violet">{L('ttk.recipe_ru')}</EyebrowInline>
            <p className="mt-1 font-display text-[15px] font-extrabold leading-relaxed" style={{ color: '#111111' }}>{recipe.recipe.ru}</p>
            <p className="mt-2 text-[11px] font-bold" style={{ color: '#555555' }}>{L('ttk.source_note_ru')}</p>
          </div>
          <div className="rounded-[24px] p-4" style={{ background: '#FFFFFF' }}>
            <EyebrowInline color="coral">{L('ttk.taste_ru')}</EyebrowInline>
            <p className="mt-1 text-[13px] leading-relaxed" style={{ color: '#111111' }}>{recipe.taste.ru}</p>
          </div>
          <div className="rounded-[24px] p-4" style={{ background: '#FFFFFF' }}>
            <EyebrowInline color="violet">{L('ttk.steps_ru')}</EyebrowInline>
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
        </div>

        <div className="mt-5 grid gap-2">
          <button
            onClick={() => actions.markKnown(recipe.id, !known)}
            className="rounded-[26px] px-4 py-3 text-[13px] font-extrabold uppercase btn-press"
            style={{ background: known ? '#FFFFFF' : '#111111', color: known ? '#111111' : '#FFFFFF', height: 52, border: known ? '1px solid #3A3A3D' : 'none' }}
          >
            {known ? L('ttk.mark_known_ru') : `${L('ttk.mark_known_xp_ru')}`}
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={onTrain} className="rounded-[26px] px-4 py-3 text-[12px] font-extrabold uppercase btn-press"
              style={{ background: '#1B1B1D', color: '#FFFFFF', height: 52 }}>{L('ttk.build_ru')}</button>
            <button onClick={onRecall} className="rounded-[26px] px-4 py-3 text-[12px] font-extrabold uppercase btn-press"
              style={{ background: color, color: '#FFFFFF', height: 52 }}>{L('ttk.recall_ru')}</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function EyebrowInline({ color = 'lime', children }: { color?: string; children: React.ReactNode }) {
  return <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.14em', color, margin: 0 }}>{children}</p>
}

function RecallModal({ recipe, onClose, lang }: { recipe: Recipe; onClose: () => void; lang: Lang }) {
  const [answer, setAnswer] = useState('')
  const [show, setShow] = useState(false)
  const [result, setResult] = useState<'ok' | 'bad' | null>(null)
  const L = (key: string) => t(key, lang)

  const nums = recipe.recipe.ru.match(/\d+(?:[.,]\d+)?/g)
  const target = nums ? nums[0] : '—'

  const check = () => {
    const ok = answer.trim().replace(/,/g, '.') === target
    setResult(ok ? 'ok' : 'bad')
    if (ok) actions.addXp(XP_VALUES.recallCorrect, L('ttk.recall_ru'))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      style={{ background: 'rgba(18,18,18,0.75)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-card p-5"
        style={{ background: '#1B1B1D', color: '#111111' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <EyebrowInline color="yellow">{L('ttk.recall_mode_ru')}</EyebrowInline>
            <h2 className="mt-1 font-display text-[20px] font-extrabold uppercase leading-none" style={{ color: '#111111' }}>{recipe.name}</h2>
          </div>
          <button onClick={onClose} className="rounded-[22px] px-3 py-1.5 text-[12px] font-bold" style={{ background: '#1B1B1D', color: '#FFFFFF' }}>
            {L('ttk.close_ru')}
          </button>
        </div>

        <p className="mt-4 text-[13px] leading-relaxed" style={{ color: '#111111' }}>{L('ttk.recall_instr_ru')}</p>

        <div className="mt-4 rounded-[24px] p-5" style={{ background: '#FFFFFF' }}>
          <EyebrowInline color="coral">{L('ttk.question_ru')}</EyebrowInline>
          <p className="mt-1 font-display text-[16px] font-extrabold leading-relaxed" style={{ color: '#111111' }}>
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
                style={{ borderColor: '#3A3A3D', background: '#1B1B1D', color: '#FFFFFF' }}
              />
              <button onClick={check} className="mt-3 rounded-[26px] px-4 py-3 text-[12px] font-extrabold uppercase btn-press w-full"
                style={{ background: '#111111', color: '#FFFFFF', height: 44 }}>{L('ttk.show_etalon_ru')}</button>
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              <p className={`text-[14px] font-bold ${result === 'ok' ? 'text-[#C9D98A]' : 'text-[#EB5A52]'}`}>
                {result === 'ok' ? `${L('ttk.correct_ru')}` : `${L('ttk.wrong_ru')} ${target}`}
              </p>
              <p className="mt-1 text-[12px]" style={{ color: '#111111' }}>{L('ttk.full_recipe_ru')} {recipe.recipe.ru}</p>
              <button onClick={() => { setShow(false); setResult(null); setAnswer('') }} className="rounded-[26px] px-4 py-3 text-[12px] font-extrabold uppercase btn-press w-full"
                style={{ background: '#1B1B1D', color: '#FFFFFF', height: 44 }}>{L('ttk.again_ru')}</button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Ttk({ lang }: { lang: Lang }) {
  const s = useStore()
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('all')
  const [open, setOpen] = useState<Recipe | null>(null)
  const [train, setTrain] = useState<Recipe | null>(null)
  const [recall, setRecall] = useState<Recipe | null>(null)

  const L = (key: string) => t(key, lang)

  const knownCount = Object.values(s.known).filter(Boolean).length
  const totalTtk = recipes.length

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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="space-y-2"
      >
        <Eyebrow>{L('ttk.title_ru')}</Eyebrow>
        <H1>{L('ttk.title_ru')}</H1>
        <p className="mt-1 text-[13px]" style={{ color: '#555555' }}>{L('ttk.subtitle_ru')}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
        className="CardLight p-4"
      >
        <div className="flex items-start justify-between text-[12px]" style={{ color: '#555555' }}>
          <span>{L('ttk.known_ru')}</span>
          <span className="font-bold tnum" style={{ color: '#C9D98A' }}>{knownCount} / {totalTtk}</span>
        </div>
        <div className="mt-2"><ProgressBar value={(knownCount / totalTtk) * 100} /></div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.2 }}
      >
        <SearchInput value={query} onChange={setQuery} placeholder={L('ttk.search_ru')} />

        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 mt-4">
          <Chip active={cat === 'all'} onClick={() => setCat('all')}>{L('ttk.all_ru')}</Chip>
          {ttkCategories.map((c) => (
            <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>{c.title}</Chip>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.3 }}
        className="space-y-2"
      >
        {filtered.map((r, i) => {
          const known = !!s.known[r.id]
          const color = CATEGORY_COLOR[r.category] || '#666666'
          return (
            <motion.button
              key={r.id}
              onClick={() => setOpen(r)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="CardLight flex w-full items-center gap-3 p-4 text-left"
              style={{ animationDelay: `${Math.min(i, 12) * 30}ms`, borderLeft: `4px solid ${color}` }}
            >
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: known ? '#C9D98A' : '#4A4A4D' }} />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-bold" style={{ color: '#111111' }}>{r.name}</p>
                <p className="truncate text-[12px]" style={{ color: '#555555' }}>{r.recipe.ru}</p>
              </div>
              <Pill dark={!known}>{ttkCategories.find((c) => c.id === r.category)?.title}</Pill>
            </motion.button>
          )
        })}
        {filtered.length === 0 && (
          <p className="py-8 text-left text-[13px]" style={{ color: '#555555' }}>{L('ttk.not_found_ru')}</p>
        )}
      </motion.div>

      {open && !train && !recall && <RecipeModal recipe={open} onClose={() => setOpen(null)} onTrain={() => setTrain(open)} onRecall={() => setRecall(open)} lang={lang} />}
      {train && <BuildTrainer recipe={train} onClose={() => { setTrain(null); setOpen(null) }} lang={lang} />}
      {recall && <RecallModal recipe={recall} onClose={() => { setRecall(null); setOpen(null) }} lang={lang} />}
    </div>
  )
}

function BuildTrainer({ recipe, onClose, lang }: { recipe: Recipe; onClose: () => void; lang: Lang }) {
  const correct = recipe.steps.ru
  const [pool] = useState(() => [...correct].sort(() => Math.random() - 0.5))
  const [picked, setPicked] = useState<string[]>([])
  const [result, setResult] = useState<null | boolean>(null)
  const L = (key: string) => t(key, lang)

  const check = (next: string[]) => {
    if (next.length !== correct.length) return
    const ok = next.every((s, i) => s === correct[i])
    setResult(ok)
    if (ok) {
      actions.addXp(XP_VALUES.buildCorrect, L('ttk.build_ru'))
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      style={{ background: 'rgba(18,18,18,0.75)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-card p-5"
        style={{ background: '#1B1B1D', color: '#111111' }}
        onClick={(e) => e.stopPropagation()}
      >
        <Eyebrow color="yellow">{L('ttk.build_trainer_ru')}</Eyebrow>
        <h2 className="font-display mt-1 text-[18px] font-extrabold uppercase leading-none" style={{ color: '#111111' }}>{recipe.name}</h2>
        <p className="mt-1 text-[13px]" style={{ color: '#555555' }}>{L('ttk.build_instr_ru')}</p>

        <div className="mt-4 min-h-[64px] rounded-[24px] p-3" style={{ background: '#FFFFFF' }}>
          {picked.length === 0 && <p className="text-[13px] italic" style={{ color: '#555555' }}>{L('ttk.build_here_ru')}</p>}
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
              <button key={i} onClick={() => pick(p)} className="rounded-pill px-3 py-2 text-[12px] font-bold btn-press"
                style={{ background: '#1B1B1D', color: '#FFFFFF' }}>{p}</button>
            ))}
          </div>
        )}

        {result !== null && (
          <div className="mt-4 rounded-[24px] p-4 text-left" style={{ background: result ? '#C9D98A22' : '#EB5A5222' }}>
            <p className="font-display text-[16px] font-extrabold" style={{ color: result ? '#C9D98A' : '#EB5A52' }}>
              {result ? `${L('ttk.build_perfect_ru')}` : L('ttk.build_wrong_ru')}
            </p>
            {!result && (
              <p className="mt-2 text-[12px]" style={{ color: '#111111' }}>
                {L('ttk.build_correct_ru')} {correct.join(' → ')}
              </p>
            )}
            <button onClick={onClose} className="mt-4 rounded-[26px] px-6 py-2.5 text-[13px] font-extrabold uppercase btn-press"
              style={{ background: '#111111', color: '#FFFFFF', height: 44 }}>{L('ttk.done_ru')}</button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
