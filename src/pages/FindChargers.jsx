import { useState, useEffect } from "react";
import Map from "../components/Map.jsx";
import { useGeolocation } from "../hooks/useGeolocation.js";
import { useNearestStation } from "../hooks/useNearestStation.js";
import { isFastCharger, getMaxPowerKW } from "../api/getStations.js";
import BookingModal from "../components/BookingModal";

export default function FindChargers() {
  const [activeFilter, setActiveFilter] = useState("all");

  // 🔥 BOOKING STATE (GLOBAL CONTROL POINT)
  const [selectedStation, setSelectedStation] = useState(null);

  // USER
  const user = JSON.parse(localStorage.getItem("user"));

  // LOCATION
  const {
    position,
    loading: geoLoading,
    error: geoError,
    retry,
  } = useGeolocation();

  // STATIONS
  const {
    filtered,
    nearest,
    loading,
    error,
    refresh,
  } = useNearestStation(position, activeFilter);

  const isLoading = geoLoading || loading;

  // 🔥 LIVE SYNC LISTENER (IMPORTANT)
  useEffect(() => {
    const sync = () => refresh();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  function handleDirections() {
    if (!nearest || !position) return;

    const { Latitude, Longitude } = nearest.AddressInfo;

    window.open(
      `https://www.google.com/maps/dir/${position.lat},${position.lng}/${Latitude},${Longitude}`
    );
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">

      {/* MAP */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            Loading stations...
          </div>
        )}

        <Map userPos={position} stations={filtered} nearest={nearest} />
      </div>

      {/* BOTTOM PANEL */}
      <div className="p-4 space-y-3 bg-gray-900">

        {/* ERROR */}
        {error && (
          <div className="text-red-400 flex justify-between">
            <span>{error}</span>
            <button onClick={geoError ? retry : refresh}>
              Retry
            </button>
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-3 gap-2">
          <StatCard label="Stations" value={filtered.length} />
          <StatCard label="Nearest" value={nearest?.distanceKm?.toFixed(1)} />
          <StatCard
            label="Location"
            value={position ? `${position.lat}, ${position.lng}` : "—"}
          />
        </div>

        {/* FILTERS */}
        <div className="flex gap-2 flex-wrap">
          {["all", "fast", "level2", "available"].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="px-3 py-1 border rounded"
            >
              {f}
            </button>
          ))}
        </div>

        {/* NEAREST + BOOK BUTTON */}
        {nearest && (
          <div className="bg-green-900/20 p-4 rounded-xl">

            <p className="font-bold">
              {nearest.AddressInfo.Title}
            </p>

            <p className="text-sm text-gray-400">
              {getMaxPowerKW(nearest)} kW ·
              {isFastCharger(nearest) ? " Fast" : " Level 2"}
            </p>

            <div className="flex gap-2 mt-3">

              <button
                onClick={() => window.scrollTo({ top: 0 })}
                className="bg-green-500 px-3 py-1 rounded"
              >
                View
              </button>

              <button
                onClick={handleDirections}
                className="border px-3 py-1 rounded"
              >
                Directions
              </button>

              {/* 🔥 BOOK BUTTON */}
              <button
                onClick={() => setSelectedStation(nearest)}
                className="bg-blue-500 px-3 py-1 rounded"
              >
                Book
              </button>

            </div>
          </div>
        )}

        {/* BOOKING MODAL */}
        {selectedStation && (
          <BookingModal
            station={selectedStation}
            user={user}
            onClose={() => setSelectedStation(null)}
          />
        )}

      </div>
    </div>
  );
}

// simple helper UI
function StatCard({ label, value }) {
  return (
    <div className="bg-gray-800 p-3 rounded">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-bold">{value || "—"}</p>
    </div>
  );
}