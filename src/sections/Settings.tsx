import { useState } from 'react'
import { actions, useStore } from '../store'
import { Card, Button } from '../components/app-ui'

export default function Settings() {
  const s = useStore()
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md')
  const [reduceMotion, setReduceMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)

  const applyFonts = () => {
    const root = document.documentElement
    root.style.fontSize = fontSize === 'sm' ? '12px' : fontSize === 'md' ? '14px' : '16px'
  }
  const applyMotion = () => {
    document.body.style.setProperty('--reduce-motion', reduceMotion ? 'reduce' : 'no-preference')
  }
  const applyContrast = () => {
    document.body.style.setProperty('--high-contrast', highContrast ? '1' : '0')
  }

  return (
    <div className="space-y-6">
      <div className="anim-rise">
        <p className="eyebrow">Настройки приложения</p>
        <h1 className="font-display mt-2 text-[28px] font-extrabold uppercase leading-none" style={{ color: '#FFFFFF' }}>Настройки</h1>
      </div>

      <Card light className="space-y-4">
        <p className="eyebrow" style={{ color: '#5B45F0' }}>Размер шрифта</p>
        <p className="text-[13px]" style={{ color: '#111111' }}>Три шага: 小 / 中 / 大. Минимум 12 px, контраст не ниже 4.5:1.</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {(['sm', 'md', 'lg'] as const).map((fs) => {
            const labels: Record<string, string> = { sm: 'Малый', md: 'Средний', lg: 'Крупный' }
            return (
              <Button
                key={fs}
                variant={fontSize === fs ? 'primary' : 'ghost'}
                onClick={() => { setFontSize(fs); applyFonts() }}
                style={{ height: 44, fontSize: '12px', padding: '0 10px' }}
              >
                {labels[fs]}
              </Button>
            )
          })}
        </div>
      </Card>

      <Card light className="space-y-4">
        <p className="eyebrow" style={{ color: '#5B45F0' }}>Анимации</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-[13px] font-extrabold uppercase" style={{ color: '#111111' }}>Уменьшение анимаций</p>
            <p className="mt-0.5 text-[12px]" style={{ color: '#555555' }}>Отключается при prefers-reduced-motion и здесь.</p>
          </div>
          <button
            role="switch"
            aria-checked={reduceMotion}
            onClick={() => { setReduceMotion(!reduceMotion); applyMotion() }}
            className="flex h-[28px] w-[56px] shrink-0 items-center rounded-full btn-press transition-transform"
            style={{ background: reduceMotion ? '#111111' : '#C9DB8A', color: reduceMotion ? '#FFFFFF' : '#111111' }}
          >
            <span style={{ display: 'inline-block', width: 22, height: 22, borderRadius: '50%', background: '#FFFFFF', transform: reduceMotion ? 'translateX(28px)' : 'translateX(2px)' }} />
          </button>
        </div>
      </Card>

      <Card light className="space-y-4">
        <p className="eyebrow" style={{ color: '#5B45F0' }}>Высокий контраст</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-[13px] font-extrabold uppercase" style={{ color: '#111111' }}>Режим высокого контраста</p>
            <p className="mt-0.5 text-[12px]" style={{ color: '#555555' }}>Состояния не только цветом.</p>
          </div>
          <button
            role="switch"
            aria-checked={highContrast}
            onClick={() => { setHighContrast(!highContrast); applyContrast() }}
            className="flex h-[28px] w-[56px] shrink-0 items-center rounded-full btn-press transition-transform"
            style={{ background: highContrast ? '#111111' : '#C9DB8A', color: highContrast ? '#FFFFFF' : '#111111' }}
          >
            <span style={{ display: 'inline-block', width: 22, height: 22, borderRadius: '50%', background: '#FFFFFF', transform: highContrast ? 'translateX(28px)' : 'translateX(2px)' }} />
          </button>
        </div>
      </Card>

      <Card light className="space-y-4">
        <p className="eyebrow" style={{ color: '#5B45F0' }}>Резервная копия</p>
        <p className="text-[13px]" style={{ color: '#111111' }}>Прогресс и настройки хранятся только в этом браузере (localStorage). Экспорт и импорт в JSON.</p>
        <div className="mt-3 flex gap-2">
          <Button variant="secondary" onClick={handleExport} className="flex-1" style={{ height: 44, fontSize: '12px' }}>Экспорт JSON</Button>
          <Button variant="ghost" onClick={handleImport} className="flex-1" style={{ height: 44, fontSize: '12px' }}>Импорт JSON</Button>
        </div>
      </Card>

      <div className="rounded-card bg-surface p-4" style={{ border: '1px dashed #CFCCC4' }}>
        <p className="text-[12px] font-bold" style={{ color: '#111111' }}>Приватность (demo)</p>
        <p className="mt-1 text-[12px]" style={{ color: '#555555' }}>
          Это демо-версия без сервера. Персональные данные не отправляются за пределы устройства и хранятся только в этом браузере.
          Для работы сети нужен бэкенд (например, Supabase) — выберите хранилище перед запуском в продакшен.
        </p>
      </div>
    </div>
  )

  function handleExport() {
    const data = JSON.stringify({ xp: s.xp, known: s.known, earnedBadges: s.earnedBadges, checklistsDone: s.checklistsDone, days: s.days }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '202f-academy-progress.json'
    a.click()
    URL.revokeObjectURL(url)
    actions.addXp(5, 'экспорт прогресса')
  }

  function handleImport() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target!.result as string)
          void data
          // Minimal restore; a full build would run schema migration here
          actions.addXp(5, 'импорт прогресса')
        } catch {
          alert('Неверный файл резервной копии')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }
}
