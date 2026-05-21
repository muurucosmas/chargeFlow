import toast from "react-hot-toast";

const KEY = "reservations";

function getAll() {
  return JSON.parse(localStorage.getItem(KEY)) || [];
}

function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function isPortActive(stationId, portId) {
  const all = getAll();
  return all.some(
    (r) =>
      r.stationId === stationId &&
      r.portId === portId &&
      r.status !== "paid"
  );
}

/* Reserve port*/
export function reservePort({ station, portId, user }) {
  if (!user) {
    toast.error("Login required");
    return false;
  }

  const all = getAll();

  const exists = all.find(
    (r) =>
      r.stationId === station.id &&
      r.portId === portId &&
      r.status !== "paid"
  );

  if (exists) {
    toast.error("Port not available");
    return false;
  }

  const newRes = {
    id: crypto.randomUUID(),
    stationId: station.id,
    stationName: station.name,
    portId,
    userId: user.id || user.email,
    status: "reserved",
    createdAt: new Date().toISOString(),
  };

  save([...all, newRes]);

  toast.success("Port reserved");
  return true;
}

/* Start charging*/
export function startCharging(reservationId) {
  const all = getAll();

  const updated = all.map((r) =>
    r.id === reservationId ? { ...r, status: "charging" } : r
  );

  save(updated);
  toast.success("Charging started");
}

/* Finish charging*/
export function finishCharging(reservationId) {
  const all = getAll();

  const updated = all.map((r) =>
    r.id === reservationId ? { ...r, status: "finished" } : r
  );

  save(updated);
  toast.success("Charging finished");
}

/* Pay & release*/
export function payAndRelease(reservationId) {
  const all = getAll();

  const updated = all.map((r) =>
    r.id === reservationId ? { ...r, status: "paid" } : r
  );

  save(updated);
  toast.success("Payment successful");
}

/* Get active reservation for map */
export function isPortReserved(stationId, portId) {
  const all = getAll();

  return all.some(
    (r) =>
      r.stationId === stationId &&
      r.portId === portId &&
      r.status !== "paid"
  );
}