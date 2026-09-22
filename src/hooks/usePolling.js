import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Calls fetchFn immediately, then again every intervalMs, keeping the last
 * good result on screen if a later poll fails (so the UI doesn't flicker
 * into an error state on one dropped request).
 */
export default function usePolling(fetchFn, intervalMs = 4000) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const timerRef = useRef(null)
  const fetchRef = useRef(fetchFn)
  fetchRef.current = fetchFn

  const run = useCallback(async () => {
    try {
      const result = await fetchRef.current()
      setData(result)
      setError(null)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    run()
    timerRef.current = setInterval(run, intervalMs)
    return () => clearInterval(timerRef.current)
  }, [run, intervalMs])

  return { data, error, loading, refresh: run }
}
