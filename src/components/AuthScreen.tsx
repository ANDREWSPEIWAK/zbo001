import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { t, type Lang } from '../lang'
import {
  Mail, Lock, LockOpen, ArrowLeft, Globe,
  Loader2,
} from 'lucide-react'

type AuthMode = 'welcome' | 'login' | 'register'

const ROLES: { id: string; labelRu: string; labelEn: string }[] = [
  { id: 'barista', labelRu: 'Бариста', labelEn: 'Barista' },
  { id: 'senior', labelRu: 'Старший бариста', labelEn: 'Senior Barista' },
  { id: 'head', labelRu: 'Шеф-бариста', labelEn: 'Head Barista' },
  { id: 'mentor', labelRu: 'Наставник', labelEn: 'Mentor' },
  { id: 'manager', labelRu: 'Управляющий сети', labelEn: 'Network Manager' },
]

export default function AuthScreen({ onAuth }: { onAuth: () => void }) {
  const [lang, setLang] = useState<Lang>('ru')
  const [mode, setMode] = useState<AuthMode>('welcome')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load saved language
  useEffect(() => {
    const saved = localStorage.getItem('202f-lang') as Lang | null
    if (saved && (saved === 'ru' || saved === 'en')) setLang(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem('202f-lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  const L = (key: string) => t(key, lang)

  // Form data state (declared early to avoid TDZ issues)
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
    workplace: '',
    terms: false,
  })

  const handleLanguageSwitch = () => {
    setLang((l) => (l === 'ru' ? 'en' : 'ru'))
  }

  const simulateAuth = async () => {
    setLoading(true)
    setErrors({})
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setLoading(false)
    onAuth()
  }

  const validateLogin = (data: FormData): boolean => {
    const e: Record<string, string> = {}
    if (!data.email) e.email = L('auth.email_ru') === 'Email or phone' ? 'Enter email or phone' : 'Введите email или телефон'
    if (!data.password) e.password = L('auth.password_ru') === 'Password' ? 'Enter password' : 'Введите пароль'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateRegister = (data: FormData): boolean => {
    const e: Record<string, string> = {}
    if (!data.firstName) e.firstName = L('auth.first_name_ru') === 'First name' ? 'Enter first name' : 'Введите имя'
    if (!data.lastName) e.lastName = L('auth.last_name_ru') === 'Last name' ? 'Enter last name' : 'Введите фамилию'
    if (!data.email) e.email = L('auth.email_ru') === 'Email or phone' ? 'Enter email or phone' : 'Введите email или телефон'
    if (!data.password || data.password.length < 8) e.password = L('auth.password_min_ru') === 'Minimum 8 characters' ? 'Minimum 8 characters' : 'Минимум 8 символов'
    if (!data.role) e.role = L('auth.role_ru') === 'Role' ? 'Select role' : 'Выберите роль'
    if (!data.workplace) e.workplace = L('auth.workplace_ru') === 'Coffee shop (location)' ? 'Select workplace' : 'Выберите точку'
    if (!data.terms) e.terms = L('auth.terms_ru') === 'I agree to the terms and privacy policy' ? 'You must agree to terms' : 'Необходимо согласие с правилами'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-full max-w-md bg-surface rounded-[32px] p-6 shadow-card relative overflow-hidden"
      >
        {/* Language switch — top right */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <Globe size={16} strokeWidth={1.5} style={{ color: '#666666' }} />
          <button
            onClick={handleLanguageSwitch}
            className="flex h-[32px] w-[64px] shrink-0 items-center rounded-full btn-press transition-transform"
            style={{
              background: lang === 'ru' ? '#1A1A1C' : '#8B5CF6',
              color: lang === 'ru' ? '#FFFFFF' : '#FFFFFF',
              border: '1px solid #3A3A3D',
            }}
          >
            <span
              className="text-[11px] font-bold uppercase"
              style={{
                transform: lang === 'ru' ? 'translateX(2px)' : 'translateX(28px)',
                transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              {lang === 'ru' ? 'RU' : 'EN'}
            </span>
          </button>
        </div>

        {/* Watermark logo behind */}
        <img
          src="/logo-202.svg"
          alt=""
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] opacity-[0.03] pointer-events-none"
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="space-y-4 relative z-10"
          >

            {/* ===== WELCOME SCREEN ===== */}
            {mode === 'welcome' && (
              <>
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full mb-6" style={{ background: '#1A1A1C', border: '1px solid #3A3A3D' }}>
                  <img src="/logo-202.svg" alt="202" style={{ width: 30, height: 30 }} />
                </div>
                <h1 className="font-display text-[28px] font-extrabold uppercase text-center leading-none" style={{ color: '#0F0F10' }}>
                  {L('auth.welcome_ru') === 'Welcome to 202f Academy' ? L('auth.welcome_en') : L('auth.welcome_ru')}
                </h1>
                <p className="mt-2 text-center text-[13px] leading-relaxed" style={{ color: '#666666' }}>
                  {L('auth.subtitle_ru') === 'Internal barista academy of the 202f coffee chain. Training, certification, and career growth.' ? L('auth.subtitle_en') : L('auth.subtitle_ru')}
                </p>

                <div className="mt-8 space-y-3">
                  <button
                    onClick={() => setMode('login')}
                    className="w-full rounded-[26px] px-4 py-3 text-[13px] font-extrabold uppercase btn-press"
                    style={{ background: '#0F0F10', color: '#FFFFFF', height: 52 }}
                  >
                    {L('auth.login_ru') === 'Log in' ? L('auth.login_en') : L('auth.login_ru')}
                  </button>
                  <button
                    onClick={() => setMode('register')}
                    className="w-full rounded-[26px] px-4 py-3 text-[13px] font-extrabold uppercase btn-press"
                    style={{ background: '#FBBF24', color: '#0F0F10', height: 52 }}
                  >
                    {L('auth.register_ru') === 'Create account' ? L('auth.register_en') : L('auth.register_ru')}
                  </button>
                </div>

                <div className="mt-6 rounded-card bg-surface p-4 text-left">
                  <p className="eyebrow" style={{ color: '#8B5CF6' }}>Инфо</p>
                  <p className="mt-1 text-[12px] leading-relaxed" style={{ color: '#0F0F10' }}>
                    {L('auth.demo_note_ru') === 'Demo version: data is stored only on this device.' ? L('auth.demo_note_en') : L('auth.demo_note_ru')}
                  </p>
                </div>
              </>
            )}

            {/* ===== LOGIN SCREEN ===== */}
            {mode === 'login' && (
              <>
                <motion.button
                  onClick={() => setMode('welcome')}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="mb-5 rounded-[22px] border px-4 py-2 text-[12px] font-bold btn-press"
                  style={{ borderColor: '#3A3A3D', color: '#FFFFFF' }}
                >
                  <ArrowLeft size={14} strokeWidth={1.8} /> {L('auth.back_ru') === 'Back' ? L('auth.back_en') : L('auth.back_ru')}
                </motion.button>
                <h2 className="font-display text-[25px] font-extrabold uppercase leading-none" style={{ color: '#0F0F10' }}>
                  {L('auth.login_title_ru') === 'Log in' ? L('auth.login_title_en') : L('auth.login_title_ru')}
                </h2>
                <p className="mt-1 text-[13px]" style={{ color: '#666666' }}>{L('auth.subtitle_ru') === 'Internal barista academy of the 202f coffee chain. Training, certification, and career growth.' ? L('auth.subtitle_en') : L('auth.subtitle_ru')}</p>

                <form onSubmit={(e) => { e.preventDefault(); if (validateLogin(formData)) simulateAuth() }} className="mt-6 space-y-3">
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold uppercase" style={{ color: '#0F0F10' }}>{L('auth.email_ru') === 'Email or phone' ? L('auth.email_en') : L('auth.email_ru')}</label>
                    <div className="relative">
                      <Mail size={18} strokeWidth={1.8} className="absolute left-3 top-3" style={{ color: '#666666' }} />
                      <input
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
                        placeholder="name@coffee.shop"
                        className="h-[44px] w-full rounded-[22px] border pl-10 pr-4 text-[13px] outline-none"
                        style={{ borderColor: errors.email ? '#F87171' : '#3A3A3D', background: '#1A1A1C', color: '#FFFFFF' }}
                      />
                      {errors.email && <LockOpen size={14} strokeWidth={1.8} className="absolute right-3 top-3" style={{ color: '#F87171' }} />}
                    </div>
                    {errors.email && <p className="text-[11px] font-bold" style={{ color: '#F87171' }}>{errors.email}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[12px] font-bold uppercase" style={{ color: '#0F0F10' }}>{L('auth.password_ru') === 'Password' ? L('auth.password_en') : L('auth.password_ru')}</label>
                    <div className="relative">
                      <Lock size={18} strokeWidth={1.8} className="absolute left-3 top-3" style={{ color: '#666666' }} />
                      <input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData((d) => ({ ...d, password: e.target.value }))}
                        placeholder="••••••••"
                        className="h-[44px] w-full rounded-[22px] border pl-10 pr-4 text-[13px] outline-none"
                        style={{ borderColor: errors.password ? '#F87171' : '#3A3A3D', background: '#1A1A1C', color: '#FFFFFF' }}
                      />
                      {errors.password && <LockOpen size={14} strokeWidth={1.8} className="absolute right-3 top-3" style={{ color: '#F87171' }} />}
                    </div>
                    {errors.password && <p className="text-[11px] font-bold" style={{ color: '#F87171' }}>{errors.password}</p>}
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <button type="button" onClick={() => {}} className="text-[11px] font-bold" style={{ color: '#8B5CF6' }}>
                      {L('auth.forgot_ru') === 'Forgot password?' ? L('auth.forgot_en') : L('auth.forgot_ru')}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-[26px] px-4 py-3 text-[13px] font-extrabold uppercase btn-press"
                    style={{ background: loading ? '#3A3A3D' : '#8B5CF6', color: '#FFFFFF', height: 52 }}
                  >
                    {loading ? <Loader2 size={18} strokeWidth={1.8} /> : (L('auth.submit_ru') === 'Continue' ? L('auth.submit_en') : L('auth.submit_ru'))}
                  </button>
                </form>

                <div className="mt-5 text-center">
                  <p className="text-[12px]" style={{ color: '#666666' }}>
                    {L('auth.no_account_ru') === "Don't have an account?" ? L('auth.no_account_en') : L('auth.no_account_ru')}
                  </p>
                  <button
                    onClick={() => setMode('register')}
                    className="text-[12px] font-bold" style={{ color: '#FBBF24' }}
                  >
                    {L('auth.register_ru') === 'Create account' ? L('auth.register_en') : L('auth.register_ru')}
                  </button>
                </div>
              </>
            )}

            {/* ===== REGISTER SCREEN ===== */}
            {mode === 'register' && (
              <>
                <motion.button
                  onClick={() => setMode('welcome')}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="mb-5 rounded-[22px] border px-4 py-2 text-[12px] font-bold btn-press"
                  style={{ borderColor: '#3A3A3D', color: '#FFFFFF' }}
                >
                  <ArrowLeft size={14} strokeWidth={1.8} /> {L('auth.back_ru') === 'Back' ? L('auth.back_en') : L('auth.back_ru')}
                </motion.button>
                <h2 className="font-display text-[25px] font-extrabold uppercase leading-none" style={{ color: '#0F0F10' }}>
                  {L('auth.register_title_ru') === 'Registration' ? L('auth.register_title_en') : L('auth.register_title_ru')}
                </h2>

                <form onSubmit={(e) => { e.preventDefault(); if (validateRegister(formData)) simulateAuth() }} className="mt-6 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[12px] font-bold uppercase" style={{ color: '#0F0F10' }}>{L('auth.first_name_ru') === 'First name' ? L('auth.first_name_en') : L('auth.first_name_ru')}</label>
                      <input
                        name="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData((d) => ({ ...d, firstName: e.target.value }))}
                        placeholder="Иван"
                        className="h-[44px] w-full rounded-[22px] border px-4 text-[13px] outline-none"
                        style={{ borderColor: errors.firstName ? '#F87171' : '#3A3A3D', background: '#1A1A1C', color: '#FFFFFF' }}
                      />
                      {errors.firstName && <p className="text-[11px] font-bold" style={{ color: '#F87171' }}>{errors.firstName}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="text-[12px] font-bold uppercase" style={{ color: '#0F0F10' }}>{L('auth.last_name_ru') === 'Last name' ? L('auth.last_name_en') : L('auth.last_name_ru')}</label>
                      <input
                        name="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData((d) => ({ ...d, lastName: e.target.value }))}
                        placeholder="Петров"
                        className="h-[44px] w-full rounded-[22px] border px-4 text-[13px] outline-none"
                        style={{ borderColor: errors.lastName ? '#F87171' : '#3A3A3D', background: '#1A1A1C', color: '#FFFFFF' }}
                      />
                      {errors.lastName && <p className="text-[11px] font-bold" style={{ color: '#F87171' }}>{errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[12px] font-bold uppercase" style={{ color: '#0F0F10' }}>{L('auth.email_ru') === 'Email or phone' ? L('auth.email_en') : L('auth.email_ru')}</label>
                    <div className="relative">
                      <Mail size={18} strokeWidth={1.8} className="absolute left-3 top-3" style={{ color: '#666666' }} />
                      <input
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
                        placeholder="name@coffee.shop"
                        className="h-[44px] w-full rounded-[22px] border pl-10 pr-4 text-[13px] outline-none"
                        style={{ borderColor: errors.email ? '#F87171' : '#3A3A3D', background: '#1A1A1C', color: '#FFFFFF' }}
                      />
                      {errors.email && <LockOpen size={14} strokeWidth={1.8} className="absolute right-3 top-3" style={{ color: '#F87171' }} />}
                    </div>
                    {errors.email && <p className="text-[11px] font-bold" style={{ color: '#F87171' }}>{errors.email}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[12px] font-bold uppercase" style={{ color: '#0F0F10' }}>{L('auth.password_ru') === 'Password' ? L('auth.password_en') : L('auth.password_ru')}</label>
                    <div className="relative">
                      <Lock size={18} strokeWidth={1.8} className="absolute left-3 top-3" style={{ color: '#666666' }} />
                      <input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData((d) => ({ ...d, password: e.target.value }))}
                        placeholder="••••••••"
                        className="h-[44px] w-full rounded-[22px] border pl-10 pr-4 text-[13px] outline-none"
                        style={{ borderColor: errors.password ? '#F87171' : '#3A3A3D', background: '#1A1A1C', color: '#FFFFFF' }}
                      />
                      {errors.password && <LockOpen size={14} strokeWidth={1.8} className="absolute right-3 top-3" style={{ color: '#F87171' }} />}
                    </div>
                    {errors.password && <p className="text-[11px] font-bold" style={{ color: '#F87171' }}>{errors.password}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[12px] font-bold uppercase" style={{ color: '#0F0F10' }}>{L('auth.role_ru') === 'Role' ? L('auth.role_en') : L('auth.role_ru')}</label>
                    <div className="no-scrollbar flex gap-2 overflow-x-auto">
                      {ROLES.map((r) => {
                        const selected = formData.role === r.id
                        return (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => setFormData((d) => ({ ...d, role: r.id }))}
                            className="shrink-0 rounded-[22px] px-4 py-2 text-[11px] font-bold uppercase btn-press"
                            style={{
                              background: selected ? '#FBBF24' : 'transparent',
                              color: selected ? '#0F0F10' : '#FFFFFF',
                              border: selected ? 'none' : '1px solid #3A3A3D',
                              height: 44,
                            }}
                          >
                            {lang === 'ru' ? r.labelRu : r.labelEn}
                          </button>
                        )
                      })}
                    </div>
                    {errors.role && <p className="text-[11px] font-bold" style={{ color: '#F87171' }}>{errors.role}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[12px] font-bold uppercase" style={{ color: '#0F0F10' }}>{L('auth.workplace_ru') === 'Coffee shop (location)' ? L('auth.workplace_en') : L('auth.workplace_ru')}</label>
                    <input
                      name="workplace"
                      value={formData.workplace}
                      onChange={(e) => setFormData((d) => ({ ...d, workplace: e.target.value }))}
                      placeholder="Кофейня «202f» Центральная"
                      className="h-[44px] w-full rounded-[22px] border px-4 text-[13px] outline-none"
                      style={{ borderColor: errors.workplace ? '#F87171' : '#3A3A3D', background: '#1A1A1C', color: '#FFFFFF' }}
                    />
                    {errors.workplace && <p className="text-[11px] font-bold" style={{ color: '#F87171' }}>{errors.workplace}</p>}
                  </div>

                  <div className="flex items-start gap-2 mt-1">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={formData.terms}
                      onChange={(e) => setFormData((d) => ({ ...d, terms: e.target.checked }))}
                      className="mt-0.5 h-[18px] w-[18px] rounded-[6px] border border-[#3A3A3D] bg-[#1A1A1C] accent-[#FBBF24]"
                    />
                    <label htmlFor="terms" className="text-[12px] leading-relaxed" style={{ color: '#0F0F10' }}>
                      {L('auth.terms_ru') === 'I agree to the terms and privacy policy' ? L('auth.terms_en') : L('auth.terms_ru')}
                    </label>
                    {errors.terms && <p className="text-[11px] font-bold" style={{ color: '#F87171' }}>{errors.terms}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-[26px] px-4 py-3 text-[13px] font-extrabold uppercase btn-press"
                    style={{ background: loading ? '#3A3A3D' : '#FBBF24', color: '#0F0F10', height: 52 }}
                  >
                    {loading ? <Loader2 size={18} strokeWidth={1.8} /> : (L('auth.submit_ru') === 'Continue' ? L('auth.submit_en') : L('auth.submit_ru'))}
                  </button>
                </form>

                <div className="mt-5 text-center">
                  <p className="text-[12px]" style={{ color: '#666666' }}>
                    {L('auth.have_account_ru') === 'Already have an account?' ? L('auth.have_account_en') : L('auth.have_account_ru')}
                  </p>
                  <button
                    onClick={() => setMode('login')}
                    className="text-[12px] font-bold" style={{ color: '#8B5CF6' }}
                  >
                    {L('auth.login_ru') === 'Log in' ? L('auth.login_en') : L('auth.login_ru')}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  password: string
  role: string
  workplace: string
  terms: boolean
}
