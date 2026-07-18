import { useState, useEffect, useCallback, useMemo } from 'react'
import * as api from '../api'
import Sidebar from './Sidebar'
import StatCard from './StatCard'
import SemesterList from './SemesterList'
import SemesterForm from './SemesterForm'
import EnrollmentPeriodList from './EnrollmentPeriodList'
import EnrollmentPeriodForm from './EnrollmentPeriodForm'

export default function AdminDashboard({ onLogout }) {
  const [view, setView] = useState('dashboard')

  const [semesters, setSemesters] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [editingSemester, setEditingSemester] = useState(null)
  const [showSemesterForm, setShowSemesterForm] = useState(false)

  const [periods, setPeriods] = useState([])
  const [editingPeriod, setEditingPeriod] = useState(null)
  const [showPeriodForm, setShowPeriodForm] = useState(false)

  const [loading, setLoading] = useState(true)
  const [globalError, setGlobalError] = useState('')

  const loadSemesters = useCallback(async () => {
    try {
      const data = await api.getSemesters()
      setSemesters(data)
    } catch (err) {
      setGlobalError(
        `Could not reach the backend at http://localhost:8000. Is it running? (${err.message})`
      )
    } finally {
      setLoading(false)
    }
  }, [])

  const loadPeriods = useCallback(async (semesterId) => {
    if (!semesterId) {
      setPeriods([])
      return
    }
    try {
      const data = await api.getEnrollmentPeriods(semesterId)
      setPeriods(data)
    } catch (err) {
      setGlobalError(err.message)
    }
  }, [])

  useEffect(() => {
    loadSemesters()
  }, [loadSemesters])

  useEffect(() => {
    loadPeriods(selectedId)
    setEditingPeriod(null)
    setShowPeriodForm(false)
  }, [selectedId, loadPeriods])

  // ---- Semester handlers ----

  const handleCreateSemester = async (form) => {
    await api.createSemester(form)
    setShowSemesterForm(false)
    await loadSemesters()
  }

  const handleUpdateSemester = async (form) => {
    await api.updateSemester(editingSemester.id, form)
    setEditingSemester(null)
    await loadSemesters()
  }

  const handleDeleteSemester = async (id) => {
    if (!confirm('Delete this semester and all its enrollment periods?')) return
    await api.deleteSemester(id)
    if (selectedId === id) setSelectedId(null)
    await loadSemesters()
  }

  // ---- Enrollment period handlers ----

  const handleCreatePeriod = async (form) => {
    await api.createEnrollmentPeriod(selectedId, form)
    setShowPeriodForm(false)
    await loadPeriods(selectedId)
  }

  const handleUpdatePeriod = async (form) => {
    await api.updateEnrollmentPeriod(editingPeriod.id, form)
    setEditingPeriod(null)
    await loadPeriods(selectedId)
  }

  const handleDeletePeriod = async (id) => {
    if (!confirm('Delete this enrollment period?')) return
    await api.deleteEnrollmentPeriod(id)
    await loadPeriods(selectedId)
  }

  const selectedSemester = semesters.find((s) => s.id === selectedId)

  const stats = useMemo(() => {
    const active = semesters.filter((s) => s.status === 'active').length
    const upcoming = semesters.filter((s) => s.status === 'upcoming').length
    const completed = semesters.filter((s) => s.status === 'completed').length
    return { total: semesters.length, active, upcoming, completed }
  }, [semesters])

  return (
    <div className="shell">
      <Sidebar active={view} onNavigate={setView} onLogout={onLogout} />

      <div className="main-col">
        <div className="topbar">
          <span className="context-pill">
            <DotIcon /> Admin Panel
          </span>
        </div>

        <div className="page">
          <div className="page-head">
            <div>
              <h1>Welcome back, Admin.</h1>
              <p className="page-sub">SafeX Solutions &middot; Semester Management</p>
            </div>
            <button className="primary" onClick={() => { setEditingSemester(null); setShowSemesterForm(true); setView('semesters') }}>
              + New Semester
            </button>
          </div>

          {globalError && <div className="alert">{globalError}</div>}

          <div className="stat-row">
            <StatCard label="Total Semesters" value={loading ? '—' : stats.total} hint="All time" />
            <StatCard label="Active" value={loading ? '—' : stats.active} hint="Currently running" accent="active" />
            <StatCard label="Upcoming" value={loading ? '—' : stats.upcoming} hint="Not yet started" accent="upcoming" />
            <StatCard label="Completed" value={loading ? '—' : stats.completed} hint="Wrapped up" accent="completed" />
          </div>

          {view === 'dashboard' && (
            <div className="panel">
              <div className="panel-head">
                <h2>Semesters</h2>
                <button onClick={() => setView('semesters')}>Manage &rarr;</button>
              </div>
              {loading ? (
                <p className="muted">Loading semesters&hellip;</p>
              ) : (
                <SemesterList
                  semesters={semesters}
                  selectedId={selectedId}
                  onSelect={(id) => { setSelectedId(id); setView('semesters') }}
                  onEdit={(s) => { setEditingSemester(s); setShowSemesterForm(true); setView('semesters') }}
                  onDelete={handleDeleteSemester}
                />
              )}
            </div>
          )}

          {view === 'semesters' && (
            <div className="grid-2">
              <section className="panel">
                <div className="panel-head">
                  <h2>Semesters</h2>
                  {!showSemesterForm && !editingSemester && (
                    <button className="primary" onClick={() => setShowSemesterForm(true)}>+ Add</button>
                  )}
                </div>

                {loading ? (
                  <p className="muted">Loading semesters&hellip;</p>
                ) : (
                  <SemesterList
                    semesters={semesters}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                    onEdit={(s) => { setEditingSemester(s); setShowSemesterForm(true) }}
                    onDelete={handleDeleteSemester}
                  />
                )}

                {(showSemesterForm || editingSemester) && (
                  <SemesterForm
                    initial={editingSemester}
                    onSubmit={editingSemester ? handleUpdateSemester : handleCreateSemester}
                    onCancel={() => { setEditingSemester(null); setShowSemesterForm(false) }}
                  />
                )}
              </section>

              <section className="panel">
                <div className="panel-head">
                  <h2>Enrollment Periods</h2>
                </div>
                {!selectedSemester ? (
                  <p className="muted">Select a semester to manage its enrollment periods.</p>
                ) : (
                  <>
                    <p className="muted">
                      Managing periods for <strong>{selectedSemester.name}</strong>
                    </p>

                    <EnrollmentPeriodList
                      periods={periods}
                      onEdit={(p) => { setEditingPeriod(p); setShowPeriodForm(true) }}
                      onDelete={handleDeletePeriod}
                    />

                    {showPeriodForm ? (
                      <EnrollmentPeriodForm
                        initial={editingPeriod}
                        onSubmit={editingPeriod ? handleUpdatePeriod : handleCreatePeriod}
                        onCancel={() => { setEditingPeriod(null); setShowPeriodForm(false) }}
                      />
                    ) : (
                      <button className="primary" onClick={() => setShowPeriodForm(true)}>
                        + Add Enrollment Period
                      </button>
                    )}
                  </>
                )}
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DotIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" style={{ marginRight: 6 }}>
      <circle cx="4" cy="4" r="4" fill="currentColor" />
    </svg>
  )
}
