export default function StatCard({ label, value, hint, accent }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className={`stat-value ${accent ? `stat-value-${accent}` : ''}`}>{value}</div>
      {hint && <div className="stat-hint">{hint}</div>}
    </div>
  )
}
