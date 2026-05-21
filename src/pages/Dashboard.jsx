import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  EvCharger,
  Rabbit,
  Sprout,
  MapPinSearch,
  User,
  Activity,
  Save,
  CalendarDays,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function Dashboard() {
  const navigate = useNavigate();

  const [showAuth, setShowAuth] = useState(false);
  const [authMessage, setAuthMessage] = useState("");

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  const isAuthenticated = !!user;

  function requireAuth(action, message) {
    if (!isAuthenticated) {
      setAuthMessage(message);
      setShowAuth(true);
      return;
    }
    action();
  }

  function handleFindClick() {
    requireAuth(
      () => navigate("/findcharger"),
      "You need an account to access charging stations"
    );
  }

  function handleReservationsClick() {
    requireAuth(
      () => navigate("/reservations"),
      "You need an account to view your reservations"
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white shadow-lg">
        <div className="mx-auto max-w-[1600px] px-4 py-3 flex flex-wrap md:flex-nowrap items-center justify-between gap-3">

          <img
            className="w-28 md:w-40"
            src="src/assets/ChargeFlow.png"
            alt="ChargeFlow"
          />

          <div className="w-full md:w-auto flex justify-center md:justify-start">
            <Sidebar />
          </div>

          <div className="flex gap-2 md:gap-3 flex-wrap justify-center md:justify-end w-full md:w-auto">

            {user ? (
              <Link
                to="/profile"
                className="bg-green-500 px-3 py-2 text-sm md:text-lg font-bold text-white rounded-xl hover:bg-green-700"
              >
                {user.username}
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="border border-green-500 text-green-500 px-3 py-2 text-sm md:text-lg font-bold rounded-xl hover:bg-green-100"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="bg-green-500 px-3 py-2 text-sm md:text-lg font-bold text-white rounded-xl hover:bg-green-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

        </div>
      </header>

      {/* HERO */}
      <main className="mx-auto max-w-[1600px] px-4 mt-8 md:mt-10">

        <section className="flex flex-col gap-3 md:gap-4 pb-6">

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Powering your journey,
            <span className="text-green-500"> sustainably</span>
          </h1>

          <p className="text-lg md:text-2xl">
            Find the nearest station:
            <span className="font-bold text-gray-500"> Charge, Pay, Flow</span>
          </p>

        </section>

        {/* ACTIONS */}
        <section className="flex flex-wrap gap-3">

          <button
            onClick={handleFindClick}
            className="bg-green-500 px-4 py-3 text-white rounded-xl font-bold hover:bg-green-700 flex items-center gap-2"
          >
            <MapPinSearch size={18} />
            Find Charging Station
          </button>

          <button
            onClick={handleReservationsClick}
            className="bg-black px-4 py-3 text-white rounded-xl font-bold hover:bg-gray-800 flex items-center gap-2"
          >
            <CalendarDays size={18} />
            My Reservations
          </button>

        </section>

        {/* STATS */}
        <section className="flex flex-col lg:flex-row items-center justify-between gap-10 mt-10">

          <div className="flex flex-wrap gap-6 justify-center lg:justify-start">

            <div className="flex flex-col items-center lg:items-start">
              <EvCharger className="text-green-500" />
              <h2 className="font-bold text-2xl md:text-3xl">2,450+</h2>
              <p>Charging Stations</p>
            </div>

            <div className="flex flex-col items-center lg:items-start">
              <User className="text-green-500" />
              <h2 className="font-bold text-2xl md:text-3xl">10k+</h2>
              <p>Users</p>
            </div>

            <div className="flex flex-col items-center lg:items-start">
              <Activity className="text-green-500" />
              <h2 className="font-bold text-2xl md:text-3xl">97%</h2>
              <p>Uptime</p>
            </div>

          </div>

          <img
            className="w-full lg:w-[600px] h-[250px] md:h-[400px] lg:h-[500px] object-cover rounded-xl"
            src="https://images.unsplash.com/photo-1703860271509-b50f5679f2a0"
            alt="charging"
          />

        </section>

        {/* FEATURES */}
        <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="p-6 border rounded-xl shadow">
            <MapPinSearch className="text-green-500" />
            <h3>Find Chargers</h3>
          </div>

          <div className="p-6 border rounded-xl shadow">
            <Rabbit className="text-green-500" />
            <h3>Fast & Easy</h3>
          </div>

          <div className="p-6 border rounded-xl shadow">
            <Save className="text-green-500" />
            <h3>Save Money</h3>
          </div>

          <div className="p-6 border rounded-xl shadow">
            <Sprout className="text-green-500" />
            <h3>Go Green</h3>
          </div>

        </section>

      </main>

      {/* AUTH MODAL */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">

          <div className="bg-white p-6 rounded-xl w-full max-w-sm text-center shadow-xl">

            <h2 className="text-xl font-bold mb-2">
              Login Required
            </h2>

            <p className="text-gray-600 mb-6">
              {authMessage}
            </p>

            <div className="flex flex-col gap-3">

              <button
                onClick={() => navigate("/login")}
                className="bg-green-500 text-white py-2 rounded-lg"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="border border-green-500 text-green-500 py-2 rounded-lg"
              >
                Sign Up
              </button>

              <button
                onClick={() => setShowAuth(false)}
                className="text-gray-500 text-sm"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-auto bg-white border-t border-gray-300 text-gray-700 py-8 px-4">

        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between gap-6">

          <div className="flex flex-col md:flex-row gap-4">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/contacts">Contacts</Link>
            <Link to="/faq">FAQ</Link>
          </div>

        </div>

        <div className="text-center text-sm text-gray-500 mt-6">
          © {new Date().getFullYear()} ChargeFlow
        </div>

      </footer>

    </div>
  );
}

export default Dashboard;