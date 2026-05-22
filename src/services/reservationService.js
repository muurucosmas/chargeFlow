const KEY = "reservations";

/**
 * Get all reservations
 */
export function getReservations() {
  return JSON.parse(localStorage.getItem(KEY)) || [];
}

/**
 * Save + trigger real-time update
 */
export function saveReservations(data) {
  localStorage.setItem(KEY, JSON.stringify(data));

  // 🔥 real-time event
  window.dispatchEvent(new Event("reservations:update"));
}

/**
 * Subscribe to changes
 */
export function subscribeReservations(callback) {
  const handler = () => callback(getReservations());

  window.addEventListener("reservations:update", handler);

  // initial load
  handler();

  return () =>
    window.removeEventListener("reservations:update", handler);
}