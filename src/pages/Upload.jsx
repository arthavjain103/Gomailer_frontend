import { useEffect, useRef, useState } from 'react'
import { uploadCsv, getAttachment, uploadAttachment, removeAttachment } from '../api/emailApi'
import Banner from '../components/Banner'
import Spinner from '../components/Spinner'

export default function Upload() {
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] ?? null)
    setResult(null)
    setError(null)
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Choose a CSV file first.')
      return
    }
    setUploading(true)
    setError(null)
    setResult(null)
    setProgress(0)

    try {
      const data = await uploadCsv(file, setProgress)
      setResult(data)
      setFile(null)
      if (inputRef.current) inputRef.current.value = ''
    } catch (err) {
      setError(err?.response?.data?.error || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1>Upload recipients</h1>
          <p className="page__subtitle">CSV format: first column name, second column email.</p>
        </div>
      </div>

      <div className="card upload-card">
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          disabled={uploading}
        />

        <button className="btn btn--primary" onClick={handleUpload} disabled={uploading || !file}>
          {uploading ? <Spinner size={14} /> : null}
          {uploading ? 'Uploading…' : 'Upload CSV'}
        </button>

        {uploading && (
          <div className="progress-bar">
            <div className="progress-bar__fill" style={{ width: `${progress}%` }} />
          </div>
        )}

        <Banner type="error">{error}</Banner>
        <Banner type="success">
          {result ? `Uploaded "${result.filename}" successfully. Go to Campaign to start sending.` : null}
        </Banner>
      </div>

      <AttachmentCard />
    </div>
  )
}

function AttachmentCard() {
  const [current, setCurrent] = useState(null) // filename string | null
  const [loadingCurrent, setLoadingCurrent] = useState(true)
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const inputRef = useRef(null)

  const loadCurrent = () => {
    setLoadingCurrent(true)
    getAttachment()
      .then((data) => setCurrent(data?.filename || null))
      .catch(() => setCurrent(null))
      .finally(() => setLoadingCurrent(false))
  }

  useEffect(() => {
    loadCurrent()
  }, [])

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] ?? null)
    setError(null)
    setSuccess(null)
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Choose a file first.')
      return
    }
    setUploading(true)
    setError(null)
    setSuccess(null)
    setProgress(0)

    try {
      const data = await uploadAttachment(file, setProgress)
      setCurrent(data.filename)
      setSuccess(`"${data.filename}" will be attached to every email sent.`)
      setFile(null)
      if (inputRef.current) inputRef.current.value = ''
    } catch (err) {
      setError(err?.response?.data?.error || 'Attachment upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async () => {
    setRemoving(true)
    setError(null)
    setSuccess(null)
    try {
      await removeAttachment()
      setCurrent(null)
      setSuccess('Attachment removed. Emails will go out without one.')
    } catch (err) {
      setError(err?.response?.data?.error || 'Could not remove the attachment.')
    } finally {
      setRemoving(false)
    }
  }

  return (
    <div className="page__section">
      <div className="page__header">
        <div>
          <h1>Email attachment</h1>
          <p className="page__subtitle">
            Optional. If set, this file is attached to every campaign email.
          </p>
        </div>
      </div>

      <div className="card upload-card">
        {loadingCurrent ? (
          <div className="template-card__loading">
            <Spinner size={14} /> Checking current attachment…
          </div>
        ) : (
          <div className="campaign-card__row" style={{ width: '100%' }}>
            <span className="campaign-card__label">Current attachment</span>
            <code className="campaign-card__source">{current || 'None'}</code>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          onChange={handleFileChange}
          disabled={uploading || removing}
        />

        <div className="campaign-card__actions">
          <button
            className="btn btn--primary"
            onClick={handleUpload}
            disabled={uploading || removing || !file}
          >
            {uploading ? <Spinner size={14} /> : null}
            {uploading ? 'Uploading…' : 'Attach file'}
          </button>
          {current && (
            <button
              className="btn btn--secondary"
              onClick={handleRemove}
              disabled={uploading || removing}
            >
              {removing ? <Spinner size={14} /> : null}
              {removing ? 'Removing…' : 'Remove attachment'}
            </button>
          )}
        </div>

        {uploading && (
          <div className="progress-bar">
            <div className="progress-bar__fill" style={{ width: `${progress}%` }} />
          </div>
        )}

        <Banner type="error">{error}</Banner>
        <Banner type="success">{success}</Banner>
      </div>
    </div>
  )
}
