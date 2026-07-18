import { useState, useEffect } from 'react'

const EMPTY = { start_date: '', end_date: '', status: 'open' }

export default function EnrollmentPeriodForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')

  useEffect(() => {
    setForm(
      initial
        ? { start_date: initial.start_date, end_date: initial.end_date, status: initial.status }
        : EMPTY
    )
  }, [initial])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.start_date || !form.end_date) {
      setError('Both dates are required.')
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
      <h4>{initial ? 'Edit Enrollment Period' : 'Add Enrollment Period'}</h4>

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
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      </label>

      {error && <p className="error">{error}</p>}

      <div className="actions">
        <button type="submit" className="primary">
          {initial ? 'Save Changes' : 'Add Period'}
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
