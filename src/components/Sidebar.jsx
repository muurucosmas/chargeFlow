import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Home,
  MapPin,
  Info,
  CalendarDays,
} from "lucide-react";

import toast from "react-hot-toast";

function Sidebar() {
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);

  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem("user")
    );
  } catch (err) {
    user = null;
  }

  function handleProtectedClick(e) {
    if (!user) {
      e.preventDefault();
      setShowAuth(true);
      toast.error(
        "You must be logged in to access this feature!"
      );
    }
  }

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-green-600 font-bold flex items-center gap-1"
      : "text-gray-700 hover:text-green-600 flex items-center gap-1";

  return (
    <div className="w-full flex flex-wrap md:flex-nowrap justify-center md:justify-start gap-3 md:gap-5 font-semibold text-sm md:text-lg font-display relative">

      {/* AUTH MODAL */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">

          <div className="bg-white p-6 rounded-xl w-full max-w-sm text-center shadow-xl">

            <h2 className="text-xl md:text-2xl font-bold mb-2">
              Login Required
            </h2>

            <p className="text-gray-600 mb-6 text-sm md:text-base">
              You need an account to access this feature
            </p>

            <div className="flex flex-col gap-3">

              <button
                onClick={() =>
                  navigate("/login")
                }
                className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-700"
              >
                Login
              </button>

              <button
                onClick={() =>
                  navigate("/signup")
                }
                className="border border-green-500 text-green-500 py-2 rounded-lg hover:bg-green-100"
              >
                Create Account
              </button>

              <button
                onClick={() =>
                  setShowAuth(false)
                }
                className="text-gray-500 text-sm mt-2"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

      {/* NAV LINKS */}

      <NavLink to="/" className={linkClass}>
        <Home size={18} />
        <span className="hidden sm:inline">
          Home
        </span>
      </NavLink>

      <NavLink
        to="/findcharger"
        onClick={handleProtectedClick}
        className={linkClass}
      >
        <MapPin size={18} />
        <span className="hidden sm:inline">
          Find Chargers
        </span>
      </NavLink>

      {/* NEW: Reservations */}
      <NavLink
        to="/reservations"
        className={linkClass}
      >
        <CalendarDays size={18} />
        <span className="hidden sm:inline">
          Reservations
        </span>
      </NavLink>

      <NavLink to="/about" className={linkClass}>
        <Info size={18} />
        <span className="hidden sm:inline">
          About Us
        </span>
      </NavLink>

    </div>
  );
}

export default Sidebar;