import { useState } from 'react'
import { actions, useStore } from '../store'
import { badges, ranks, rankFor } from '../data/gamification'
import { ProgressBar, ProgressRing } from '../components/app-ui'

export default function Profile() {
  const s = useStore()
  const [confirm, setConfirm] = useState(false)
  const r = rankFor(s.xp)
  const knownCount = Object.values(s.known).filter(Boolean).length
  const lessonsCount = Object.values(s.lessonsRead).filter(Boolean).length
  const examTotal = Object.values(s.examKnown).filter(Boolean).length

  return (
    <div className="space-y-6">
      <div className="anim-rise">
        <p className="eyebrow">Прогресс и синхронизация</p>
        <h1 className="font-display mt-2 text-[24px] font-extrabold uppercase leading-tight" style={{ color: '#FFFFFF' }}>Профиль</h1>
      </div>

      <div className="rounded-card bg-light p-6 anim-rise" style={{ borderColor: '#FDC55E' }}>
        <div className="flex flex-wrap items-center gap-5">
          <ProgressRing value={r.next ? (r.into / r.span) * 100 : 100} size={96} stroke={6} color="#FDC55E">
            <div className="text-center">
              <p className="font-display text-[18px] font-extrabold">{s.xp}</p>
              <p className="text-[9px] uppercase tracking-widest" style={{ color: '#555555' }}>XP</p>
            </div>
          </ProgressRing>
          <div className="min-w-0 flex-1">
            <p className="font-display text-[22px] font-extrabold" style={{ color: '#FDC55E' }}>{r.current.title}</p>
            <p className="mt-1 text-[12px]" style={{ color: '#555555' }}>{r.current.perk}</p>
            {r.next && (
              <p className="mt-2 text-[11px]" style={{ color: '#555555' }}>
                до «{r.next.title}»: {r.next.xp - s.xp} XP
              </p>
            )}
          </div>
        </div>
        <div className="mt-5 space-y-2">
          {ranks.map((rk) => (
            <div key={rk.id} className="flex items-center gap-3">
              <span className="w-28 shrink-0 text-[12px] font-bold" style={{ color: s.xp >= rk.xp ? '#C9D98A' : '#555555' }}>
                {rk.title}
              </span>
              <div className="flex-1"><ProgressBar value={Math.min(100, (s.xp / rk.xp) * 100)} color={s.xp >= rk.xp ? '#C9D98A' : '#3A3A3D'} h={4} /></div>
              <span className="w-14 text-right text-[10px]" style={{ color: '#555555' }}>{rk.xp} XP</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 anim-rise">
        {[
          { label: 'Стрик', value: `${s.streak.count} дн`, color: '#EB5A52' },
          { label: 'ТТК в голове', value: `${knownCount}/79`, color: '#C9D98A' },
          { label: 'Экзамен', value: `${examTotal}/40`, color: '#FDC55E' },
          { label: 'Методики', value: `${lessonsCount}/31`, color: '#C9D98A' },
          { label: 'Квиз ТТК', value: `${s.quizBest}%`, color: '#C9D98A' },
          { label: 'Блиц рекорд', value: `${s.blitzBest}`, color: '#EB5A52' },
          { label: 'Rush рекорд', value: `${s.rushBest}`, color: '#FDC55E' },
          { label: 'Дней в строю', value: `${s.days.length}`, color: '#C9D98A' },
        ].map((it) => (
          <div key={it.label} className="rounded-card bg-light p-4">
            <p className="eyebrow" style={{ color: '#5B3FF0' }}>{it.label}</p>
            <p className="font-display mt-2 text-[18px] font-extrabold" style={{ color: it.color }}>{it.value}</p>
          </div>
        ))}
      </div>

      <div className="anim-rise">
        <h2 className="font-display text-[15px] font-extrabold uppercase" style={{ color: '#FFFFFF' }}>Бейджи · {s.earnedBadges.length}/{badges.length}</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {badges.map((b) => {
            const earned = s.earnedBadges.includes(b.id)
            return (
              <div key={b.id} className="rounded-card bg-light p-4 text-center"
                style={{ opacity: earned ? 1 : 0.45 }}>
                <span className="font-display text-[22px]" style={{ color: earned ? '#FDC55E' : '#555555' }}>{b.icon}</span>
                <p className="mt-2 text-[12px] font-bold" style={{ color: '#111111' }}>{b.title}</p>
                <p className="mt-1 text-[10px] leading-relaxed" style={{ color: '#555555' }}>{b.desc}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-card bg-light p-5 anim-rise">
        <p className="text-[13px] font-bold" style={{ color: '#111111' }}>Сброс прогресса</p>
        <p className="mt-1 text-[12px]" style={{ color: '#555555' }}>
          Прогресс хранится только в этом браузере. Сброс удалит XP, бейджи и историю.
        </p>
        {!confirm ? (
          <button onClick={() => setConfirm(true)} className="mt-3 rounded-pill border px-4 py-2 text-[12px] font-bold"
            style={{ borderColor: '#EB5A52', color: '#EB5A52' }}>
            Сбросить всё
          </button>
        ) : (
          <div className="mt-3 flex gap-2">
            <button onClick={() => actions.resetAll()} className="rounded-pill px-4 py-2 text-[12px] font-bold"
              style={{ background: '#EB5A52', color: '#FFFFFF' }}>Да, с нуля</button>
            <button onClick={() => setConfirm(false)} className="rounded-pill border px-4 py-2 text-[12px] font-bold"
              style={{ borderColor: '#3A3A3D', color: '#111111' }}>Отмена</button>
          </div>
        )}
      </div>
    </div>
  )
}
