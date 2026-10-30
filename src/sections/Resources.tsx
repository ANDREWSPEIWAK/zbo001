import { useState } from 'react'
import { motion } from 'framer-motion'
import { t, type Lang } from '../lang'
import { CardLight } from '../components/app-ui'

export interface Resource {
  id: string
  title: string
  url: string
  why: string
  level: string
  checkedDate: string
  checked: boolean
}

export const resources: Resource[] = [
  {
    id: 'sca-barista',
    title: 'SCA Coffee Skills Program — Barista Skills',
    url: 'https://sca.coffee/education',
    why: 'Официальные стандарты SCA: базовые навыки бариста, экстракция, сенсорика. База для junior-уровня.',
    level: 'Junior',
    checkedDate: '2024-09-01',
    checked: true,
  },
  {
    id: 'sca-brewing',
    title: 'SCA Coffee Skills Program — Brewing',
    url: 'https://sca.coffee/education',
    why: 'Стандарты заваривания фильтра: Golden Cup, соотношения, температура, экстракция.',
    level: 'Skilled',
    checkedDate: '2024-09-01',
    checked: true,
  },
  {
    id: 'sca-sensory',
    title: 'SCA Coffee Skills Program — Sensory',
    url: 'https://sca.coffee/education',
    why: 'Сенсорный анализ, каппинг по протоколу SCA, оценка по 10 категориям.',
    level: 'PRO',
    checkedDate: '2024-09-01',
    checked: true,
  },
  {
    id: 'hoffmann-atlas',
    title: 'World Atlas of Coffee (Джеймс Хоффманн)',
    url: 'https://www.jameshoffmann.co.uk/',
    why: 'Справочник по происхождению и обработке кофе. Карта чтения для общения с гостем.',
    level: 'Skilled',
    checkedDate: '2024-09-01',
    checked: true,
  },
  {
    id: 'rao-handbook',
    title: "The Professional Barista's Handbook (Скотт Рао)",
    url: 'https://www.scottrao.com/',
    why: 'Эспрессо, фильтр и контроль экстракции. Источник методов диалина.',
    level: 'PRO',
    checkedDate: '2024-09-01',
    checked: true,
  },
  {
    id: '202f-network',
    title: 'Внутренние документы сети 202f',
    url: '#',
    why: 'Калькуляции ТТК, регламенты и ПОС сети. Первичный источник всех цифр в приложении.',
    level: 'Все уровни',
    checkedDate: '—',
    checked: false,
  },
]

function ResourceCard({ r, lang, onOpen }: { r: Resource; lang: Lang; onOpen: (url: string) => void }) {
  const L = (key: string) => t(key, lang)
  const badgeBg = r.checked ? '#C9D98A' : '#1B1B1D'
  const badgeText = r.checked ? `${L('resources.checked_ru')} ${r.checkedDate}` : L('resources.check_ru')

  return (
    <CardLight key={r.id} className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Eyebrow color="violet">{r.level}</Eyebrow>
          <h3 className="font-display mt-1 text-[15px] font-extrabold uppercase leading-none" style={{ color: '#111111' }}>{r.title}</h3>
        </div>
        <span className={`rounded-[22px] px-3 py-1 text-[11px] font-bold`} style={{ background: badgeBg, color: r.checked ? '#111111' : '#FFFFFF' }}>
          {badgeText}
        </span>
      </div>
      <p className="mt-1 text-[13px] leading-relaxed" style={{ color: '#111111' }}>{r.why}</p>
      <div className="mt-3 flex items-start gap-2">
        <button
          onClick={() => onOpen(r.url)}
          className="flex-1 rounded-[26px] px-4 py-3 text-[12px] font-extrabold uppercase btn-press"
          style={{ background: '#1B1B1D', color: '#FFFFFF', height: 44 }}
        >
          {L('resources.open_ru')}
        </button>
        <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold" style={{ color: '#EB5A52' }}>
          ↗ {L('resources.new_tab_ru')}
        </a>
      </div>
    </CardLight>
  )
}

function Eyebrow({ color = 'lime', children }: { color?: string; children: React.ReactNode }) {
  return <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.14em', color, margin: 0 }}>{children}</p>
}

export default function Resources({ lang }: { lang: Lang }) {
  const L = (key: string) => t(key, lang)
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="space-y-2"
      >
        <Eyebrow>Ресурсы · путь развития</Eyebrow>
        <h1 className="font-display mt-1 text-[28px] font-extrabold uppercase leading-none" style={{ color: '#FFFFFF' }}>{L('resources.title_ru')}</h1>
        <p className="mt-1 text-[13px]" style={{ color: '#555555' }}>{L('resources.subtitle_ru')}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
        className="space-y-3"
      >
        {resources.map((r) => (
          <ResourceCard key={r.id} r={r} lang={lang} onOpen={(url) => { setOpen(url); window.open(url, '_blank', 'noopener,noreferrer') }} />
        ))}
      </motion.div>

      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center"
            style={{ background: 'rgba(18,18,18,0.8)' }}
            onClick={() => setOpen(null)}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 h-full w-[300px] overflow-y-auto"
            style={{ background: '#1B1B1D', borderRadius: '0 32px 32px 0' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-6">
              <Eyebrow color="violet">{L('resources.ext_ru')}</Eyebrow>
              <p className="mt-1 text-[13px] font-bold" style={{ color: '#111111' }}>{open}</p>
              <p className="mt-2 text-[12px]" style={{ color: '#555555' }}>{L('resources.ext_desc_ru')}</p>
              <button onClick={() => setOpen(null)} className="mt-4 rounded-[26px] px-8 py-3 text-[13px] font-extrabold uppercase btn-press" style={{ background: '#111111', color: '#FFFFFF', height: 44 }}>{L('resources.ok_ru')}</button>
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}
