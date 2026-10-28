import { useState } from 'react'
import { actions } from '../store'
import { Input, Button } from '../components/app-ui'

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = () => {
    if (!name.trim()) { setError('Введите имя'); return }
    if (mode === 'register' && password.length < 4) { setError('Пароль минимум 4 символа'); return }
    actions.login(name.trim())
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-sm rounded-card bg-light p-6">
        <div className="text-center">
          <img src="/logo-202.png" alt="202" style={{ width: 44, height: 44, borderRadius: 10, margin: '0 auto' }} />
          <h1 className="font-display mt-3 text-[24px] font-extrabold uppercase" style={{ color: '#111111' }}>
            {mode === 'login' ? 'Вход' : 'Регистрация'}
          </h1>
          <p className="mt-1 text-[12px]" style={{ color: '#555555' }}>202F Academy</p>
        </div>

        <div className="mt-6 space-y-3">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Имя" />
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" />
          {error && <p className="text-[12px]" style={{ color: '#EB5A52' }}>{error}</p>}
          <Button onClick={submit}>{mode === 'login' ? 'Войти' : 'Зарегистрироваться'}</Button>
        </div>

        <button
          type="button"
          onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
          className="mt-4 w-full text-[12px] font-bold"
          style={{ color: '#5B3FF0' }}
        >
          {mode === 'login' ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
        </button>
      </div>
    </div>
  )
}
