/**
 * Map.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Interactive Leaflet map component for ChargeKenya.
 *
 * Renders:
 *   • Dark CartoDB tile layer
 *   • Orange pulsing marker for the user's position
 *   • Green markers for fast chargers, blue for Level 2
 *   • Red highlighted marker for the nearest station
 *   • Dashed polyline from user → nearest station
 *   • Rich popups with station details
 *
 * Props:
 *   userPos   { lat, lng } | null
 *   stations  Array of OCM station objects (with .distanceKm)
 *   nearest   OCM station object | null
 */

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { isFastCharger, getMaxPowerKW } from '../api/getStations'

// ─── Constants ────────────────────────────────────────────────────────────────

const KENYA_CENTER  = [-1.2921, 36.8219]
const TILE_URL      = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'

const COLORS = {
  user:    '#f5a623',
  fast:    '#00c896',
  level2:  '#378ADD',
  nearest: '#E24B4A',
  line:    '#00c896',
}

// ─── Icon factory ─────────────────────────────────────────────────────────────

function makeIcon(color, size = 13, glow = false) {
  const shadow = glow ? `box-shadow:0 0 10px ${color}88,0 0 20px ${color}44;` : ''
  return L.divIcon({
    className: '',
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:${color};border:2px solid rgba(255,255,255,0.85);
      ${shadow}
    "></div>`,
    iconSize:   [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

function makeUserIcon() {
  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:22px;height:22px">
        <div style="
          position:absolute;inset:0;border-radius:50%;
          background:${COLORS.user}33;
          animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
        "></div>
        <div style="
          position:absolute;inset:3px;border-radius:50%;
          background:${COLORS.user};
          border:2px solid white;
          box-shadow:0 0 12px ${COLORS.user}99;
        "></div>
      </div>
      <style>
        @keyframes ping {
          75%,100% { transform:scale(2.2); opacity:0; }
        }
      </style>
    `,
    iconSize:   [22, 22],
    iconAnchor: [11, 11],
  })
}

// ─── Popup builder ────────────────────────────────────────────────────────────

function buildPopup(station, isNearest = false) {
  const fast  = isFastCharger(station)
  const kw    = getMaxPowerKW(station) ?? '?'
  const color = isNearest ? COLORS.nearest : fast ? COLORS.fast : COLORS.level2
  const badge = isNearest ? `<span style="font-size:10px;background:${COLORS.nearest}22;color:${COLORS.nearest};border:1px solid ${COLORS.nearest}44;border-radius:4px;padding:1px 6px;margin-right:4px">NEAREST</span>` : ''
  const type  = fast ? '⚡ Fast Charger' : '🔌 Level 2'

  return `
    <div style="font-family:'Sora',sans-serif;min-width:180px;color:#e8f4f8">
      <p style="font-size:13px;font-weight:600;margin-bottom:4px">${badge}${station.AddressInfo.Title}</p>
      <p style="font-size:11px;color:rgba(255,255,255,0.45);margin-bottom:8px">${station.AddressInfo.AddressLine1 || 'Kenya'}</p>
      <p style="font-size:12px;color:${color};font-weight:600;margin-bottom:2px">${kw} kW · ${type}</p>
      ${station.distanceKm != null
        ? `<p style="font-size:11px;color:rgba(255,255,255,0.35)">${station.distanceKm.toFixed(1)} km from you</p>`
        : ''}
    </div>
  `
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Map({ userPos, stations, nearest }) {
  const containerRef = useRef(null)
  const mapRef       = useRef(null)
  const layersRef    = useRef({ markers: [], line: null, userMarker: null })

  // ── Initialize map once ─────────────────────────────────────────────────
  useEffect(() => {
    if (mapRef.current) return // already initialised

    const map = L.map(containerRef.current, {
      center:             KENYA_CENTER,
      zoom:               7,
      zoomControl:        true,
      attributionControl: false,
    })

    L.tileLayer(TILE_URL, { maxZoom: 19 }).addTo(map)

    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // ── Update user marker when position arrives ─────────────────────────────
  useEffect(() => {
    const map = mapRef.current
    if (!map || !userPos) return

    const { userMarker } = layersRef.current

    if (userMarker) {
      userMarker.setLatLng([userPos.lat, userPos.lng])
    } else {
      layersRef.current.userMarker = L.marker([userPos.lat, userPos.lng], {
        icon: makeUserIcon(),
        zIndexOffset: 500,
      })
        .bindPopup('<b style="font-family:Sora,sans-serif">📍 Your location</b>')
        .addTo(map)
    }

    // Fly to user on first position fix
    map.flyTo([userPos.lat, userPos.lng], 11, { duration: 1.4 })
  }, [userPos])

  // ── Re-render station markers whenever stations list changes ─────────────
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Remove old station markers + route line
    layersRef.current.markers.forEach((m) => map.removeLayer(m))
    layersRef.current.markers = []

    if (layersRef.current.line) {
      map.removeLayer(layersRef.current.line)
      layersRef.current.line = null
    }

    // Add markers for all stations
    stations.forEach((station) => {
      const lat     = station.AddressInfo.Latitude
      const lng     = station.AddressInfo.Longitude
      const fast    = isFastCharger(station)
      const isNear  = nearest && station.ID === nearest.ID
      const color   = isNear ? COLORS.nearest : fast ? COLORS.fast : COLORS.level2
      const size    = isNear ? 18 : 12

      const marker = L.marker([lat, lng], {
        icon:          makeIcon(color, size, isNear),
        zIndexOffset:  isNear ? 1000 : 0,
      })
        .bindPopup(buildPopup(station, isNear))
        .addTo(map)

      layersRef.current.markers.push(marker)
    })

    // Draw dashed line from user → nearest
    if (userPos && nearest) {
      const nlat = nearest.AddressInfo.Latitude
      const nlng = nearest.AddressInfo.Longitude

      layersRef.current.line = L.polyline(
        [[userPos.lat, userPos.lng], [nlat, nlng]],
        { color: COLORS.line, weight: 2, dashArray: '6 10', opacity: 0.65 }
      ).addTo(map)
    }
  }, [stations, nearest, userPos])

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ minHeight: '400px' }}
      aria-label="EV charging station map of Kenya"
    />
  )
}
