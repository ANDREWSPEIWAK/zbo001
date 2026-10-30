import { useState } from 'react'
import { motion } from 'framer-motion'
import { t, type Lang } from '../lang'
import { libraryTopics, libraryItems, type LibraryTopic } from '../data/library'
import { Card, Button } from '../components/app-ui'

export default function Library({ lang }: { lang: Lang }) {
  const L = (key: string) => t(key, lang)
  const [open, setOpen] = useState<LibraryTopic | null>(null)

  if (open) return (
    <div className="space-y-6">
      <motion.button onClick={() => setOpen(null)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="mb-5 rounded-[22px] border px-4 py-2 text-[12px] font-bold btn-press"
        style={{ borderColor: '#3A3A3D', color: '#FFFFFF' }}
      >
        ← {L('library.back_ru')}
      </motion.button>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <p className="eyebrow" style={{ color: '#8B5CF6' }}>{open.kicker}</p>
        <h1 className="font-display mt-1 text-[25px] font-extrabold uppercase leading-none" style={{ color: '#0F0F10' }}>{open.title}</h1>
        <p className="mt-1 text-[13px]" style={{ color: '#666666' }}>{open.blurb}</p>
      </motion.div>
      <div className="space-y-4">
        {(open.lessonIds ?? []).map((lid) => {
          const item = libraryItems.find((i) => i.id === lid)
          if (!item) return null
          return (
            <motion.div key={lid}
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.99 }}
              className="space-y-3"
              style={{ animationDelay: '50ms' }}
            >
              <Card light className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="eyebrow" style={{ color: '#C9DB8A' }}>{item.kind}</p>
                    <h3 className="font-display mt-1 text-[15px] font-extrabold uppercase leading-none" style={{ color: '#0F0F10' }}>{item.title}</h3>
                    <p className="mt-0.5 text-[12px] font-bold" style={{ color: '#666666' }}>{item.duration}</p>
                  </div>
                  <span className="text-[12px] font-bold" style={{ color: '#FBBF24' }}>→</span>
                </div>
                <p className="mt-1 text-[13px] leading-relaxed" style={{ color: '#0F0F10' }}>{item.summary}</p>
                {item.recipe && (
                  <div className="mt-3 rounded-[20px] p-3" style={{ background: '#FFFFFF' }}>
                    <p className="eyebrow mb-1" style={{ color: '#8B5CF6' }}>Рецепт</p>
                    <table className="w-full text-[12px]">
                      <tbody>
                        {item.recipe.rows.map((row, i) => (
                          <tr key={i} className={i > 0 ? 'border-t' : ''} style={{ borderColor: '#3A3A3D' }}>
                            <td className="px-3 py-1" style={{ color: '#666666' }}>{row[0]}</td>
                            <td className="px-3 py-1 text-right font-bold" style={{ color: '#0F0F10' }}>{row[1]}</td>
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
                      style={{ background: '#1A1A1C', color: '#FFFFFF', height: 44 }}
                    >
                      Видео: {item.youtube.title}
                    </a>
                  )}
                  <Button variant="ghost" className="flex-1" style={{ height: 44, padding: '0 12px', fontSize: '11px' }}>{L('library.open_lesson_ru')}</Button>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="space-y-2"
      >
        <p className="eyebrow">Методика сети</p>
        <h1 className="font-display mt-1 text-[28px] font-extrabold uppercase leading-none" style={{ color: '#FFFFFF' }}>{L('library.title_ru')}</h1>
        <p className="mt-1 text-[13px]" style={{ color: '#666666' }}>{libraryTopics.length} тем: латте-арт, фильтр, сервис, сенсорика и другое.</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {libraryTopics.map((t, i) => (
          <motion.button key={t.id} onClick={() => setOpen(t)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-card bg-surface p-5 flex flex-col"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex h-20 w-full items-center justify-center rounded-[24px] mb-4" style={{ background: '#1A1A1C', border: '1px solid #3A3A3D' }}>
              <span className="text-[24px]">{t.id === 'latte' ? '☕' : t.id === 'v60' || t.id === 'kalita' || t.id === 'aeropress' || t.id === 'coldbrew' ? '🫘' : t.id === 'service' || t.id === 'bar' ? '🤝' : t.id === 'sensory' ? '👃' : t.id === 'roast' ? '🔥' : '📖'}</span>
            </div>
            <h3 className="font-display mt-1 text-[15px] font-extrabold uppercase leading-none" style={{ color: '#0F0F10' }}>{t.title}</h3>
            <p className="mt-1 text-[12px] font-bold" style={{ color: '#C9DB8A' }}>{t.kicker}</p>
            <p className="mt-auto text-[12px] leading-relaxed" style={{ color: '#666666' }}>{t.blurb}</p>
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}
