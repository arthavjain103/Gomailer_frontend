import { useState } from 'react'
import usePolling from '../hooks/usePolling'
import { getCampaignStatus, startCampaign, stopCampaign } from '../api/emailApi'
import StatusPill from '../components/StatusPill'
import Banner from '../components/Banner'
import Spinner from '../components/Spinner'

export default function Campaign() {
  const { data, error, refresh } = usePolling(getCampaignStatus, 4000)
  const [actionError, setActionError] = useState(null)
  const [pending, setPending] = useState(null) // 'start' | 'stop' | null

  const runAction = async (action, fn) => {
    setPending(action)
    setActionError(null)
    try {
      await fn()
      await refresh()
    } catch (err) {
      setActionError(err?.response?.data?.error || `Could not ${action} the campaign.`)
    } finally {
      setPending(null)
    }
  }

  const paused = data?.paused

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1>Campaign controls</h1>
          <p className="page__subtitle">Start or pause sending. Pausing lets in-flight emails finish safely.</p>
        </div>
      </div>

      <Banner type="error">
        {error ? "Can't reach the backend API." : actionError}
      </Banner>

      <div className="card campaign-card">
        <div className="campaign-card__row">
          <span className="campaign-card__label">Status</span>
          <StatusPill unknown={!data} ok={!!data && !paused} label={paused ? 'Paused' : 'Running'} />
        </div>
        <div className="campaign-card__row">
          <span className="campaign-card__label">Recipient source</span>
          <code className="campaign-card__source">{data?.source ?? '—'}</code>
        </div>

        <div className="campaign-card__actions">
          <button
            className="btn btn--primary"
            onClick={() => runAction('start', startCampaign)}
            disabled={pending !== null}
          >
            {pending === 'start' ? <Spinner size={14} /> : null}
            Start sending
          </button>
          <button
            className="btn btn--secondary"
            onClick={() => runAction('stop', stopCampaign)}
            disabled={pending !== null}
          >
            {pending === 'stop' ? <Spinner size={14} /> : null}
            Stop / Pause
          </button>
        </div>
      </div>
    </div>
  )
}
