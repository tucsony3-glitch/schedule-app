import { useState } from 'react'
import Login from './pages/Login'
import Calendar from './pages/Calendar'

export default function App() {
  const [accessToken, setAccessToken] = useState(() => sessionStorage.getItem('gat') || null)

  function handleLogin(token) {
    sessionStorage.setItem('gat', token)
    setAccessToken(token)
  }

  function handleLogout() {
    sessionStorage.removeItem('gat')
    setAccessToken(null)
  }

  if (!accessToken) {
    return <Login onLogin={handleLogin} />
  }

  return <Calendar accessToken={accessToken} onLogout={handleLogout} />
}
