import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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
  Menu, X, User, Home, BookOpen, Target, GraduationCap, Sparkles, Clock, ShieldCheck, FileText, Globe, Settings as SettingsIcon,
  type LucideIcon,
} from 'lucide-react'

type AppTab =
  | 'path' | 'ttk' | 'tests' | 'library' | 'wheel'
  | 'shift' | 'discipline' | 'standards' | 'resources' | 'settings'
type DrawerItem = 'shift' | 'discipline' | 'standards' | 'resources' | 'settings'

const bottomTabs: { id: AppTab; label: string; Icon: LucideIcon }[] = [
  { id: 'path', label: 'Путь', Icon: Home },
  { id: 'ttk', label: 'ТТК', Icon: BookOpen },
  { id: 'tests', label: 'Тесты', Icon: Target },
  { id: 'library', label: 'Методики', Icon: GraduationCap },
  { id: 'wheel', label: 'Вкусы', Icon: Sparkles },
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
      <header className="sticky top-0 z-40 flex items-center justify-between px-4" style={{ height: 56, paddingTop: 'env(safe-area-inset-top)', background: '#0F0F10' }}>
        <button
          type="button"
          aria-label="Меню"
          onClick={() => setDrawerOpen(true)}
          className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full btn-press"
          style={{ background: '#1A1A1C', border: '1px solid #3A3A3D', color: '#FFFFFF' }}
        >
          <Menu size={20} strokeWidth={1.8} strokeLinecap="round" />
        </button>

        <div className="flex items-center gap-2">
          <img src="/logo-202.svg" alt="202" style={{ width: 30, height: 30, borderRadius: 8 }} />
          <span className="font-display text-[16px] font-extrabold uppercase leading-none">
            <span style={{ color: '#FBBF24' }}>202F</span>{' '}
            <span style={{ color: '#FFFFFF' }}>ACADEMY</span>
          </span>
        </div>

        <button
          type="button"
          aria-label="Профиль"
          onClick={() => setProfileOpen(true)}
          className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full btn-press btn-selected"
          style={{ background: '#8B5CF6', color: '#FFFFFF' }}
        >
          <User size={20} strokeWidth={1.8} strokeLinecap="round" />
        </button>
      </header>

      {/* Main */}
      <main className="mx-auto w-full max-w-[430px] px-4 pt-4 pb-2 relative">
        <img
          src="/logo-202.svg"
          alt=""
          className="watermark"
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="space-y-6"
          >
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
          </motion.div>
        </AnimatePresence>
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
        <div className="flex items-center gap-3 rounded-[34px] px-3 py-2" style={{ background: '#1A1A1C', color: '#FFFFFF', boxShadow: '0 20px 40px rgba(139, 92, 246, 0.35)' }}>
          {bottomTabs.map((b) => {
            const Icon = b.Icon
            const active = bottomActive === b.id
            return (
              <motion.button
                key={b.id}
                type="button"
                aria-label={b.label}
                onClick={() => go(b.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full btn-press"
                style={{
                  background: active ? '#111111' : 'transparent',
                  color: active ? '#C9DB8A' : '#111111',
                  boxShadow: active ? 'inset -5px -5px 10px rgba(0,0,0,0.7)' : 'none',
                }}
              >
                <Icon size={22} strokeWidth={1.8} strokeLinecap="round" />
              </motion.button>
            )
          })}
        </div>
      </nav>

      {/* Drawer */}
      {drawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.55)' }}
            onClick={() => setDrawerOpen(false)}
          />
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 h-full w-[300px] overflow-y-auto"
            style={{
              background: '#1A1A1C',
              borderRadius: '0 32px 32px 0',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Закрыть"
              onClick={() => setDrawerOpen(false)}
              className="absolute -right-[48px] top-4 flex h-[44px] w-[44px] items-center justify-center rounded-full btn-press"
              style={{ background: '#1A1A1C', border: '1px solid #3A3A3D', color: '#FFFFFF' }}
            >
              <X size={20} strokeWidth={1.8} />
            </button>

            <div className="px-5 py-6">
              <div className="flex items-center gap-3 mb-7">
                <img src="/logo-202.svg" alt="202" style={{ width: 40, height: 40, borderRadius: 10 }} />
                <span className="font-display text-[14px] font-extrabold uppercase leading-none">
                  <span style={{ color: '#8B5CF6' }}>202F</span>{' '}
                  <span style={{ color: '#0F0F10' }}>ACADEMY</span>
                </span>
              </div>

              <div className="space-y-1">
                {drawerItems.map((item) => {
                  const Icon = item.Icon
                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      aria-label={item.label}
                      onClick={() => goDrawer(item.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex w-full items-center gap-3 border-t border-solid border-[#3A3A3D] px-5 py-3.5 text-left"
                      style={{ height: 56 }}
                    >
                      <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full"
                        style={{ background: '#1A1A1C', color: '#C9DB8A' }}>
                        <Icon size={18} strokeWidth={1.8} strokeLinecap="round" />
                      </span>
                      <span className="font-display text-[13px] font-extrabold uppercase" style={{ color: '#0F0F10' }}>
                        {item.label}
                      </span>
                    </motion.button>
                  )
                })}
              </div>

              <div className="mt-8 border-t border-solid border-[#3A3A3D] pt-5">
                <div className="flex items-center gap-3">
                    <span className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full" style={{ background: '#8B5CF6', color: '#FFFFFF' }}>
                    <User size={16} strokeWidth={1.8} strokeLinecap="round" />
                  </span>
                  <div>
                    <p className="font-display text-[13px] font-extrabold uppercase" style={{ color: '#0F0F10' }}>{r.current.title}</p>
                    <p className="text-[11px] font-bold tnum" style={{ color: '#666666' }}>{s.xp} XP</p>
                  </div>
                </div>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setDrawerOpen(false); setProfileOpen(true) }}
                  className="mt-3 w-full rounded-btn px-4 py-2.5 text-[12px] font-extrabold uppercase"
                  style={{ background: '#111111', color: '#FFFFFF', height: 44 }}
                >
                  Профиль
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {profileOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
