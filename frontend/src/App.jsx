import { useState, useEffect, useCallback } from 'react'
import * as api from './api'
import Login from './components/Login'
import AdminDashboard from './components/AdminDashboard'

export default function App() {
  // null = still checking, false = logged out, true = logged in
  const [authed, setAuthed] = useState(null)

  const handleLogout = useCallback(() => {
    api.clearToken()
    setAuthed(false)
  }, [])

  useEffect(() => {
    // If any request comes back 401, drop straight to the login screen.
    api.setUnauthorizedHandler(() => setAuthed(false))
  }, [])

  useEffect(() => {
    const token = api.getToken()
    setAuthed(!!token)
  }, [])

  if (authed === null) {
    return <div className="boot-screen">Loading&hellip;</div>
  }

  if (!authed) {
    return <Login onSuccess={() => setAuthed(true)} />
  }

  return <AdminDashboard onLogout={handleLogout} />
}
