import { useEffect, useRef, useState } from 'react'
import { getTemplate, saveTemplate, getAttachment, uploadAttachment, removeAttachment } from '../api/emailApi'
import Banner from '../components/Banner'
import Spinner from '../components/Spinner'

export default function Template() {
  const [template, setTemplate] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState(null)
  const [saveError, setSaveError] = useState(null)
  const [saved, setSaved] = useState(false)

  const [attachmentName, setAttachmentName] = useState(null)
  const [attachmentLoading, setAttachmentLoading] = useState(true)
  const [file, setFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [attachmentError, setAttachmentError] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    getAttachment()
      .then((data) => {
        if (!cancelled) setAttachmentName(data?.filename || null)
      })
      .catch(() => {
        /* no attachment configured yet, or backend not reachable — ignore */
      })
      .finally(() => {
        if (!cancelled) setAttachmentLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleAttachmentUpload = async () => {
    if (!file) {
      setAttachmentError('Choose a file first.')
      return
    }
    setUploading(true)
    setAttachmentError(null)
    setUploadProgress(0)
    try {
      const data = await uploadAttachment(file, setUploadProgress)
      setAttachmentName(data?.filename || file.name)
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      setAttachmentError(err?.response?.data?.error || 'Could not upload the attachment.')
    } finally {
      setUploading(false)
    }
  }

  const handleAttachmentRemove = async () => {
    setRemoving(true)
    setAttachmentError(null)
    try {
      await removeAttachment()
      setAttachmentName(null)
    } catch (err) {
      setAttachmentError(err?.response?.data?.error || 'Could not remove the attachment.')
    } finally {
      setRemoving(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getTemplate()
      .then((data) => {
        if (!cancelled) setTemplate(data?.template ?? '')
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(err?.response?.data?.error || 'Could not load the current template.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSaveError(null)
    setSaved(false)
    try {
      await saveTemplate(template)
      setSaved(true)
    } catch (err) {
      setSaveError(err?.response?.data?.error || 'Could not save the template.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1>Email template</h1>
          <p className="page__subtitle">
            Edit the raw email (headers + body) sent to recipients. Use{' '}
            <code>{'{{.Name}}'}</code>, <code>{'{{.Email}}'}</code>,{' '}
            <code>{'{{.Retry}}'}</code> and <code>{'{{.CampaignID}}'}</code> as placeholders.
          </p>
        </div>
      </div>

      <div className="card template-card">
        <Banner type="error">{loadError}</Banner>

        {loading ? (
          <div className="template-card__loading">
            <Spinner size={14} /> Loading current template…
          </div>
        ) : (
          <>
            <textarea
              className="template-card__textarea"
              value={template}
              onChange={(e) => {
                setTemplate(e.target.value)
                setSaved(false)
              }}
              spellCheck={false}
              rows={16}
              placeholder={
                'From: you@example.com\nSubject: Your subject\n\nDear {{.Name}},\n\n...'
              }
            />

            <div className="template-card__actions">
              <button
                className="btn btn--primary"
                onClick={handleSave}
                disabled={saving || !template.trim()}
              >
                {saving ? <Spinner size={14} /> : null}
                {saving ? 'Saving…' : 'Save template'}
              </button>
            </div>

            <Banner type="error">{saveError}</Banner>
            <Banner type="success">
              {saved ? 'Template saved. New sends will use this version.' : null}
            </Banner>
          </>
        )}
      </div>

      <div className="card template-card">
        <div className="page__header" style={{ marginBottom: 0 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 16 }}>Attachment</h2>
            <p className="page__subtitle">
              Optional file (e.g. resume PDF) attached to every email sent from now on.
            </p>
          </div>
        </div>

        {attachmentLoading ? (
          <div className="template-card__loading">
            <Spinner size={14} /> Checking current attachment…
          </div>
        ) : (
          <>
            {attachmentName ? (
              <div className="campaign-card__row">
                <span className="campaign-card__label">Current attachment</span>
                <code className="campaign-card__source">{attachmentName}</code>
              </div>
            ) : (
              <div className="campaign-card__row">
                <span className="campaign-card__label">Current attachment</span>
                <code className="campaign-card__source">none</code>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              disabled={uploading || removing}
            />

            <div className="template-card__actions">
              <button
                className="btn btn--primary"
                onClick={handleAttachmentUpload}
                disabled={uploading || removing || !file}
              >
                {uploading ? <Spinner size={14} /> : null}
                {uploading ? 'Uploading…' : 'Upload attachment'}
              </button>
              {attachmentName ? (
                <button
                  className="btn btn--secondary"
                  onClick={handleAttachmentRemove}
                  disabled={uploading || removing}
                >
                  {removing ? <Spinner size={14} /> : null}
                  {removing ? 'Removing…' : 'Remove attachment'}
                </button>
              ) : null}
            </div>

            {uploading && (
              <div className="progress-bar">
                <div className="progress-bar__fill" style={{ width: `${uploadProgress}%` }} />
              </div>
            )}

            <Banner type="error">{attachmentError}</Banner>
          </>
        )}
      </div>
    </div>
  )
}
