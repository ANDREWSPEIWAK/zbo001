import { useState } from 'react'
import { libraryTopics, libraryItems, type LibraryTopic } from '../data/library'
import { Card, Button } from '../components/app-ui'

export default function Library() {
  const [open, setOpen] = useState<LibraryTopic | null>(null)

  if (open) return (
    <div className="space-y-6">
      <button onClick={() => setOpen(null)} className="mb-5 rounded-[22px] border px-4 py-2 text-[12px] font-bold btn-press"
        style={{ borderColor: '#2A2A2D', color: '#FFFFFF' }}>← Методики</button>
      <div className="anim-rise">
        <p className="eyebrow" style={{ color: '#5B45F0' }}>{open.kicker}</p>
        <h1 className="font-display mt-2 text-[25px] font-extrabold uppercase leading-none" style={{ color: '#FFFFFF' }}>{open.title}</h1>
        <p className="mt-2 text-[13px]" style={{ color: '#555555' }}>{open.blurb}</p>
      </div>
      <div className="space-y-4">
        {(open.lessonIds ?? []).map((lid) => {
          const item = libraryItems.find((i) => i.id === lid)
          if (!item) return null
          return (
            <Card key={lid} light className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="eyebrow" style={{ color: '#C9DB8A' }}>{item.kind}</p>
                  <h3 className="font-display mt-1 text-[15px] font-extrabold uppercase leading-none" style={{ color: '#111111' }}>{item.title}</h3>
                  <p className="mt-0.5 text-[12px] font-bold" style={{ color: '#555555' }}>{item.duration}</p>
                </div>
                <span className="text-[12px] font-bold" style={{ color: '#FBC85F' }}>→</span>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed" style={{ color: '#111111' }}>{item.summary}</p>
              {item.recipe && (
                <div className="mt-3 rounded-[20px] p-3" style={{ background: '#FFFFFF' }}>
                  <p className="eyebrow mb-1" style={{ color: '#5B45F0' }}>Рецепт</p>
                  <table className="w-full text-[12px]">
                    <tbody>
                      {item.recipe.rows.map((row, i) => (
                        <tr key={i} className={i > 0 ? 'border-t' : ''} style={{ borderColor: '#CFCCC4' }}>
                          <td className="px-3 py-1" style={{ color: '#555555' }}>{row[0]}</td>
                          <td className="px-3 py-1 text-right font-bold" style={{ color: '#111111' }}>{row[1]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="mt-3 flex gap-2">
                {item.youtube && (
                  <a href={`https://youtu.be/${item.youtube.id}`} target="_blank" rel="noopener noreferrer"
                    className="flex-1 rounded-[26px] px-4 py-3 text-[12px] font-extrabold uppercase btn-press"
                    style={{ background: '#1B1B1D', color: '#FFFFFF', height: 44 }}>
                    Видео: {item.youtube.title}
                  </a>
                )}
                <Button variant="ghost" className="flex-1" style={{ height: 44, padding: '0 12px', fontSize: '11px' }}>Открыть урок</Button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="anim-rise">
        <p className="eyebrow">Методика сети</p>
        <h1 className="font-display mt-2 text-[28px] font-extrabold uppercase leading-none" style={{ color: '#FFFFFF' }}>Методики</h1>
        <p className="mt-2 text-[13px]" style={{ color: '#555555' }}>        {libraryTopics.length} тем: латте-арт, фильтр, сервис, сенсорика и другое.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {libraryTopics.map((t) => (
          <button key={t.id} onClick={() => setOpen(t)}
            className="rounded-card bg-surface p-5 flex flex-col anim-rise btn-press">
            <div className="flex h-20 w-full items-center justify-center rounded-[24px] mb-4" style={{ background: '#1B1B1D', border: '1px solid #2A2A2D' }}>
              <span className="text-[24px]">{t.id === 'latte' ? '☕' : t.id === 'v60' || t.id === 'kalita' || t.id === 'aeropress' || t.id === 'coldbrew' ? '🫘' : t.id === 'service' || t.id === 'bar' ? '🤝' : t.id === 'sensory' ? '👃' : t.id === 'roast' ? '🔥' : '📖'}</span>
            </div>
            <h3 className="font-display mt-1 text-[15px] font-extrabold uppercase leading-none" style={{ color: '#111111' }}>{t.title}</h3>
            <p className="mt-1 text-[12px] font-bold" style={{ color: '#C9DB8A' }}>{t.kicker}</p>
            <p className="mt-auto text-[12px] leading-relaxed" style={{ color: '#555555' }}>{t.blurb}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
