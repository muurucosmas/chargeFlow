import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";

import { useEffect, useState, useMemo } from "react";
import chargers from "../data/chargers.json";
import { toast } from "react-hot-toast";

// ---------------- USER ----------------
function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

// ---------------- RESERVATIONS ----------------
function getReservations() {
  return JSON.parse(localStorage.getItem("reservations")) || [];
}

// ---------------- STATUS LOGIC ----------------
function getPortStatus(stationId, portId) {
  const all = getReservations();

  const match = all.find(
    (r) =>
      r.stationId === stationId &&
      r.portId === portId &&
      r.status !== "paid"
  );

  return match?.status || "available";
}

// ---------------- MARKER COLORS ----------------
function getMarkerColor(status) {
  switch (status) {
    case "available":
      return "#22c55e"; // green
    case "reserved":
      return "#facc15"; // yellow
    case "charging":
      return "#ef4444"; // red
    case "finished":
    case "payment":
      return "#9ca3af"; // gray
    default:
      return "#22c55e";
  }
}

// ---------------- PULSE STYLE ----------------
function getPulse(status, isSelected) {
  if (isSelected) return "pulse-green";
  if (status === "charging") return "pulse-red";
  if (status === "reserved") return "pulse-yellow";
  return "";
}

// ---------------- CLICK PIN ----------------
function ClickToPin({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({
        lat: e.latlng.lat,
        lon: e.latlng.lng,
        label: `Pinned: ${e.latlng.lat.toFixed(
          5
        )}, ${e.latlng.lng.toFixed(5)}`,
      });
    },
  });

  return null;
}

// TRACK LOCATION
function TrackUserLocation({ onLocationChange }) {
  const map = useMap();

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        onLocationChange({ lat: latitude, lon: longitude });
        map.setView([latitude, longitude], map.getZoom());
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, [map, onLocationChange]);

  return null;
}

//  AUTO ZOOM
function AutoZoom({ selected }) {
  const map = useMap();

  useEffect(() => {
    if (selected?.lat && selected?.lon) {
      map.flyTo([selected.lat, selected.lon], 16, {
        duration: 1.2,
      });
    }
  }, [selected, map]);

  return null;
}

// MAIN MAP 
export default function MapView({ center, selected, onPick }) {
  const initialCenter = useMemo(
    () => center ?? [-1.2921, 36.8219],
    [center]
  );

  const [userLocation, setUserLocation] = useState(null);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const sync = () => forceUpdate((x) => x + 1);
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  //  RESERVE 
  function reservePort(station, port) {
    const user = getUser();

    if (!user) {
      toast.error("Login required");
      return;
    }

    const all = getReservations();

    const exists = all.find(
      (r) =>
        r.stationId === station.id &&
        r.portId === port.id &&
        r.status !== "paid"
    );

    if (exists) {
      toast.error("Port already in use");
      return;
    }

    all.push({
      id: Date.now(),
      userId: user.id || user.email,
      stationId: station.id,
      stationName: station.name,
      portId: port.id,
      status: "reserved",
      reservedAt: new Date().toISOString(),
    });

    localStorage.setItem("reservations", JSON.stringify(all));

    toast.success(`Reserved ${port.id}`);
    forceUpdate((x) => x + 1);
  }

  // RENDER MARKER ICON
  function createDot(color, pulseClass) {
    return L.divIcon({
      className: "",
      html: `
        <div class="marker-dot ${pulseClass}" 
          style="
            background:${color};
            width:18px;
            height:18px;
            border-radius:50%;
            border:2px solid white;
            box-shadow:0 0 10px rgba(0,0,0,0.3);
          ">
        </div>
      `,
    });
  }

  return (
    <>
      {/*  PULSE ANIMATION STYLES */}
      <style>{`
        .pulse-red {
          animation: pulse-red 1.5s infinite;
        }
        .pulse-yellow {
          animation: pulse-yellow 1.5s infinite;
        }
        .pulse-green {
          animation: pulse-green 2s infinite;
        }

        @keyframes pulse-red {
          0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.6); }
          70% { box-shadow: 0 0 0 15px rgba(239,68,68,0); }
          100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
        }

        @keyframes pulse-yellow {
          0% { box-shadow: 0 0 0 0 rgba(250,204,21,0.6); }
          70% { box-shadow: 0 0 0 15px rgba(250,204,21,0); }
          100% { box-shadow: 0 0 0 0 rgba(250,204,21,0); }
        }

        @keyframes pulse-green {
          0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.6); }
          70% { box-shadow: 0 0 0 15px rgba(34,197,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }

        .marker-dot {
          display:flex;
          align-items:center;
          justify-content:center;
        }
      `}</style>

      <MapContainer
        center={initialCenter}
        zoom={13}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <ClickToPin onPick={onPick} />
        <TrackUserLocation onLocationChange={setUserLocation} />
        <AutoZoom selected={selected} />

        {/* USER */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lon]}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {/* STATIONS */}
        {chargers.map((station) => (
          <Marker
            key={station.id}
            position={[station.lat, station.lng]}
          >
            <Popup>
              <div className="w-64 space-y-2">
                <h2 className="font-bold text-green-600">
                  {station.name}
                </h2>

                <p className="text-sm text-gray-500">
                  {station.type}
                </p>

                <div className="space-y-2">
                  <h3 className="font-semibold">Ports</h3>

                  {station.ports.map((port) => {
                    const status = getPortStatus(
                      station.id,
                      port.id
                    );

                    const color = getMarkerColor(status);

                    const isSelected =
                      selected?.stationId === station.id &&
                      selected?.portId === port.id;

                    return (
                      <div
                        key={`${station.id}-${port.id}`}
                        className="border p-2 rounded"
                      >
                        <div className="flex justify-between">
                          <span>
                            {port.id} ({port.type})
                          </span>

                          <span className="font-semibold">
                            {status}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500">
                          {port.power}
                        </p>

                        {status === "available" ? (
                          <button
                            onClick={() =>
                              reservePort(station, port)
                            }
                            className="mt-2 bg-green-500 text-white px-2 py-1 text-xs rounded hover:bg-green-700"
                          >
                            Reserve
                          </button>
                        ) : (
                          <button
                            disabled
                            className="mt-2 bg-gray-400 text-white px-2 py-1 text-xs rounded"
                          >
                            {status}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}