import { useState } from 'react'
import { motion } from 'framer-motion'
import { t, type Lang } from '../lang'
import { actions, useStore } from '../store'
import { Card, Button } from '../components/app-ui'

export default function Settings({ lang }: { lang: Lang }) {
  const L = (key: string) => t(key, lang)
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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <p className="eyebrow">Настройки приложения</p>
        <h1 className="font-display mt-1 text-[28px] font-extrabold uppercase leading-none" style={{ color: '#FFFFFF' }}>{L('settings.title_ru')}</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
        className="space-y-4"
      >
        <Card light className="space-y-4">
          <p className="eyebrow" style={{ color: '#8B5CF6' }}>{L('settings.font_ru')}</p>
          <p className="text-[13px]" style={{ color: '#0F0F10' }}>{L('settings.font_desc_ru')}</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(['sm', 'md', 'lg'] as const).map((fs) => {
              const labels: Record<string, string> = { sm: 'Малый', md: 'Средний', lg: 'Крупный' }
              const isActive = fontSize === fs
              return (
                <motion.button key={fs}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setFontSize(fs); applyFonts() }}
                  className="flex-1 rounded-[22px] px-4 py-2 text-[12px] font-extrabold uppercase btn-press"
                  style={{
                    height: 44,
                    fontSize: '12px',
                    background: isActive ? '#0F0F10' : 'transparent',
                    color: '#FFFFFF',
                    border: isActive ? 'none' : '1px solid #3A3A3D',
                  }}
                >
                  {labels[fs]}
                </motion.button>
              )
            })}
          </div>
        </Card>

        <Card light className="space-y-4">
          <p className="eyebrow" style={{ color: '#8B5CF6' }}>{L('settings.anim_ru')}</p>
          <div className="flex items-start justify-between">
            <div>
              <p className="font-display text-[13px] font-extrabold uppercase" style={{ color: '#0F0F10' }}>{L('settings.anim_ru')}</p>
              <p className="mt-0.5 text-[12px]" style={{ color: '#666666' }}>{L('settings.anim_desc_ru')}</p>
            </div>
            <button
              role="switch"
              aria-checked={reduceMotion}
              onClick={() => { setReduceMotion(!reduceMotion); applyMotion() }}
              className="flex h-[28px] w-[56px] shrink-0 items-center rounded-full btn-press transition-transform"
              style={{ background: reduceMotion ? '#0F0F10' : '#C9DB8A', color: reduceMotion ? '#FFFFFF' : '#0F0F10' }}
            >
              <span style={{ display: 'inline-block', width: 22, height: 22, borderRadius: '50%', background: '#FFFFFF', transform: reduceMotion ? 'translateX(28px)' : 'translateX(2px)' }} />
            </button>
          </div>
        </Card>

        <Card light className="space-y-4">
          <p className="eyebrow" style={{ color: '#8B5CF6' }}>{L('settings.contrast_ru')}</p>
          <div className="flex items-start justify-between">
            <div>
              <p className="font-display text-[13px] font-extrabold uppercase" style={{ color: '#0F0F10' }}>{L('settings.contrast_ru')}</p>
              <p className="mt-0.5 text-[12px]" style={{ color: '#666666' }}>{L('settings.contrast_desc_ru')}</p>
            </div>
            <button
              role="switch"
              aria-checked={highContrast}
              onClick={() => { setHighContrast(!highContrast); applyContrast() }}
              className="flex h-[28px] w-[56px] shrink-0 items-center rounded-full btn-press transition-transform"
              style={{ background: highContrast ? '#0F0F10' : '#C9DB8A', color: highContrast ? '#FFFFFF' : '#0F0F10' }}
            >
              <span style={{ display: 'inline-block', width: 22, height: 22, borderRadius: '50%', background: '#FFFFFF', transform: highContrast ? 'translateX(28px)' : 'translateX(2px)' }} />
            </button>
          </div>
        </Card>

        <Card light className="space-y-4">
          <p className="eyebrow" style={{ color: '#8B5CF6' }}>{L('settings.backup_ru')}</p>
          <p className="text-[13px]" style={{ color: '#0F0F10' }}>{L('settings.backup_desc_ru')}</p>
          <div className="mt-3 flex gap-2">
            <Button variant="secondary" onClick={handleExport} className="flex-1" style={{ height: 44, fontSize: '12px' }}>{L('settings.export_ru')}</Button>
            <Button variant="ghost" onClick={handleImport} className="flex-1" style={{ height: 44, fontSize: '12px' }}>{L('settings.import_ru')}</Button>
          </div>
        </Card>

        <div className="rounded-card bg-surface p-4" style={{ border: '1px dashed #3A3A3D' }}>
          <p className="text-[12px] font-bold" style={{ color: '#0F0F10' }}>{L('settings.privacy_ru')}</p>
          <p className="mt-1 text-[12px]" style={{ color: '#666666' }}>{L('settings.privacy_desc_ru')}</p>
        </div>
      </motion.div>
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
          actions.addXp(5, 'импорт прогресса')
        } catch {
          alert(L('settings.bad_backup_ru'))
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }
}
