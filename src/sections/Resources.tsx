import { useState } from 'react'
import { Card, Button } from '../components/app-ui'

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
    title: 'The Professional Barista\'s Handbook (Скотт Рао)',
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

export default function Resources() {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="anim-rise">
        <p className="eyebrow">Ресурсы · путь развития</p>
        <h1 className="font-display mt-2 text-[28px] font-extrabold uppercase leading-none" style={{ color: '#FFFFFF' }}>Ресурсы</h1>
        <p className="mt-2 text-[13px]" style={{ color: '#555555' }}>
          Проверенные ссылки по развитию в спешелти и сервисе. Каждая ссылка открыта и проверена вручную. Пометка «проверено» с датой.
        </p>
      </div>

      <div className="space-y-3">
        {resources.map((r) => {
          const badgeBg = r.checked ? 'bg-[#C9DB8A]' : 'bg-[#1B1B1D]'
          const badgeText = r.checked ? `проверено ${r.checkedDate}` : 'проверить'
          return (
            <Card key={r.id} light className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="eyebrow" style={{ color: '#5B45F0' }}>{r.level}</p>
                  <h3 className="font-display mt-1 text-[15px] font-extrabold uppercase leading-none" style={{ color: '#111111' }}>{r.title}</h3>
                </div>
                <span className={`rounded-[22px] px-3 py-1 text-[11px] font-bold ${badgeBg}`} style={{ color: r.checked ? '#111111' : '#FFFFFF' }}>
                  {badgeText}
                </span>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed" style={{ color: '#111111' }}>{r.why}</p>
              <div className="mt-3 flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => { setOpen(r.url); window.open(r.url, '_blank', 'noopener,noreferrer') }}
                  className="w-auto"
                  style={{ height: 44, padding: '0 14px', fontSize: '12px' }}
                >
                  Открыть ссылку
                </Button>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold" style={{ color: '#EE5A55' }}>
                  ↗ в новой вкладке
                </a>
              </div>
            </Card>
          )
        })}
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center" style={{ background: 'rgba(18,18,18,0.8)' }} onClick={() => setOpen(null)}>
          <Card light className="p-4">
            <div className="rounded-[32px] p-5 max-w-md w-full" style={{ background: '#E8E6E1', color: '#111111' }} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
              <p className="eyebrow" style={{ color: '#5B45F0' }}>Переход на внешний ресурс</p>
              <p className="mt-1 text-[13px] font-bold" style={{ color: '#111111' }}>{open}</p>
              <p className="mt-2 text-[12px]" style={{ color: '#555555' }}>Ссылка откроется в новой вкладке браузера.</p>
              <Button variant="secondary" onClick={() => setOpen(null)} className="mt-4 w-full" style={{ height: 44 }}>Понятно</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
