import { useEffect, useState } from 'react'
import { actions, useStore } from './store'
import { Toasts } from './components/app-ui'
import { rankFor } from './data/gamification'
import Path from './sections/Path'
import Ttk from './sections/Ttk'
import Tests from './sections/Tests'
import Library from './sections/Library'
import Wheel from './sections/Wheel'
import Shift from './sections/Shift'
import Discipline from './sections/Discipline'
import Standards from './sections/Standards'
import Resources from './sections/Resources'
import Settings from './sections/Settings'
import Profile from './sections/Profile'
import {
  Menu, X, User, Route, FileText, CheckCircle2, Clock, ShieldCheck, Palette, Globe, Settings as SettingsIcon,
  type LucideIcon,
} from 'lucide-react'

type AppTab =
  | 'path'
  | 'ttk'
  | 'tests'
  | 'library'
  | 'wheel'
  | 'shift'
  | 'discipline'
  | 'standards'
  | 'resources'
  | 'settings'
type DrawerItem = 'shift' | 'discipline' | 'standards' | 'resources' | 'settings'

const bottomTabs: { id: AppTab; label: string; Icon: LucideIcon }[] = [
  { id: 'path', label: 'Путь', Icon: Route },
  { id: 'ttk', label: 'ТТК', Icon: FileText },
  { id: 'tests', label: 'Тесты', Icon: CheckCircle2 },
  { id: 'library', label: 'Методики', Icon: Palette },
  { id: 'wheel', label: 'Вкусы', Icon: Palette },
]

const drawerItems: { id: DrawerItem; label: string; Icon: LucideIcon }[] = [
  { id: 'shift', label: 'Смена', Icon: Clock },
  { id: 'discipline', label: 'Дисциплина', Icon: ShieldCheck },
  { id: 'standards', label: 'Стандарты и чек-листы', Icon: FileText },
  { id: 'resources', label: 'Ресурсы', Icon: Globe },
  { id: 'settings', label: 'Настройки', Icon: SettingsIcon },
]

export default function App() {
  const s = useStore()
  const [tab, setTab] = useState<AppTab>('path')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const r = rankFor(s.xp)

  useEffect(() => {
    actions.dayOpened()
  }, [])

  const go = (t: AppTab) => {
    setTab(t)
    window.scrollTo({ top: 0 })
    setDrawerOpen(false)
  }

  const goDrawer = (id: DrawerItem) => {
    setTab(id)
    setDrawerOpen(false)
  }

  const bottomActive = bottomTabs.some((b) => b.id === tab) ? tab : null

  return (
    <div className="min-h-screen bg-bg text-white" style={{ paddingBottom: 92 }}>
      <Toasts />

      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4" style={{ height: 56, paddingTop: 'env(safe-area-inset-top)', background: '#121212' }}>
        <button
          type="button"
          aria-label="Меню"
          onClick={() => setDrawerOpen(true)}
          className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full btn-press"
          style={{ background: '#1B1B1D', border: '1px solid #2A2A2D', color: '#FFFFFF' }}
        >
          <Menu size={20} strokeWidth={1.8} strokeLinecap="round" />
        </button>

        <div className="flex items-center gap-2">
          <img src="/logo-202.png" alt="202" style={{ width: 30, height: 30, borderRadius: 8 }} />
          <span className="font-display text-[16px] font-extrabold uppercase leading-none">
            <span style={{ color: '#FBC85F' }}>202F</span>{' '}
            <span style={{ color: '#FFFFFF' }}>ACADEMY</span>
          </span>
        </div>

        <button
          type="button"
          aria-label="Профиль"
          onClick={() => setProfileOpen(true)}
          className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full btn-press btn-selected"
          style={{ background: '#5B45F0', color: '#FFFFFF' }}
        >
          <User size={20} strokeWidth={1.8} strokeLinecap="round" />
        </button>
      </header>

      {/* Main */}
      <main className="mx-auto w-full max-w-[430px] px-4 pt-4 pb-2">
        {tab === 'path' && <Path />}
        {tab === 'ttk' && <Ttk />}
        {tab === 'tests' && <Tests />}
        {tab === 'library' && <Library />}
        {tab === 'wheel' && <Wheel />}
        {tab === 'shift' && <Shift />}
        {tab === 'discipline' && <Discipline />}
        {tab === 'standards' && <Standards />}
        {tab === 'resources' && <Resources />}
        {tab === 'settings' && <Settings />}
      </main>

      {/* Bottom pill nav */}
      <nav
        className="fixed z-40 flex items-center justify-center"
        style={{
          left: '50%',
          bottom: 'calc(20px + env(safe-area-inset-bottom))',
          transform: 'translateX(-50%)',
          height: 68,
        }}
      >
        <div className="flex items-center gap-3 rounded-[34px] px-3 py-2" style={{ background: '#E8E6E1', color: '#111111', boxShadow: '0 10px 30px rgba(91, 69, 240, 0.35)' }}>
          {bottomTabs.map((b) => {
            const Icon = b.Icon
            const active = bottomActive === b.id
            return (
              <button
                key={b.id}
                type="button"
                aria-label={b.label}
                onClick={() => go(b.id)}
                className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full btn-press"
                style={{
                  background: active ? '#111111' : 'transparent',
                  color: active ? '#C9DB8A' : '#111111',
                  boxShadow: active ? 'inset -5px -5px 10px rgba(0,0,0,0.7)' : 'none',
                }}
              >
                <Icon size={22} strokeWidth={1.8} strokeLinecap="round" />
              </button>
            )
          })}
        </div>
      </nav>

      {/* Drawer */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.55)' }}
            onClick={() => setDrawerOpen(false)}
          />
          <div
            className="fixed inset-y-0 left-0 z-50 h-full w-[300px] overflow-y-auto"
            style={{
              background: '#E8E6E1',
              borderRadius: '0 32px 32px 0',
              animation: 'slide-in-left 0.4s cubic-bezier(0.34,1.56,0.64,1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Закрыть"
              onClick={() => setDrawerOpen(false)}
              className="absolute -right-[48px] top-4 flex h-[44px] w-[44px] items-center justify-center rounded-full btn-press"
              style={{ background: '#1B1B1D', border: '1px solid #2A2A2D', color: '#FFFFFF' }}
            >
              <X size={20} strokeWidth={1.8} />
            </button>

            <div className="px-5 py-6">
              <div className="flex items-center gap-3 mb-7">
                <img src="/logo-202.png" alt="202" style={{ width: 40, height: 40, borderRadius: 10 }} />
                <span className="font-display text-[14px] font-extrabold uppercase leading-none">
                  <span style={{ color: '#5B45F0' }}>202F</span>{' '}
                  <span style={{ color: '#111111' }}>ACADEMY</span>
                </span>
              </div>

              <div className="space-y-1">
                {drawerItems.map((item) => {
                  const Icon = item.Icon
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-label={item.label}
                      onClick={() => goDrawer(item.id)}
                      className="flex w-full items-center gap-3 border-t border-solid border-[#CFCCC4] px-5 py-3.5 text-left"
                      style={{ height: 56 }}
                    >
                      <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full"
                        style={{ background: '#1B1B1D', color: '#C9DB8A' }}>
                        <Icon size={18} strokeWidth={1.8} strokeLinecap="round" />
                      </span>
                      <span className="font-display text-[13px] font-extrabold uppercase" style={{ color: '#111111' }}>
                        {item.label}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="mt-8 border-t border-solid border-[#CFCCC4] pt-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full" style={{ background: '#5B45F0', color: '#FFFFFF' }}>
                    <User size={16} strokeWidth={1.8} strokeLinecap="round" />
                  </span>
                  <div>
                    <p className="font-display text-[13px] font-extrabold uppercase" style={{ color: '#111111' }}>{r.current.title}</p>
                    <p className="text-[11px] font-bold tnum" style={{ color: '#555555' }}>{s.xp} XP</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setDrawerOpen(false); setProfileOpen(true) }}
                  className="mt-3 w-full rounded-btn px-4 py-2.5 text-[12px] font-extrabold uppercase"
                  style={{ background: '#111111', color: '#FFFFFF', height: 44 }}
                >
                  Профиль
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {profileOpen && (
        <>
          <div
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.55)' }}
            onClick={() => setProfileOpen(false)}
          />
          <Profile onClose={() => setProfileOpen(false)} />
        </>
      )}
    </div>
  )
}
