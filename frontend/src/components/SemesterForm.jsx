import { useState, useEffect } from 'react'

const EMPTY = { name: '', start_date: '', end_date: '', status: 'upcoming' }

export default function SemesterForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')

  useEffect(() => {
    setForm(
      initial
        ? {
            name: initial.name,
            start_date: initial.start_date,
            end_date: initial.end_date,
            status: initial.status,
          }
        : EMPTY
    )
  }, [initial])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.start_date || !form.end_date) {
      setError('All fields are required.')
      return
    }
    if (form.end_date < form.start_date) {
      setError('End date must be on or after start date.')
      return
    }
    try {
      await onSubmit(form)
      if (!initial) setForm(EMPTY)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h3>{initial ? 'Edit Semester' : 'Create Semester'}</h3>

      <label>
        Name
        <input
          type="text"
          name="name"
          placeholder="e.g. Fall 2026"
          value={form.name}
          onChange={handleChange}
        />
      </label>

      <div className="row">
        <label>
          Start Date
          <input type="date" name="start_date" value={form.start_date} onChange={handleChange} />
        </label>
        <label>
          End Date
          <input type="date" name="end_date" value={form.end_date} onChange={handleChange} />
        </label>
      </div>

      <label>
        Status
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="upcoming">Upcoming</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </label>

      {error && <p className="error">{error}</p>}

      <div className="actions">
        <button type="submit" className="primary">
          {initial ? 'Save Changes' : 'Create Semester'}
        </button>
        {initial && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
