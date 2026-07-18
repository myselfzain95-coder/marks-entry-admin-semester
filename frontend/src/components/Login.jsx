import { useState } from 'react'
import * as api from '../api'

export default function Login({ onSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!username || !password) {
      setError('Please enter both a username and password.')
      return
    }
    setSubmitting(true)
    try {
      await api.login(username, password)
      onSuccess()
    } catch (err) {
      setError(err.message || 'Login failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-mark">
            <GradCapIcon />
          </div>
          <div>
            <div className="brand-name">Marks Entry</div>
            <div className="brand-sub">SafeX Solutions</div>
          </div>
        </div>

        <h1>Admin sign in</h1>
        <p className="login-sub">Semester Management &middot; authorized staff only</p>

        <form className="form" onSubmit={handleSubmit}>
          <label>
            Username
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </label>

          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="primary login-btn" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

function GradCapIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 3 1 8l11 5 9-4.1V17h2V8L12 3Z" fill="currentColor" />
      <path d="M5 10.5V15c0 1.7 3.13 3.5 7 3.5s7-1.8 7-3.5v-4.5l-7 3.2-7-3.2Z" fill="currentColor" opacity="0.55" />
    </svg>
  )
}
