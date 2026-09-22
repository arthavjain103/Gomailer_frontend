import { useCallback } from 'react'
import usePolling from '../hooks/usePolling'
import { getStatus, getStats } from '../api/emailApi'
import StatusPill from '../components/StatusPill'
import StatCard from '../components/StatCard'
import Banner from '../components/Banner'
import Spinner from '../components/Spinner'

export default function Dashboard() {
  const fetchAll = useCallback(async () => {
    const [status, stats] = await Promise.all([getStatus(), getStats()])
    return { status, stats }
  }, [])

  const { data, error, loading } = usePolling(fetchAll, 4000)

  const status = data?.status
  const stats = data?.stats

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1>Dashboard</h1>
          <p className="page__subtitle">Live view of the email pipeline. Refreshes every 4 seconds.</p>
        </div>
        {loading && !data && <Spinner size={20} />}
      </div>

      <Banner type="error">
        {error ? "Can't reach the backend API. Check that the Go server is running and REDIS is up." : null}
      </Banner>

      <section className="status-row">
        <StatusPill unknown={!status} ok={!!status && status.status === 'ok'} label="Server" />
        <StatusPill unknown={!status} ok={!!status && status.redis} label="Redis" />
        <StatusPill
          unknown={!status}
          ok={!!status && !status.paused}
          label={status?.paused ? 'Campaign paused' : 'Campaign running'}
        />
      </section>

      <section className="stat-grid">
        <StatCard label="Pending" value={stats?.pending} tone="neutral" hint="email:queue" />
        <StatCard label="Processing" value={stats?.processing} tone="info" hint="email:processing" />
        <StatCard label="Completed" value={stats?.completed} tone="success" hint="sent successfully" />
        <StatCard label="Failed" value={stats?.failed} tone="danger" hint="email:dlq" />
      </section>
    </div>
  )
}
