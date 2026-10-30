import { useState } from 'react'
import { actions, useStore } from '../store'
import { badges, ranks, rankFor } from '../data/gamification'
import { ProgressBar, ProgressRing, Card } from '../components/app-ui'

export default function Profile({ onClose }: { onClose: () => void }) {
  const header = (
    <div className="anim-rise">
      <p className="eyebrow">Ваша карьера в сети</p>
      <h1 className="font-display mt-2 text-[28px] font-extrabold uppercase leading-none" style={{ color: '#FFFFFF' }}>Профиль</h1>
    </div>
  )

  if (onClose) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center" style={{ background: 'rgba(18,18,18,0.8)' }} onClick={onClose}>
        <div className="rounded-[32px] p-5 max-w-md w-full max-h-[90vh] overflow-y-auto" style={{ background: '#E8E6E1', color: '#111111' }} onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-[20px] font-extrabold uppercase leading-none" style={{ color: '#111111' }}>Профиль</h2>
            <button onClick={onClose} className="rounded-[22px] px-3 py-1.5 text-[12px] font-bold" style={{ background: '#1B1B1D', color: '#FFFFFF' }}>Закрыть</button>
          </div>
          <ProfileBody />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {header}
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
      {/* XP карточка */}
      <Card light accent="#FBC85F" className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <ProgressRing value={r.next ? (r.into / r.span) * 100 : 100} size={100} color="#FBC85F" stroke={8}>
            <div className="text-center">
              <p className="font-display text-[20px] font-extrabold tnum">{s.xp}</p>
              <p className="text-[10px] uppercase tracking-widest" style={{ color: '#555555' }}>XP</p>
            </div>
          </ProgressRing>
          <div className="min-w-0 flex-1">
            <p className="font-display text-[22px] font-extrabold" style={{ color: '#FBC85F' }}>{r.current.title}</p>
            <p className="mt-1 text-[12px]" style={{ color: '#555555' }}>{r.current.perk}</p>
            {r.next && (
              <p className="mt-2 text-[11px] font-bold tnum" style={{ color: '#555555' }}>
                до «{r.next.title}»: {r.next.xp - s.xp} XP
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {ranks.map((rk) => (
            <div key={rk.id} className="flex items-center gap-3">
              <span className="w-32 shrink-0 text-[12px] font-bold" style={{ color: s.xp >= rk.xp ? '#C9DB8A' : '#555555' }}>{rk.title}</span>
              <div className="flex-1"><ProgressBar value={Math.min(100, (s.xp / rk.xp) * 100)} color={s.xp >= rk.xp ? '#C9DB8A' : '#2A2A2D'} h={5} /></div>
              <span className="w-16 text-right text-[10px] font-bold tnum" style={{ color: '#555555' }}>{rk.xp} XP</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Показатели */}
      <div className="grid grid-cols-2 gap-3 anim-rise">
        {[
          { label: 'Серия', value: `${s.streak.count} дн`, color: '#EE5A55' },
          { label: 'ТТК в голове', value: `${knownCount}/79`, color: '#C9DB8A' },
          { label: 'Экзамен', value: `${examTotal}/40`, color: '#FBC85F' },
          { label: 'Методики', value: `${lessonsCount}/31`, color: '#C9DB8A' },
          { label: 'Квиз ТТК', value: `${s.quizBest}%`, color: '#C9DB8A' },
          { label: 'Блиц рекорд', value: `${s.blitzBest}`, color: '#EE5A55' },
          { label: 'Rush рекорд', value: `${s.rushBest}`, color: '#FBC85F' },
          { label: 'Дней в строю', value: `${s.days.length}`, color: '#C9DB8A' },
        ].map((it) => (
          <div key={it.label} className="rounded-card bg-surface p-4">
            <p className="eyebrow" style={{ color: '#5B45F0' }}>{it.label}</p>
            <p className="font-display mt-2 text-[18px] font-extrabold tnum" style={{ color: it.color }}>{it.value}</p>
          </div>
        ))}
      </div>

      {/* Бейджи */}
      <div className="anim-rise">
        <h2 className="font-display text-[15px] font-extrabold uppercase" style={{ color: '#FFFFFF' }}>Бейджи · {s.earnedBadges.length}/{badges.length}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-4">
          {badges.map((b) => {
            const earned = s.earnedBadges.includes(b.id)
            return (
              <div key={b.id} className="rounded-card bg-surface p-4 text-center" style={{ opacity: earned ? 1 : 0.45 }}>
                <span className="font-display text-[22px]" style={{ color: earned ? '#FBC85F' : '#555555' }}>{b.icon}</span>
                <p className="mt-2 text-[12px] font-bold" style={{ color: '#111111' }}>{b.title}</p>
                <p className="mt-1 text-[10px] leading-relaxed" style={{ color: '#555555' }}>{b.desc}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Сброс */}
      <Card light className="space-y-3">
        <p className="text-[13px] font-bold" style={{ color: '#111111' }}>Сброс прогресса</p>
        <p className="mt-1 text-[12px]" style={{ color: '#555555' }}>
          Прогресс хранится только в этом браузере. Сброс удалит XP, бейджи и историю.
        </p>
        {!confirm ? (
          <button onClick={() => setConfirm(true)} className="mt-3 rounded-[22px] border px-4 py-2 text-[12px] font-bold btn-press"
            style={{ borderColor: '#EE5A55', color: '#EE5A55' }}>
            Сбросить всё
          </button>
        ) : (
          <div className="mt-3 flex gap-2">
            <button onClick={() => { actions.resetAll(); setConfirm(false) }} className="rounded-[22px] px-4 py-2 text-[12px] font-bold btn-press"
              style={{ background: '#EE5A55', color: '#111111' }}>Да, с нуля</button>
            <button onClick={() => setConfirm(false)} className="rounded-[22px] border px-4 py-2 text-[12px] font-bold btn-press"
              style={{ borderColor: '#2A2A2D', color: '#111111' }}>Отмена</button>
          </div>
        )}
      </Card>
    </div>
  )
}
