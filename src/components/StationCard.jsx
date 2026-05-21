import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function StationCard({ station }) {
  const [ports, setPorts] = useState([]);

  // Load ports
  useEffect(() => {
    const savedReservations =
      JSON.parse(localStorage.getItem("reservations")) || [];

    const updatedPorts = station.ports.map((port) => {
      const reserved = savedReservations.find(
        (r) =>
          r.stationId === station.id &&
          r.portId === port.id
      );

      if (reserved) {
        return {
          ...port,
          status: "reserved",
        };
      }

      return port;
    });

    setPorts(updatedPorts);
  }, [station]);

  // Reserve Port
  function handleReserve(port) {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      toast.error("Please login first");
      return;
    }

    // Prevent duplicate reservations
    const existingReservations =
      JSON.parse(localStorage.getItem("reservations")) || [];

    const alreadyReserved = existingReservations.find(
      (r) =>
        r.stationId === station.id &&
        r.portId === port.id
    );

    if (alreadyReserved) {
      toast.error("Port already reserved");
      return;
    }

    const reservation = {
      id: Date.now(),
      userId: user.id || user.email,
      username: user.username,
      stationId: station.id,
      stationName: station.name,
      portId: port.id,
      reservedAt: new Date().toISOString(),
    };

    // Save reservation
    const updatedReservations = [
      ...existingReservations,
      reservation,
    ];

    localStorage.setItem(
      "reservations",
      JSON.stringify(updatedReservations)
    );

    // Update UI immediately
    const updatedPorts = ports.map((p) =>
      p.id === port.id
        ? { ...p, status: "reserved" }
        : p
    );

    setPorts(updatedPorts);

    toast.success(
      `Port ${port.id} reserved successfully`
    );
  }

  return (
    <div className="w-80 space-y-4">

      {/* Station Info */}
      <div>
        <h2 className="text-lg font-bold text-green-600">
          {station.name}
        </h2>

        <p className="text-sm text-gray-500">
          {station.type}
        </p>

        <p className="text-sm">
          Operator: {station.operator}
        </p>

        <p className="text-xs text-gray-500 mt-1">
          {station.notes}
        </p>
      </div>

      {/* Ports */}
      <div>
        <h3 className="font-semibold mb-2">
          Charging Ports
        </h3>

        <div className="space-y-3">

          {ports.map((port) => (
            <div
              key={port.id}
              className="border rounded-xl p-3 flex justify-between items-center"
            >

              {/* Port Info */}
              <div>
                <p className="font-bold">
                  Port {port.id}
                </p>

                <p className="text-xs text-gray-500">
                  {port.type}
                </p>

                <p className="text-xs text-gray-500">
                  {port.power}
                </p>
              </div>

              {/* Port Status */}
              <div>
                {port.status === "available" && (
                  <button
                    onClick={() =>
                      handleReserve(port)
                    }
                    className="bg-green-500 hover:bg-green-700 text-white text-xs px-3 py-2 rounded-lg font-bold"
                  >
                    Reserve
                  </button>
                )}

                {port.status === "occupied" && (
                  <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                    Occupied
                  </span>
                )}

                {port.status === "reserved" && (
                  <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-full">
                    Reserved
                  </span>
                )}
              </div>

            </div>
          ))}

        </div>
      </div>

    </div>
  );
}