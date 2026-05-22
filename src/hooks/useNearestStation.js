/**
 * useNearestStation.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Custom React hook that:
 *   1. Fetches EV stations from Open Charge Map (or uses demo data)
 *   2. Calculates distance from user position to every station (Haversine)
 *   3. Returns the sorted list and the single nearest station
 *
 * Returns:
 *   stations       Array    — all fetched stations, each with .distanceKm
 *   filtered       Array    — stations after applying the active filter
 *   nearest        object|null — the closest station object
 *   loading        boolean
 *   error          string|null
 *   refresh        () => void — re-fetch stations on demand
 *
 * Usage:
 *   const { stations, nearest, loading } = useNearestStation(position, filter)
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { getStations, getDemoStations, isFastCharger, isAvailable } from '../api/getStations'
import { sortByDistance } from '../utils/distanse'
import { getReservations } from "../services/reservationService";
// ─── Filter helpers ───────────────────────────────────────────────────────────

const FILTERS = {
  all:       () => true,
  fast:      (s) => isFastCharger(s),
  level2:    (s) => !isFastCharger(s),
  available: (s) => isAvailable(s),
}

function applyFilter(stations, filterKey) {
  const fn = FILTERS[filterKey] ?? FILTERS.all
  return stations.filter(fn)
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * @param {{ lat: number, lng: number } | null} position - User GPS position
 * @param {string} [activeFilter='all']                  - 'all' | 'fast' | 'level2' | 'available'
 */
export function useNearestStation(position, activeFilter = 'all') {
  const [stations, setStations] = useState([])   // all stations + distanceKm
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [fetchKey, setFetchKey] = useState(0)    // incremented by refresh()

  const refresh = useCallback(() => setFetchKey((k) => k + 1), [])

  // ── Fetch stations whenever position changes or refresh() is called ──────
  useEffect(() => {
    if (!position) return

    let cancelled = false
    setLoading(true)
    setError(null)

    async function load() {
      try {
        let raw

        if (!import.meta.env.VITE_OCM_API_KEY) {
          // No API key → use demo data (still realistic Kenya stations)
          raw = getDemoStations()
        } else {
          raw = await getStations(position.lat, position.lng)
        }

        if (cancelled) return

        // Attach distanceKm to every station, then sort nearest-first
        const sorted = sortByDistance(position, raw)
        setStations(sorted)
      } catch (err) {
        if (cancelled) return
        console.error('[useNearestStation]', err)
        setError('Could not load stations. Showing demo data.')
        const fallback = sortByDistance(position, getDemoStations())
        setStations(fallback)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [position, fetchKey])

  // ── Derived values ────────────────────────────────────────────────────────
  const filtered = applyFilter(stations, activeFilter)
  const nearest  = filtered.length > 0 ? filtered[0] : null

  return { stations, filtered, nearest, loading, error, refresh }
}
