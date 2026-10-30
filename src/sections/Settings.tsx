import { useState } from 'react'
import { motion } from 'framer-motion'
import { t, type Lang } from '../lang'
import { actions, useStore } from '../store'
import { CardLight, ButtonPrimary } from '../components/app-ui'

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
        <Eyebrow>Настройки приложения</Eyebrow>
        <H1>{L('settings.title_ru')}</H1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
        className="space-y-4"
      >
        <CardLight className="space-y-4">
          <Eyebrow color="violet">{L('settings.font_ru')}</Eyebrow>
          <p className="text-[13px]" style={{ color: '#111111' }}>{L('settings.font_desc_ru')}</p>
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
                    background: isActive ? '#111111' : 'transparent',
                    color: '#FFFFFF',
                    border: isActive ? 'none' : '1px solid #3A3A3D',
                  }}
                >
                  {labels[fs]}
                </motion.button>
              )
            })}
          </div>
        </CardLight>

        <CardLight className="space-y-4">
          <Eyebrow color="violet">{L('settings.anim_ru')}</Eyebrow>
          <div className="flex items-start justify-between">
            <div>
              <p className="font-display text-[13px] font-extrabold uppercase" style={{ color: '#111111' }}>{L('settings.anim_ru')}</p>
              <p className="mt-0.5 text-[12px]" style={{ color: '#555555' }}>{L('settings.anim_desc_ru')}</p>
            </div>
            <button role="switch" aria-checked={reduceMotion} onClick={() => { setReduceMotion(!reduceMotion); applyMotion() }}
              className="flex h-[28px] w-[56px] shrink-0 items-center rounded-full btn-press transition-transform"
              style={{ background: reduceMotion ? '#111111' : '#C9D98A', color: reduceMotion ? '#FFFFFF' : '#111111' }}>
              <span style={{ display: 'inline-block', width: 22, height: 22, borderRadius: '50%', background: '#FFFFFF', transform: reduceMotion ? 'translateX(28px)' : 'translateX(2px)' }} />
            </button>
          </div>
        </CardLight>

        <CardLight className="space-y-4">
          <Eyebrow color="violet">{L('settings.contrast_ru')}</Eyebrow>
          <div className="flex items-start justify-between">
            <div>
              <p className="font-display text-[13px] font-extrabold uppercase" style={{ color: '#111111' }}>{L('settings.contrast_ru')}</p>
              <p className="mt-0.5 text-[12px]" style={{ color: '#555555' }}>{L('settings.contrast_desc_ru')}</p>
            </div>
            <button role="switch" aria-checked={highContrast} onClick={() => { setHighContrast(!highContrast); applyContrast() }}
              className="flex h-[28px] w-[56px] shrink-0 items-center rounded-full btn-press transition-transform"
              style={{ background: highContrast ? '#111111' : '#C9D98A', color: highContrast ? '#FFFFFF' : '#111111' }}>
              <span style={{ display: 'inline-block', width: 22, height: 22, borderRadius: '50%', background: '#FFFFFF', transform: highContrast ? 'translateX(28px)' : 'translateX(2px)' }} />
            </button>
          </div>
        </CardLight>

        <CardLight className="space-y-4">
          <Eyebrow color="violet">{L('settings.backup_ru')}</Eyebrow>
          <p className="text-[13px]" style={{ color: '#111111' }}>{L('settings.backup_desc_ru')}</p>
          <div className="mt-3 flex gap-2">
            <ButtonPrimary onClick={handleExport} fullWidth={false}>{L('settings.export_ru')}</ButtonPrimary>
            <button onClick={handleImport} className="flex-1 rounded-[22px] px-4 py-2 text-[12px] font-extrabold uppercase btn-press" style={{ height: 44, border: '1px solid #3A3A3D', background: 'transparent', color: '#FFFFFF' }}>{L('settings.import_ru')}</button>
          </div>
        </CardLight>

        <div className="rounded-card bg-surface p-4" style={{ border: '1px dashed #3A3A3D' }}>
          <p className="text-[12px] font-bold" style={{ color: '#111111' }}>{L('settings.privacy_ru')}</p>
          <p className="mt-1 text-[12px]" style={{ color: '#555555' }}>{L('settings.privacy_desc_ru')}</p>
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

function Eyebrow({ color = 'lime', children }: { color?: string; children: React.ReactNode }) {
  return <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.14em', color, margin: 0 }}>{children}</p>
}

function H1({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h1 className={`mt-1 ${className}`} style={{ fontFamily: "'Unbounded', 'Manrope', sans-serif", fontWeight: 800, fontSize: 28, textTransform: 'uppercase', lineHeight: 1.1 }}>{children}</h1>
}
