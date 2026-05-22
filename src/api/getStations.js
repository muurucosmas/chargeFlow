/**
 * getStations.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Fetches EV charging stations from the Open Charge Map (OCM) API.
 *
 * API docs: https://openchargemap.org/site/develop/api
 *
 * Get your free API key at: https://openchargemap.org/site/develop
 * Then add it to your .env file as: VITE_OCM_API_KEY=your_key_here
 */

// ─── Configuration ───────────────────────────────────────────────────────────

const OCM_BASE_URL = 'https://api.openchargemap.io/v3/poi'

/**
 * Your Open Charge Map API key.
 * Set VITE_OCM_API_KEY in a .env file at the project root.
 * Example .env:
 *   VITE_OCM_API_KEY=abc123yourkeyhere
 */
const API_KEY = import.meta.env.VITE_OCM_API_KEY || ''

// ─── Default fetch options ────────────────────────────────────────────────────

const DEFAULT_OPTIONS = {
  countryCode: 'KE',       // Kenya
  maxResults: 200,         // OCM free tier allows up to 500
  distanceKm: 200,         // Search radius around user position
  distanceUnit: 'KM',
  compact: true,           // Smaller response payload
  verbose: false,
}

// ─── Main fetch function ──────────────────────────────────────────────────────

/**
 * Fetch EV charging stations near a geographic position.
 *
 * @param {number} lat        - User latitude
 * @param {number} lng        - User longitude
 * @param {object} [options]  - Override DEFAULT_OPTIONS fields
 * @returns {Promise<Array>}  Array of OCM station objects
 *
 * @example
 *   const stations = await getStations(-1.2921, 36.8219)
 */
export async function getStations(lat, lng, options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  const params = new URLSearchParams({
    output:       'json',
    countrycode:  opts.countryCode,
    latitude:     lat,
    longitude:    lng,
    distance:     opts.distanceKm,
    distanceunit: opts.distanceUnit,
    maxresults:   opts.maxResults,
    compact:      opts.compact,
    verbose:      opts.verbose,
    key:          API_KEY,
  })

  const url = `${OCM_BASE_URL}?${params.toString()}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(
      `Open Charge Map API error: ${response.status} ${response.statusText}`
    )
  }

  const stations = await response.json()

  // Filter out entries missing coordinates (malformed OCM records)
  return stations.filter(
    (s) =>
      s.AddressInfo?.Latitude != null &&
      s.AddressInfo?.Longitude != null
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns true if a station has at least one fast charger (≥ 22 kW).
 * @param {object} station - OCM station object
 * @returns {boolean}
 */
export function isFastCharger(station) {
  return (
    Array.isArray(station.Connections) &&
    station.Connections.some((c) => c.PowerKW != null && c.PowerKW >= 22)
  )
}

/**
 * Returns the max power (kW) across all connections for a station.
 * @param {object} station
 * @returns {number|null}
 */
export function getMaxPowerKW(station) {
  if (!Array.isArray(station.Connections) || station.Connections.length === 0) {
    return null
  }
  return Math.max(...station.Connections.map((c) => c.PowerKW || 0))
}

/**
 * Returns whether a station is currently available.
 * OCM StatusTypeID 200 = Operational, anything else = unavailable/unknown.
 * @param {object} station
 * @returns {boolean}
 */
export function isAvailable(station) {
  return station.StatusTypeID === 200
}

// ─── Demo / offline fallback ──────────────────────────────────────────────────

/**
 * Returns a hardcoded set of demo stations across Kenya.
 * Used as fallback when the OCM API is unavailable (no key, offline, etc.)
 *
 * @returns {Array} Array of mock OCM-shaped station objects
 */
export function getDemoStations() {
  const cities = [
    { name: 'Nairobi CBD',         lat: -1.2921, lng: 36.8219, addr: 'Kenyatta Avenue, Nairobi',      kw: 50  },
    { name: 'Westlands Mall',      lat: -1.2673, lng: 36.8031, addr: 'Westlands, Nairobi',            kw: 22  },
    { name: 'Garden City Mall',    lat: -1.2329, lng: 36.8681, addr: 'Thika Road, Nairobi',           kw: 7   },
    { name: 'Two Rivers Mall',     lat: -1.1736, lng: 36.8282, addr: 'Runda, Nairobi',                kw: 50  },
    { name: 'Junction Mall',       lat: -1.3055, lng: 36.7780, addr: 'Ngong Road, Nairobi',           kw: 22  },
    { name: 'Karen Hub',           lat: -1.3271, lng: 36.7118, addr: 'Karen, Nairobi',                kw: 7   },
    { name: 'Thika Road Mall',     lat: -1.2029, lng: 36.8871, addr: 'Thika Road, Nairobi',           kw: 50  },
    { name: 'Gigiri Hub',          lat: -1.2274, lng: 36.8135, addr: 'Gigiri, Nairobi',               kw: 22  },
    { name: 'Upperhill Medical',   lat: -1.2994, lng: 36.8141, addr: 'Upperhill, Nairobi',            kw: 50  },
    { name: 'Lavington Green',     lat: -1.2817, lng: 36.7746, addr: 'Lavington, Nairobi',            kw: 7   },
    { name: 'Ruiru Station',       lat: -1.1469, lng: 36.9602, addr: 'Ruiru, Kiambu',                 kw: 22  },
    { name: 'Thika Blue Post',     lat: -1.0332, lng: 37.0742, addr: 'Thika, Kenya',                  kw: 50  },
    { name: 'Mombasa Port',        lat: -4.0435, lng: 39.6682, addr: 'Kilindini Rd, Mombasa',         kw: 50  },
    { name: 'City Mall Mombasa',   lat: -4.0567, lng: 39.6634, addr: 'Nyali, Mombasa',                kw: 22  },
    { name: 'Nyali Beach',         lat: -4.0212, lng: 39.7210, addr: 'Nyali, Mombasa',                kw: 7   },
    { name: 'Malindi Coast',       lat: -3.2175, lng: 40.1169, addr: 'Malindi, Kenya',                kw: 22  },
    { name: 'Kilifi Station',      lat: -3.6306, lng: 39.8499, addr: 'Kilifi, Kenya',                 kw: 50  },
    { name: 'Kisumu Central',      lat: -0.0917, lng: 34.7680, addr: 'Oginga Odinga St, Kisumu',      kw: 22  },
    { name: 'Mega City Kisumu',    lat: -0.0787, lng: 34.7421, addr: 'Kisumu, Kenya',                 kw: 50  },
    { name: 'Eldoret Town',        lat:  0.5143, lng: 35.2698, addr: 'Uganda Road, Eldoret',          kw: 22  },
    { name: 'Nakuru Mall',         lat: -0.2831, lng: 36.0699, addr: 'Kenyatta Ave, Nakuru',          kw: 50  },
    { name: 'Naivasha Lake',       lat: -0.7167, lng: 36.4306, addr: 'Naivasha, Kenya',               kw: 7   },
    { name: 'Nyeri Town',          lat: -0.4239, lng: 36.9473, addr: 'Nyeri, Kenya',                  kw: 22  },
    { name: 'Nanyuki Hub',         lat:  0.0147, lng: 37.0742, addr: 'Nanyuki, Kenya',                kw: 50  },
    { name: 'Embu Station',        lat: -0.5367, lng: 37.4526, addr: 'Embu, Kenya',                   kw: 22  },
    { name: 'Meru Central',        lat:  0.0470, lng: 37.6490, addr: 'Meru, Kenya',                   kw: 7   },
    { name: 'Machakos Town',       lat: -1.5177, lng: 37.2634, addr: 'Machakos, Kenya',               kw: 50  },
    { name: 'Muranga Station',     lat: -0.7199, lng: 37.1499, addr: 'Muranga, Kenya',                kw: 22  },
    { name: 'Garissa Town',        lat: -0.4536, lng: 39.6401, addr: 'Garissa, Kenya',                kw: 7   },
    { name: 'Kitale Hub',          lat:  1.0154, lng: 35.0062, addr: 'Kitale, Kenya',                 kw: 22  },
  ]

  return cities.map((c, i) => ({
    ID: i + 1,
    AddressInfo: {
      Title:        c.name,
      AddressLine1: c.addr,
      Latitude:     c.lat,
      Longitude:    c.lng,
    },
    Connections: [{ PowerKW: c.kw, ConnectionTypeID: c.kw >= 50 ? 33 : c.kw >= 22 ? 25 : 1 }],
    StatusTypeID: i % 5 === 0 ? 100 : 200, // ~80% available
  }))
}
