import { useState } from 'react'
import Login from './pages/Login'
import Calendar from './pages/Calendar'

export default function App() {
  const [accessToken, setAccessToken] = useState(() => {
    // iOSリダイレクト後のトークン取得
    const hash = window.location.hash
    if (hash) {
      const params = new URLSearchParams(hash.replace('#', '?').slice(1))
      const token = params.get('access_token')
      if (token) {
        localStorage.setItem('gat', token)
        window.history.replaceState(null, '', window.location.pathname)
        return token
      }
    }
    // 保存済みトークンをそのまま使う（ログイン画面をスキップ）
    return localStorage.getItem('gat') || null
  })

  function handleLogin(token) {
    localStorage.setItem('gat', token)
    setAccessToken(token)
  }

  function handleLogout() {
    localStorage.removeItem('gat')
    setAccessToken(null)
  }

  if (!accessToken) {
    return <Login onLogin={handleLogin} />
  }

  return <Calendar accessToken={accessToken} onLogout={handleLogout} />
}
