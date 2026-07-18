const BASE_URL = 'http://localhost:8000'
const TOKEN_KEY = 'ams_admin_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

// Fired whenever a request comes back 401, so the app can drop to the login screen
let onUnauthorized = () => {}
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn
}

async function request(path, options = {}, auth = true) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }

  if (auth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (res.status === 401) {
    clearToken()
    onUnauthorized()
    let detail = 'Session expired. Please log in again.'
    try {
      const body = await res.json()
      detail = body.detail || detail
    } catch (_) {}
    throw new Error(detail)
  }

  if (!res.ok) {
    let detail = `Request failed (${res.status})`
    try {
      const body = await res.json()
      detail = body.detail ? JSON.stringify(body.detail) : detail
    } catch (_) {}
    throw new Error(detail)
  }

  if (res.status === 204) return null
  return res.json()
}

// ---- Auth ----
export const login = async (username, password) => {
  const data = await request(
    '/auth/login',
    { method: 'POST', body: JSON.stringify({ username, password }) },
    false // no token to attach yet
  )
  setToken(data.access_token)
  return data
}

// ---- Semesters ----
export const getSemesters = () => request('/semesters')
export const getSemester = (id) => request(`/semesters/${id}`)
export const createSemester = (data) =>
  request('/semesters', { method: 'POST', body: JSON.stringify(data) })
export const updateSemester = (id, data) =>
  request(`/semesters/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteSemester = (id) =>
  request(`/semesters/${id}`, { method: 'DELETE' })

// ---- Enrollment Periods ----
export const getEnrollmentPeriods = (semesterId) =>
  request(`/semesters/${semesterId}/enrollment-periods`)
export const createEnrollmentPeriod = (semesterId, data) =>
  request(`/semesters/${semesterId}/enrollment-periods`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
export const updateEnrollmentPeriod = (id, data) =>
  request(`/enrollment-periods/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteEnrollmentPeriod = (id) =>
  request(`/enrollment-periods/${id}`, { method: 'DELETE' })
