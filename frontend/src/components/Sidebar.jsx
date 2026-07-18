const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: DashboardIcon, soon: false },
  { key: 'semesters', label: 'Semesters', icon: CalendarIcon, soon: false },
  { key: 'subjects', label: 'Subjects', icon: BookIcon, soon: true },
  { key: 'attendance', label: 'Attendance', icon: CheckIcon, soon: true },
  { key: 'results', label: 'Results & GPA', icon: ChartIcon, soon: true },
  { key: 'transcript', label: 'Transcript', icon: DocIcon, soon: true },
]

export default function Sidebar({ active, onNavigate, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <GradCapIcon />
        </div>
        <div>
          <div className="brand-name">Marks Entry</div>
          <div className="brand-sub">SafeX Solutions</div>
        </div>
      </div>

      <nav className="nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`nav-item ${active === item.key ? 'nav-item-active' : ''} ${
              item.soon ? 'nav-item-soon' : ''
            }`}
            disabled={item.soon}
            onClick={() => onNavigate(item.key)}
          >
            <item.icon />
            <span>{item.label}</span>
            {item.soon && <span className="soon-tag">SOON</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-title">Group 22</div>
        <div className="sidebar-footer-sub">Week 2 &middot; Admin Semester Management</div>
        <button className="logout-btn" onClick={onLogout}>
          <LogoutIcon /> Log out
        </button>
      </div>
    </aside>
  )
}

function LogoutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ---- Inline icons (no external icon dependency) ---- */

function GradCapIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 3 1 8l11 5 9-4.1V17h2V8L12 3Z" fill="currentColor" />
      <path d="M5 10.5V15c0 1.7 3.13 3.5 7 3.5s7-1.8 7-3.5v-4.5l-7 3.2-7-3.2Z" fill="currentColor" opacity="0.55" />
    </svg>
  )
}

function DashboardIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor" />
      <rect x="13" y="3" width="8" height="8" rx="2" fill="currentColor" opacity="0.5" />
      <rect x="3" y="13" width="8" height="8" rx="2" fill="currentColor" opacity="0.5" />
      <rect x="13" y="13" width="8" height="8" rx="2" fill="currentColor" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 9.5h18" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path d="M4 4.5C4 3.7 4.7 3 5.5 3H14v18H5.5c-.8 0-1.5-.7-1.5-1.5v-15Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M14 3h4.5c.8 0 1.5.7 1.5 1.5v15c0 .8-.7 1.5-1.5 1.5H14" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 12l3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path d="M4 20V10M12 20V4M20 20v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function DocIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path d="M6 2.5h9l3 3V21a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8.5 12h7M8.5 15.5h7M8.5 8.5h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
