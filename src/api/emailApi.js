import client from './client'

// Server + queue stats
export const getStatus = () =>
  client.get('/api/status').then((r) => r.data)

export const getStats = () =>
  client.get('/api/stats').then((r) => r.data)

// Live monitoring
export const getLogs = () =>
  client.get('/api/logs').then((r) => r.data)

// Campaign controls
export const getCampaignStatus = () =>
  client.get('/api/campaign/status').then((r) => r.data)

export const startCampaign = () =>
  client.post('/api/campaign/start').then((r) => r.data)

export const stopCampaign = () =>
  client.post('/api/campaign/stop').then((r) => r.data)

// Email template
export const getTemplate = () =>
  client.get('/api/template').then((r) => r.data)

export const saveTemplate = (template) =>
  client.post('/api/template', { template }).then((r) => r.data)

// Email attachment
export const getAttachment = () =>
  client.get('/api/attachment').then((r) => r.data)

export const removeAttachment = () =>
  client.delete('/api/attachment').then((r) => r.data)

export const uploadAttachment = (file, onProgress) => {
  const form = new FormData()
  form.append('file', file)

  return client
    .post('/api/attachment', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (evt) => {
        if (onProgress && evt.total) {
          onProgress(Math.round((evt.loaded * 100) / evt.total))
        }
      },
    })
    .then((r) => r.data)
}

// CSV upload
export const uploadCsv = (file, onProgress) => {
  const form = new FormData()
  form.append('file', file)

  return client
    .post('/api/upload', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (evt) => {
        if (onProgress && evt.total) {
          onProgress(Math.round((evt.loaded * 100) / evt.total))
        }
      },
    })
    .then((r) => r.data)
}

// Redis queue inspection
export const getQueues = () =>
  client.get('/api/queues').then((r) => r.data)