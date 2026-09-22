import { NavLink, Link } from 'react-router-dom'

const links = [
  { to: '/console', label: 'Dashboard', end: true },
  { to: '/console/upload', label: 'Upload CSV' },
  { to: '/console/campaign', label: 'Campaign' },
  { to: '/console/template', label: 'Email template' },
  { to: '/console/monitoring', label: 'Monitoring' },
  { to: '/console/queues', label: 'Queues' },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <Link to="/" className="sidebar__brand" style={{ textDecoration: 'none' }}>
        <span className="grid h-8 w-8 shrink-0 flex-shrink-0 place-items-center rounded-lg bg-white text-black">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="3" y="7" width="18" height="11" rx="2.5" stroke="currentColor" strokeWidth="2" />
          </svg>
        </span>
        <span className="text-[16px] font-bold tracking-tight text-white m-0">GoMailer</span>
      </Link>
      <nav className="sidebar__nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              'sidebar__link' + (isActive ? ' sidebar__link--active' : '')
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar__footer">Email pipeline dashboard</div>
    </aside>
  )
}
