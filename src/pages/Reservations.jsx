import React, { useEffect, useState } from "react";
import { CalendarDays, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // LOAD USER + DATA
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));

    if (!loggedInUser) {
      setUser(null);
      return;
    }

    setUser(loggedInUser);

    const allReservations =
      JSON.parse(localStorage.getItem("reservations")) || [];

    const userReservations = allReservations.filter(
      (r) =>
        r.userId === (loggedInUser?.id || loggedInUser?.email)
    );

    setReservations(userReservations);
  }, []);

  // SAVE + SYNC 
  const saveAndSync = (updatedUserReservations) => {
    const all = JSON.parse(localStorage.getItem("reservations")) || [];

    // remove old user reservations, replace with updated ones
    const otherUsers = all.filter(
      (r) =>
        r.userId !== (user?.id || user?.email)
    );

    const newAll = [...otherUsers, ...updatedUserReservations];

    localStorage.setItem("reservations", JSON.stringify(newAll));

    setReservations(updatedUserReservations);

    //  IMPORTANT: notify MapView instantly
    window.dispatchEvent(new Event("storage"));
  };

  // CANCEL 
  function cancelReservation(id) {
    const updated = reservations.filter((r) => r.id !== id);
    saveAndSync(updated);
    toast.success("Reservation cancelled");
  }

  //  START CHARGING 
  function startCharging(res) {
    const updated = reservations.map((r) =>
      r.id === res.id
        ? {
            ...r,
            status: "charging",
            startedAt: new Date().toISOString(),
          }
        : r
    );

    saveAndSync(updated);
    toast.success("Charging started");
  }

  // FINISH 
  function finishCharging(res) {
    const updated = reservations.map((r) =>
      r.id === res.id
        ? {
            ...r,
            status: "finished",
            finishedAt: new Date().toISOString(),
          }
        : r
    );

    saveAndSync(updated);
    toast.success("Charging finished — pending payment");
  }

  // PAY 
  function payAndRelease(res) {
    const updated = reservations.map((r) =>
      r.id === res.id
        ? {
            ...r,
            status: "paid",
            paidAt: new Date().toISOString(),
          }
        : r
    );

    saveAndSync(updated);
    toast.success("Payment complete — port released");
  }

  // NOT LOGGED IN 
  if (!user) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
        <div className="bg-white p-6 rounded-xl w-full max-w-sm text-center shadow-xl">
          <h2 className="text-xl font-bold mb-2">Login Required</h2>

          <p className="text-gray-600 mb-6">
            You need an account to view your reservations
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/login")}
              className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-700"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="border border-green-500 text-green-500 py-2 rounded-lg hover:bg-green-100"
            >
              Create Account
            </button>

            <button
              onClick={() => navigate("/")}
              className="text-gray-500 text-sm mt-2"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  //  MAIN UI 
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">

          <button
            onClick={() => navigate("/findcharger")}
            className="p-2 rounded-full bg-white shadow hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-3xl font-bold">
              My Reservations
            </h1>

            <p className="text-gray-500">
              Manage your charging sessions
            </p>
          </div>

        </div>

        {/* EMPTY STATE */}
        {reservations.length === 0 && (
          <div className="bg-white rounded-2xl p-10 text-center shadow">
            <h2 className="text-xl font-bold mb-2">
              No Reservations Yet
            </h2>

            <p className="text-gray-500">
              Reserve a charging port to see it here.
            </p>
          </div>
        )}

        {/* CARDS */}
        <div className="grid gap-5">

          {reservations.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl shadow p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >

              <div className="space-y-2">

                <h2 className="text-xl font-bold text-green-600">
                  {r.stationName}
                </h2>

                <p className="font-semibold">
                  Port: {r.portId}
                </p>

                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <CalendarDays size={16} />
                  <span>
                    Reserved on{" "}
                    {new Date(r.reservedAt).toLocaleString()}
                  </span>
                </div>

                <div className="text-sm">
                  Status:{" "}
                  <span
                    className={
                      r.status === "reserved"
                        ? "text-yellow-600"
                        : r.status === "charging"
                        ? "text-blue-600"
                        : r.status === "finished"
                        ? "text-orange-600"
                        : "text-green-600"
                    }
                  >
                    {r.status}
                  </span>
                </div>

              </div>

              {/* ACTIONS */}
              <div className="flex flex-col md:flex-row gap-2">

                {r.status === "reserved" && (
                  <>
                    <button
                      onClick={() => startCharging(r)}
                      className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold"
                    >
                      Start Charging
                    </button>

                    <button
                      onClick={() => cancelReservation(r.id)}
                      className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold"
                    >
                      <Trash2 size={18} />
                      Cancel
                    </button>
                  </>
                )}

                {r.status === "charging" && (
                  <button
                    onClick={() => finishCharging(r)}
                    className="bg-orange-500 hover:bg-orange-700 text-white px-4 py-2 rounded-xl font-semibold"
                  >
                    Finish Charging
                  </button>
                )}

                {r.status === "finished" && (
                  <button
                    onClick={() => payAndRelease(r)}
                    className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold"
                  >
                    Pay & Release
                  </button>
                )}

                {r.status === "paid" && (
                  <span className="text-gray-500 px-4 py-2 rounded-xl border">
                    Completed
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