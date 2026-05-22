/**
 * useGeolocation.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Custom React hook that retrieves and tracks the user's GPS position using
 * the browser Geolocation API.
 *
 * Returns:
 *   position  { lat, lng } | null   — user's current coordinates
 *   loading   boolean               — true while waiting for first fix
 *   error     string | null         — human-readable error message
 *   retry     () => void            — manually re-request location
 *
 * Usage:
 *   const { position, loading, error, retry } = useGeolocation()
 */
import { useState, useEffect, useCallback } from "react"

export const KENYA_DEFAULT_POS = { lat: -1.2921, lng: 36.8219 }

const GEO_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 60000,
}

export function useGeolocation(watchMode = false) {
  const [position, setPosition] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [attempt, setAttempt] = useState(0)

  const retry = useCallback(() => {
    setLoading(true)
    setError(null)
    setAttempt((n) => n + 1)
  }, [])

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.")
      setPosition(KENYA_DEFAULT_POS)
      setLoading(false)
      return
    }

    let watchId = null

    const onSuccess = (geoPos) => {
      setPosition({
        lat: geoPos.coords.latitude,
        lng: geoPos.coords.longitude,
        accuracy: geoPos.coords.accuracy,
      })
      setLoading(false)
      setError(null)
    }

    const onError = (err) => {
      console.warn("Geolocation error:", err)

      if (err.code === 1) {
        // Permission denied → fallback permanently
        setError("Location permission denied. Using Nairobi.")
        setPosition(KENYA_DEFAULT_POS)
      } else if (err.code === 2) {
        setError("Position unavailable. Try again.")
      } else if (err.code === 3) {
        setError("Location timeout. Retrying might help.")
      } else {
        setError("Unknown location error.")
      }

      setLoading(false)
    }

    if (watchMode) {
      watchId = navigator.geolocation.watchPosition(
        onSuccess,
        onError,
        GEO_OPTIONS
      )
    } else {
      navigator.geolocation.getCurrentPosition(
        onSuccess,
        onError,
        GEO_OPTIONS
      )
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [watchMode, attempt])

  return { position, loading, error, retry }
}