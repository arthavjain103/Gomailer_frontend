export default function StatusPill({ ok, label, unknown = false }) {
  const tone = unknown ? 'unknown' : ok ? 'good' : 'bad'
  return (
    <span className={`status-pill status-pill--${tone}`}>
      <span className="status-pill__dot" />
      {label}
    </span>
  )
}
