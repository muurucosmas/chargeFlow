import { useState } from "react";
import toast from "react-hot-toast";

export default function BookingModal({ station, user, onClose }) {
  const [loading, setLoading] = useState(false);

  function bookStation() {
    setLoading(true);

    const reservation = {
      id: Date.now(),
      userId: user.id || user.email,
      stationId: station.ID,
      stationName: station.AddressInfo.Title,
      port: "P1",
      status: "reserved",
      reservedAt: new Date().toISOString(),
      lat: station.AddressInfo.Latitude,
      lng: station.AddressInfo.Longitude,
    };

    const all = JSON.parse(localStorage.getItem("reservations")) || [];
    localStorage.setItem("reservations", JSON.stringify([...all, reservation]));

    // 🔥 GLOBAL LIVE SYNC
    window.dispatchEvent(new Event("storage"));

    toast.success("Station booked!");
    setLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
      <div className="bg-white p-5 rounded-xl w-96">

        <h2 className="text-xl font-bold mb-3">
          Book {station.AddressInfo.Title}
        </h2>

        <button
          onClick={bookStation}
          disabled={loading}
          className="bg-green-500 text-white w-full py-2 rounded"
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>

        <button
          onClick={onClose}
          className="mt-2 text-gray-500 w-full"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}