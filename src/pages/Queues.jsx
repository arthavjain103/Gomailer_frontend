import { useState, useCallback } from 'react'
import usePolling from '../hooks/usePolling'
import { getQueues } from '../api/emailApi'
import Banner from '../components/Banner'
import Spinner from '../components/Spinner'

function formatTime(iso) {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return ''
  }
}

function statusClass(status) {
  switch (status) {
    case 'waiting':
    case 'pending':
      return 'neutral'
    case 'active':
    case 'processing':
      return 'info'
    case 'dead':
    case 'failed':
      return 'danger'
    case 'completed':
    case 'sent':
      return 'success'
    case 'retry':
      return 'warning'
    default:
      return 'neutral'
  }
}

export default function Queues() {
  const [activeTab, setActiveTab] = useState(0)

  const fetchQueues = useCallback(async () => {
    const res = await getQueues()
    return res.queues || []
  }, [])

  const { data: queues, error, loading } = usePolling(fetchQueues, 5000)

  const activeQueue = queues?.[activeTab]

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1>Redis Queues</h1>
          <p className="page__subtitle">
            Inspect individual jobs across all queues including the Dead Letter Queue. Refreshes every 5 s.
          </p>
        </div>
        {loading && !queues && <Spinner size={20} />}
      </div>

      <Banner type="error">
        {error ? "Can't reach the backend API. Check that the Go server is running and Redis is up." : null}
      </Banner>

      {queues && queues.length > 0 && (
        <>
          {/* Queue tabs */}
          <div className="queue-tabs">
            {queues.map((q, i) => {
              const isDlq = q.name.toLowerCase().includes('dlq') || q.name.toLowerCase().includes('dead')
              return (
                <button
                  key={q.name}
                  className={
                    'queue-tab' +
                    (i === activeTab ? ' queue-tab--active' : '') +
                    (isDlq ? ' queue-tab--dlq' : '')
                  }
                  onClick={() => setActiveTab(i)}
                >
                  {q.display || q.name}
                  <span className={'queue-tab__badge' + (isDlq ? ' queue-tab__badge--dlq' : '')}>
                    {q.count ?? q.jobs?.length ?? 0}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Job table */}
          <div className="card">
            {(!activeQueue?.jobs || activeQueue.jobs.length === 0) ? (
              <p className="queue-empty">
                No jobs in <strong>{activeQueue?.display || activeQueue?.name}</strong> right now.
              </p>
            ) : (
              <div className="queue-table-wrap">
                <table className="queue-table">
                  <thead>
                    <tr>
                      <th>Job ID</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeQueue.jobs.map((job) => (
                      <tr key={job.id}>
                        <td className="queue-table__id">{job.id}</td>
                        <td>{job.email || '—'}</td>
                        <td>
                          <span className={`queue-table__status queue-table__status--${statusClass(job.status)}`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="queue-table__time">{formatTime(job.created_at)}</td>
                        <td className={job.error ? 'queue-table__error' : ''}>
                          {job.error || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {queues && queues.length === 0 && (
        <div className="card">
          <p className="queue-empty">No queues found. Start a campaign to populate queues.</p>
        </div>
      )}
    </div>
  )
}
