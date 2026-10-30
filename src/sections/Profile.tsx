import { useState } from 'react'
import { motion } from 'framer-motion'
import { actions, useStore } from '../store'
import { badges, ranks, rankFor } from '../data/gamification'
import { ProgressBar, ProgressRing, Card } from '../components/app-ui'

export default function Profile({ onClose }: { onClose: () => void }) {
  if (onClose) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center"
        style={{ background: 'rgba(18,18,18,0.8)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="rounded-[32px] p-5 max-w-md w-full max-h-[90vh] overflow-y-auto"
          style={{ background: '#1A1A1C', color: '#0F0F10' }}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between mb-4">
            <h2 className="font-display text-[20px] font-extrabold uppercase leading-none" style={{ color: '#0F0F10' }}>Профиль</h2>
            <button onClick={onClose} className="rounded-[22px] px-3 py-1.5 text-[12px] font-bold" style={{ background: '#1A1A1C', color: '#FFFFFF' }}>Закрыть</button>
          </div>
          <ProfileBody />
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <p className="eyebrow">Ваша карьера в сети</p>
        <h1 className="font-display mt-1 text-[28px] font-extrabold uppercase leading-none" style={{ color: '#FFFFFF' }}>Профиль</h1>
      </motion.div>
      <ProfileBody />
    </div>
  )
}

function ProfileBody() {
  const s = useStore()
  const [confirm, setConfirm] = useState(false)
  const r = rankFor(s.xp)
  const knownCount = Object.values(s.known).filter(Boolean).length
  const lessonsCount = Object.values(s.lessonsRead).filter(Boolean).length
  const examTotal = Object.values(s.examKnown).filter(Boolean).length

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="space-y-4"
      >
        <Card light accent="#FBBF24" className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <ProgressRing value={r.next ? (r.into / r.span) * 100 : 100} size={100} color="#FBBF24" stroke={8}>
              <div className="text-left">
                <p className="font-display text-[20px] font-extrabold tnum">{s.xp}</p>
                <p className="text-[10px] uppercase tracking-widest" style={{ color: '#666666' }}>XP</p>
              </div>
            </ProgressRing>
            <div className="min-w-0 flex-1">
              <p className="font-display text-[22px] font-extrabold" style={{ color: '#FBBF24' }}>{r.current.title}</p>
              <p className="mt-1 text-[12px]" style={{ color: '#666666' }}>{r.current.perk}</p>
              {r.next && (
                <p className="mt-2 text-[11px] font-bold tnum" style={{ color: '#666666' }}>
                  до «{r.next.title}»: {r.next.xp - s.xp} XP
                </p>
              )}
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {ranks.map((rk) => (
              <div key={rk.id} className="flex items-start gap-3">
                <span className="w-32 shrink-0 text-[12px] font-bold" style={{ color: s.xp >= rk.xp ? '#C9DB8A' : '#666666' }}>{rk.title}</span>
                <div className="flex-1"><ProgressBar value={Math.min(100, (s.xp / rk.xp) * 100)} color={s.xp >= rk.xp ? '#C9DB8A' : '#3A3A3D'} h={5} /></div>
                <span className="w-16 text-left text-[10px] font-bold tnum" style={{ color: '#666666' }}>{rk.xp} XP</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
        className="space-y-3"
      >
        <h2 className="font-display text-[15px] font-extrabold uppercase" style={{ color: '#FFFFFF' }}>Показатели</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-4">
          {[
            { label: 'Серия', value: `${s.streak.count} дн`, color: '#F87171' },
            { label: 'ТТК в голове', value: `${knownCount} / 79`, color: '#C9DB8A' },
            { label: 'Экзамен', value: `${examTotal} / 40`, color: '#FBBF24' },
            { label: 'Методики', value: `${lessonsCount} / 31`, color: '#C9DB8A' },
            { label: 'Квиз ТТК', value: `${s.quizBest}%`, color: '#C9DB8A' },
            { label: 'Блиц рекорд', value: `${s.blitzBest}`, color: '#F87171' },
            { label: 'Rush рекорд', value: `${s.rushBest}`, color: '#FBBF24' },
            { label: 'Дней в строю', value: `${s.days.length}`, color: '#C9DB8A' },
          ].map((it) => (
            <div key={it.label} className="rounded-card bg-surface p-4">
              <p className="eyebrow" style={{ color: '#8B5CF6' }}>{it.label}</p>
              <p className="mt-2 font-display text-[18px] font-extrabold tnum" style={{ color: it.color }}>{it.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.2 }}
        className="space-y-3"
      >
        <h2 className="font-display text-[15px] font-extrabold uppercase" style={{ color: '#FFFFFF' }}>Бейджи · {s.earnedBadges.length} / {badges.length}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-4">
          {badges.map((b) => {
            const earned = s.earnedBadges.includes(b.id)
            return (
              <motion.div key={b.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-card bg-surface p-4 text-left"
                style={{ opacity: earned ? 1 : 0.45 }}
              >
                <span className="font-display text-[22px]" style={{ color: earned ? '#FBBF24' : '#666666' }}>{b.icon}</span>
                <p className="mt-2 text-[12px] font-bold" style={{ color: '#0F0F10' }}>{b.title}</p>
                <p className="mt-1 text-[10px] leading-relaxed" style={{ color: '#666666' }}>{b.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.3 }}
        className="space-y-3"
      >
        <Card light className="space-y-3">
          <p className="text-[13px] font-bold" style={{ color: '#0F0F10' }}>Сброс прогресса</p>
          <p className="mt-1 text-[12px]" style={{ color: '#666666' }}>
            Прогресс хранится только в этом браузере. Сброс удалит XP, бейджи и историю.
          </p>
          {!confirm ? (
            <button onClick={() => setConfirm(true)} className="mt-3 rounded-[22px] border px-4 py-2 text-[12px] font-bold btn-press"
              style={{ borderColor: '#F87171', color: '#F87171' }}>
              Сбросить всё
            </button>
          ) : (
            <div className="mt-3 flex items-start gap-2">
              <button onClick={() => { actions.resetAll(); setConfirm(false) }} className="rounded-[22px] px-4 py-2 text-[12px] font-bold btn-press"
                style={{ background: '#F87171', color: '#0F0F10' }}>
                Да, с нуля
              </button>
              <button onClick={() => setConfirm(false)} className="rounded-[22px] border px-4 py-2 text-[12px] font-bold btn-press"
                style={{ borderColor: '#3A3A3D', color: '#0F0F10' }}>
                Отмена
              </button>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
