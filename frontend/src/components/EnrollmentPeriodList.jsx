export default function EnrollmentPeriodList({ periods, onEdit, onDelete }) {
  if (periods.length === 0) {
    return <p className="muted">No enrollment periods for this semester yet.</p>
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Start</th>
          <th>End</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {periods.map((p) => (
          <tr key={p.id}>
            <td>{p.start_date}</td>
            <td>{p.end_date}</td>
            <td>
              <span className={p.status === 'open' ? 'badge badge-active' : 'badge badge-completed'}>
                {p.status}
              </span>
            </td>
            <td className="row-actions">
              <button onClick={() => onEdit(p)}>Edit</button>
              <button className="danger" onClick={() => onDelete(p.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
