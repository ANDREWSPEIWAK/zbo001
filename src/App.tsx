import { useEffect, useState } from 'react'
import { actions, useStore } from './store'
import { Toasts } from './components/app-ui'
import { rankFor } from './data/gamification'
import Path from './sections/Path'
import Ttk from './sections/Ttk'
import Tests from './sections/Tests'
import Shift from './sections/Shift'
import Discipline from './sections/Discipline'
import Library from './sections/Library'
import Wheel from './sections/Wheel'
import Profile from './sections/Profile'
import {
  Menu, X, User, Route, BookOpen, CheckCircle2, Clock, ShieldCheck, Palette, FileText, Globe, Settings,
  type LucideIcon,
} from 'lucide-react'

type Tab = 'path' | 'ttk' | 'tests' | 'shift' | 'discipline' | 'library' | 'wheel' | 'profile'

const bottomTabs: { id: Tab; label: string; Icon: LucideIcon }[] = [
  { id: 'path', label: 'Путь', Icon: Route },
  { id: 'library', label: 'Методики', Icon: BookOpen },
  { id: 'tests', label: 'Тесты', Icon: CheckCircle2 },
  { id: 'shift', label: 'Смена', Icon: Clock },
  { id: 'profile', label: 'Профиль', Icon: User },
]

const drawerItems: { id: Tab | 'lang' | 'settings'; label: string; Icon: LucideIcon }[] = [
  { id: 'discipline', label: 'Дисциплина', Icon: ShieldCheck },
  { id: 'wheel', label: 'Вкусы', Icon: Palette },
  { id: 'ttk', label: 'Техкарты', Icon: FileText },
  { id: 'lang', label: 'Язык', Icon: Globe },
  { id: 'settings', label: 'Настройки', Icon: Settings },
]

export default function App() {
  const s = useStore()
  const [tab, setTab] = useState<Tab>('path')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const r = rankFor(s.xp)

  useEffect(() => {
    actions.dayOpened()
  }, [])

  const go = (t: Tab) => {
    setTab(t)
    window.scrollTo({ top: 0 })
    setDrawerOpen(false)
  }

  const bottomActive = bottomTabs.some((b) => b.id === tab) ? tab : null

  return (
    <div className="min-h-screen bg-bg text-white" style={{ paddingBottom: 96 }}>
      <Toasts />

      {/* Header */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-5"
        style={{ height: 48, paddingTop: 'env(safe-area-inset-top)', background: '#0F0F10' }}
      >
        <button
          type="button"
          aria-label="Меню"
          onClick={() => setDrawerOpen(true)}
          className="flex h-[40px] w-[40px] items-center justify-center rounded-full"
          style={{ background: '#1B1B1D', border: '1px solid #2A2A2D', color: '#FFFFFF' }}
        >
          <Menu size={20} strokeWidth={1.8} strokeLinecap="round" />
        </button>

        <div className="flex items-center gap-2">
          <img src="/logo-202.png" alt="202" style={{ width: 34, height: 34, borderRadius: 10 }} />
          <span className="font-display text-[14px] font-extrabold uppercase">
            <span style={{ color: '#FDC55E' }}>202F</span>{' '}
            <span style={{ color: '#FFFFFF' }}>ACADEMY</span>
          </span>
        </div>

        <button
          type="button"
          aria-label="Профиль"
          onClick={() => go('profile')}
          className="flex h-[40px] w-[40px] items-center justify-center rounded-full"
          style={{ background: '#5B3FF0', color: '#FFFFFF' }}
        >
          <User size={20} strokeWidth={1.8} strokeLinecap="round" />
        </button>
      </header>

      {/* Main */}
      <main className="mx-auto w-full max-w-[480px] px-5 pt-4">
        {tab === 'path' && <Path />}
        {tab === 'ttk' && <Ttk />}
        {tab === 'tests' && <Tests />}
        {tab === 'shift' && <Shift />}
        {tab === 'discipline' && <Discipline />}
        {tab === 'library' && <Library />}
        {tab === 'wheel' && <Wheel />}
        {tab === 'profile' && <Profile />}
      </main>

      {/* Bottom Nav */}
      <nav
        className="fixed z-40 flex items-center justify-around"
        style={{
          left: 20,
          right: 20,
          bottom: 'calc(24px + env(safe-area-inset-bottom))',
          height: 64,
          background: '#E8E6DF',
          borderRadius: 32,
        }}
      >
        {bottomTabs.map((b) => {
          const active = bottomActive === b.id
          const Icon = b.Icon
          return (
            <button
              key={b.id}
              type="button"
              aria-label={b.label}
              onClick={() => go(b.id)}
              className="flex h-[48px] w-[48px] items-center justify-center rounded-full transition-all"
              style={{
                background: active ? '#111111' : 'transparent',
                color: active ? '#C9D98A' : '#111111',
              }}
            >
              <Icon size={24} strokeWidth={1.8} strokeLinecap="round" />
            </button>
          )
        })}
      </nav>

      {/* Drawer */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={() => setDrawerOpen(false)}
          />
          <div
            className="fixed left-0 top-0 z-50 h-full w-[300px] overflow-y-auto"
            style={{
              background: '#E8E6DF',
              borderRadius: '0 32px 32px 0',
              animation: 'slide-in-left 0.4s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          >
            {/* close button to right of panel */}
            <button
              type="button"
              aria-label="Закрыть"
              onClick={() => setDrawerOpen(false)}
              className="absolute -right-12 top-4 flex h-[40px] w-[40px] items-center justify-center rounded-full"
              style={{ background: '#1B1B1D', border: '1px solid #2A2A2D', color: '#FFFFFF' }}
            >
              <X size={20} strokeWidth={1.8} />
            </button>

            <div className="px-5 py-6">
              <div className="flex items-center gap-3">
                <img src="/logo-202.png" alt="202" style={{ width: 44, height: 44, borderRadius: 10 }} />
                <span className="font-display text-[14px] font-extrabold uppercase">
                  <span style={{ color: '#5B3FF0' }}>202F</span>{' '}
                  <span style={{ color: '#111111' }}>ACADEMY</span>
                </span>
              </div>

              <div className="mt-6 space-y-0">
                {drawerItems.map((item) => {
                  const Icon = item.Icon
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        if (item.id === 'discipline' || item.id === 'wheel' || item.id === 'ttk') {
                          go(item.id as Tab)
                        } else {
                          setDrawerOpen(false)
                        }
                      }}
                      className="flex w-full items-center gap-3 border-t border-divider py-3 text-left"
                      style={{ height: 56 }}
                    >
                      <span
                        className="flex h-[36px] w-[36px] items-center justify-center rounded-full"
                        style={{ background: '#1B1B1D', color: '#C9D98A' }}
                      >
                        <Icon size={18} strokeWidth={1.8} strokeLinecap="round" />
                      </span>
                      <span className="font-display text-[14px] font-extrabold uppercase" style={{ color: '#111111' }}>
                        {item.label}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="mt-6 text-[10px]" style={{ color: '#555555' }}>
                {r.current.title} · {s.xp} XP
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
