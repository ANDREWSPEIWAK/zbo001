import { useMemo, useState } from 'react'
import { actions, useStore } from '../store'
import { libraryTopics, libraryItems, type LibraryItem } from '../data/library'
import { Chip } from '../components/app-ui'

function ItemModal({ item, onClose }: { item: LibraryItem; onClose: () => void }) {
  const s = useStore()
  const read = !!s.lessonsRead[item.id]
  const topic = libraryTopics.find((t) => t.id === item.topicId)
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" style={{ background: 'rgba(15,15,16,.85)' }} onClick={onClose}>
      <div className="anim-rise max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-card p-6"
        style={{ background: '#E8E6DF', color: '#111111' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow" style={{ color: '#5B3FF0' }}>{topic?.title} · {item.duration}</p>
            <h2 className="font-display mt-1 text-[20px] font-extrabold uppercase">{item.title}</h2>
            <p className="mt-1 text-[13px]" style={{ color: '#555555' }}>{item.summary}</p>
          </div>
          <button onClick={onClose} className="rounded-pill px-3 py-1.5 text-[12px] font-bold" style={{ background: '#1B1B1D', color: '#FFFFFF' }}>Закрыть</button>
        </div>

        {item.youtube && (
          <a href={`https://www.youtube.com/watch?v=${item.youtube.id}`} target="_blank" rel="noreferrer"
            className="mt-5 flex items-center gap-4 rounded-[24px] p-4 transition-transform hover:scale-[1.01]"
            style={{ background: '#FFFFFF', border: '1px solid #EB5A5255' }}>
            <span className="flex h-12 w-12 items-center justify-center rounded-full text-lg" style={{ background: '#EB5A52', color: '#FFFFFF' }}>▶</span>
            <div>
              <p className="eyebrow" style={{ color: '#EB5A52' }}>Видео-методика</p>
              <p className="mt-0.5 text-[13px] font-bold" style={{ color: '#111111' }}>{item.youtube.title}</p>
            </div>
          </a>
        )}

        {item.recipe && (
          <div className="mt-4 overflow-hidden rounded-[24px] border" style={{ borderColor: '#CFCCC4' }}>
            <table className="w-full text-[12px]">
              <tbody>
                {item.recipe.rows.map((row, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: '#CFCCC4' }}>
                    <td className="px-3 py-2" style={{ color: '#555555' }}>{row[0]}</td>
                    <td className="px-3 py-2 text-right font-bold" style={{ color: '#C9D98A' }}>{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-5 space-y-4">
          {item.sections.map((sec, i) => (
            <div key={i}>
              <p className="eyebrow" style={{ color: '#FDC55E' }}>{sec.title}</p>
              {sec.steps && (
                <ol className="mt-2 space-y-2">
                  {sec.steps.map((st, j) => (
                    <li key={j} className="flex gap-3 text-[13px]" style={{ color: '#111111' }}>
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                        style={{ background: '#1B1B1D', color: '#C9D98A' }}>{j + 1}</span>
                      {st}
                    </li>
                  ))}
                </ol>
              )}
              {sec.body && <p className="mt-2 text-[13px] leading-relaxed" style={{ color: '#111111' }}>{sec.body}</p>}
            </div>
          ))}
        </div>

        <button
          onClick={() => { actions.readLesson(item.id); onClose() }}
          disabled={read}
          className="mt-6 w-full rounded-btn px-4 py-3 text-[13px] font-extrabold uppercase disabled:opacity-40"
          style={{ background: '#111111', color: '#FFFFFF', height: 48 }}
        >
          {read ? 'Изучено ✓' : 'Изучил методику · +10 XP'}
        </button>
      </div>
    </div>
  )
}

export default function Library() {
  const s = useStore()
  const [topic, setTopic] = useState('all')
  const [open, setOpen] = useState<LibraryItem | null>(null)

  const filtered = useMemo(
    () => (topic === 'all' ? libraryItems : libraryItems.filter((i) => i.topicId === topic)),
    [topic],
  )
  const readCount = Object.values(s.lessonsRead).filter(Boolean).length

  return (
    <div className="space-y-6">
      <div className="anim-rise">
        <p className="eyebrow">Методики и видео</p>
        <h1 className="font-display mt-2 text-[28px] font-extrabold uppercase leading-tight" style={{ color: '#FFFFFF' }}>Библиотека</h1>
        <p className="mt-2 text-[13px]" style={{ color: '#555555' }}>
          Рабочие методики станции: текстура молока, латте-арт, фильтр, диалин. Изучено {readCount}/{libraryItems.length}.
        </p>
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto anim-rise">
        <Chip active={topic === 'all'} onClick={() => setTopic('all')}>Все</Chip>
        {libraryTopics.map((t) => (
          <Chip key={t.id} active={topic === t.id} onClick={() => setTopic(t.id)}>
            {t.title}
          </Chip>
        ))}
      </div>

      <div className="grid gap-3">
        {filtered.map((item, i) => {
          const read = !!s.lessonsRead[item.id]
          const t = libraryTopics.find((x) => x.id === item.topicId)
          return (
            <button key={item.id} onClick={() => setOpen(item)}
              className="rounded-card bg-light p-5 text-left anim-rise" style={{ animationDelay: `${Math.min(i, 10) * 40}ms` }}>
              <div className="flex items-center justify-between">
                <p className="eyebrow" style={{ color: '#5B3FF0' }}>{t?.title}</p>
                <div className="flex items-center gap-2">
                  {item.youtube && <span className="text-[12px]" style={{ color: '#EB5A52' }}>▶ видео</span>}
                  {read && <span className="rounded-pill px-[10px] py-[3px] text-[10px] font-bold" style={{ background: '#C9D98A', color: '#111111' }}>✓</span>}
                </div>
              </div>
              <h3 className="font-display mt-2 text-[15px] font-extrabold uppercase" style={{ color: '#111111' }}>{item.title}</h3>
              <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed" style={{ color: '#555555' }}>{item.summary}</p>
              <p className="mt-3 text-[10px]" style={{ color: '#555555' }}>{item.duration}</p>
            </button>
          )
        })}
      </div>

      {open && <ItemModal item={open} onClose={() => setOpen(null)} />}
    </div>
  )
}
