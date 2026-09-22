import { useCallback } from 'react'
import usePolling from '../hooks/usePolling'
import { getStats, getLogs } from '../api/emailApi'
import StatCard from '../components/StatCard'
import Banner from '../components/Banner'

function formatTime(iso) {
  try {
    return new Date(iso).toLocaleTimeString()
  } catch {
    return ''
  }
}

export default function Monitoring() {
  const fetchAll = useCallback(async () => {
    const [stats, logs] = await Promise.all([getStats(), getLogs()])
    return { stats, entries: logs.entries || [] }
  }, [])

  const { data, error } = usePolling(fetchAll, 3000)

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1>Live monitoring</h1>
          <p className="page__subtitle">Recent worker activity, refreshed every 3 seconds.</p>
        </div>
      </div>

      <Banner type="error">{error ? "Can't reach the backend API." : null}</Banner>

      <section className="stat-grid stat-grid--compact">
        <StatCard label="Sent" value={data?.stats?.completed} tone="success" />
        <StatCard label="Failed" value={data?.stats?.failed} tone="danger" />
        <StatCard label="Retry" value={data?.stats?.retry} tone="warning" />
        <StatCard label="Queued" value={data?.stats?.pending} tone="neutral" />
      </section>

      <div className="card log-feed">
        {(!data?.entries || data.entries.length === 0) && (
          <p className="log-feed__empty">No activity yet. Start a campaign to see live updates here.</p>
        )}
        <ul className="log-feed__list">
          {data?.entries?.map((entry, i) => (
            <li key={i} className={`log-feed__item log-feed__item--${entry.status}`}>
              <span className="log-feed__time">{formatTime(entry.time)}</span>
              <span className="log-feed__status">{entry.status}</span>
              <span className="log-feed__message">
                {entry.email ? `${entry.email} — ` : ''}
                {entry.message}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
