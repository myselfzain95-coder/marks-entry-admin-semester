const STATUS_CLASS = {
  upcoming: 'badge badge-upcoming',
  active: 'badge badge-active',
  completed: 'badge badge-completed',
}

export default function SemesterList({
  semesters,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
}) {
  if (semesters.length === 0) {
    return <p className="muted">No semesters yet. Create one to get started.</p>
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Start</th>
          <th>End</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {semesters.map((s) => (
          <tr
            key={s.id}
            className={s.id === selectedId ? 'selected' : ''}
            onClick={() => onSelect(s.id)}
          >
            <td>{s.name}</td>
            <td>{s.start_date}</td>
            <td>{s.end_date}</td>
            <td>
              <span className={STATUS_CLASS[s.status]}>{s.status}</span>
            </td>
            <td className="row-actions">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(s)
                }}
              >
                Edit
              </button>
              <button
                className="danger"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(s.id)
                }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
