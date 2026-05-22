/**
 * distance.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Haversine formula: calculates the great-circle distance between two points
 * on the Earth's surface given their latitude/longitude in decimal degrees.
 *
 * Returns distance in kilometres (km).
 *
 * Formula:
 *   a = sin²(Δlat/2) + cos(lat1) · cos(lat2) · sin²(Δlon/2)
 *   c = 2 · atan2(√a, √(1−a))
 *   d = R · c        where R = 6371 km (Earth's mean radius)
 */

const EARTH_RADIUS_KM = 6371

/**
 * Convert decimal degrees to radians.
 * @param {number} degrees
 * @returns {number} radians
 */
function toRad(degrees) {
  return degrees * (Math.PI / 180)
}

/**
 * Calculate distance between two geographic coordinates.
 *
 * @param {number} lat1 - Latitude of point A (decimal degrees)
 * @param {number} lon1 - Longitude of point A (decimal degrees)
 * @param {number} lat2 - Latitude of point B (decimal degrees)
 * @param {number} lon2 - Longitude of point B (decimal degrees)
 * @returns {number} Distance in kilometres, rounded to 2 decimal places
 */
export function haversineDistance(lat1, lon1, lat2, lon2) {
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distanceKm = EARTH_RADIUS_KM * c

  return Math.round(distanceKm * 100) / 100 // 2 decimal precision
}

/**
 * Sort an array of stations by distance from a user position.
 *
 * @param {{ lat: number, lng: number }} userPos
 * @param {Array}   stations - OCM station objects
 * @returns {Array} Stations sorted nearest → farthest, each with a `distanceKm` field
 */
export function sortByDistance(userPos, stations) {
  return stations
    .map((station) => ({
      ...station,
      distanceKm: haversineDistance(
        userPos.lat,
        userPos.lng,
        station.AddressInfo.Latitude,
        station.AddressInfo.Longitude
      ),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
}
